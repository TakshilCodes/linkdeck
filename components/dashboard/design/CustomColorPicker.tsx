import { useState, useEffect, useRef } from "react";
import { HexColorPicker } from "react-colorful";

export default function CustomColorPicker({ 
  value, 
  onChange 
}: { 
  value: string; 
  onChange: (color: string) => void; 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Sync internal state if prop changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.toUpperCase();
    setInputValue(newValue);
    if (/^#[0-9A-F]{6}$/i.test(newValue)) {
      onChange(newValue);
    }
  };

  const handleColorChange = (newColor: string) => {
    const upperColor = newColor.toUpperCase();
    setInputValue(upperColor);
    onChange(upperColor);
  };

  return (
    <div ref={pickerRef} className="relative w-full">
      <div className="flex h-14 w-full items-center overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a1a] px-4 transition focus-within:border-cyan-400 focus-within:ring-1 focus-within:ring-cyan-400/50 hover:border-white/20">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          className="h-full w-full bg-transparent text-[15px] font-medium text-white uppercase outline-none placeholder:text-white/30"
          placeholder="#000000"
          maxLength={7}
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="relative ml-3 flex shrink-0 items-center justify-center h-8 w-8 rounded-full border border-white/20 shadow-lg transition-transform hover:scale-105 overflow-hidden focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          <div className="absolute inset-0" style={{ backgroundColor: value }} />
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] right-0 z-50 rounded-2xl border border-white/10 bg-[#1a1a1a] shadow-xl p-4 animate-in fade-in zoom-in-95 duration-200">
          <style dangerouslySetInnerHTML={{__html: `
            .react-colorful { width: 200px; height: 200px; }
            .react-colorful__pointer { width: 24px; height: 24px; }
          `}} />
          <HexColorPicker color={value} onChange={handleColorChange} />
          
          <div className="mt-4 flex items-center gap-3 border-t border-white/10 pt-4">
            <span className="text-[13px] font-medium text-white/50">Hex</span>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
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
