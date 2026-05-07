import { format } from "date-fns";
import { de } from "date-fns/locale";
import { getAccountContext } from "@/lib/data/account";
import type {
  Lease,
  Payment,
  Receivable,
  RentTerm,
  Tenant,
  Unit,
} from "@/lib/supabase/types";

export type PaymentListItem = Receivable & {
  paidAmount: number;
  unit: Unit | null;
  tenant: Tenant | null;
  payments: Payment[];
};

function numeric(value: number | string | null | undefined) {
  return typeof value === "string" ? Number(value) : value ?? 0;
}

function monthBounds(targetMonth: Date) {
  const start = new Date(targetMonth.getFullYear(), targetMonth.getMonth(), 1);
  const end = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0);
  return {
    start: format(start, "yyyy-MM-dd"),
    end: format(end, "yyyy-MM-dd"),
  };
}

export async function ensureMonthlyRentReceivables(
  accountId: string,
  targetMonth: Date,
) {
  const { supabase } = await getAccountContext();
  const bounds = monthBounds(targetMonth);

  const { data: leases } = await supabase
    .from("leases")
    .select("*")
    .eq("account_id", accountId)
    .eq("status", "active")
    .is("archived_at", null);

  const leaseList = (leases ?? []) as Lease[];

  for (const lease of leaseList) {
    const dueDate = new Date(
      targetMonth.getFullYear(),
      targetMonth.getMonth(),
      lease.payment_due_day,
    );
    const dueDateIso = format(dueDate, "yyyy-MM-dd");

    const { data: existing } = await supabase
      .from("receivables")
      .select("id")
      .eq("account_id", accountId)
      .eq("lease_id", lease.id)
      .eq("type", "rent")
      .eq("due_date", dueDateIso)
      .is("archived_at", null)
      .maybeSingle();

    if (existing) continue;

    const { data: terms } = await supabase
      .from("rent_terms")
      .select("*")
      .eq("account_id", accountId)
      .eq("lease_id", lease.id)
      .lte("valid_from", bounds.end)
      .order("valid_from", { ascending: false })
      .limit(1);

    const rentTerm = ((terms ?? []) as RentTerm[])[0];
    if (!rentTerm || numeric(rentTerm.total_rent) <= 0) continue;

    const label = `Miete ${format(targetMonth, "LLLL yyyy", { locale: de })}`;

    await supabase.from("receivables").insert({
      account_id: accountId,
      lease_id: lease.id,
      type: "rent",
      label,
      amount: numeric(rentTerm.total_rent),
      due_date: dueDateIso,
      status: "open",
    });
  }
}

export async function getPaymentsForMonth(
  accountId: string,
  year: number,
  month: number,
) {
  const { supabase } = await getAccountContext();
  const targetMonth = new Date(year, month - 1, 1);
  const bounds = monthBounds(targetMonth);

  const { data: receivables } = await supabase
    .from("receivables")
    .select("*")
    .eq("account_id", accountId)
    .eq("type", "rent")
    .gte("due_date", bounds.start)
    .lte("due_date", bounds.end)
    .is("archived_at", null)
    .order("due_date", { ascending: true });

  const receivableList = (receivables ?? []) as Receivable[];
  const receivableIds = receivableList.map((receivable) => receivable.id);
  const leaseIds = receivableList
    .map((receivable) => receivable.lease_id)
    .filter((id): id is string => Boolean(id));

  const [{ data: payments }, { data: leases }] = await Promise.all([
    receivableIds.length
      ? supabase
          .from("payments")
          .select("*")
          .eq("account_id", accountId)
          .in("receivable_id", receivableIds)
      : Promise.resolve({ data: [] }),
    leaseIds.length
      ? supabase.from("leases").select("*").in("id", leaseIds)
      : Promise.resolve({ data: [] }),
  ]);

  const paymentList = (payments ?? []) as Payment[];
  const leaseList = (leases ?? []) as Lease[];
  const unitIds = leaseList.map((lease) => lease.unit_id);
  const tenantIds = leaseList
    .map((lease) => lease.tenant_id)
    .filter((id): id is string => Boolean(id));

  const [{ data: units }, { data: tenants }] = await Promise.all([
    unitIds.length ? supabase.from("units").select("*").in("id", unitIds) : Promise.resolve({ data: [] }),
    tenantIds.length
      ? supabase.from("tenants").select("*").in("id", tenantIds)
      : Promise.resolve({ data: [] }),
  ]);

  const paymentsByReceivableId = new Map<string, Payment[]>();
  paymentList.forEach((payment) => {
    if (!payment.receivable_id) return;
    const list = paymentsByReceivableId.get(payment.receivable_id) ?? [];
    list.push(payment);
    paymentsByReceivableId.set(payment.receivable_id, list);
  });
  const leaseById = new Map(leaseList.map((lease) => [lease.id, lease]));
  const unitById = new Map((units ?? []).map((unit) => [unit.id, unit]));
  const tenantById = new Map((tenants ?? []).map((tenant) => [tenant.id, tenant]));

  return receivableList.map((receivable) => {
    const itemPayments = paymentsByReceivableId.get(receivable.id) ?? [];
    const paidAmount = itemPayments.reduce(
      (sum, payment) => sum + numeric(payment.amount),
      0,
    );
    const lease = receivable.lease_id ? leaseById.get(receivable.lease_id) : null;
    return {
      ...receivable,
      paidAmount,
      payments: itemPayments,
      unit: lease ? ((unitById.get(lease.unit_id) as Unit | undefined) ?? null) : null,
      tenant:
        lease?.tenant_id
          ? ((tenantById.get(lease.tenant_id) as Tenant | undefined) ?? null)
          : null,
    } satisfies PaymentListItem;
  });
}

export async function syncReceivableStatus(accountId: string, receivableId: string) {
  const { supabase } = await getAccountContext();
  const [{ data: receivable }, { data: payments }] = await Promise.all([
    supabase
      .from("receivables")
      .select("*")
      .eq("account_id", accountId)
      .eq("id", receivableId)
      .maybeSingle(),
    supabase
      .from("payments")
      .select("amount")
      .eq("account_id", accountId)
      .eq("receivable_id", receivableId),
  ]);

  if (!receivable) return;
  const paid = ((payments ?? []) as Pick<Payment, "amount">[]).reduce(
    (sum, payment) => sum + numeric(payment.amount),
    0,
  );
  const amount = numeric((receivable as Receivable).amount);
  const status = paid >= amount ? "paid" : paid > 0 ? "partial" : "open";

  await supabase
    .from("receivables")
    .update({ status })
    .eq("account_id", accountId)
    .eq("id", receivableId);
}
