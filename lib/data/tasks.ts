import { getAccountContext } from "@/lib/data/account";
import type { Task, Unit } from "@/lib/supabase/types";

export type TaskListItem = Task & {
  unit: Unit | null;
};

export async function getTasks(accountId: string, includeDone = false) {
  const { supabase } = await getAccountContext();
  let query = supabase
    .from("tasks")
    .select("*")
    .eq("account_id", accountId)
    .is("archived_at", null)
    .order("created_at", { ascending: false });

  if (!includeDone) query = query.neq("status", "done");

  const { data: tasks } = await query;
  const taskList = (tasks ?? []) as Task[];
  const unitIds = taskList
    .map((task) => task.unit_id)
    .filter((id): id is string => Boolean(id));

  const { data: units } = unitIds.length
    ? await supabase.from("units").select("*").in("id", unitIds)
    : { data: [] };
  const unitById = new Map((units ?? []).map((unit) => [unit.id, unit]));

  return taskList.map((task) => ({
    ...task,
    unit: task.unit_id ? ((unitById.get(task.unit_id) as Unit | undefined) ?? null) : null,
  })) satisfies TaskListItem[];
}
