import { UnitCard } from "@/components/app/unit-card";
import type { UnitListItem } from "@/lib/data/properties";

export function PropertyCard({ unit }: { unit: UnitListItem }) {
  return <UnitCard unit={unit} />;
}
