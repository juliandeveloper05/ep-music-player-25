"use client";

import { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  Users,
  MessageCircle,
  Heart,
  Flame,
  Sparkles,
  Zap,
  Send,
  Volume2,
  Radio,
  Shuffle,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";

// ============================================================================
// LIVEWAVE - DJ Session Interface
// Estilo: Cyberpunk Neon
// Target: Experimental → Electrónica
// ============================================================================

// Tipos
interface Message {
  id: number;
  user: string;
  text: string;
  time: string;
}

interface Reaction {
  id: number;
  type: string;
  x: number;
}

interface Listener {
  id: number;
  name: string;
  color: string;
}

export default function LiveWaveSession() {
  // Estados
  const [isPlaying, setIsPlaying] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, user: "@cosmic_rider", text: "this is insane 🔥", time: "now" },
    { id: 2, user: "@neon_dreams", text: "where is this DJ from?", time: "1m" },
    { id: 3, user: "@bass_hunter", text: "DROP IT!!!", time: "2m" },
    { id: 4, user: "@ambient_soul", text: "first time here, loving it", time: "3m" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [listenerCount, setListenerCount] = useState(1247);
  const [audioLevel, setAudioLevel] = useState<number[]>([]);
  const reactionIdRef = useRef(0);

  // Simular niveles de audio
  useEffect(() => {
    const interval = setInterval(() => {
      const bars = Array.from({ length: 64 }, () => 
        Math.random() * 100
      );
      setAudioLevel(bars);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Simular cambios en listeners
  useEffect(() => {
    const interval = setInterval(() => {
      setListenerCount(prev => prev + Math.floor(Math.random() * 5) - 2);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Limpiar reacciones antiguas
  useEffect(() => {
    const interval = setInterval(() => {
      setReactions(prev => prev.filter(r => Date.now() - r.id < 3000));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Enviar mensaje
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const msg: Message = {
      id: Date.now(),
      user: "@you",
      text: newMessage,
      time: "now",
    };
    setMessages(prev => [msg, ...prev].slice(0, 50));
    setNewMessage("");
  };

  // Enviar reacción
  const sendReaction = (type: string) => {
    const newReaction: Reaction = {
      id: Date.now() + reactionIdRef.current++,
      type,
      x: 20 + Math.random() * 60,
    };
    setReactions(prev => [...prev, newReaction]);
  };

  // Listeners simulados
  const listeners: Listener[] = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    name: `user_${i}`,
    color: `hsl(${(i * 15) % 360}, 70%, 60%)`,
  }));

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans overflow-hidden">
      {/* Fondo con gradiente animado */}
      <div className="fixed inset-0 bg-gradient-to-br from-violet-950/30 via-transparent to-cyan-950/30 pointer-events-none" />
      
      {/* Grid de fondo cyberpunk */}
      <div 
        className="fixed inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(124, 58, 237, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124, 58, 237, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Header */}
      <header className="relative z-50 flex items-center justify-between px-6 py-4 border-b border-violet-500/20 backdrop-blur-xl bg-black/30">
        <div className="flex items-center gap-4">
          <Link 
            href="/"
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={20} />
            <span className="hidden md:inline">Volver</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
              <Radio size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                LIVEWAVE
              </h1>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                EN VIVO
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/20 border border-violet-500/30">
            <Users size={16} className="text-violet-400" />
            <span className="text-sm font-medium">{listenerCount.toLocaleString()}</span>
          </div>
          
          <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 font-medium text-sm hover:from-violet-500 hover:to-cyan-500 transition-all shadow-lg shadow-violet-500/25">
            Seguir DJ
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col lg:flex-row h-[calc(100vh-140px)]">
        
        {/* Left: Visualizer & DJ Info */}
        <div className="flex-1 flex flex-col p-6 lg:p-8">
          
          {/* DJ Card */}
          <div className="mb-6 flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 p-[2px]">
                <div className="w-full h-full rounded-2xl bg-slate-900 flex items-center justify-center text-2xl">
                  🎧
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-[#0a0a0f]" />
            </div>
            <div>
              <h2 className="text-xl font-bold">@experimental_void</h2>
              <p className="text-sm text-slate-400">Explorando los límites del sonido</p>
              <div className="flex gap-2 mt-1">
                <span className="px-2 py-0.5 text-xs rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  #experimental
                </span>
                <span className="px-2 py-0.5 text-xs rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  #ambient
                </span>
                <span className="px-2 py-0.5 text-xs rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                  #glitch
                </span>
              </div>
            </div>
          </div>

          {/* Audio Visualizer */}
          <div className="flex-1 relative rounded-3xl overflow-hidden border border-violet-500/20 bg-black/50 backdrop-blur-xl">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-violet-600/20 via-transparent to-cyan-600/10 pointer-events-none" />
            
            {/* Visualizer bars */}
            <div className="absolute inset-x-0 bottom-0 h-2/3 flex items-end justify-center gap-[2px] px-4 pb-4">
              {audioLevel.map((level, i) => (
                <div
                  key={i}
                  className="flex-1 max-w-3 rounded-t-full transition-all duration-75"
                  style={{
                    height: `${level}%`,
                    background: `linear-gradient(to top, 
                      rgba(124, 58, 237, 0.8) 0%, 
                      rgba(6, 182, 212, 0.8) 50%, 
                      rgba(236, 72, 153, 0.6) 100%
                    )`,
                    boxShadow: level > 70 
                      ? '0 0 20px rgba(124, 58, 237, 0.5)' 
                      : 'none',
                  }}
                />
              ))}
            </div>

            {/* Track Info Overlay */}
            <div className="absolute inset-x-0 top-0 p-6 bg-gradient-to-b from-black/80 to-transparent">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-violet-400 mb-1">Reproduciendo ahora</p>
                  <h3 className="text-2xl font-bold">"Fragmentos del Vacío"</h3>
                  <p className="text-slate-400 mt-1">Sesión en vivo • 47:23</p>
                </div>
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-violet-500/30"
                >
                  {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
                </button>
              </div>
            </div>

            {/* Floating Reactions */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {reactions.map((reaction) => (
                <div
                  key={reaction.id}
                  className="absolute bottom-0 animate-float-up text-3xl"
                  style={{ left: `${reaction.x}%` }}
                >
                  {reaction.type}
                </div>
              ))}
            </div>

            {/* Center DJ avatar */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-32 h-32 rounded-full border-4 border-violet-500/50 bg-black/50 backdrop-blur-sm flex items-center justify-center animate-pulse-slow">
                <div className="text-5xl">🎧</div>
              </div>
            </div>
          </div>

          {/* Reaction Buttons */}
          <div className="mt-4 flex items-center justify-center gap-3">
            {[
              { icon: "🔥", label: "Fire" },
              { icon: "💎", label: "Gem" },
              { icon: "💜", label: "Love" },
              { icon: "🌊", label: "Wave" },
              { icon: "✨", label: "Magic" },
              { icon: "🚀", label: "Boost" },
            ].map((reaction) => (
              <button
                key={reaction.label}
                onClick={() => sendReaction(reaction.icon)}
                className="group relative px-4 py-3 rounded-2xl bg-slate-900/80 border border-violet-500/20 hover:border-violet-500/50 hover:bg-violet-500/10 transition-all"
              >
                <span className="text-2xl group-hover:scale-125 transition-transform inline-block">
                  {reaction.icon}
                </span>
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  {reaction.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Chat & Listeners */}
        <div className="w-full lg:w-96 flex flex-col border-l border-violet-500/20 bg-black/30 backdrop-blur-xl">
          
          {/* Tabs */}
          <div className="flex border-b border-violet-500/20">
            <button className="flex-1 py-3 text-sm font-medium border-b-2 border-violet-500 text-violet-400">
              <MessageCircle size={16} className="inline mr-2" />
              Chat
            </button>
            <button className="flex-1 py-3 text-sm font-medium text-slate-500 hover:text-slate-300 transition-colors">
              <Users size={16} className="inline mr-2" />
              Oyentes
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className="group animate-slide-in"
              >
                <div className="flex items-start gap-3">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: `linear-gradient(135deg, 
                        hsl(${(msg.user.charCodeAt(1) * 10) % 360}, 70%, 40%),
                        hsl(${(msg.user.charCodeAt(1) * 10 + 60) % 360}, 70%, 50%)
                      )`,
                    }}
                  >
                    {msg.user.charAt(1).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-violet-400">{msg.user}</span>
                      <span className="text-xs text-slate-600">{msg.time}</span>
                    </div>
                    <p className="text-sm text-slate-300 break-words">{msg.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-violet-500/20">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Escribe un mensaje..."
                className="flex-1 px-4 py-3 rounded-xl bg-slate-900/80 border border-violet-500/20 focus:border-violet-500/50 focus:outline-none text-sm placeholder-slate-500"
              />
              <button 
                onClick={handleSendMessage}
                className="px-4 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 transition-all"
              >
                <Send size={18} />
              </button>
            </div>
          </div>

          {/* Listeners Preview */}
          <div className="p-4 border-t border-violet-500/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-400">Escuchando ahora</span>
              <span className="text-sm text-violet-400">{listenerCount.toLocaleString()}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {listeners.map((listener) => (
                <div
                  key={listener.id}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold hover:scale-110 transition-transform cursor-pointer"
                  style={{ backgroundColor: listener.color }}
                  title={listener.name}
                >
                  {listener.name.charAt(5).toUpperCase()}
                </div>
              ))}
              <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-xs text-slate-400">
                +{listenerCount - 24}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Bar: Now Playing */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 px-6 py-4 border-t border-violet-500/20 bg-black/80 backdrop-blur-xl">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button className="text-slate-400 hover:text-white transition-colors">
              <Shuffle size={20} />
            </button>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center"
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
            </button>
            <div className="flex items-center gap-2">
              <Volume2 size={18} className="text-slate-400" />
              <div className="w-24 h-1 rounded-full bg-slate-800">
                <div className="w-3/4 h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500" />
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-sm font-medium">Fragmentos del Vacío</p>
            <p className="text-xs text-slate-500">@experimental_void</p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => sendReaction("❤️")}
              className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <Heart size={20} className="text-pink-500" />
            </button>
            <button className="px-4 py-2 rounded-xl bg-violet-500/20 border border-violet-500/30 text-sm font-medium hover:bg-violet-500/30 transition-colors">
              🎲 Saltar al Vacío
            </button>
          </div>
        </div>
      </footer>

      {/* Animations */}
      <style jsx>{`
        @keyframes float-up {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-300px) scale(1.5);
          }
        }
        .animate-float-up {
          animation: float-up 3s ease-out forwards;
        }
        
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.8;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
