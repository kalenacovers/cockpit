import { getPaymentsForMonth } from "@/lib/data/payments";
import { getTasks } from "@/lib/data/tasks";
import { getUnits } from "@/lib/data/properties";

export async function getDashboardData(accountId: string) {
  const now = new Date();
  const [units, payments, tasks] = await Promise.all([
    getUnits(accountId),
    getPaymentsForMonth(accountId, now.getFullYear(), now.getMonth() + 1),
    getTasks(accountId),
  ]);

  const monthlyRent = units.reduce((sum, unit) => {
    const rent = unit.rentTerm?.total_rent
      ? Number(unit.rentTerm.total_rent)
      : 0;
    return sum + rent;
  }, 0);

  const openRent = payments.reduce((sum, payment) => {
    if (payment.status === "paid") return sum;
    return sum + Math.max(Number(payment.amount) - payment.paidAmount, 0);
  }, 0);

  const hints = [
    ...payments
      .filter((payment) => payment.status !== "paid")
      .map((payment) => ({
        title: "Diese Miete ist noch offen.",
        detail: payment.unit?.name ?? payment.label,
        href: "/zahlungen",
      })),
    ...tasks.slice(0, 5).map((task) => ({
      title: task.title,
      detail: task.unit?.name ?? "Aufgabe",
      href: "/aufgaben",
    })),
  ].slice(0, 5);

  return {
    units,
    payments,
    tasks,
    hints,
    summary: {
      totalUnits: units.length,
      rentedUnits: units.filter((unit) => unit.status === "vermietet").length,
      monthlyRent,
      openRent,
      openTasks: tasks.length,
    },
  };
}
