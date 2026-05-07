"use client";

import { useActionState, useMemo, useState } from "react";
import { Check } from "lucide-react";
import { completeSetupAction } from "@/lib/actions/setup";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const steps = [
  "Adresse",
  "Wohnung",
  "Status",
  "Mieter",
  "Miete",
  "Kaution",
  "Dokument",
  "Fertig",
];

function StepShell({
  active,
  children,
}: {
  active: boolean;
  children: React.ReactNode;
}) {
  return <div className={active ? "space-y-5" : "hidden"}>{children}</div>;
}

export function SetupWizard() {
  const [state, action, pending] = useActionState(completeSetupAction, {});
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState("vermietet");
  const [depositChoice, setDepositChoice] = useState("later");
  const [coldRent, setColdRent] = useState("");
  const [utilities, setUtilities] = useState("");

  const totalRent = useMemo(() => {
    const cold = Number(coldRent.replace(",", ".")) || 0;
    const side = Number(utilities.replace(",", ".")) || 0;
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(cold + side);
  }, [coldRent, utilities]);

  return (
    <Card className="mx-auto max-w-3xl">
      <div className="mb-6 flex flex-wrap gap-2">
        {steps.map((label, index) => (
          <span
            key={label}
            className={cn(
              "inline-flex h-8 items-center rounded-full border px-3 text-[13px] font-medium",
              index === step
                ? "border-[#111111] bg-[#111111] text-white"
                : index < step
                  ? "border-[#C8DCD4] bg-[#EEF5F2] text-[#2F5D50]"
                  : "border-[#E5E5E5] bg-white text-[#737373]",
            )}
          >
            {index < step ? <Check className="mr-1 h-3.5 w-3.5" /> : null}
            {label}
          </span>
        ))}
      </div>

      <form action={action} className="space-y-6">
        <StepShell active={step === 0}>
          <div>
            <h2 className="text-xl font-semibold leading-7">Adresse</h2>
            <p className="mt-1 text-sm text-[#737373]">
              Wo liegt deine Wohnung?
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="street">Strasse und Hausnummer</Label>
              <Input id="street" name="street" />
              {state.fieldErrors?.street ? (
                <p className="text-sm text-[#991B1B]">
                  {state.fieldErrors.street[0]}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="postal_code">PLZ</Label>
              <Input id="postal_code" name="postal_code" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Ort</Label>
              <Input id="city" name="city" />
            </div>
            <input type="hidden" name="country" value="Deutschland" />
          </div>
        </StepShell>

        <StepShell active={step === 1}>
          <div>
            <h2 className="text-xl font-semibold leading-7">Wohnung</h2>
            <p className="mt-1 text-sm text-[#737373]">
              Gib der Wohnung einen Namen, den du sofort wiedererkennst.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="unit_name">Wohnungsname</Label>
              <Input id="unit_name" name="unit_name" placeholder="2. OG links" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="size_sqm">Groesse in m²</Label>
              <Input id="size_sqm" name="size_sqm" inputMode="decimal" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rooms">Zimmeranzahl</Label>
              <Input id="rooms" name="rooms" inputMode="decimal" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="floor">Etage</Label>
              <Input id="floor" name="floor" placeholder="Dachgeschoss" />
            </div>
          </div>
        </StepShell>

        <StepShell active={step === 2}>
          <div>
            <h2 className="text-xl font-semibold leading-7">
              Ist die Wohnung vermietet?
            </h2>
          </div>
          <input type="hidden" name="status" value={status} />
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["vermietet", "Ja, sie ist vermietet"],
              ["frei", "Nein, sie ist frei"],
              ["unbekannt", "Ich trage das spaeter ein"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setStatus(value)}
                className={cn(
                  "focus-ring min-h-24 rounded-md border p-4 text-left text-sm font-medium",
                  status === value
                    ? "border-[#111111] bg-[#FAFAFA]"
                    : "border-[#E5E5E5] bg-white",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </StepShell>

        <StepShell active={step === 3}>
          <div>
            <h2 className="text-xl font-semibold leading-7">Mieter</h2>
            <p className="mt-1 text-sm text-[#737373]">
              Nur ausfuellen, wenn die Wohnung vermietet ist.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="first_name">Vorname</Label>
              <Input id="first_name" name="first_name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Nachname</Label>
              <Input id="last_name" name="last_name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tenant_email">E-Mail</Label>
              <Input id="tenant_email" name="email" type="email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefon</Label>
              <Input id="phone" name="phone" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="start_date">Einzugsdatum</Label>
              <Input id="start_date" name="start_date" type="date" />
            </div>
          </div>
        </StepShell>

        <StepShell active={step === 4}>
          <div>
            <h2 className="text-xl font-semibold leading-7">Miete</h2>
            <p className="mt-1 text-sm text-[#737373]">
              Gesamtmiete: {totalRent}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="cold_rent">Kaltmiete</Label>
              <Input
                id="cold_rent"
                name="cold_rent"
                inputMode="decimal"
                value={coldRent}
                onChange={(event) => setColdRent(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="utilities">Nebenkosten</Label>
              <Input
                id="utilities"
                name="utilities"
                inputMode="decimal"
                value={utilities}
                onChange={(event) => setUtilities(event.target.value)}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="payment_due_day">Faelligkeit</Label>
              <Select id="payment_due_day" name="payment_due_day" defaultValue="3">
                <option value="1">Am 1. des Monats</option>
                <option value="3">Am 3. des Monats</option>
                <option value="5">Am 5. des Monats</option>
                <option value="10">Am 10. des Monats</option>
              </Select>
            </div>
          </div>
        </StepShell>

        <StepShell active={step === 5}>
          <div>
            <h2 className="text-xl font-semibold leading-7">Kaution</h2>
          </div>
          <input type="hidden" name="deposit_choice" value={depositChoice} />
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["yes", "Ja"],
              ["no", "Nein"],
              ["later", "Spaeter eintragen"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setDepositChoice(value)}
                className={cn(
                  "focus-ring min-h-16 rounded-md border p-4 text-left text-sm font-medium",
                  depositChoice === value
                    ? "border-[#111111] bg-[#FAFAFA]"
                    : "border-[#E5E5E5] bg-white",
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <div className={depositChoice === "yes" ? "grid gap-4 sm:grid-cols-2" : "hidden"}>
            <div className="space-y-2">
              <Label htmlFor="deposit_agreed_amount">Vereinbarte Kaution</Label>
              <Input id="deposit_agreed_amount" name="deposit_agreed_amount" inputMode="decimal" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deposit_paid_amount">Davon bereits bezahlt</Label>
              <Input id="deposit_paid_amount" name="deposit_paid_amount" inputMode="decimal" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="deposit_held_at">Aufbewahrung / Konto</Label>
              <Input id="deposit_held_at" name="deposit_held_at" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="deposit_notes">Notiz</Label>
              <Textarea id="deposit_notes" name="deposit_notes" />
            </div>
          </div>
        </StepShell>

        <StepShell active={step === 6}>
          <div>
            <h2 className="text-xl font-semibold leading-7">Dokument</h2>
            <p className="mt-1 text-sm text-[#737373]">
              Optional. Du kannst den Mietvertrag auch spaeter hochladen.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="document">Dokument hochladen</Label>
            <Input id="document" name="document" type="file" />
          </div>
        </StepShell>

        <StepShell active={step === 7}>
          <div>
            <h2 className="text-xl font-semibold leading-7">Fertig</h2>
            <p className="mt-1 text-sm text-[#737373]">
              Wir legen jetzt Wohnung, Mieter, Miete und erste Aufgaben an.
            </p>
          </div>
          <ul className="space-y-2 text-sm text-[#525252]">
            <li>Wohnung angelegt</li>
            <li>Mieter eingetragen, falls die Wohnung vermietet ist</li>
            <li>Miete hinterlegt</li>
            <li>Erste Aufgaben erstellt, wenn noch etwas fehlt</li>
          </ul>
        </StepShell>

        {state.message ? (
          <p className="rounded-md border border-[#FDE68A] bg-[#FFFBEB] p-3 text-sm text-[#92400E]">
            {state.message}
          </p>
        ) : null}

        <div className="flex flex-col-reverse gap-2 border-t border-[#E5E5E5] pt-5 sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setStep((value) => Math.max(value - 1, 0))}
            disabled={step === 0 || pending}
          >
            Zurueck
          </Button>
          {step < steps.length - 1 ? (
            <Button
              type="button"
              onClick={() => setStep((value) => Math.min(value + 1, steps.length - 1))}
              disabled={pending}
            >
              Weiter
            </Button>
          ) : (
            <Button type="submit" disabled={pending}>
              Zum Dashboard
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}
