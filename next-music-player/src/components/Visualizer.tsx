// Ubicación: src/components/Visualizer.tsx
// ----------------------------------------------------------------------
// Componente de Visualización. Muestra el arte de tapa giratorio y
// los "badges" que se iluminan al detectar instrumentos.
// Utiliza requestAnimationFrame para consultar el AnalyserNode 60 veces/segundo.
// ----------------------------------------------------------------------

import { useEffect, useRef } from "react";
import { Play } from "lucide-react";

interface VisualizerProps {
  analyser: AnalyserNode | null;
  isPlaying: boolean;
  coverUrl: string | null;
  onTogglePlay: () => void;
}

export default function Visualizer({
  analyser,
  isPlaying,
  coverUrl,
  onTogglePlay,
}: VisualizerProps) {
  const animationRef = useRef<number | undefined>(undefined);

  // Usamos Refs para acceder directamente al DOM de los badges
  // Esto mejora el rendimiento evitando re-renderizados de React en cada frame de animación
  const bassRef = useRef<HTMLDivElement>(null);
  const kickRef = useRef<HTMLDivElement>(null);
  const voxRef = useRef<HTMLDivElement>(null);
  const highsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!analyser || !isPlaying) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    // Bucle de animación
    const draw = () => {
      // Obtener datos de frecuencia actuales
      analyser.getByteFrequencyData(dataArray);

      // --- Lógica de Detección de Instrumentos (Simplificada) ---

      // Bajos: Promedio de las primeras 3 bandas (frecuencias muy bajas)
      let bassEnergy = 0;
      for (let i = 0; i < 3; i++) bassEnergy += dataArray[i];
      bassEnergy /= 3;

      // Kick: Solo la primera banda (subgraves profundos)
      let kickEnergy = dataArray[0];

      // Voces: Rango medio de frecuencias
      let vocalEnergy = 0;
      for (let i = 3; i < 10; i++) vocalEnergy += dataArray[i];
      vocalEnergy /= 7;

      // Agudos (Hi-Hats): Rango alto
      let highEnergy = 0;
      for (let i = 30; i < 60; i++) highEnergy += dataArray[i];
      highEnergy /= 30;

      // Modificar clases CSS directamente según umbrales de energía
      toggleBadge(bassRef.current, bassEnergy > 180);
      toggleBadge(kickRef.current, kickEnergy > 210);
      toggleBadge(voxRef.current, vocalEnergy > 140);
      toggleBadge(highsRef.current, highEnergy > 100);

      // Solicitar siguiente frame
      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    // Limpiar animación al desmontar o pausar
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [analyser, isPlaying]);

  // Helper para añadir/quitar clase 'active'
  const toggleBadge = (el: HTMLDivElement | null, active: boolean) => {
    if (!el) return;
    if (active) el.classList.add("active");
    else el.classList.remove("active");
  };

  return (
    <section className="flex-1 flex flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-900 to-slate-950 relative z-10 overflow-hidden w-full h-full min-h-[300px]">
      {/* Indicadores de Instrumentos */}
      <div className="flex gap-2 mb-6 flex-wrap justify-center">
        <div
          ref={bassRef}
          className="instrument-badge border border-slate-700 px-2 py-1 rounded-full text-[9px] font-bold text-slate-300 flex items-center gap-1"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div> BASS
        </div>
        <div
          ref={kickRef}
          className="instrument-badge border border-slate-700 px-2 py-1 rounded-full text-[9px] font-bold text-slate-300 flex items-center gap-1"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> KICK
        </div>
        <div
          ref={voxRef}
          className="instrument-badge border border-slate-700 px-2 py-1 rounded-full text-[9px] font-bold text-slate-300 flex items-center gap-1"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div> VOX
        </div>
        <div
          ref={highsRef}
          className="instrument-badge border border-slate-700 px-2 py-1 rounded-full text-[9px] font-bold text-slate-300 flex items-center gap-1"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div> HI-HAT
        </div>
      </div>

      {/* Disco Giratorio (Portada) */}
      <div
        className="relative w-48 h-48 md:w-64 md:h-64 mb-4 group shrink-0 cursor-pointer"
        onClick={onTogglePlay}
      >
        {/* Efecto de resplandor */}
        <div className="absolute inset-0 bg-indigo-500 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>

        {/* Disco */}
        <div
          className={`w-full h-full bg-slate-800 rounded-full border-4 border-slate-700 shadow-2xl flex items-center justify-center overflow-hidden relative transition-transform duration-700 ${
            isPlaying ? "spin-slow" : ""
          }`}
          style={{ animationPlayState: isPlaying ? "running" : "paused" }}
        >
          {/* Imagen de fondo */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40 transition-opacity duration-300"
            style={{
              backgroundImage: `url('${
                coverUrl ||
                "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=1000&auto=format&fit=crop"
              }')`,
              opacity: coverUrl ? 0.8 : 0.4,
            }}
          ></div>

          {/* Centro del disco */}
          <div className="w-16 h-16 bg-slate-950 rounded-full border-4 border-slate-700 z-30 flex items-center justify-center">
            <Play
              className={`w-6 h-6 text-slate-500 ${
                isPlaying ? "ml-0" : "ml-1"
              }`}
              fill={isPlaying ? "none" : "currentColor"}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
