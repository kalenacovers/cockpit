"use client";

import { useActionState } from "react";
import { uploadDocumentAction } from "@/lib/actions/documents";
import { documentTypes } from "@/lib/constants";
import type { TenantListItem } from "@/lib/data/tenants";
import type { UnitListItem } from "@/lib/data/properties";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

export function DocumentUpload({
  units,
  tenants,
}: {
  units: UnitListItem[];
  tenants: TenantListItem[];
}) {
  const [state, action, pending] = useActionState(uploadDocumentAction, {});

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dokument hochladen</CardTitle>
        <CardDescription>Wozu gehoert dieses Dokument?</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="document-title">Name</Label>
            <Input id="document-title" name="title" placeholder="Mietvertrag" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="document-type">Dokumenttyp</Label>
            <Select id="document-type" name="type" defaultValue="mietvertrag">
              {documentTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="document-unit">Wohnung</Label>
            <Select id="document-unit" name="unit_id" defaultValue="">
              <option value="">Keine Zuordnung</option>
              {units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="document-tenant">Mieter</Label>
            <Select id="document-tenant" name="tenant_id" defaultValue="">
              <option value="">Keine Zuordnung</option>
              {tenants.map((tenant) => (
                <option key={tenant.id} value={tenant.id}>
                  {tenant.first_name} {tenant.last_name}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="document-file">Datei</Label>
            <Input id="document-file" name="document" type="file" />
          </div>
          {state.message ? (
            <p className="text-sm text-[#92400E] md:col-span-2">
              {state.message}
            </p>
          ) : null}
          <div className="md:col-span-2">
            <Button type="submit" disabled={pending}>
              Dokument hochladen
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
