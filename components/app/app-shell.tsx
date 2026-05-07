import type { ReactNode } from "react";
import { MobileNav } from "@/components/app/mobile-nav";
import { Sidebar } from "@/components/app/sidebar";

export function AppShell({
  children,
  accountName,
  email,
}: {
  children: ReactNode;
  accountName: string;
  email: string | null;
}) {
  return (
    <div className="min-h-screen bg-white">
      <Sidebar accountName={accountName} email={email} />
      <main className="pb-24 lg:ml-[260px] lg:pb-0">
        <div className="page-shell">{children}</div>
      </main>
      <MobileNav />
    </div>
  );
}
