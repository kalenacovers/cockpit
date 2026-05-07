import { Archive, FileText } from "lucide-react";
import { archiveDocumentAction, openDocumentAction } from "@/lib/actions/documents";
import { getAccountContext } from "@/lib/data/account";
import { getDocuments } from "@/lib/data/documents";
import { getTenants } from "@/lib/data/tenants";
import { getUnits } from "@/lib/data/properties";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/app/empty-state";
import { PageHeader } from "@/components/app/page-header";
import { DocumentUpload } from "@/components/app/document-upload";
import { formatDate } from "@/lib/utils";

export default async function DocumentsPage() {
  const { account } = await getAccountContext();
  const [documents, units, tenants] = await Promise.all([
    getDocuments(account.id),
    getUnits(account.id),
    getTenants(account.id),
  ]);

  return (
    <div>
      <PageHeader
        title="Dokumente"
        description="Speichere Mietvertraege, Protokolle und Nachweise an einem Ort."
        action={
          <Button asChild>
            <a href="#dokument-hochladen">
              <FileText className="h-4 w-4" aria-hidden="true" />
              Dokument hochladen
            </a>
          </Button>
        }
      />

      <div className="space-y-6">
        <div id="dokument-hochladen">
          <DocumentUpload units={units} tenants={tenants} />
        </div>

        {documents.length === 0 ? (
          <EmptyState
            title="Noch keine Dokumente"
            description="Lade Mietvertrag, Uebergabeprotokoll oder Kautionsnachweis hoch."
            actionLabel="Dokument hochladen"
            href="#dokument-hochladen"
          />
        ) : (
          <section className="grid gap-4 md:grid-cols-2">
            {documents.map((document) => (
              <Card key={document.id} className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-base font-semibold leading-6 text-[#111111]">
                      {document.title}
                    </h2>
                    <p className="mt-1 text-sm text-[#525252]">
                      {document.unit?.name ?? "Allgemein"}
                    </p>
                    {document.tenant ? (
                      <p className="text-sm text-[#737373]">
                        {document.tenant.first_name} {document.tenant.last_name}
                      </p>
                    ) : null}
                  </div>
                  <FileText className="h-5 w-5 text-[#737373]" aria-hidden="true" />
                </div>
                <p className="text-sm text-[#737373]">
                  Hochgeladen am {formatDate(document.created_at)}
                </p>
                <div className="flex flex-wrap gap-2">
                  <form action={openDocumentAction}>
                    <input type="hidden" name="document_id" value={document.id} />
                    <Button variant="secondary" type="submit">
                      Oeffnen
                    </Button>
                  </form>
                  <form action={archiveDocumentAction}>
                    <input type="hidden" name="document_id" value={document.id} />
                    <Button variant="ghost" type="submit">
                      <Archive className="h-4 w-4" aria-hidden="true" />
                      Archivieren
                    </Button>
                  </form>
                </div>
              </Card>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
