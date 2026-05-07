import { z } from "zod";
import {
  allowedDocumentMimeTypes,
  documentTypes,
  maxDocumentBytes,
} from "@/lib/constants";
import { optionalText } from "@/lib/validation/shared";

const documentTypeValues = documentTypes.map((type) => type.value) as [
  (typeof documentTypes)[number]["value"],
  ...(typeof documentTypes)[number]["value"][],
];

export const documentSchema = z.object({
  title: z.string().trim().min(1, "Bitte gib einen Namen fuer das Dokument ein."),
  type: z.enum(documentTypeValues),
  unit_id: optionalText,
  tenant_id: optionalText,
});

export function validateDocumentFile(file: File | null) {
  if (!file || file.size === 0) {
    return "Bitte waehle eine Datei aus.";
  }
  if (file.size > maxDocumentBytes) {
    return "Die Datei darf maximal 10 MB gross sein.";
  }
  if (!allowedDocumentMimeTypes.includes(file.type)) {
    return "Bitte lade eine PDF-, JPG-, PNG- oder WebP-Datei hoch.";
  }
  return null;
}
