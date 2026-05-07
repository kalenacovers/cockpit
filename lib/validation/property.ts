import { z } from "zod";
import {
  dueDayValue,
  moneyValue,
  optionalDate,
  optionalMoneyValue,
  optionalText,
  positiveOptionalNumber,
} from "@/lib/validation/shared";

export const unitSchema = z.object({
  street: z.string().trim().min(1, "Bitte gib Strasse und Hausnummer ein."),
  postal_code: z.string().trim().min(1, "Bitte gib die PLZ ein."),
  city: z.string().trim().min(1, "Bitte gib den Ort ein."),
  country: z.string().trim().optional().default("Deutschland"),
  property_name: optionalText,
  unit_name: z.string().trim().min(1, "Bitte gib einen Namen fuer die Wohnung ein."),
  floor: optionalText,
  size_sqm: positiveOptionalNumber,
  rooms: positiveOptionalNumber,
  status: z.enum(["vermietet", "frei", "unbekannt"]).default("unbekannt"),
  notes: optionalText,
});

export const rentedUnitSchema = unitSchema.extend({
  first_name: optionalText,
  last_name: optionalText,
  email: z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    z.string().email("Bitte gib eine gueltige E-Mail-Adresse ein.").optional(),
  ),
  phone: optionalText,
  start_date: optionalDate,
  cold_rent: moneyValue,
  utilities: moneyValue,
  payment_due_day: dueDayValue,
  deposit_choice: z.enum(["yes", "no", "later"]).default("later"),
  deposit_agreed_amount: optionalMoneyValue,
  deposit_paid_amount: optionalMoneyValue,
  deposit_held_at: optionalText,
  deposit_notes: optionalText,
});
