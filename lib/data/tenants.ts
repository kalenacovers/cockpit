import { getAccountContext } from "@/lib/data/account";
import type { Lease, Tenant, Unit } from "@/lib/supabase/types";

export type TenantListItem = Tenant & {
  unit: Unit | null;
  lease: Lease | null;
};

export async function getTenants(accountId: string) {
  const { supabase } = await getAccountContext();
  const { data: tenants } = await supabase
    .from("tenants")
    .select("*")
    .eq("account_id", accountId)
    .is("archived_at", null)
    .order("last_name", { ascending: true });

  const tenantList = (tenants ?? []) as Tenant[];
  const tenantIds = tenantList.map((tenant) => tenant.id);

  const { data: leases } = tenantIds.length
    ? await supabase
        .from("leases")
        .select("*")
        .eq("account_id", accountId)
        .in("tenant_id", tenantIds)
        .is("archived_at", null)
    : { data: [] };

  const leaseList = (leases ?? []) as Lease[];
  const unitIds = leaseList.map((lease) => lease.unit_id);
  const { data: units } = unitIds.length
    ? await supabase.from("units").select("*").in("id", unitIds)
    : { data: [] };

  const leaseByTenantId = new Map<string, Lease>();
  leaseList.forEach((lease) => {
    if (lease.tenant_id && !leaseByTenantId.has(lease.tenant_id)) {
      leaseByTenantId.set(lease.tenant_id, lease);
    }
  });
  const unitById = new Map((units ?? []).map((unit) => [unit.id, unit]));

  return tenantList.map((tenant) => {
    const lease = leaseByTenantId.get(tenant.id) ?? null;
    return {
      ...tenant,
      lease,
      unit: lease ? ((unitById.get(lease.unit_id) as Unit | undefined) ?? null) : null,
    } satisfies TenantListItem;
  });
}

export async function getTenantDetail(accountId: string, tenantId: string) {
  const tenants = await getTenants(accountId);
  return tenants.find((tenant) => tenant.id === tenantId) ?? null;
}
