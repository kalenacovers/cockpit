import { redirect } from "next/navigation";
import { getAccountContext, getUser } from "@/lib/data/account";
import { getUnits } from "@/lib/data/properties";

export default async function HomePage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const { account } = await getAccountContext();
  const units = await getUnits(account.id);

  if (units.length === 0) redirect("/setup");
  redirect("/dashboard");
}
