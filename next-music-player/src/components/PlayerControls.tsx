// Ubicación: src/components/PlayerControls.tsx
// ----------------------------------------------------------------------
// Barra de controles inferior. Muestra título, barra de progreso,
// botones de reproducción y control de volumen.
// ----------------------------------------------------------------------

import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";

interface PlayerControlsProps {
  title: string;
  orderText: string;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  volume: number;
  onPlayPause: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSeek: (time: number) => void;
  onVolume: (vol: number) => void;
  hasTracks: boolean;
}

export default function PlayerControls({
  title,
  orderText,
  currentTime,
  duration,
  isPlaying,
  volume,
  onPlayPause,
  onPrev,
  onNext,
  onSeek,
  onVolume,
  hasTracks,
}: PlayerControlsProps) {
  // Utilidad para formatear segundos a MM:SS
  const formatTime = (s: number) => {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sc = Math.floor(s % 60);
    return `${m}:${sc < 10 ? "0" : ""}${sc}`;
  };

  return (
    <div className="text-center w-full max-w-md shrink-0 flex flex-col gap-2 pb-6 md:pb-0 z-20 relative bg-transparent mx-auto">
      {/* Información de la pista */}
      <div>
        <h2 className="text-lg font-bold text-white truncate px-4">{title}</h2>
        <p className="text-slate-400 text-xs">{orderText}</p>
      </div>

      {/* Barra de Progreso */}
      <div className="w-full flex items-center gap-2 px-6">
        <span className="text-[10px] text-slate-400 w-8 text-right font-mono">
          {formatTime(currentTime)}
        </span>
        <div
          className="flex-1 relative h-1 bg-slate-700 rounded-full cursor-pointer group py-2 bg-clip-content"
          onClick={(e) => {
            if (!hasTracks) return;
            // Calcular posición del click relativo a la barra
            const rect = e.currentTarget.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            onSeek(percent * duration);
          }}
        >
          <div className="absolute top-2 left-0 right-0 h-1 bg-slate-700 rounded-full"></div>
          {/* Barra de progreso coloreada */}
          <div
            className="absolute top-2 left-0 h-1 bg-indigo-500 rounded-full group-hover:bg-indigo-400 transition-all"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          ></div>
        </div>
        <span className="text-[10px] text-slate-400 w-8 text-left font-mono">
          {formatTime(duration)}
        </span>
      </div>

      {/* Botonera de Reproducción */}
      <div className="flex items-center justify-center gap-6 mt-1">
        <button
          onClick={onPrev}
          disabled={!hasTracks}
          className="text-slate-400 hover:text-white transition-colors disabled:opacity-30 p-2"
          title="Previous track"
          aria-label="Previous track"
        >
          <SkipBack className="w-6 h-6" />
        </button>

        <button
          onClick={onPlayPause}
          disabled={!hasTracks}
          className="w-12 h-12 bg-white text-slate-900 rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-white/10 mx-2"
          title={isPlaying ? "Pause" : "Play"}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 fill-current" />
          ) : (
            <Play className="w-5 h-5 fill-current ml-1" />
          )}
        </button>

        <button
          onClick={onNext}
          disabled={!hasTracks}
          className="text-slate-400 hover:text-white transition-colors disabled:opacity-30 p-2"
          title="Next track"
          aria-label="Next track"
        >
          <SkipForward className="w-6 h-6" />
        </button>
      </div>

      {/* Slider de Volumen */}
      <div className="flex items-center justify-center gap-2 w-2/3 mx-auto mt-1">
        <Volume2 className="w-3 h-3 text-slate-400" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={(e) => onVolume(parseFloat(e.target.value))}
          className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
          title="Volume"
          aria-label="Volume control"
        />
      </div>
    </div>
  );
}
