import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/app/empty-state";
import { PageHeader } from "@/components/app/page-header";
import { UnitCard } from "@/components/app/unit-card";
import { getAccountContext } from "@/lib/data/account";
import { getUnits } from "@/lib/data/properties";

export default async function UnitsPage() {
  const { account } = await getAccountContext();
  const units = await getUnits(account.id);

  return (
    <div>
      <PageHeader
        title="Deine Wohnungen"
        description="Alle Wohnungen, Mieter und Mietstatus auf einen Blick."
        action={
          <Button asChild>
            <Link href="/wohnungen/new">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Wohnung hinzufuegen
            </Link>
          </Button>
        }
      />

      {units.length === 0 ? (
        <EmptyState
          title="Noch keine Wohnung angelegt"
          description="Fuege deine erste Wohnung hinzu und behalte Miete, Mieter und Dokumente im Blick."
          actionLabel="Erste Wohnung hinzufuegen"
          href="/setup"
        />
      ) : (
        <div className="space-y-4">
          {units.map((unit) => (
            <UnitCard key={unit.id} unit={unit} />
          ))}
        </div>
      )}
    </div>
  );
}
