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
};

export default function LinkSection({
  title,
  links,
  theme,
  titleColor,
  isCollection = false,
  className,
}: LinkSectionProps) {
  if (!links.length) return null;

  return (
    <div className={className}>
      <p
        className={`text-center font-bold ${
          isCollection ? "text-[15px] opacity-80" : "text-[17px]"
        }`}
        style={{ color: titleColor }}
      >
        {title}
      </p>
      <div
        className={`flex flex-col ${
          isCollection ? "mt-4 gap-6" : "mt-5 gap-9"
        }`}
      >
        {links.map((link) => (
          <LinkButton
            key={link.id}
            label={link.name}
            href={link.url}
            theme={theme}
          />
        ))}
      </div>
    </div>
  );
}