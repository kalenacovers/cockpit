"use client";

import { useActionState, useState } from "react";
import { createUnitAction } from "@/lib/actions/properties";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function UnitForm() {
  const [state, action, pending] = useActionState(createUnitAction, {});
  const [status, setStatus] = useState("unbekannt");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wohnung hinzufuegen</CardTitle>
        <CardDescription>
          Die wichtigsten Angaben reichen fuer den Start.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-6">
          <section className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="street">Strasse und Hausnummer</Label>
              <Input id="street" name="street" />
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
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="unit_name">Wohnungsname</Label>
              <Input id="unit_name" name="unit_name" placeholder="2. OG links" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                id="status"
                name="status"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              >
                <option value="vermietet">Vermietet</option>
                <option value="frei">Frei</option>
                <option value="unbekannt">Spaeter eintragen</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="floor">Etage</Label>
              <Input id="floor" name="floor" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="size_sqm">Groesse in m²</Label>
              <Input id="size_sqm" name="size_sqm" inputMode="decimal" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rooms">Zimmeranzahl</Label>
              <Input id="rooms" name="rooms" inputMode="decimal" />
            </div>
          </section>

          {status === "vermietet" ? (
            <section className="grid gap-4 rounded-md border border-[#E5E5E5] p-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="first_name">Vorname</Label>
                <Input id="first_name" name="first_name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Nachname</Label>
                <Input id="last_name" name="last_name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-Mail</Label>
                <Input id="email" name="email" type="email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon</Label>
                <Input id="phone" name="phone" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cold_rent">Kaltmiete</Label>
                <Input id="cold_rent" name="cold_rent" inputMode="decimal" defaultValue="0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="utilities">Nebenkosten</Label>
                <Input id="utilities" name="utilities" inputMode="decimal" defaultValue="0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="start_date">Einzugsdatum</Label>
                <Input id="start_date" name="start_date" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment_due_day">Faelligkeit</Label>
                <Select id="payment_due_day" name="payment_due_day" defaultValue="3">
                  <option value="1">Am 1. des Monats</option>
                  <option value="3">Am 3. des Monats</option>
                  <option value="5">Am 5. des Monats</option>
                </Select>
              </div>
            </section>
          ) : (
            <>
              <input type="hidden" name="cold_rent" value="0" />
              <input type="hidden" name="utilities" value="0" />
              <input type="hidden" name="payment_due_day" value="3" />
              <input type="hidden" name="deposit_choice" value="later" />
            </>
          )}

          <details className="rounded-md border border-[#E5E5E5] p-4">
            <summary className="cursor-pointer text-sm font-medium text-[#111111]">
              Weitere Details
            </summary>
            <div className="mt-4 space-y-2">
              <Label htmlFor="notes">Notizen</Label>
              <Textarea id="notes" name="notes" />
            </div>
          </details>

          {state.message ? (
            <p className="text-sm text-[#991B1B]">{state.message}</p>
          ) : null}
          <Button type="submit" disabled={pending}>
            Wohnung hinzufuegen
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
