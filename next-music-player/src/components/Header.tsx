// Ubicación: src/components/Header.tsx
// ----------------------------------------------------------------------
// Componente de encabezado. Contiene el logo y los botones principales
// para abrir paneles (EQ, Isolator) y subir archivos.
// ----------------------------------------------------------------------

import {
  Music,
  Layers,
  SlidersHorizontal,
  Image as ImageIcon,
  Upload,
} from "lucide-react";

interface HeaderProps {
  onToggleIsolator: () => void;
  onToggleEQ: () => void;
  onUploadCover: (file: File) => void;
  onUploadFiles: (files: FileList) => void;
}

export default function Header({
  onToggleIsolator,
  onToggleEQ,
  onUploadCover,
  onUploadFiles,
}: HeaderProps) {
  return (
    <header className="p-4 flex flex-col md:flex-row justify-between items-center border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-20 gap-3 flex-none">
      {/* Logo y Título */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
          <Music className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">
            EP Player
          </h1>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest">
            Stem Edition
          </p>
        </div>
      </div>

      {/* Botonera de Acciones */}
      <div className="flex flex-wrap justify-center gap-2">
        <button
          onClick={onToggleIsolator}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-2 border border-slate-700 shadow-md"
        >
          <Layers className="w-3 h-3" />
          <span>Aislar</span>
        </button>
        <button
          onClick={onToggleEQ}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-2 border border-slate-700 shadow-md"
        >
          <SlidersHorizontal className="w-3 h-3" />
          <span>EQ</span>
        </button>

        {/* Input oculto para subir portada */}
        <label className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-2 border border-slate-700 cursor-pointer">
          <ImageIcon className="w-3 h-3" />
          <span>Portada</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) =>
              e.target.files?.[0] && onUploadCover(e.target.files[0])
            }
          />
        </label>

        {/* Input oculto para subir música (múltiple) */}
        <label className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-2 shadow-lg shadow-indigo-900/20 cursor-pointer">
          <Upload className="w-3 h-3" />
          <span>Subir</span>
          <input
            type="file"
            multiple
            accept="audio/*"
            className="hidden"
            onChange={(e) => e.target.files && onUploadFiles(e.target.files)}
          />
        </label>
      </div>
    </header>
  );
}
