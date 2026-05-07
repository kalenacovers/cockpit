"use client";

import { useActionState, useState } from "react";
import { createTaskAction } from "@/lib/actions/tasks";
import { taskTemplates } from "@/lib/constants";
import type { UnitListItem } from "@/lib/data/properties";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function TaskForm({ units }: { units: UnitListItem[] }) {
  const [state, action, pending] = useActionState(createTaskAction, {});
  const [title, setTitle] = useState("");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aufgabe erstellen</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap gap-2">
          {taskTemplates.map((template) => (
            <button
              type="button"
              key={template}
              onClick={() => setTitle(template)}
              className="focus-ring rounded-full border border-[#E5E5E5] px-3 py-1 text-[13px] font-medium text-[#525252] hover:bg-[#F5F5F5]"
            >
              {template}
            </button>
          ))}
        </div>
        <form action={action} className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="title">Aufgabe</Label>
            <Input
              id="title"
              name="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="unit_id">Wohnung</Label>
            <Select id="unit_id" name="unit_id" defaultValue="">
              <option value="">Keine Zuordnung</option>
              {units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="due_date">Faellig am</Label>
            <Input id="due_date" name="due_date" type="date" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority">Prioritaet</Label>
            <Select id="priority" name="priority" defaultValue="normal">
              <option value="low">Niedrig</option>
              <option value="normal">Normal</option>
              <option value="high">Wichtig</option>
            </Select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="description">Notiz</Label>
            <Textarea id="description" name="description" />
          </div>
          {state.message ? (
            <p className="text-sm text-[#92400E] sm:col-span-2">
              {state.message}
            </p>
          ) : null}
          <div className="sm:col-span-2">
            <Button type="submit" disabled={pending}>
              Aufgabe erstellen
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
