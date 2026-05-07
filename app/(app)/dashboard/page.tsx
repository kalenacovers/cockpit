import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DashboardSummary } from "@/components/app/dashboard-summary";
import { EmptyState } from "@/components/app/empty-state";
import { PageHeader } from "@/components/app/page-header";
import { UnitCard } from "@/components/app/unit-card";
import { getAccountContext } from "@/lib/data/account";
import { getDashboardData } from "@/lib/data/dashboard";
import { ensureMonthlyRentReceivables } from "@/lib/data/payments";

export default async function DashboardPage() {
  const { account } = await getAccountContext();
  await ensureMonthlyRentReceivables(account.id, new Date());
  const data = await getDashboardData(account.id);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Hier siehst du, ob bei deinen Wohnungen alles in Ordnung ist."
        action={
          <Button asChild>
            <Link href="/wohnungen/new">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Wohnung hinzufuegen
            </Link>
          </Button>
        }
      />

      {data.units.length === 0 ? (
        <EmptyState
          title="Noch keine Wohnung angelegt"
          description="Fuege deine erste Wohnung hinzu und behalte Miete, Mieter und Dokumente im Blick."
          actionLabel="Erste Wohnung hinzufuegen"
          href="/setup"
        />
      ) : (
        <div className="space-y-8">
          <DashboardSummary {...data.summary} />

          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold leading-7 text-[#111111]">
                Zu erledigen
              </h2>
              <p className="mt-1 text-sm text-[#737373]">
                Die wichtigsten offenen Punkte.
              </p>
            </div>
            <Card className="space-y-0 p-0">
              {data.hints.length > 0 ? (
                data.hints.map((hint, index) => (
                  <div
                    key={`${hint.title}-${index}`}
                    className="flex flex-col gap-3 border-b border-[#E5E5E5] p-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-medium text-[#111111]">{hint.title}</p>
                      <p className="text-sm text-[#737373]">{hint.detail}</p>
                    </div>
                    <Button asChild variant="secondary" size="sm">
                      <Link href={hint.href}>Oeffnen</Link>
                    </Button>
                  </div>
                ))
              ) : (
                <div className="p-6">
                  <p className="font-medium text-[#111111]">
                    Alles sieht gut aus.
                  </p>
                  <p className="mt-1 text-sm text-[#737373]">
                    Es gibt gerade keine offenen Hinweise.
                  </p>
                </div>
              )}
            </Card>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold leading-7 text-[#111111]">
              Wohnungen
            </h2>
            <div className="space-y-4">
              {data.units.slice(0, 5).map((unit) => (
                <UnitCard key={unit.id} unit={unit} />
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
