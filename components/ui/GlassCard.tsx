import React from "react";

export default function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "rounded-3xl",
        "bg-white/5 backdrop-blur-xl",
        "border border-white/10",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
        "shadow-[0_20px_60px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.03)]",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}