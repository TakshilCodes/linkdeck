"use client";

import type { ResolvedTheme } from "@/types/theme";
import LinkButton from "./LinkButton";

type SectionLink = {
  id: string;
  name: string;
  url: string;
};

type LinkSectionProps = {
  title: string;
  links: SectionLink[];
  theme: ResolvedTheme;
  titleColor: string;
  isCollection?: boolean;
  className?: string;
  compact?: boolean;
};

export default function LinkSection({
  title,
  links,
  theme,
  titleColor,
  isCollection = false,
  className,
  compact = false,
}: LinkSectionProps) {
  if (!links.length) return null;

  const titleClass = compact
    ? isCollection
      ? "text-[11px] font-bold opacity-80"
      : "text-[12px] font-bold"
    : isCollection
      ? "text-[15px] font-bold opacity-80"
      : "text-[17px] font-bold";

  const stackClass = compact
    ? isCollection
      ? "mt-2 gap-2.5"
      : "mt-3 gap-3"
    : isCollection
      ? "mt-4 gap-6"
      : "mt-5 gap-9";

  return (
    <div className={className}>
      <p className={`text-center ${titleClass}`} style={{ color: titleColor }}>
        {title}
      </p>
      <div className={`flex flex-col ${stackClass}`}>
        {links.map((link) => (
          <LinkButton
            key={link.id}
            label={link.name}
            href={`/api/go/${link.id}`}
            theme={theme}
            compact={compact}
          />
        ))}
      </div>
    </div>
  );
}