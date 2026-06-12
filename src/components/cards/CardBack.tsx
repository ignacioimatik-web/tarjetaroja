"use client";

import { cn } from "@/lib/utils";
import { Trophy } from "lucide-react";

interface CardBackProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "w-28 h-40",
  md: "w-36 h-52",
  lg: "w-44 h-64",
};

export function CardBack({ size = "md", className = "" }: CardBackProps) {
  return (
    <div
      className={cn(
        "relative rounded-xl border-2 border-zinc-700 bg-gradient-to-b from-zinc-900 to-zinc-950 overflow-hidden",
        sizeMap[size],
        className
      )}
    >
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
          backgroundSize: "8px 8px",
        }}
      />
      <div className="absolute inset-2 rounded-lg border border-zinc-700/50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <span className="text-[8px] text-zinc-500 font-bold tracking-[0.2em] uppercase text-center leading-tight">
            Adrenalyn
            <br />
            Cup
          </span>
        </div>
      </div>
    </div>
  );
}
