"use client";

import { Search, X } from "lucide-react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
};

export default function HelpSearch({ value, onChange, onClear }: Props) {
  const hasValue = value.trim().length > 0;

  return (
    <div className="relative mx-auto w-full max-w-3xl">
      <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-white/35" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search help articles..."
        aria-label="Search help articles"
        className="h-16 w-full rounded-2xl border border-white/10 bg-[#0b1421]/80 pl-13 pr-14 text-base text-white shadow-[0_20px_60px_rgba(0,0,0,0.35)] outline-none transition placeholder:text-white/30 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
      />
      {hasValue ? (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search"
          className="absolute right-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-white/50 transition hover:bg-white/10 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}
