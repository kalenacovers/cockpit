import { Badge } from "@/components/ui/badge";

type StatusBadgeProps = {
  status:
    | "paid"
    | "partial"
    | "open"
    | "cancelled"
    | "vermietet"
    | "frei"
    | "unbekannt"
    | "done"
    | "archived"
    | "missing"
    | string;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const map: Record<string, { label: string; variant: React.ComponentProps<typeof Badge>["variant"] }> = {
    paid: { label: "Bezahlt", variant: "success" },
    partial: { label: "Teilweise bezahlt", variant: "warning" },
    open: { label: "Offen", variant: "warning" },
    cancelled: { label: "Archiviert", variant: "default" },
    vermietet: { label: "Vermietet", variant: "accent" },
    frei: { label: "Frei", variant: "info" },
    unbekannt: { label: "Spaeter eintragen", variant: "default" },
    done: { label: "Erledigt", variant: "success" },
    archived: { label: "Archiviert", variant: "default" },
    missing: { label: "Fehlt noch", variant: "warning" },
  };

  const item = map[status] ?? { label: status, variant: "default" };
  return <Badge variant={item.variant}>{item.label}</Badge>;
}
