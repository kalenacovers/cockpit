import { z } from "zod";
import { optionalDate, optionalText } from "@/lib/validation/shared";

export const taskSchema = z.object({
  title: z.string().trim().min(1, "Bitte gib einen Titel fuer die Aufgabe ein."),
  description: optionalText,
  due_date: optionalDate,
  priority: z.enum(["low", "normal", "high"]).default("normal"),
  unit_id: optionalText,
  tenant_id: optionalText,
});
