"use server";

import { format } from "date-fns";
import { de } from "date-fns/locale";
import { redirect } from "next/navigation";
import type { ActionState } from "@/lib/constants";
import {
  allowedDocumentMimeTypes,
  maxDocumentBytes,
} from "@/lib/constants";
import { getAccountContext } from "@/lib/data/account";
import { safeFileName } from "@/lib/utils";
import { setupSchema } from "@/lib/validation/setup";
import { formDataToObject } from "@/lib/validation/shared";

function numeric(value: number | string | null | undefined) {
  return typeof value === "string" ? Number(value) : value ?? 0;
}

async function audit(
  accountId: string,
  userId: string,
  action: string,
  entityType: string,
  entityId: string | null,
  metadata: Record<string, unknown> = {},
) {
  const { supabase } = await getAccountContext();
  await supabase.from("audit_logs").insert({
    account_id: accountId,
    actor_user_id: userId,
    action,
    entity_type: entityType,
    entity_id: entityId,
    metadata,
  });
}

export async function completeSetupAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = setupSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    return {
      message: "Bitte pruefe die markierten Felder.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { supabase, account, userId } = await getAccountContext();
  const data = parsed.data;

  const { data: property, error: propertyError } = await supabase
    .from("properties")
    .insert({
      account_id: account.id,
      name: data.property_name || data.street,
      street: data.street,
      postal_code: data.postal_code,
      city: data.city,
      country: data.country || "Deutschland",
    })
    .select("*")
    .single();

  if (propertyError || !property) {
    return { message: "Die Adresse konnte nicht gespeichert werden." };
  }

  const { data: unit, error: unitError } = await supabase
    .from("units")
    .insert({
      account_id: account.id,
      property_id: property.id,
      name: data.unit_name,
      floor: data.floor,
      size_sqm: data.size_sqm,
      rooms: data.rooms,
      status: data.status,
      notes: data.notes,
    })
    .select("*")
    .single();

  if (unitError || !unit) {
    return { message: "Die Wohnung konnte nicht gespeichert werden." };
  }

  await audit(account.id, userId, "unit.created", "unit", unit.id);

  let tenantId: string | null = null;
  let leaseId: string | null = null;
  let depositIncomplete = false;

  if (data.status === "vermietet") {
    const { data: tenant, error: tenantError } = await supabase
      .from("tenants")
      .insert({
        account_id: account.id,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
      })
      .select("*")
      .single();

    if (tenantError || !tenant) {
      return { message: "Der Mieter konnte nicht gespeichert werden." };
    }

    tenantId = tenant.id;
    await audit(account.id, userId, "tenant.created", "tenant", tenant.id);

    const { data: lease, error: leaseError } = await supabase
      .from("leases")
      .insert({
        account_id: account.id,
        unit_id: unit.id,
        tenant_id: tenant.id,
        start_date: data.start_date,
        payment_due_day: data.payment_due_day,
        status: "active",
      })
      .select("*")
      .single();

    if (leaseError || !lease) {
      return { message: "Der Mietvertrag konnte nicht gespeichert werden." };
    }

    leaseId = lease.id;
    await audit(account.id, userId, "lease.created", "lease", lease.id);

    const { error: rentError } = await supabase.from("rent_terms").insert({
      account_id: account.id,
      lease_id: lease.id,
      valid_from: data.start_date || format(new Date(), "yyyy-MM-dd"),
      cold_rent: data.cold_rent,
      utilities: data.utilities,
      reason: "Startmiete",
    });

    if (rentError) {
      return { message: "Die Miete konnte nicht gespeichert werden." };
    }

    if (data.deposit_choice === "yes") {
      const agreed = numeric(data.deposit_agreed_amount);
      const paid = numeric(data.deposit_paid_amount);
      depositIncomplete = agreed > paid;

      await supabase.from("deposits").insert({
        account_id: account.id,
        lease_id: lease.id,
        agreed_amount: agreed,
        paid_amount: paid,
        held_at: data.deposit_held_at,
        notes: data.deposit_notes,
      });
    }

    const dueDate = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      data.payment_due_day,
    );

    await supabase.from("receivables").insert({
      account_id: account.id,
      lease_id: lease.id,
      type: "rent",
      label: `Miete ${format(new Date(), "LLLL yyyy", { locale: de })}`,
      due_date: format(dueDate, "yyyy-MM-dd"),
      amount: numeric(data.cold_rent) + numeric(data.utilities),
      status: "open",
    });
  }

  const file = formData.get("document");
  const hasDocument = file instanceof File && file.size > 0;

  if (hasDocument) {
    if (file.size > maxDocumentBytes || !allowedDocumentMimeTypes.includes(file.type)) {
      return {
        message:
          "Die Wohnung wurde gespeichert, aber das Dokument passt nicht. Bitte lade es spaeter erneut hoch.",
      };
    }

    const path = `${account.id}/${unit.id}/${Date.now()}-${safeFileName(file.name)}`;
    const { error: uploadError } = await supabase.storage
      .from("documents")
      .upload(path, file, {
        contentType: file.type,
      });

    if (!uploadError) {
      const { data: document } = await supabase
        .from("documents")
        .insert({
          account_id: account.id,
          property_id: property.id,
          unit_id: unit.id,
          tenant_id: tenantId,
          lease_id: leaseId,
          type: "mietvertrag",
          title: "Mietvertrag",
          file_path: path,
          mime_type: file.type,
          file_size: file.size,
          uploaded_by: userId,
        })
        .select("id")
        .single();
      await audit(
        account.id,
        userId,
        "document.uploaded",
        "document",
        document?.id ?? null,
      );
    }
  }

  if (!hasDocument) {
    await supabase.from("tasks").insert({
      account_id: account.id,
      property_id: property.id,
      unit_id: unit.id,
      tenant_id: tenantId,
      lease_id: leaseId,
      title: "Mietvertrag hochladen",
      priority: "normal",
    });
  }

  if (depositIncomplete) {
    await supabase.from("tasks").insert({
      account_id: account.id,
      property_id: property.id,
      unit_id: unit.id,
      tenant_id: tenantId,
      lease_id: leaseId,
      title: "Kaution pruefen",
      priority: "normal",
    });
  }

  await supabase.from("tasks").insert({
    account_id: account.id,
    property_id: property.id,
    unit_id: unit.id,
    tenant_id: tenantId,
    lease_id: leaseId,
    title: "Uebergabeprotokoll hochladen",
    priority: "low",
  });

  redirect("/dashboard");
}
