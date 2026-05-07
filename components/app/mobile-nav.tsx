"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  CheckSquare,
  CreditCard,
  Home,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mobileItems = [
  { href: "/dashboard", label: "Start", icon: Home },
  { href: "/wohnungen", label: "Wohnungen", icon: Building2 },
  { href: "/zahlungen", label: "Zahlungen", icon: CreditCard },
  { href: "/aufgaben", label: "Aufgaben", icon: CheckSquare },
  { href: "/einstellungen", label: "Mehr", icon: MoreHorizontal },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-[#E5E5E5] bg-white px-2 pb-2 pt-2 lg:hidden">
      <div className="grid grid-cols-5 gap-1">
        {mobileItems.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              href={item.href}
              key={item.href}
              className={cn(
                "focus-ring flex min-h-12 flex-col items-center justify-center gap-1 rounded-sm text-[11px] font-medium text-[#737373]",
                active && "bg-[#F5F5F5] text-[#111111]",
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
