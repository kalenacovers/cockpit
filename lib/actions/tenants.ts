"use server";

import { revalidatePath } from "next/cache";
import type { ActionState } from "@/lib/constants";
import { writeAuditLog } from "@/lib/actions/audit";
import { getAccountContext } from "@/lib/data/account";
import { tenantSchema } from "@/lib/validation/tenant";
import { formDataToObject } from "@/lib/validation/shared";

export async function createTenantAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = tenantSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) {
    return {
      message: "Bitte pruefe die markierten Felder.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { supabase, account } = await getAccountContext();
  const { data, error } = await supabase
    .from("tenants")
    .insert({
      account_id: account.id,
      ...parsed.data,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { message: "Der Mieter konnte nicht gespeichert werden." };
  }

  await writeAuditLog("tenant.created", "tenant", data.id);
  revalidatePath("/mieter");
  return { ok: true, message: "Mieter wurde eingetragen." };
}

export async function updateTenantAction(formData: FormData) {
  const { supabase, account } = await getAccountContext();
  const tenantId = String(formData.get("tenant_id") ?? "");
  const parsed = tenantSchema.safeParse(formDataToObject(formData));
  if (!tenantId || !parsed.success) return;

  await supabase
    .from("tenants")
    .update(parsed.data)
    .eq("account_id", account.id)
    .eq("id", tenantId);

  await writeAuditLog("tenant.updated", "tenant", tenantId);
  revalidatePath("/mieter");
  revalidatePath(`/mieter/${tenantId}`);
}

export async function archiveTenantAction(formData: FormData) {
  const { supabase, account } = await getAccountContext();
  const tenantId = String(formData.get("tenant_id") ?? "");
  if (!tenantId) return;

  await supabase
    .from("tenants")
    .update({ archived_at: new Date().toISOString() })
    .eq("account_id", account.id)
    .eq("id", tenantId);

  await writeAuditLog("tenant.archived", "tenant", tenantId);
  revalidatePath("/mieter");
}
