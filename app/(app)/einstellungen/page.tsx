import { signOutAction } from "@/lib/actions/auth";
import { getAccountContext } from "@/lib/data/account";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/app/page-header";

export default async function SettingsPage() {
  const { account, email, profile } = await getAccountContext();

  return (
    <div>
      <PageHeader
        title="Einstellungen"
        description="Profil, Account und Logout."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profil</CardTitle>
          </CardHeader>
          <div className="space-y-2 text-sm text-[#525252]">
            <p>Name: {profile?.full_name ?? "Noch nicht eingetragen"}</p>
            <p>E-Mail: {email ?? "-"}</p>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <div className="space-y-2 text-sm text-[#525252]">
            <p>{account.name}</p>
            <p>Private Vermietung</p>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Logout</CardTitle>
          </CardHeader>
          <form action={signOutAction}>
            <Button type="submit" variant="secondary">
              Logout
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
