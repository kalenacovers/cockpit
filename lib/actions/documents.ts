"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ActionState } from "@/lib/constants";
import { writeAuditLog } from "@/lib/actions/audit";
import { getAccountContext } from "@/lib/data/account";
import { safeFileName } from "@/lib/utils";
import {
  documentSchema,
  validateDocumentFile,
} from "@/lib/validation/document";
import { formDataToObject } from "@/lib/validation/shared";

export async function uploadDocumentAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = documentSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) {
    return {
      message: "Bitte pruefe die Angaben zum Dokument.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const file = formData.get("document");
  const fileError = validateDocumentFile(file instanceof File ? file : null);
  if (fileError || !(file instanceof File)) {
    return { message: fileError ?? "Bitte waehle eine Datei aus." };
  }

  const { supabase, account, userId } = await getAccountContext();
  const unitId = parsed.data.unit_id ?? null;
  const tenantId = parsed.data.tenant_id ?? null;
  let propertyId: string | null = null;
  let leaseId: string | null = null;

  if (unitId) {
    const { data: unit } = await supabase
      .from("units")
      .select("property_id")
      .eq("account_id", account.id)
      .eq("id", unitId)
      .maybeSingle();
    propertyId = unit?.property_id ?? null;

    const { data: lease } = await supabase
      .from("leases")
      .select("id")
      .eq("account_id", account.id)
      .eq("unit_id", unitId)
      .eq("status", "active")
      .maybeSingle();
    leaseId = lease?.id ?? null;
  }

  const path = `${account.id}/${unitId ?? "allgemein"}/${Date.now()}-${safeFileName(file.name)}`;
  const { error: uploadError } = await supabase.storage
    .from("documents")
    .upload(path, file, { contentType: file.type });

  if (uploadError) {
    return { message: "Das Dokument konnte nicht hochgeladen werden." };
  }

  const { data, error } = await supabase
    .from("documents")
    .insert({
      account_id: account.id,
      property_id: propertyId,
      unit_id: unitId,
      tenant_id: tenantId,
      lease_id: leaseId,
      type: parsed.data.type,
      title: parsed.data.title,
      file_path: path,
      mime_type: file.type,
      file_size: file.size,
      uploaded_by: userId,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { message: "Die Dokumentdaten konnten nicht gespeichert werden." };
  }

  await writeAuditLog("document.uploaded", "document", data.id);
  revalidatePath("/dokumente");
  revalidatePath("/dashboard");
  if (unitId) revalidatePath(`/wohnungen/${unitId}`);
  return { ok: true, message: "Dokument wurde hochgeladen." };
}

export async function openDocumentAction(formData: FormData) {
  const { supabase, account } = await getAccountContext();
  const documentId = String(formData.get("document_id") ?? "");
  if (!documentId) return;

  const { data: document } = await supabase
    .from("documents")
    .select("file_path")
    .eq("account_id", account.id)
    .eq("id", documentId)
    .maybeSingle();

  if (!document) return;

  const { data } = await supabase.storage
    .from("documents")
    .createSignedUrl(document.file_path, 60);

  if (data?.signedUrl) {
    redirect(data.signedUrl);
  }
}

export async function archiveDocumentAction(formData: FormData) {
  const { supabase, account } = await getAccountContext();
  const documentId = String(formData.get("document_id") ?? "");
  if (!documentId) return;

  await supabase
    .from("documents")
    .update({ archived_at: new Date().toISOString() })
    .eq("account_id", account.id)
    .eq("id", documentId);

  await writeAuditLog("document.archived", "document", documentId);
  revalidatePath("/dokumente");
  revalidatePath("/dashboard");
}
