import { z } from "zod";
import { optionalText } from "@/lib/validation/shared";

export const tenantSchema = z.object({
  first_name: z.string().trim().min(1, "Bitte gib den Vornamen ein."),
  last_name: z.string().trim().min(1, "Bitte gib den Nachnamen ein."),
  email: z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    z.string().email("Bitte gib eine gueltige E-Mail-Adresse ein.").optional(),
  ),
  phone: optionalText,
  notes: optionalText,
});
