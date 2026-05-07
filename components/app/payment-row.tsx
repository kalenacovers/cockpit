"use client";

import { useActionState } from "react";
import { addPaymentAction, markReceivablePaidAction } from "@/lib/actions/payments";
import type { PaymentListItem } from "@/lib/data/payments";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/app/status-badge";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export function PaymentRow({ payment }: { payment: PaymentListItem }) {
  const [state, action, pending] = useActionState(addPaymentAction, {});
  const outstanding = Math.max(Number(payment.amount) - payment.paidAmount, 0);

  return (
    <Card className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-semibold leading-6 text-[#111111]">
              {payment.unit?.name ?? payment.label}
            </h2>
            <StatusBadge status={payment.status} />
          </div>
          <p className="text-sm leading-5 text-[#525252]">
            {payment.tenant
              ? `${payment.tenant.first_name} ${payment.tenant.last_name}`
              : "Mieter nicht eingetragen"}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm sm:text-right">
          <div>
            <p className="text-[#737373]">Soll</p>
            <p className="font-medium text-[#111111]">
              {formatCurrency(payment.amount)}
            </p>
          </div>
          <div>
            <p className="text-[#737373]">Bezahlt</p>
            <p className="font-medium text-[#111111]">
              {formatCurrency(payment.paidAmount)}
            </p>
          </div>
        </div>
      </div>

      {payment.status !== "paid" ? (
        <div className="flex flex-col gap-3 border-t border-[#E5E5E5] pt-4 sm:flex-row sm:items-end">
          <form action={markReceivablePaidAction}>
            <input type="hidden" name="receivable_id" value={payment.id} />
            <Button type="submit">Als bezahlt markieren</Button>
          </form>
          <form action={action} className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-end">
            <input type="hidden" name="receivable_id" value={payment.id} />
            <input
              type="hidden"
              name="paid_at"
              value={new Date().toISOString().slice(0, 10)}
            />
            <div className="min-w-0 flex-1">
              <label className="mb-1 block text-sm font-medium text-[#111111]">
                Teilzahlung
              </label>
              <Input
                name="amount"
                inputMode="decimal"
                placeholder={formatCurrency(outstanding)}
              />
            </div>
            <Button type="submit" variant="secondary" disabled={pending}>
              Teilzahlung speichern
            </Button>
          </form>
        </div>
      ) : null}
      {state.message ? (
        <p className="text-sm text-[#92400E]">{state.message}</p>
      ) : null}
    </Card>
  );
}
