import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().trim().email("Bitte gib eine gueltige E-Mail-Adresse ein."),
  password: z.string().min(1, "Bitte gib dein Passwort ein."),
});

export const signUpSchema = z.object({
  full_name: z.string().trim().min(1, "Bitte gib deinen Namen ein."),
  email: z.string().trim().email("Bitte gib eine gueltige E-Mail-Adresse ein."),
  password: z.string().min(8, "Das Passwort braucht mindestens 8 Zeichen."),
});
