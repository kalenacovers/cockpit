"use server";

import { getAccountContext } from "@/lib/data/account";

export async function writeAuditLog(
  action: string,
  entityType: string,
  entityId: string | null,
  metadata: Record<string, unknown> = {},
) {
  const { supabase, account, userId } = await getAccountContext();
  await supabase.from("audit_logs").insert({
    account_id: account.id,
    actor_user_id: userId,
    action,
    entity_type: entityType,
    entity_id: entityId,
    metadata,
  });
}
