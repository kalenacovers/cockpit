"use server";

import { format } from "date-fns";
import { de } from "date-fns/locale";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ActionState } from "@/lib/constants";
import { getAccountContext } from "@/lib/data/account";
import { rentedUnitSchema } from "@/lib/validation/property";
import { formDataToObject } from "@/lib/validation/shared";
import { writeAuditLog } from "@/lib/actions/audit";

function numeric(value: number | string | null | undefined) {
  return typeof value === "string" ? Number(value) : value ?? 0;
}

export async function createUnitAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = rentedUnitSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    return {
      message: "Bitte pruefe die markierten Felder.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { supabase, account } = await getAccountContext();
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

  await writeAuditLog("unit.created", "unit", unit.id);

  if (data.status === "vermietet" && data.first_name && data.last_name) {
    const { data: tenant } = await supabase
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

    if (tenant) {
      await writeAuditLog("tenant.created", "tenant", tenant.id);
      const { data: lease } = await supabase
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

      if (lease) {
        await writeAuditLog("lease.created", "lease", lease.id);
        await supabase.from("rent_terms").insert({
          account_id: account.id,
          lease_id: lease.id,
          valid_from: data.start_date || format(new Date(), "yyyy-MM-dd"),
          cold_rent: data.cold_rent,
          utilities: data.utilities,
          reason: "Startmiete",
        });

        await supabase.from("receivables").insert({
          account_id: account.id,
          lease_id: lease.id,
          type: "rent",
          label: `Miete ${format(new Date(), "LLLL yyyy", { locale: de })}`,
          due_date: format(
            new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              data.payment_due_day,
            ),
            "yyyy-MM-dd",
          ),
          amount: numeric(data.cold_rent) + numeric(data.utilities),
          status: "open",
        });

        await supabase.from("tasks").insert({
          account_id: account.id,
          property_id: property.id,
          unit_id: unit.id,
          tenant_id: tenant.id,
          lease_id: lease.id,
          title: "Mietvertrag hochladen",
          priority: "normal",
        });
      }
    }
  } else if (data.status === "frei") {
    await supabase.from("tasks").insert({
      account_id: account.id,
      property_id: property.id,
      unit_id: unit.id,
      title: "Mieter eintragen",
      priority: "normal",
    });
  }

  revalidatePath("/wohnungen");
  revalidatePath("/dashboard");
  redirect(`/wohnungen/${unit.id}`);
}

export async function updateUnitAction(formData: FormData) {
  const { supabase, account } = await getAccountContext();
  const unitId = String(formData.get("unit_id") ?? "");
  const name = String(formData.get("unit_name") ?? "").trim();
  const status = String(formData.get("status") ?? "unbekannt");
  const notes = String(formData.get("notes") ?? "").trim();

  if (!unitId || !name) return;

  await supabase
    .from("units")
    .update({
      name,
      status,
      notes: notes || null,
    })
    .eq("account_id", account.id)
    .eq("id", unitId);

  await writeAuditLog("unit.updated", "unit", unitId);
  revalidatePath(`/wohnungen/${unitId}`);
  revalidatePath("/wohnungen");
}

export async function archiveUnitAction(formData: FormData) {
  const { supabase, account } = await getAccountContext();
  const unitId = String(formData.get("unit_id") ?? "");
  if (!unitId) return;

  await supabase
    .from("units")
    .update({ archived_at: new Date().toISOString() })
    .eq("account_id", account.id)
    .eq("id", unitId);

  await writeAuditLog("unit.archived", "unit", unitId);
  revalidatePath("/wohnungen");
  revalidatePath("/dashboard");
  redirect("/wohnungen");
}
