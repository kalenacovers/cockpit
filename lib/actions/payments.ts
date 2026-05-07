"use server";

import { revalidatePath } from "next/cache";
import type { ActionState } from "@/lib/constants";
import { writeAuditLog } from "@/lib/actions/audit";
import { getAccountContext } from "@/lib/data/account";
import {
  ensureMonthlyRentReceivables,
  syncReceivableStatus,
} from "@/lib/data/payments";
import { paymentSchema } from "@/lib/validation/payment";
import { formDataToObject } from "@/lib/validation/shared";

function numeric(value: number | string | null | undefined) {
  return typeof value === "string" ? Number(value) : value ?? 0;
}

export async function ensureCurrentMonthReceivablesAction() {
  const { account } = await getAccountContext();
  await ensureMonthlyRentReceivables(account.id, new Date());
  revalidatePath("/zahlungen");
  revalidatePath("/dashboard");
}

export async function markReceivablePaidAction(formData: FormData) {
  const { supabase, account } = await getAccountContext();
  const receivableId = String(formData.get("receivable_id") ?? "");
  if (!receivableId) return;

  const [{ data: receivable }, { data: payments }] = await Promise.all([
    supabase
      .from("receivables")
      .select("*")
      .eq("account_id", account.id)
      .eq("id", receivableId)
      .maybeSingle(),
    supabase
      .from("payments")
      .select("amount")
      .eq("account_id", account.id)
      .eq("receivable_id", receivableId),
  ]);

  if (!receivable) return;

  const paid = (payments ?? []).reduce(
    (sum, payment) => sum + numeric(payment.amount),
    0,
  );
  const outstanding = Math.max(numeric(receivable.amount) - paid, 0);

  if (outstanding > 0) {
    const { data } = await supabase
      .from("payments")
      .insert({
        account_id: account.id,
        receivable_id: receivableId,
        lease_id: receivable.lease_id,
        amount: outstanding,
        paid_at: new Date().toISOString().slice(0, 10),
        method: "manuell",
      })
      .select("id")
      .single();
    await writeAuditLog("payment.created", "payment", data?.id ?? null);
  }

  await syncReceivableStatus(account.id, receivableId);
  revalidatePath("/zahlungen");
  revalidatePath("/dashboard");
}

export async function addPaymentAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = paymentSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) {
    return {
      message: "Bitte pruefe die Zahlung.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { supabase, account } = await getAccountContext();
  const { data: receivable } = await supabase
    .from("receivables")
    .select("*")
    .eq("account_id", account.id)
    .eq("id", parsed.data.receivable_id)
    .maybeSingle();

  if (!receivable) {
    return { message: "Diese offene Miete wurde nicht gefunden." };
  }

  const { data, error } = await supabase
    .from("payments")
    .insert({
      account_id: account.id,
      receivable_id: parsed.data.receivable_id,
      lease_id: receivable.lease_id,
      amount: parsed.data.amount,
      paid_at: parsed.data.paid_at,
      method: parsed.data.method,
      notes: parsed.data.notes,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { message: "Die Zahlung konnte nicht gespeichert werden." };
  }

  await syncReceivableStatus(account.id, parsed.data.receivable_id);
  await writeAuditLog("payment.created", "payment", data.id);
  revalidatePath("/zahlungen");
  revalidatePath("/dashboard");
  return { ok: true, message: "Zahlung wurde gespeichert." };
}

export async function updatePaymentAction(formData: FormData) {
  const { supabase, account } = await getAccountContext();
  const paymentId = String(formData.get("payment_id") ?? "");
  if (!paymentId) return;

  await supabase
    .from("payments")
    .update({
      amount: Number(String(formData.get("amount") ?? "0").replace(",", ".")),
      paid_at: String(formData.get("paid_at") ?? new Date().toISOString().slice(0, 10)),
      notes: String(formData.get("notes") ?? "") || null,
    })
    .eq("account_id", account.id)
    .eq("id", paymentId);

  await writeAuditLog("payment.updated", "payment", paymentId);
  revalidatePath("/zahlungen");
}
