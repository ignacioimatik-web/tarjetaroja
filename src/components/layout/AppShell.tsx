"use client";

import { TopNav } from "./TopNav";
import { MobileBottomNav } from "./MobileBottomNav";
import { usePathname } from "next/navigation";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  return (
    <div className="min-h-screen bg-stadium flex flex-col">
      {!isLanding && <TopNav />}
      <main className={`flex-1 ${isLanding ? "" : "pb-20 md:pb-0"}`}>
        {children}
      </main>
      {!isLanding && <MobileBottomNav />}
    </div>
  );
}
