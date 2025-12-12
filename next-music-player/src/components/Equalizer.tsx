// Ubicación: src/components/Equalizer.tsx
// ----------------------------------------------------------------------
// Panel flotante del Ecualizador Gráfico de 6 bandas.
// Renderiza 6 sliders verticales que controlan la ganancia (dB).
// ----------------------------------------------------------------------

import { Sliders, X } from "lucide-react";
import { useState } from "react";

interface EqualizerProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateEQ: (index: number, value: number) => void;
  onReset: () => void;
}

const FREQUENCIES = [60, 250, 500, "1k", "4k", "10k"];

export default function Equalizer({
  isOpen,
  onClose,
  onUpdateEQ,
  onReset,
}: EqualizerProps) {
  // Estado local para mantener la posición visual de los sliders
  const [values, setValues] = useState<number[]>(new Array(6).fill(0));

  const handleChange = (index: number, val: string) => {
    const numVal = parseFloat(val);
    const newValues = [...values];
    newValues[index] = numVal;
    setValues(newValues);
    onUpdateEQ(index, numVal); // Notifica al hook de audio
  };

  const handleReset = () => {
    setValues(new Array(6).fill(0));
    onReset();
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-16 right-4 md:right-20 z-30 bg-slate-900/95 backdrop-blur-xl border border-slate-700 p-4 rounded-2xl shadow-2xl w-auto animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-indigo-400 font-bold text-xs uppercase flex items-center gap-2">
          <Sliders className="w-3 h-3" /> Ecualizador
        </h3>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white"
          title="Cerrar ecualizador"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Contenedor de Sliders */}
      <div className="flex gap-2 justify-center">
        {FREQUENCIES.map((freq, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            {/* Contenedor CSS personalizado para rotar el input range y hacerlo vertical */}
            <div className="eq-slider-container">
              <input
                type="range"
                min="-12"
                max="12"
                value={values[i]}
                step="1"
                className="eq-slider"
                title={`Ganancia para ${freq}Hz`}
                onChange={(e) => handleChange(i, e.target.value)}
              />
            </div>
            <span className="text-[9px] text-slate-400 font-mono">{freq}</span>
          </div>
        ))}
      </div>

      <div className="mt-2 text-center">
        <button
          onClick={handleReset}
          className="text-[9px] text-slate-500 hover:text-white underline"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
