"use client";

import { TopNav } from "./TopNav";
import { MobileBottomNav } from "./MobileBottomNav";
import { usePathname } from "next/navigation";
import { TemplateProvider } from "@/lib/card-templates/context";
import { RepositoryProvider } from "@/lib/storage/RepositoryProvider";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  return (
    <TemplateProvider>
      <RepositoryProvider>
        <div className="min-h-screen bg-stadium flex flex-col">
          {!isLanding && <TopNav />}
          <main className={`flex-1 ${isLanding ? "" : "pb-20 md:pb-0"}`}>
            {children}
          </main>
          {!isLanding && <MobileBottomNav />}
        </div>
      </RepositoryProvider>
    </TemplateProvider>
  );
}
