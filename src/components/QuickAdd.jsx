import { Plus, Command } from "lucide-react";
import { useState } from "react";

interface QuickAddProps {
  onAdd: (title: string) => void;
}

export function QuickAdd({ onAdd }: QuickAddProps) {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setValue("");
  };

  return (
    <div className="w-full relative shadow-sm hover:shadow-md transition-shadow duration-300 rounded-2xl bg-white border border-gray-100 flex items-center p-2 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-300">
      <div className="pl-4 pr-3 text-gray-400 flex items-center justify-center">
        <Plus className="w-5 h-5" />
      </div>

      <input
        type="text"
        placeholder="Nad čím přemýšlíš? (Rychlé přidání)"
        className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder:text-gray-400 text-lg py-3 w-full font-medium"
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSubmit();
          }
        }}
      />
      
      <div className="flex items-center gap-3 pr-2">
        <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded bg-gray-100 text-gray-500 text-xs font-medium tracking-wide">
          <Command className="w-3 h-3" />
          <span>K</span>
        </div>

        <button
          onClick={handleSubmit}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium text-sm transition-colors flex items-center gap-2 shadow-sm"
        >
          Přidat
        </button>

      </div>
    </div>
  );
}
