"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  CheckSquare,
  CreditCard,
  FileText,
  Home,
  Settings,
  Users,
} from "lucide-react";
import { signOutAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/wohnungen", label: "Wohnungen", icon: Building2 },
  { href: "/mieter", label: "Mieter", icon: Users },
  { href: "/zahlungen", label: "Zahlungen", icon: CreditCard },
  { href: "/dokumente", label: "Dokumente", icon: FileText },
  { href: "/aufgaben", label: "Aufgaben", icon: CheckSquare },
  { href: "/einstellungen", label: "Einstellungen", icon: Settings },
];

export function Sidebar({
  accountName,
  email,
}: {
  accountName: string;
  email: string | null;
}) {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-[260px] border-r border-[#E5E5E5] bg-white lg:flex lg:flex-col">
      <div className="border-b border-[#E5E5E5] px-6 py-5">
        <Link href="/dashboard" className="block">
          <p className="text-base font-semibold leading-6 text-[#111111]">
            Vermieter Cockpit
          </p>
          <p className="mt-1 text-[13px] leading-[18px] text-[#737373]">
            Digitaler Vermieter-Ordner
          </p>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "focus-ring flex h-10 items-center gap-3 rounded-sm px-3 text-sm font-medium text-[#525252] transition-colors hover:bg-[#F5F5F5] hover:text-[#111111]",
                active && "bg-[#F5F5F5] text-[#111111]",
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[#E5E5E5] p-4">
        <p className="truncate text-sm font-medium text-[#111111]">
          {accountName}
        </p>
        <p className="mt-1 truncate text-[13px] text-[#737373]">{email}</p>
        <form action={signOutAction} className="mt-3">
          <Button variant="secondary" className="w-full" type="submit">
            Logout
          </Button>
        </form>
      </div>
    </aside>
  );
}
