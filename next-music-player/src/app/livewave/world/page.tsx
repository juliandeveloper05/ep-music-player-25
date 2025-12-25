"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Radio,
  Users,
  Search,
  Shuffle,
  Flame,
  TrendingUp,
  Globe,
  Headphones,
  Sparkles,
  Zap,
  Music,
  ChevronRight,
  Play,
} from "lucide-react";

// ============================================================================
// LIVEWAVE WORLD - Explorador de Sesiones
// El mapa donde descubres todas las sesiones en vivo
// ============================================================================

interface Session {
  id: string;
  djName: string;
  title: string;
  listeners: number;
  genre: string[];
  isLive: boolean;
  avatar: string;
  mood: string;
  country: string;
}

const MOCK_SESSIONS: Session[] = [
  {
    id: "1",
    djName: "@experimental_void",
    title: "Fragmentos del Vacío",
    listeners: 1247,
    genre: ["experimental", "ambient", "glitch"],
    isLive: true,
    avatar: "🎧",
    mood: "Etéreo",
    country: "AR",
  },
  {
    id: "2",
    djName: "@neon_circuits",
    title: "Midnight Protocol",
    listeners: 892,
    genre: ["techno", "industrial"],
    isLive: true,
    avatar: "💿",
    mood: "Intenso",
    country: "DE",
  },
  {
    id: "3",
    djName: "@cosmic_waves",
    title: "Stellar Drift",
    listeners: 456,
    genre: ["space", "downtempo"],
    isLive: true,
    avatar: "🌌",
    mood: "Cósmico",
    country: "JP",
  },
  {
    id: "4",
    djName: "@bass_architect",
    title: "Deep Constructions",
    listeners: 2103,
    genre: ["bass", "dubstep", "experimental"],
    isLive: true,
    avatar: "🔊",
    mood: "Poderoso",
    country: "UK",
  },
  {
    id: "5",
    djName: "@silent_frequency",
    title: "Whispers in Code",
    listeners: 78,
    genre: ["minimal", "noise", "field-recording"],
    isLive: true,
    avatar: "📡",
    mood: "Íntimo",
    country: "IS",
  },
  {
    id: "6",
    djName: "@rhythm_shaman",
    title: "Tribal Electronics",
    listeners: 634,
    genre: ["world", "electronic", "percussion"],
    isLive: true,
    avatar: "🥁",
    mood: "Ritual",
    country: "BR",
  },
  {
    id: "7",
    djName: "@dream_machine",
    title: "Lucid States",
    listeners: 1567,
    genre: ["trance", "psychedelic"],
    isLive: true,
    avatar: "🌀",
    mood: "Hipnótico",
    country: "NL",
  },
  {
    id: "8",
    djName: "@new_explorer",
    title: "Mi Primera Sesión",
    listeners: 12,
    genre: ["mixed", "experimental"],
    isLive: true,
    avatar: "🌱",
    mood: "Fresh",
    country: "MX",
  },
];

const GENRES = [
  "Todos",
  "experimental",
  "techno",
  "ambient",
  "bass",
  "trance",
  "minimal",
  "industrial",
  "world",
];

