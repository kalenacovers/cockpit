"use client";

import { useActionState } from "react";
import { addPaymentAction } from "@/lib/actions/payments";
import type { PaymentListItem } from "@/lib/data/payments";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function PaymentForm({ payments }: { payments: PaymentListItem[] }) {
  const [state, action, pending] = useActionState(addPaymentAction, {});
  const openPayments = payments.filter((payment) => payment.status !== "paid");

  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="receivable_id">Offene Miete</Label>
        <Select id="receivable_id" name="receivable_id">
          {openPayments.map((payment) => (
            <option key={payment.id} value={payment.id}>
              {payment.unit?.name ?? payment.label}
            </option>
          ))}
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="amount">Betrag</Label>
        <Input id="amount" name="amount" inputMode="decimal" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="paid_at">Bezahlt am</Label>
        <Input
          id="paid_at"
          name="paid_at"
          type="date"
          defaultValue={new Date().toISOString().slice(0, 10)}
        />
      </div>
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="notes">Notiz</Label>
        <Textarea id="notes" name="notes" />
      </div>
      {state.message ? (
        <p className="text-sm text-[#92400E] sm:col-span-2">{state.message}</p>
      ) : null}
      <div className="sm:col-span-2">
        <Button type="submit" disabled={pending || openPayments.length === 0}>
          Zahlung erfassen
        </Button>
      </div>
    </form>
  );
}
