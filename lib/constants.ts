export const APP_NAME = "Vermieter Cockpit";

export const documentTypes = [
  { value: "mietvertrag", label: "Mietvertrag" },
  { value: "uebergabeprotokoll", label: "Uebergabeprotokoll" },
  { value: "kautionsnachweis", label: "Kautionsnachweis" },
  { value: "nebenkostenabrechnung", label: "Nebenkostenabrechnung" },
  { value: "rechnung", label: "Rechnung" },
  { value: "sonstiges", label: "Sonstiges" },
] as const;

export const taskTemplates = [
  "Mietvertrag hochladen",
  "Kaution pruefen",
  "Rauchmelder pruefen",
  "Nebenkostenabrechnung vorbereiten",
  "Reparatur notieren",
  "Uebergabeprotokoll hochladen",
];

export const allowedDocumentMimeTypes = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

export const maxDocumentBytes = 10 * 1024 * 1024;

export type ActionState = {
  ok?: boolean;
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};
