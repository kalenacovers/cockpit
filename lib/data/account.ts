import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Account, Profile } from "@/lib/supabase/types";

export type AccountContext = {
  supabase: Awaited<ReturnType<typeof createClient>>;
  userId: string;
  email: string | null;
  account: Account;
  profile: Profile | null;
};

export async function getAccountContext(): Promise<AccountContext> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: member, error } = await supabase
    .from("account_members")
    .select("account:accounts(*)")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  if (error || !member?.account) {
    redirect("/setup");
  }

  const account = Array.isArray(member.account)
    ? member.account[0]
    : member.account;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return {
    supabase,
    userId: user.id,
    email: user.email ?? null,
    account: account as Account,
    profile: (profile as Profile | null) ?? null,
  };
}

export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
