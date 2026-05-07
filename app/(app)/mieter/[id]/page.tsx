import { notFound } from "next/navigation";
import { archiveTenantAction, updateTenantAction } from "@/lib/actions/tenants";
import { getAccountContext } from "@/lib/data/account";
import { getTenantDetail } from "@/lib/data/tenants";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/app/page-header";
import { formatDate } from "@/lib/utils";

export default async function TenantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { account } = await getAccountContext();
  const tenant = await getTenantDetail(account.id, id);

  if (!tenant) notFound();

  return (
    <div>
      <PageHeader
        title={`${tenant.first_name} ${tenant.last_name}`}
        description={tenant.unit?.name ?? "Keine Wohnung zugeordnet"}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Kontaktdaten</CardTitle>
            </CardHeader>
            <div className="space-y-2 text-sm text-[#525252]">
              <p>Telefon: {tenant.phone ?? "-"}</p>
              <p>E-Mail: {tenant.email ?? "-"}</p>
              <p>Notiz: {tenant.notes ?? "-"}</p>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Wohnung</CardTitle>
            </CardHeader>
            <div className="space-y-2 text-sm text-[#525252]">
              <p>{tenant.unit?.name ?? "Keine Wohnung zugeordnet"}</p>
              <p>Einzug: {formatDate(tenant.lease?.start_date)}</p>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Kommunikation</CardTitle>
            </CardHeader>
            <p className="text-sm text-[#737373]">
              Notizen wie Telefonat wegen Reparatur, E-Mail wegen Mietzahlung
              oder Brief versendet kannst du im naechsten Schritt erfassen.
            </p>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bearbeiten</CardTitle>
            </CardHeader>
            <form action={updateTenantAction} className="space-y-4">
              <input type="hidden" name="tenant_id" value={tenant.id} />
              <div className="space-y-2">
                <Label htmlFor="first_name">Vorname</Label>
                <Input id="first_name" name="first_name" defaultValue={tenant.first_name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Nachname</Label>
                <Input id="last_name" name="last_name" defaultValue={tenant.last_name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-Mail</Label>
                <Input id="email" name="email" defaultValue={tenant.email ?? ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon</Label>
                <Input id="phone" name="phone" defaultValue={tenant.phone ?? ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notiz</Label>
                <Textarea id="notes" name="notes" defaultValue={tenant.notes ?? ""} />
              </div>
              <Button type="submit" variant="secondary">
                Speichern
              </Button>
            </form>
          </Card>

          <Card>
            <form action={archiveTenantAction} className="space-y-3">
              <input type="hidden" name="tenant_id" value={tenant.id} />
              <p className="text-sm text-[#737373]">
                Archivieren blendet den Mieter aus, loescht ihn aber nicht.
              </p>
              <Button type="submit" variant="danger">
                Archivieren
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
