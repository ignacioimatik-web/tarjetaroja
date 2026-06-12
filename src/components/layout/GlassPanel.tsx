"use client";

import { cn } from "@/lib/utils";

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassPanel({ children, className, hover = false }: GlassPanelProps) {
  return (
    <div
      className={cn(
        "glass rounded-xl p-6",
        hover && "hover:bg-white/[0.07] transition-all duration-200 cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}
