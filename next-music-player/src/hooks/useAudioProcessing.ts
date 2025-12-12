// Ubicación: src/hooks/useAudioProcessing.ts
// ----------------------------------------------------------------------
// Este hook maneja la Web Audio API. Es responsable del procesamiento
// de señal real: Ecualización (EQ), Aislamiento de Stems y análisis
// de frecuencias para el visualizador.
// ----------------------------------------------------------------------

import { useEffect, useRef, useState } from "react";

// Bandas de frecuencia para el ecualizador gráfico
const FREQUENCIES = [60, 250, 500, 1000, 4000, 10000];

export const useAudioProcessing = (
  audioRef: React.MutableRefObject<HTMLAudioElement | null>,
  isPlaying: boolean
) => {
  // Referencias a los nodos de audio (no causan re-renders)
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null); // Nodo para visualización
  const eqFiltersRef = useRef<BiquadFilterNode[]>([]); // Array de filtros para el EQ
  const isolatorFilterRef = useRef<BiquadFilterNode | null>(null); // Filtro dinámico para Stems

  // Inicialización del Contexto de Audio (Motor de Audio)
  const initAudioContext = () => {
    if (audioContextRef.current || !audioRef.current) return;

    // Crear contexto compatible con navegadores
    const AudioContext =
      window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContext();
    audioContextRef.current = ctx;

    // Conectar el elemento <audio> de HTML como fuente
    const source = ctx.createMediaElementSource(audioRef.current);
    sourceRef.current = source;

    // Crear nodo analizador para el visualizador
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256; // Resolución del análisis
    analyserRef.current = analyser;

    // 1. Crear Nodo Aislador (Stem Isolator)
    const isolator = ctx.createBiquadFilter();
    isolator.type = "allpass"; // Por defecto deja pasar todo
    isolatorFilterRef.current = isolator;

    // 2. Crear Cadena de Filtros para el EQ
    const filters = FREQUENCIES.map((freq, index) => {
      const filter = ctx.createBiquadFilter();
      // Configurar tipo de filtro según la banda (bajos, medios, altos)
      if (index === 0) filter.type = "lowshelf";
      else if (index === FREQUENCIES.length - 1) filter.type = "highshelf";
      else {
        filter.type = "peaking";
        filter.Q.value = 1.0;
      }
      filter.frequency.value = freq;
      filter.gain.value = 0; // Ganancia inicial 0dB
      return filter;
    });
    eqFiltersRef.current = filters;

    // CONEXIONES (Grafo de Audio):
    // Source -> Isolator -> EQ[0] -> EQ[1]... -> EQ[N] -> Analyser -> Altavoces (Destination)

    source.connect(isolator);

    let currentNode: AudioNode = isolator;
    filters.forEach((filter) => {
      currentNode.connect(filter);
      currentNode = filter;
    });

    currentNode.connect(analyser);
    analyser.connect(ctx.destination);
  };

  // Función para cambiar el modo de aislamiento (Simulación de Stems)
  const setStemMode = (
    mode: "normal" | "bass" | "drums" | "vocals" | "mids"
  ) => {
    const ctx = audioContextRef.current;
    const filter = isolatorFilterRef.current;
    if (!ctx || !filter) return;

    const currentTime = ctx.currentTime;

    // Cancelar cambios programados previos para suavidad
    filter.gain.cancelScheduledValues(currentTime);
    filter.frequency.cancelScheduledValues(currentTime);
    filter.Q.cancelScheduledValues(currentTime);

    // Configurar filtro según el modo elegido
    switch (mode) {
      case "bass": // Solo graves
        filter.type = "lowpass";
        filter.frequency.setTargetAtTime(200, currentTime, 0.1);
        filter.Q.value = 1;
        break;
      case "drums": // Notch para quitar medios y dejar bombo/platillos
        filter.type = "notch";
        filter.frequency.setTargetAtTime(500, currentTime, 0.1);
        filter.Q.value = 0.5;
        break;
      case "vocals": // Pasa-banda en frecuencias vocales
        filter.type = "bandpass";
        filter.frequency.setTargetAtTime(1000, currentTime, 0.1);
        filter.Q.value = 0.8;
        break;
      case "mids": // Pasa-banda en medios altos
        filter.type = "bandpass";
        filter.frequency.setTargetAtTime(2500, currentTime, 0.1);
        filter.Q.value = 1;
        break;
      default: // Normal (Pasa todo)
        filter.type = "allpass";
        filter.frequency.value = 350;
        break;
    }
  };

  // Actualizar una banda específica del EQ
  const updateEQ = (index: number, value: number) => {
    if (eqFiltersRef.current[index]) {
      eqFiltersRef.current[index].gain.value = value;
    }
  };

  // Resetear EQ a plano
  const resetEQ = () => {
    eqFiltersRef.current.forEach((f) => {
      f.gain.value = 0;
    });
  };

  // Inicializar el contexto de audio solo cuando el usuario interactúa (play)
  // Esto es un requisito de los navegadores modernos para evitar autoplay con sonido.
  useEffect(() => {
    if (isPlaying && !audioContextRef.current) {
      initAudioContext();
    }
    if (isPlaying && audioContextRef.current?.state === "suspended") {
      audioContextRef.current.resume();
    }
  }, [isPlaying]);

  return {
    initAudioContext,
    setStemMode,
    updateEQ,
    resetEQ,
    analyser: analyserRef.current, // Exportamos el analizador para el visualizador
  };
};
