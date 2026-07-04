"use client";

import { useEffect, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";

export default function CustomColorPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (color: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [draftValue, setDraftValue] = useState<string | null>(null);
  const [placement, setPlacement] = useState<"top" | "bottom">("bottom");
  const pickerRef = useRef<HTMLDivElement>(null);
  const inputValue = draftValue ?? value;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setDraftValue(null);
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const normalizeHex = (rawValue: string) => {
    const sanitized = rawValue.replace(/[^0-9a-f]/gi, "").slice(0, 6).toUpperCase();
    return sanitized ? `#${sanitized}` : "#";
  };

  const commitHex = (rawValue: string) => {
    const normalized = normalizeHex(rawValue);
    setDraftValue(normalized);

    if (/^#[0-9A-F]{6}$/.test(normalized)) {
      onChange(normalized);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const normalized = normalizeHex(e.target.value);
    setDraftValue(normalized);

    if (/^#[0-9A-F]{6}$/.test(normalized)) {
      onChange(normalized);
    }
  };

  const handleColorChange = (newColor: string) => {
    const upperColor = newColor.toUpperCase();
    setDraftValue(upperColor);
    onChange(upperColor);
  };

  const handleInputBlur = () => {
    commitHex(inputValue);
  };

  const handleInputPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    commitHex(e.clipboardData.getData("text"));
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      commitHex(inputValue);
    }
  };

  const togglePicker = () => {
    if (!isOpen && pickerRef.current) {
      const rect = pickerRef.current.getBoundingClientRect();
      const pickerHeight = 290;
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      setPlacement(spaceBelow < pickerHeight && spaceAbove > spaceBelow ? "top" : "bottom");
    }

    setIsOpen((current) => !current);
  };

  return (
    <div ref={pickerRef} className="relative w-full">
      <div className="flex h-14 w-full items-center overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a1a] px-4 transition focus-within:border-cyan-400 focus-within:ring-1 focus-within:ring-cyan-400/50 hover:border-white/20">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          onPaste={handleInputPaste}
          onFocus={(e) => e.currentTarget.select()}
          className="h-full w-full bg-transparent text-[15px] font-medium text-white uppercase outline-none placeholder:text-white/30"
          placeholder="#000000"
          maxLength={7}
        />
        <button
          type="button"
          onClick={togglePicker}
          className="relative ml-3 flex shrink-0 items-center justify-center h-8 w-8 rounded-full border border-white/20 shadow-lg transition-transform hover:scale-105 overflow-hidden focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          <div className="absolute inset-0" style={{ backgroundColor: value }} />
        </button>
      </div>

      {isOpen && (
        <div
          className={`absolute right-0 z-50 rounded-2xl border border-white/10 bg-[#1a1a1a] shadow-xl p-4 animate-in fade-in zoom-in-95 duration-200 ${
            placement === "top" ? "bottom-[calc(100%+8px)]" : "top-[calc(100%+8px)]"
          }`}
        >
          <style dangerouslySetInnerHTML={{ __html: `
            .react-colorful { width: 200px; height: 200px; }
            .react-colorful__pointer { width: 24px; height: 24px; }
          ` }} />
          <HexColorPicker color={value} onChange={handleColorChange} />

          <div className="mt-4 flex items-center gap-3 border-t border-white/10 pt-4">
            <span className="text-[13px] font-medium text-white/50">Hex</span>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyDown={handleInputKeyDown}
              onPaste={handleInputPaste}
              onFocus={(e) => e.currentTarget.select()}
              className="flex-1 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-[13px] font-medium text-white outline-none transition focus:border-cyan-400"
              placeholder="#000000"
              maxLength={7}
            />
          </div>
        </div>
      )}
    </div>
  );
}