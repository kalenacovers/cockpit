import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

type DashboardSummaryProps = {
  totalUnits: number;
  rentedUnits: number;
  monthlyRent: number;
  openRent: number;
  openTasks: number;
};

export function DashboardSummary({
  totalUnits,
  rentedUnits,
  monthlyRent,
  openRent,
  openTasks,
}: DashboardSummaryProps) {
  const items = [
    { label: "Wohnungen", value: String(totalUnits) },
    { label: "Vermietet", value: String(rentedUnits) },
    { label: "Monatliche Miete", value: formatCurrency(monthlyRent) },
    { label: "Offene Mieten", value: formatCurrency(openRent) },
    { label: "Offene Aufgaben", value: String(openTasks) },
  ];

  return (
    <Card>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {items.map((item) => (
          <div key={item.label}>
            <p className="text-[13px] leading-[18px] text-[#737373]">
              {item.label}
            </p>
            <p className="mt-2 text-xl font-semibold leading-7 text-[#111111]">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
