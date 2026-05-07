import { SetupWizard } from "@/components/forms/setup-wizard";
import { PageHeader } from "@/components/app/page-header";

export default function SetupPage() {
  return (
    <div>
      <PageHeader
        title="Lass uns deine erste Wohnung einrichten."
        description="Du kannst alles spaeter aendern."
      />
      <SetupWizard />
    </div>
  );
}
