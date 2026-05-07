import { AppShell } from "@/components/app/app-shell";
import { getAccountContext } from "@/lib/data/account";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { account, email } = await getAccountContext();
  return (
    <AppShell accountName={account.name} email={email}>
      {children}
    </AppShell>
  );
}
