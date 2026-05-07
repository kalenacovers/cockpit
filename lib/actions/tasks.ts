"use server";

import { revalidatePath } from "next/cache";
import type { ActionState } from "@/lib/constants";
import { writeAuditLog } from "@/lib/actions/audit";
import { getAccountContext } from "@/lib/data/account";
import { taskSchema } from "@/lib/validation/task";
import { formDataToObject } from "@/lib/validation/shared";

export async function createTaskAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = taskSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) {
    return {
      message: "Bitte pruefe die Aufgabe.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { supabase, account } = await getAccountContext();
  const { data, error } = await supabase
    .from("tasks")
    .insert({
      account_id: account.id,
      unit_id: parsed.data.unit_id,
      tenant_id: parsed.data.tenant_id,
      title: parsed.data.title,
      description: parsed.data.description,
      due_date: parsed.data.due_date,
      priority: parsed.data.priority,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { message: "Die Aufgabe konnte nicht gespeichert werden." };
  }

  await writeAuditLog("task.created", "task", data.id);
  revalidatePath("/aufgaben");
  revalidatePath("/dashboard");
  return { ok: true, message: "Aufgabe wurde erstellt." };
}

export async function markTaskDoneAction(formData: FormData) {
  const { supabase, account } = await getAccountContext();
  const taskId = String(formData.get("task_id") ?? "");
  if (!taskId) return;

  await supabase
    .from("tasks")
    .update({ status: "done" })
    .eq("account_id", account.id)
    .eq("id", taskId);

  await writeAuditLog("task.done", "task", taskId);
  revalidatePath("/aufgaben");
  revalidatePath("/dashboard");
}

export async function archiveTaskAction(formData: FormData) {
  const { supabase, account } = await getAccountContext();
  const taskId = String(formData.get("task_id") ?? "");
  if (!taskId) return;

  await supabase
    .from("tasks")
    .update({
      status: "archived",
      archived_at: new Date().toISOString(),
    })
    .eq("account_id", account.id)
    .eq("id", taskId);

  await writeAuditLog("task.archived", "task", taskId);
  revalidatePath("/aufgaben");
  revalidatePath("/dashboard");
}
