import { PageHeader } from "@/components/app/page-header";
import { UnitForm } from "@/components/forms/unit-form";

export default function NewUnitPage() {
  return (
    <div>
      <PageHeader
        title="Wohnung hinzufuegen"
        description="Lege Adresse, Wohnungsname und bei Bedarf Mieter und Miete an."
      />
      <UnitForm />
    </div>
  );
}
