// Ubicación: src/components/Playlist.tsx
// ----------------------------------------------------------------------
// Panel lateral que muestra la lista de reproducción.
// Mapea el array de tracks y resalta la pista actual.
// ----------------------------------------------------------------------

import { ListMusic, Music4 } from "lucide-react";
import { Track } from "../hooks/usePlayerState";

interface PlaylistProps {
  playlist: Track[];
  currentIndex: number;
  onSelect: (index: number) => void;
}

export default function Playlist({
  playlist,
  currentIndex,
  onSelect,
}: PlaylistProps) {
  const formatTime = (s: number) => {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sc = Math.floor(s % 60);
    return `${m}:${sc < 10 ? "0" : ""}${sc}`;
  };

  const totalDuration = playlist.reduce((acc, t) => acc + (t.duration || 0), 0);

  return (
    <section className="w-full md:w-80 bg-slate-900 border-l border-slate-800 flex flex-col z-10 h-1/3 md:h-auto border-t md:border-t-0 shrink-0">
      <div className="p-3 border-b border-slate-800 flex-none flex justify-between items-center">
        <h3 className="font-semibold text-slate-200 flex items-center gap-2 text-sm">
          <ListMusic className="w-4 h-4" />
          Lista
        </h3>
        <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">
          {playlist.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1 pb-2">
        {playlist.length === 0 ? (
          // Estado vacío
          <div className="h-full flex flex-col items-center justify-center text-slate-500 p-4 text-center opacity-60">
            <Music4 className="w-8 h-8 mb-1" />
            <p className="text-xs">Lista vacía</p>
          </div>
        ) : (
          // Renderizado de lista
          playlist.map((track, index) => {
            const isActive = index === currentIndex;
            return (
              <div
                key={index}
                onClick={() => onSelect(index)}
                className={`p-2 rounded-lg flex items-center gap-2 cursor-pointer transition-colors group ${
                  isActive
                    ? "bg-indigo-900/50 border border-indigo-500/30"
                    : "hover:bg-slate-800 border border-transparent"
                }`}
              >
                <div
                  className={`text-[10px] font-mono ${
                    isActive ? "text-indigo-400" : "text-slate-500"
                  } w-4 text-center flex-shrink-0`}
                >
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className={`font-medium text-xs truncate ${
                      isActive
                        ? "text-indigo-200"
                        : "text-slate-300 group-hover:text-white"
                    }`}
                  >
                    {track.name}
                  </div>
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  {formatTime(track.duration)}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pie de lista con duración total */}
      <div className="p-2 bg-slate-900 border-t border-slate-800 text-[10px] text-slate-500 text-center flex-none">
        Total:{" "}
        <span className="text-slate-300">{formatTime(totalDuration)}</span>
      </div>
    </section>
  );
}
