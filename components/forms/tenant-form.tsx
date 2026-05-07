"use client";

import { useActionState } from "react";
import { createTenantAction } from "@/lib/actions/tenants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function TenantForm() {
  const [state, action, pending] = useActionState(createTenantAction, {});

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mieter eintragen</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="grid gap-4 sm:grid-cols-2">
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
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="notes">Notiz</Label>
            <Textarea id="notes" name="notes" />
          </div>
          {state.message ? (
            <p
              className={
                state.ok ? "text-sm text-[#166534]" : "text-sm text-[#991B1B]"
              }
            >
              {state.message}
            </p>
          ) : null}
          <div className="sm:col-span-2">
            <Button type="submit" disabled={pending}>
              Mieter eintragen
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
