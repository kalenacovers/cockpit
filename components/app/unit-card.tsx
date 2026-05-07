import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { UnitListItem } from "@/lib/data/properties";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/app/status-badge";
import { formatCurrency } from "@/lib/utils";

export function UnitCard({ unit }: { unit: UnitListItem }) {
  return (
    <Card className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-base font-semibold leading-6 text-[#111111]">
            {unit.name}
          </h2>
          <StatusBadge status={unit.status} />
          {unit.currentReceivable ? (
            <StatusBadge status={unit.currentReceivable.status} />
          ) : null}
        </div>
        <p className="text-sm leading-5 text-[#525252]">
          {unit.property
            ? `${unit.property.street}, ${unit.property.city}`
            : "Adresse fehlt"}
        </p>
        <div className="grid gap-2 text-sm leading-5 text-[#525252] sm:grid-cols-2">
          <p>Mieter: {unit.tenant ? `${unit.tenant.first_name} ${unit.tenant.last_name}` : "Noch nicht eingetragen"}</p>
          <p>
            Miete:{" "}
            {unit.rentTerm
              ? `${formatCurrency(unit.rentTerm.total_rent)} / Monat`
              : "Noch nicht hinterlegt"}
          </p>
        </div>
      </div>
      <Button asChild variant="secondary">
        <Link href={`/wohnungen/${unit.id}`}>
          Details oeffnen
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </Button>
    </Card>
  );
}
