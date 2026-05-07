import Link from "next/link";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/app/empty-state";
import { PageHeader } from "@/components/app/page-header";
import { PaymentRow } from "@/components/app/payment-row";
import { PaymentForm } from "@/components/forms/payment-form";
import { getAccountContext } from "@/lib/data/account";
import {
  ensureMonthlyRentReceivables,
  getPaymentsForMonth,
} from "@/lib/data/payments";
import { monthLabel } from "@/lib/utils";

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; month?: string; status?: string }>;
}) {
  const params = await searchParams;
  const now = new Date();
  const year = Number(params.year ?? now.getFullYear());
  const month = Number(params.month ?? now.getMonth() + 1);
  const status = params.status ?? "all";
  const target = new Date(year, month - 1, 1);
  const previous = new Date(year, month - 2, 1);
  const next = new Date(year, month, 1);

  const { account } = await getAccountContext();
  await ensureMonthlyRentReceivables(account.id, target);
  const payments = await getPaymentsForMonth(account.id, year, month);
  const filtered =
    status === "all"
      ? payments
      : payments.filter((payment) => payment.status === status);

  const statusLinks = [
    ["all", "Alle"],
    ["open", "Offen"],
    ["paid", "Bezahlt"],
    ["partial", "Teilweise"],
  ];

  return (
    <div>
      <PageHeader
        title="Zahlungen"
        description="Behalte monatliche Mieten und offene Betraege im Blick."
        action={
          <Button asChild>
            <a href="#zahlung-erfassen">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Zahlung erfassen
            </a>
          </Button>
        }
      />

      <div className="space-y-6">
        <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Button asChild variant="ghost" size="sm">
            <Link
              href={`/zahlungen?year=${previous.getFullYear()}&month=${previous.getMonth() + 1}&status=${status}`}
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              {monthLabel(previous)}
            </Link>
          </Button>
          <p className="text-center text-xl font-semibold leading-7 text-[#111111]">
            {monthLabel(target)}
          </p>
          <Button asChild variant="ghost" size="sm">
            <Link
              href={`/zahlungen?year=${next.getFullYear()}&month=${next.getMonth() + 1}&status=${status}`}
            >
              {monthLabel(next)}
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </Card>

        <div className="flex flex-wrap gap-2">
          {statusLinks.map(([value, label]) => (
            <Button
              key={value}
              asChild
              variant={status === value ? "default" : "secondary"}
              size="sm"
            >
              <Link href={`/zahlungen?year=${year}&month=${month}&status=${value}`}>
                {label}
              </Link>
            </Button>
          ))}
        </div>

        {payments.length === 0 ? (
          <EmptyState
            title="Noch keine Mietzahlungen"
            description="Sobald du eine vermietete Wohnung angelegt hast, erscheinen hier die monatlichen Zahlungen."
          />
        ) : (
          <>
            <section className="space-y-4">
              {filtered.map((payment) => (
                <PaymentRow key={payment.id} payment={payment} />
              ))}
            </section>

            <Card id="zahlung-erfassen">
              <CardHeader>
                <CardTitle>Zahlung erfassen</CardTitle>
              </CardHeader>
              <CardContent>
                <PaymentForm payments={payments} />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
