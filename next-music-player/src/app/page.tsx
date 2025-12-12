// Ubicación: src/app/page.tsx
// ----------------------------------------------------------------------
// Página principal de la aplicación.
// Actúa como orquestador, conectando los Hooks (Lógica) con los
// Componentes (UI).
// ----------------------------------------------------------------------

"use client"; // Indispensable en Next.js App Router para componentes con estado

import { useState } from "react";
import Header from "@/components/Header";
import Visualizer from "@/components/Visualizer";
import PlayerControls from "@/components/PlayerControls";
import Playlist from "@/components/Playlist";
import Equalizer from "@/components/Equalizer";
import StemIsolator from "@/components/StemIsolator";
import { usePlayerState } from "@/hooks/usePlayerState";
import { useAudioProcessing } from "@/hooks/useAudioProcessing";

export default function Home() {
  // Estado para visibilidad de paneles flotantes
  const [showEQ, setShowEQ] = useState(false);
  const [showIsolator, setShowIsolator] = useState(false);

  // Hook 1: Estado del Reproductor (Lógica de Playlist, Play/Pause, Carga de Archivos)
  const {
    audioRef,
    playlist,
    currentIndex,
    isPlaying,
    currentTime,
    duration,
    volume,
    coverUrl,
    loadFiles,
    togglePlay,
    playNext,
    playPrev,
    seek,
    updateVolume,
    handleCoverUpload,
  } = usePlayerState();

  // Hook 2: Procesamiento de Audio (Lógica Web Audio API)
  const { setStemMode, updateEQ, resetEQ, analyser } = useAudioProcessing(
    audioRef,
    isPlaying
  );

  // Manejadores para abrir/cerrar paneles (excluyentes entre sí)
  const handleToggleEQ = () => {
    setShowEQ(!showEQ);
    if (!showEQ) setShowIsolator(false);
  };

  const handleToggleIsolator = () => {
    setShowIsolator(!showIsolator);
    if (!showIsolator) setShowEQ(false);
  };

  const currentTrack = playlist[currentIndex];

  return (
    <div className="h-screen h-[100dvh] bg-slate-950 text-slate-200 flex flex-col font-sans overflow-hidden">
      {/* Encabezado */}
      <Header
        onToggleEQ={handleToggleEQ}
        onToggleIsolator={handleToggleIsolator}
        onUploadCover={handleCoverUpload}
        onUploadFiles={loadFiles}
      />

      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative min-h-0">
        {/* Paneles Flotantes (Renderizado condicional para limpieza) */}
        <Equalizer
          isOpen={showEQ}
          onClose={() => setShowEQ(false)}
          onUpdateEQ={updateEQ}
          onReset={resetEQ}
        />

        <StemIsolator
          isOpen={showIsolator}
          onClose={() => setShowIsolator(false)}
          onSetMode={setStemMode}
        />

        {/* Sección Central Visual y Controles */}
        <div className="flex-1 flex flex-col relative">
          <Visualizer
            analyser={analyser}
            isPlaying={isPlaying}
            coverUrl={coverUrl}
            onTogglePlay={togglePlay}
          />

          {/* Controles sobre el visualizador */}
          <div className="bg-gradient-to-t from-slate-950 to-slate-900/0 pb-4">
            <PlayerControls
              title={currentTrack ? currentTrack.name : "Esperando música..."}
              orderText={
                currentTrack
                  ? `Pista ${currentIndex + 1} de ${playlist.length}`
                  : "Sube archivos para comenzar"
              }
              currentTime={currentTime}
              duration={duration}
              isPlaying={isPlaying}
              volume={volume}
              onPlayPause={togglePlay}
              onPrev={playPrev}
              onNext={playNext}
              onSeek={seek}
              onVolume={updateVolume}
              hasTracks={playlist.length > 0}
            />
          </div>
        </div>

        {/* Playlist Lateral */}
        <Playlist
          playlist={playlist}
          currentIndex={currentIndex}
          onSelect={(index) => {
            // Al hacer clic en la lista, forzamos la carga y reproducción
            const track = playlist[index];
            if (audioRef.current) {
              audioRef.current.src = track.url;
              audioRef.current.load();
              // (Nota: Idealmente esto debería manejarse dentro de una función 'playTrack' expuesta por el hook)
              setTimeout(() => togglePlay(), 50);
            }
          }}
        />
      </main>

      {/* Footer */}
      <footer className="p-4 border-t border-slate-800 bg-slate-900/90 backdrop-blur-md text-center text-xs text-slate-400 font-medium flex-none z-20 pb-6 md:pb-4">
        Developed with Next.js & Web Audio API
      </footer>
    </div>
  );
}
