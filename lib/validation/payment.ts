import { z } from "zod";
import { moneyValue, optionalText } from "@/lib/validation/shared";

export const paymentSchema = z.object({
  receivable_id: z.string().uuid("Bitte waehle eine offene Miete aus."),
  amount: moneyValue,
  paid_at: z.string().trim().min(1, "Bitte gib ein Zahlungsdatum ein."),
  method: optionalText,
  notes: optionalText,
});
