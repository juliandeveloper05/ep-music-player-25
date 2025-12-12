// Ubicación: src/hooks/usePlayerState.ts
// ----------------------------------------------------------------------
// Este hook actúa como el "cerebro" del reproductor. Maneja el estado
// de la lista de reproducción, la canción actual, el volumen y los
// controles básicos de HTMLAudioElement (play, pause, seek).
// ----------------------------------------------------------------------

import { useState, useRef, useEffect } from "react";

// Definición del tipo de dato para una pista de audio
export interface Track {
  name: string; // Nombre del archivo (sin extensión)
  url: string; // URL temporal (blob) creada por el navegador
  duration: number; // Duración en segundos
}

export const usePlayerState = () => {
  // --- Estados React (UI) ---
  const [playlist, setPlaylist] = useState<Track[]>([]); // Lista de canciones cargadas
  const [currentIndex, setCurrentIndex] = useState<number>(0); // Índice de la canción actual
  const [isPlaying, setIsPlaying] = useState(false); // Estado de reproducción
  const [currentTime, setCurrentTime] = useState(0); // Tiempo actual en segundos
  const [duration, setDuration] = useState(0); // Duración total de la canción actual
  const [volume, setVolume] = useState(1); // Volumen (0.0 a 1.0)
  const [coverUrl, setCoverUrl] = useState<string | null>(null); // URL de la imagen de portada

  // Referencia al elemento de audio HTML nativo (no visible en UI)
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Inicializar la instancia de Audio solo una vez en el cliente
  useEffect(() => {
    if (typeof window !== "undefined" && !audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.crossOrigin = "anonymous"; // Importante para efectos de audio (CORS)
    }
  }, []);

  // Función para procesar los archivos subidos por el usuario
  const loadFiles = async (files: FileList) => {
    const newTracks: Track[] = [];

    // Iteramos sobre los archivos seleccionados
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = URL.createObjectURL(file);

      // Truco para obtener la duración antes de reproducir
      const tempAudio = new Audio(url);
      const getDuration = new Promise<number>((resolve) => {
        tempAudio.onloadedmetadata = () => resolve(tempAudio.duration);
        tempAudio.onerror = () => resolve(0);
      });

      const dur = await getDuration;
      newTracks.push({
        name: file.name.replace(/\.[^/.]+$/, ""), // Quitamos la extensión del nombre
        url,
        duration: dur,
      });
    }

    // Actualizamos el estado de la playlist
    setPlaylist((prev) => {
      const updated = [...prev, ...newTracks];
      // Si es la primera vez que se cargan archivos, cargar la primera canción
      if (prev.length === 0 && newTracks.length > 0) {
        loadTrack(0, updated);
      }
      return updated;
    });
  };

  // Cargar una pista específica en el elemento de audio
  const loadTrack = (index: number, list = playlist) => {
    if (!audioRef.current || index < 0 || index >= list.length) return;

    const track = list[index];
    audioRef.current.src = track.url;
    audioRef.current.load(); // Forzar carga del recurso
    setCurrentIndex(index);
    setCurrentTime(0);
  };

  // Alternar entre Play y Pause
  const togglePlay = async () => {
    if (!audioRef.current || playlist.length === 0) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (e) {
        console.error("Error al reproducir:", e);
      }
    }
  };

  // Ir a la siguiente canción
  const playNext = () => {
    if (currentIndex < playlist.length - 1) {
      loadTrack(currentIndex + 1);
      setTimeout(() => togglePlay(), 100); // Pequeño retraso para asegurar carga
    }
  };

  // Ir a la canción anterior
  const playPrev = () => {
    if (!audioRef.current) return;
    // Si la canción lleva más de 3 segundos, reiniciar la canción actual
    if (audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
    } else if (currentIndex > 0) {
      // Si no, ir a la anterior
      loadTrack(currentIndex - 1);
      setTimeout(() => togglePlay(), 100);
    }
  };

  // Cambiar la posición de reproducción (Seeking)
  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // Cambiar volumen
  const updateVolume = (val: number) => {
    if (audioRef.current) {
      audioRef.current.volume = val;
      setVolume(val);
    }
  };

  // Manejar subida de portada
  const handleCoverUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    setCoverUrl(url);
  };

  // Configurar Listeners: Sincronizar eventos del audio nativo con el estado de React
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onEnded = () => {
      // Auto-play siguiente canción al terminar
      if (currentIndex < playlist.length - 1) {
        playNext();
      } else {
        setIsPlaying(false);
      }
    };
    const onLoadedMetadata = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);

    // Limpieza de eventos al desmontar
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
    };
  }, [playlist, currentIndex]);

  // Exponemos todo lo necesario para los componentes visuales
  return {
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
  };
};
