"use client";

interface CardShineProps {
  className?: string;
}

export function CardShine({ className = "" }: CardShineProps) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none rounded-lg ${className}`}
    >
      {/* Diagonal shine overlay */}
      <div
        className="absolute inset-0 animate-shine"
        style={{
          background:
            "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.08) 50%, transparent 70%)",
          transform: "skewX(-15deg)",
        }}
      />
      {/* Top edge highlight */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      {/* Left edge highlight */}
      <div className="absolute top-0 bottom-0 left-0 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent" />
    </div>
  );
}
