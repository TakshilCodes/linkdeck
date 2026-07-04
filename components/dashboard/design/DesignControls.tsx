"use client";

import { useEffect, useRef, useState } from "react";

type ToggleSwitchProps = {
  label: string;
  subtitle?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export function ToggleSwitch({ label, subtitle, checked, onChange }: ToggleSwitchProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4">
        <div>
          <label className="block text-sm font-medium text-white/80">{label}</label>
          {subtitle ? <p className="text-xs text-white/50">{subtitle}</p> : null}
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          onClick={() => onChange(!checked)}
          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
            checked ? "bg-cyan-400" : "bg-white/20"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              checked ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>
    </div>
  );
}

type DesignSelectProps<T extends string> = {
  value: T;
  onChange: (value: T) => void;
  options: readonly T[];
  ariaLabel?: string;
};

function formatOption(value: string) {
  return value.charAt(0) + value.slice(1).toLowerCase();
}

export function DesignSelect<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
}: DesignSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current?.contains(event.target as Node)) {
        return;
      }

      setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className="flex h-12 w-full appearance-none items-center justify-between rounded-2xl border border-white/10 bg-transparent px-4 text-left text-[15px] text-white outline-none transition focus:border-cyan-400"
      >
        <span>{formatOption(value)}</span>
        <svg
          className={`h-4 w-4 text-white/60 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen ? (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a1a] shadow-xl">
          <div className="max-h-60 overflow-y-auto">
            {options.map((option) => {
              const isSelected = option === value;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left text-[15px] transition ${
                    isSelected ? "bg-cyan-400/20 text-cyan-300" : "text-white hover:bg-[#2a2a2a]"
                  }`}
                >
                  {formatOption(option)}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
