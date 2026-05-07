import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAccountContext } from "@/lib/data/account";
import { getTenants } from "@/lib/data/tenants";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/app/empty-state";
import { PageHeader } from "@/components/app/page-header";
import { TenantForm } from "@/components/forms/tenant-form";
import { formatDate } from "@/lib/utils";

export default async function TenantsPage() {
  const { account } = await getAccountContext();
  const tenants = await getTenants(account.id);

  return (
    <div>
      <PageHeader
        title="Mieter"
        description="Kontaktdaten und Zuordnung zu deinen Wohnungen."
        action={
          <Button asChild>
            <a href="#mieter-eintragen">Mieter eintragen</a>
          </Button>
        }
      />

      <div className="space-y-6">
        <div id="mieter-eintragen">
          <TenantForm />
        </div>

        {tenants.length === 0 ? (
          <EmptyState
            title="Noch keine Mieter"
            description="Sobald du eine vermietete Wohnung anlegst, erscheinen die Mieter hier."
            actionLabel="Mieter eintragen"
            href="#mieter-eintragen"
          />
        ) : (
          <section className="grid gap-4 md:grid-cols-2">
            {tenants.map((tenant) => (
              <Card key={tenant.id} className="space-y-4">
                <div>
                  <h2 className="text-base font-semibold leading-6 text-[#111111]">
                    {tenant.first_name} {tenant.last_name}
                  </h2>
                  <p className="mt-1 text-sm text-[#525252]">
                    {tenant.unit?.name ?? "Keine Wohnung zugeordnet"}
                  </p>
                  <p className="text-sm text-[#737373]">
                    Einzug: {formatDate(tenant.lease?.start_date)}
                  </p>
                </div>
                <div className="space-y-1 text-sm text-[#525252]">
                  <p>Telefon: {tenant.phone ?? "-"}</p>
                  <p>E-Mail: {tenant.email ?? "-"}</p>
                </div>
                <Button asChild variant="secondary">
                  <Link href={`/mieter/${tenant.id}`}>
                    Details oeffnen
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </Card>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
