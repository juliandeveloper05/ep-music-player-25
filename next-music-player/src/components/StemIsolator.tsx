// Ubicación: src/components/StemIsolator.tsx
// ----------------------------------------------------------------------
// Panel flotante para aislar instrumentos (Stems).
// Permite seleccionar entre modos predefinidos de filtrado.
// ----------------------------------------------------------------------

import { Layers, X, Activity, Drum, Mic, Music2 } from "lucide-react";
import { useState } from "react";

type StemMode = "normal" | "bass" | "drums" | "vocals" | "mids";

interface StemIsolatorProps {
  isOpen: boolean;
  onClose: () => void;
  onSetMode: (mode: StemMode) => void;
}

export default function StemIsolator({
  isOpen,
  onClose,
  onSetMode,
}: StemIsolatorProps) {
  const [activeMode, setActiveMode] = useState<StemMode>("normal");

  const handleMode = (mode: StemMode) => {
    setActiveMode(mode);
    onSetMode(mode); // Llama al hook de audio para aplicar filtros
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-16 left-4 md:left-20 z-30 bg-slate-900/95 backdrop-blur-xl border border-slate-700 p-4 rounded-2xl shadow-2xl w-64 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-indigo-400 font-bold text-xs uppercase flex items-center gap-2">
          <Layers className="w-3 h-3" /> Aislador de Stems
        </h3>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Botones de Selección */}
      <div className="space-y-2">
        <StemButton
          active={activeMode === "normal"}
          onClick={() => handleMode("normal")}
          label="Original (Mix Completo)"
        />
        <div className="h-px bg-slate-700 my-2"></div>
        <StemButton
          active={activeMode === "bass"}
          onClick={() => handleMode("bass")}
          label="Bajos / Sub"
          icon={<Activity className="w-3 h-3" />}
        />
        <StemButton
          active={activeMode === "drums"}
          onClick={() => handleMode("drums")}
          label="Batería / Ritmo"
          icon={<Drum className="w-3 h-3" />}
        />
        <StemButton
          active={activeMode === "vocals"}
          onClick={() => handleMode("vocals")}
          label="Voces / Lead"
          icon={<Mic className="w-3 h-3" />}
        />
        <StemButton
          active={activeMode === "mids"}
          onClick={() => handleMode("mids")}
          label="Piano / Guitarra"
          icon={<Music2 className="w-3 h-3" />}
        />
      </div>
      <p className="text-[9px] text-slate-500 mt-3 text-center italic">
        *Simulación basada en frecuencias.
      </p>
    </div>
  );
}

// Sub-componente simple para los botones de modo
function StemButton({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded text-xs font-medium transition-colors flex justify-between items-center ${
        active
          ? "bg-indigo-600 text-white"
          : "bg-slate-800 text-slate-300 hover:bg-slate-700"
      }`}
    >
      <span>{label}</span>
      {icon}
    </button>
  );
}
