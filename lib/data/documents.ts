import { getAccountContext } from "@/lib/data/account";
import type { Document, Tenant, Unit } from "@/lib/supabase/types";

export type DocumentListItem = Document & {
  unit: Unit | null;
  tenant: Tenant | null;
};

export async function getDocuments(accountId: string) {
  const { supabase } = await getAccountContext();
  const { data: documents } = await supabase
    .from("documents")
    .select("*")
    .eq("account_id", accountId)
    .is("archived_at", null)
    .order("created_at", { ascending: false });

  const documentList = (documents ?? []) as Document[];
  const unitIds = documentList
    .map((document) => document.unit_id)
    .filter((id): id is string => Boolean(id));
  const tenantIds = documentList
    .map((document) => document.tenant_id)
    .filter((id): id is string => Boolean(id));

  const [{ data: units }, { data: tenants }] = await Promise.all([
    unitIds.length ? supabase.from("units").select("*").in("id", unitIds) : Promise.resolve({ data: [] }),
    tenantIds.length
      ? supabase.from("tenants").select("*").in("id", tenantIds)
      : Promise.resolve({ data: [] }),
  ]);

  const unitById = new Map((units ?? []).map((unit) => [unit.id, unit]));
  const tenantById = new Map((tenants ?? []).map((tenant) => [tenant.id, tenant]));

  return documentList.map((document) => ({
    ...document,
    unit: document.unit_id
      ? ((unitById.get(document.unit_id) as Unit | undefined) ?? null)
      : null,
    tenant: document.tenant_id
      ? ((tenantById.get(document.tenant_id) as Tenant | undefined) ?? null)
      : null,
  })) satisfies DocumentListItem[];
}