export default function LiveWaveWorld() {
  const [sessions, setSessions] = useState<Session[]>(MOCK_SESSIONS);
  const [selectedGenre, setSelectedGenre] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [showRandomDive, setShowRandomDive] = useState(false);

  // Filtrar sesiones
  const filteredSessions = sessions.filter((session) => {
    const matchesGenre =
      selectedGenre === "Todos" || session.genre.includes(selectedGenre);
    const matchesSearch =
      session.djName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.genre.some((g) =>
        g.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesGenre && matchesSearch;
  });

  // Ordenar: trending primero, pero dar oportunidad a los pequeños
  const sortedSessions = [...filteredSessions].sort((a, b) => {
    // Mix de popularidad con algo de aleatoriedad para dar chances a todos
    const scoreA = a.listeners + Math.random() * 500;
    const scoreB = b.listeners + Math.random() * 500;
    return scoreB - scoreA;
  });

  // Random Dive - Saltar a una sesión aleatoria
  const handleRandomDive = () => {
    setShowRandomDive(true);
    setTimeout(() => {
      const randomSession =
        sessions[Math.floor(Math.random() * sessions.length)];
      window.location.href = `/livewave`;
    }, 2000);
  };

  // Total listeners
  const totalListeners = sessions.reduce((acc, s) => acc + s.listeners, 0);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans">
      {/* Fondo */}
      <div className="fixed inset-0 bg-gradient-to-br from-violet-950/20 via-transparent to-cyan-950/20 pointer-events-none" />
      <div
        className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(124, 58, 237, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124, 58, 237, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Random Dive Overlay */}
      {showRandomDive && (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
          <div className="text-center animate-pulse">
            <div className="text-8xl mb-6">🎲</div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Saltando al Vacío...
            </h2>
            <p className="text-slate-400 mt-2">
              Descubriendo algo inesperado
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="relative z-50 border-b border-violet-500/20 backdrop-blur-xl bg-black/30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                <Radio size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                  LIVEWAVE
                </h1>
                <p className="text-xs text-slate-400">
                  Donde todos somos uno
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {/* Stats */}
              <div className="hidden md:flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Globe size={16} className="text-violet-400" />
                  <span>{sessions.length} sesiones en vivo</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-cyan-400" />
                  <span>{totalListeners.toLocaleString()} escuchando</span>
                </div>
              </div>

              {/* Random Dive Button */}
              <button
                onClick={handleRandomDive}
                className="group flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-600 font-medium hover:from-violet-500 hover:to-cyan-500 transition-all shadow-lg shadow-violet-500/25"
              >
                <Shuffle
                  size={18}
                  className="group-hover:rotate-180 transition-transform duration-500"
                />
                <span className="hidden sm:inline">Saltar al Vacío</span>
                <span className="sm:hidden">🎲</span>
              </button>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="mt-4 flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar DJs, géneros, vibes..."
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900/80 border border-violet-500/20 focus:border-violet-500/50 focus:outline-none text-sm placeholder-slate-500"
              />
            </div>

            {/* Genre Pills */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {GENRES.map((genre) => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    selectedGenre === genre
                      ? "bg-gradient-to-r from-violet-500 to-cyan-500 text-white"
                      : "bg-slate-900/80 border border-violet-500/20 text-slate-400 hover:border-violet-500/50"
                  }`}
                >
                  {genre === "Todos" ? "🌍 Todos" : `#${genre}`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Section: Trending */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp size={20} className="text-orange-400" />
            <h2 className="text-lg font-bold">En Tendencia</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedSessions.slice(0, 3).map((session) => (
              <SessionCard key={session.id} session={session} featured />
            ))}
          </div>
        </section>

        {/* Section: Descubrimientos */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles size={20} className="text-violet-400" />
            <h2 className="text-lg font-bold">Descubrimientos</h2>
            <span className="text-xs text-slate-500">
              Sesiones con menos de 100 oyentes que merecen amor
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {sessions
              .filter((s) => s.listeners < 100)
              .map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
          </div>
        </section>

        {/* Section: All Sessions */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Headphones size={20} className="text-cyan-400" />
            <h2 className="text-lg font-bold">Todas las Sesiones</h2>
            <span className="text-xs text-slate-500">
              {filteredSessions.length} en vivo
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sortedSessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        </section>

        {/* Empty State */}
        {filteredSessions.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold mb-2">
              No encontramos sesiones
            </h3>
            <p className="text-slate-400">
              Prueba con otros filtros o{" "}
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedGenre("Todos");
                }}
                className="text-violet-400 hover:underline"
              >
                reinicia los filtros
              </button>
            </p>
          </div>
        )}
      </main>

      {/* CTA: Become a DJ */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-10">
        <div className="rounded-3xl bg-gradient-to-r from-violet-900/50 to-cyan-900/50 border border-violet-500/30 p-8 text-center">
          <div className="text-5xl mb-4">🎧</div>
          <h2 className="text-2xl font-bold mb-2">
            ¿Tienes música para compartir?
          </h2>
          <p className="text-slate-400 mb-6 max-w-md mx-auto">
            Cualquiera puede ser DJ aquí. No importa si eres profesional o
            recién empiezas. Tu música tiene un lugar.
          </p>
          <button className="px-8 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-600 font-bold hover:from-violet-500 hover:to-cyan-500 transition-all shadow-lg shadow-violet-500/25">
            Crear mi Sesión
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-violet-500/20 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center text-sm text-slate-500">
          <p className="mb-2">
            LIVEWAVE • Donde todos empiezan en nivel 0 • Todos somos iguales
          </p>
          <p className="text-xs">
            🌍 Celebrando la música de todo el universo
          </p>
        </div>
      </footer>
    </div>
  );
}

// ============================================================================
// Session Card Component
// ============================================================================

interface SessionCardProps {
  session: Session;
  featured?: boolean;
}

function SessionCard({ session, featured = false }: SessionCardProps) {
  return (
    <Link href="/livewave">
      <div
        className={`group relative overflow-hidden rounded-2xl border transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-violet-500/10 cursor-pointer ${
          featured
            ? "border-violet-500/40 bg-gradient-to-br from-violet-900/30 to-cyan-900/30"
            : "border-violet-500/20 bg-slate-900/50"
        }`}
      >
        {/* Header */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                  featured
                    ? "bg-gradient-to-br from-violet-500 to-cyan-500"
                    : "bg-slate-800"
                }`}
              >
                {session.avatar}
              </div>
              <div>
                <p className="font-bold text-sm">{session.djName}</p>
                <p className="text-xs text-slate-500">{session.country}</p>
              </div>
            </div>

            {/* Live Badge */}
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/20 border border-green-500/30">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-green-400">LIVE</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-bold mb-2 group-hover:text-violet-400 transition-colors">
            {session.title}
          </h3>

          {/* Genres */}
          <div className="flex flex-wrap gap-1 mb-3">
            {session.genre.slice(0, 3).map((g) => (
              <span
                key={g}
                className="px-2 py-0.5 text-xs rounded-full bg-violet-500/20 text-violet-300"
              >
                #{g}
              </span>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-slate-400">
              <Users size={14} />
              <span>{session.listeners.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-500 group-hover:text-violet-400 transition-colors">
              <span className="text-xs">Unirse</span>
              <ChevronRight size={14} />
            </div>
          </div>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-violet-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        {/* Play button on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-14 h-14 rounded-full bg-violet-500/90 flex items-center justify-center shadow-lg">
            <Play size={24} className="ml-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}
