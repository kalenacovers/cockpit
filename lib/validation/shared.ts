import { z } from "zod";

export const optionalText = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().trim().optional(),
);

export const optionalDate = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().trim().optional(),
);

export const moneyValue = z.preprocess((value) => {
  if (typeof value !== "string") return value;
  if (value.trim() === "") return 0;
  return Number(value.replace(",", "."));
}, z.number({ error: "Bitte gib einen Betrag ein." }).min(0, "Der Betrag darf nicht negativ sein."));

export const optionalMoneyValue = z.preprocess((value) => {
  if (typeof value !== "string" || value.trim() === "") return undefined;
  return Number(value.replace(",", "."));
}, z.number().min(0, "Der Betrag darf nicht negativ sein.").optional());

export const positiveOptionalNumber = z.preprocess((value) => {
  if (typeof value !== "string" || value.trim() === "") return undefined;
  return Number(value.replace(",", "."));
}, z.number().positive("Bitte gib eine positive Zahl ein.").optional());

export const dueDayValue = z.preprocess((value) => {
  if (typeof value !== "string" || value.trim() === "") return 3;
  return Number(value);
}, z.number().int().min(1).max(28));

export function formDataToObject(formData: FormData) {
  return Object.fromEntries(formData.entries());
}
