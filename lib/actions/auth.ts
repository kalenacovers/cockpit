"use server";

import { redirect } from "next/navigation";
import type { ActionState } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { signInSchema, signUpSchema } from "@/lib/validation/auth";
import { formDataToObject } from "@/lib/validation/shared";

export async function signInAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = signInSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return {
      message: "E-Mail oder Passwort stimmen nicht.",
    };
  }

  const next =
    typeof formData.get("next") === "string" && formData.get("next")
      ? String(formData.get("next"))
      : "/dashboard";
  redirect(next);
}

export async function signUpAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = signUpSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.full_name,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/callback`,
    },
  });

  if (error) {
    console.error("[signUpAction] Supabase error:", error.message, error.status);
    return {
      message: `Fehler: ${error.message}`,
    };
  }

  if (data.session) {
    redirect("/setup");
  }

  return {
    ok: true,
    message:
      "Konto erstellt. Bitte pruefe dein Postfach oder melde dich direkt an.",
  };
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
