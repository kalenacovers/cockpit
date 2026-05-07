import type {
  Deposit,
  Document,
  Lease,
  Property,
  Receivable,
  RentTerm,
  Task,
  Tenant,
  Unit,
} from "@/lib/supabase/types";
import { getAccountContext } from "@/lib/data/account";

export type UnitListItem = Unit & {
  property: Property | null;
  tenant: Tenant | null;
  lease: Lease | null;
  rentTerm: RentTerm | null;
  currentReceivable: Receivable | null;
};

export type UnitDetail = UnitListItem & {
  documents: Document[];
  tasks: Task[];
  payments: Array<{
    id: string;
    amount: number | string;
    paid_at: string;
    notes: string | null;
  }>;
  deposit: Deposit | null;
};

async function hydrateUnits(accountId: string, units: Unit[]) {
  const { supabase } = await getAccountContext();
  const propertyIds = [...new Set(units.map((unit) => unit.property_id))];
  const unitIds = units.map((unit) => unit.id);

  const [{ data: properties }, { data: leases }, { data: receivables }] =
    await Promise.all([
      supabase.from("properties").select("*").in("id", propertyIds),
      supabase
        .from("leases")
        .select("*")
        .eq("account_id", accountId)
        .in("unit_id", unitIds)
        .is("archived_at", null)
        .order("created_at", { ascending: false }),
      supabase
        .from("receivables")
        .select("*")
        .eq("account_id", accountId)
        .is("archived_at", null)
        .order("due_date", { ascending: false }),
    ]);

  const leasesList = (leases ?? []) as Lease[];
  const leaseIds = leasesList.map((lease) => lease.id);
  const tenantIds = leasesList
    .map((lease) => lease.tenant_id)
    .filter((id): id is string => Boolean(id));

  const [{ data: tenants }, { data: rentTerms }] = await Promise.all([
    tenantIds.length
      ? supabase.from("tenants").select("*").in("id", tenantIds)
      : Promise.resolve({ data: [] }),
    leaseIds.length
      ? supabase
          .from("rent_terms")
          .select("*")
          .in("lease_id", leaseIds)
          .order("valid_from", { ascending: false })
      : Promise.resolve({ data: [] }),
  ]);

  const propertyById = new Map((properties ?? []).map((item) => [item.id, item]));
  const tenantById = new Map((tenants ?? []).map((item) => [item.id, item]));
  const leaseByUnitId = new Map<string, Lease>();
  leasesList.forEach((lease) => {
    if (!leaseByUnitId.has(lease.unit_id)) leaseByUnitId.set(lease.unit_id, lease);
  });
  const rentTermByLeaseId = new Map<string, RentTerm>();
  ((rentTerms ?? []) as RentTerm[]).forEach((term) => {
    if (!rentTermByLeaseId.has(term.lease_id)) {
      rentTermByLeaseId.set(term.lease_id, term);
    }
  });
  const receivableByLeaseId = new Map<string, Receivable>();
  ((receivables ?? []) as Receivable[]).forEach((receivable) => {
    if (receivable.lease_id && !receivableByLeaseId.has(receivable.lease_id)) {
      receivableByLeaseId.set(receivable.lease_id, receivable);
    }
  });

  return units.map((unit) => {
    const lease = leaseByUnitId.get(unit.id) ?? null;
    return {
      ...unit,
      property: (propertyById.get(unit.property_id) as Property | undefined) ?? null,
      lease,
      tenant: lease?.tenant_id
        ? ((tenantById.get(lease.tenant_id) as Tenant | undefined) ?? null)
        : null,
      rentTerm: lease ? rentTermByLeaseId.get(lease.id) ?? null : null,
      currentReceivable: lease ? receivableByLeaseId.get(lease.id) ?? null : null,
    } satisfies UnitListItem;
  });
}

export async function getUnits(accountId: string) {
  const { supabase } = await getAccountContext();
  const { data } = await supabase
    .from("units")
    .select("*")
    .eq("account_id", accountId)
    .is("archived_at", null)
    .order("created_at", { ascending: false });

  return hydrateUnits(accountId, (data ?? []) as Unit[]);
}

export async function getUnitDetail(accountId: string, unitId: string) {
  const { supabase } = await getAccountContext();
  const { data: unit } = await supabase
    .from("units")
    .select("*")
    .eq("account_id", accountId)
    .eq("id", unitId)
    .is("archived_at", null)
    .maybeSingle();

  if (!unit) return null;

  const [hydrated] = await hydrateUnits(accountId, [unit as Unit]);
  const leaseId = hydrated.lease?.id;

  const [{ data: documents }, { data: tasks }, { data: payments }, { data: deposits }] =
    await Promise.all([
      supabase
        .from("documents")
        .select("*")
        .eq("account_id", accountId)
        .eq("unit_id", unitId)
        .is("archived_at", null)
        .order("created_at", { ascending: false }),
      supabase
        .from("tasks")
        .select("*")
        .eq("account_id", accountId)
        .eq("unit_id", unitId)
        .is("archived_at", null)
        .order("created_at", { ascending: false }),
      leaseId
        ? supabase
            .from("payments")
            .select("id, amount, paid_at, notes")
            .eq("account_id", accountId)
            .eq("lease_id", leaseId)
            .order("paid_at", { ascending: false })
        : Promise.resolve({ data: [] }),
      leaseId
        ? supabase
            .from("deposits")
            .select("*")
            .eq("account_id", accountId)
            .eq("lease_id", leaseId)
            .limit(1)
        : Promise.resolve({ data: [] }),
    ]);

  return {
    ...hydrated,
    documents: (documents ?? []) as Document[],
    tasks: (tasks ?? []) as Task[],
    payments: (payments ?? []) as UnitDetail["payments"],
    deposit: ((deposits ?? []) as Deposit[])[0] ?? null,
  } satisfies UnitDetail;
}
