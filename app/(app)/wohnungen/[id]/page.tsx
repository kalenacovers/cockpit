import { notFound } from "next/navigation";
import { Archive, CheckSquare, FileUp, Pencil, Plus } from "lucide-react";
import { archiveUnitAction, updateUnitAction } from "@/lib/actions/properties";
import { openDocumentAction } from "@/lib/actions/documents";
import { getAccountContext } from "@/lib/data/account";
import { getUnitDetail } from "@/lib/data/properties";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/app/page-header";
import { StatusBadge } from "@/components/app/status-badge";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function UnitDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { account } = await getAccountContext();
  const unit = await getUnitDetail(account.id, id);

  if (!unit) notFound();

  return (
    <div>
      <PageHeader
        title={unit.name}
        description={
          unit.property
            ? `${unit.property.street}, ${unit.property.postal_code} ${unit.property.city}`
            : undefined
        }
        action={
          <Button asChild>
            <a href="/zahlungen">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Zahlung erfassen
            </a>
          </Button>
        }
        secondary={
          <>
            <Button asChild variant="secondary">
              <a href="/dokumente">
                <FileUp className="h-4 w-4" aria-hidden="true" />
                Dokument hochladen
              </a>
            </Button>
            <Button asChild variant="secondary">
              <a href="/aufgaben">
                <CheckSquare className="h-4 w-4" aria-hidden="true" />
                Aufgabe erstellen
              </a>
            </Button>
          </>
        }
      />

      <div className="mb-6 flex flex-wrap gap-2">
        <StatusBadge status={unit.status} />
        {unit.currentReceivable ? (
          <StatusBadge status={unit.currentReceivable.status} />
        ) : null}
        {unit.documents.some((document) => document.type === "mietvertrag") ? null : (
          <StatusBadge status="missing" />
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mieter</CardTitle>
              <CardDescription>
                {unit.tenant
                  ? `${unit.tenant.first_name} ${unit.tenant.last_name}`
                  : "Noch kein Mieter eingetragen"}
              </CardDescription>
            </CardHeader>
            {unit.tenant ? (
              <div className="space-y-2 text-sm text-[#525252]">
                <p>Einzug: {formatDate(unit.lease?.start_date)}</p>
                <p>Telefon: {unit.tenant.phone ?? "-"}</p>
                <p>E-Mail: {unit.tenant.email ?? "-"}</p>
              </div>
            ) : null}
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monatliche Miete</CardTitle>
            </CardHeader>
            {unit.rentTerm && unit.lease ? (
              <div className="space-y-2 text-sm text-[#525252]">
                <p>Kaltmiete: {formatCurrency(unit.rentTerm.cold_rent)}</p>
                <p>Nebenkosten: {formatCurrency(unit.rentTerm.utilities)}</p>
                <p className="font-medium text-[#111111]">
                  Gesamt: {formatCurrency(unit.rentTerm.total_rent)}
                </p>
                <p>Faellig jeden Monat am {unit.lease.payment_due_day}.</p>
              </div>
            ) : (
              <p className="text-sm text-[#737373]">
                Noch keine Miete hinterlegt.
              </p>
            )}
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Zahlungen</CardTitle>
            </CardHeader>
            {unit.payments.length > 0 ? (
              <div className="space-y-3">
                {unit.payments.slice(0, 5).map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between border-b border-[#E5E5E5] pb-3 text-sm last:border-b-0 last:pb-0"
                  >
                    <span>{formatDate(payment.paid_at)}</span>
                    <span className="font-medium">
                      {formatCurrency(payment.amount)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#737373]">
                Noch keine Zahlung erfasst.
              </p>
            )}
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dokumente</CardTitle>
            </CardHeader>
            {unit.documents.length > 0 ? (
              <div className="space-y-3">
                {unit.documents.map((document) => (
                  <div
                    key={document.id}
                    className="flex items-center justify-between gap-3 border-b border-[#E5E5E5] pb-3 text-sm last:border-b-0 last:pb-0"
                  >
                    <span>{document.title}</span>
                    <form action={openDocumentAction}>
                      <input type="hidden" name="document_id" value={document.id} />
                      <Button variant="secondary" size="sm" type="submit">
                        Oeffnen
                      </Button>
                    </form>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#92400E]">
                Mietvertrag noch nicht hochgeladen.
              </p>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Aufgaben</CardTitle>
            </CardHeader>
            {unit.tasks.length > 0 ? (
              <div className="space-y-3">
                {unit.tasks.map((task) => (
                  <div key={task.id} className="text-sm">
                    <p className="font-medium text-[#111111]">{task.title}</p>
                    <p className="text-[#737373]">
                      Faellig: {formatDate(task.due_date)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#737373]">Alles sieht gut aus.</p>
            )}
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bearbeiten</CardTitle>
            </CardHeader>
            <form action={updateUnitAction} className="space-y-4">
              <input type="hidden" name="unit_id" value={unit.id} />
              <div className="space-y-2">
                <Label htmlFor="unit_name">Wohnungsname</Label>
                <Input id="unit_name" name="unit_name" defaultValue={unit.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select id="status" name="status" defaultValue={unit.status}>
                  <option value="vermietet">Vermietet</option>
                  <option value="frei">Frei</option>
                  <option value="unbekannt">Spaeter eintragen</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notizen</Label>
                <Textarea id="notes" name="notes" defaultValue={unit.notes ?? ""} />
              </div>
              <Button type="submit" variant="secondary">
                <Pencil className="h-4 w-4" aria-hidden="true" />
                Speichern
              </Button>
            </form>
          </Card>

          <Card>
            <form action={archiveUnitAction} className="space-y-3">
              <input type="hidden" name="unit_id" value={unit.id} />
              <p className="text-sm text-[#737373]">
                Archivieren blendet die Wohnung aus, loescht sie aber nicht.
              </p>
              <Button type="submit" variant="danger">
                <Archive className="h-4 w-4" aria-hidden="true" />
                Archivieren
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
