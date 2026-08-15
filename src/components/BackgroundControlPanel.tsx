import React from 'react';
import { Palette, Image as ImageIcon, Sliders, Grid } from 'lucide-react';

interface BackgroundControlPanelProps {
  label: string;
  backgroundType?: 'solid' | 'gradient' | 'pattern' | 'image';
  colorSolid?: string;
  opacity?: number;
  colorStart?: string;
  colorEnd?: string;
  patternName?: string;
  imageUrl?: string;
  onChange: (updates: {
    backgroundType?: 'solid' | 'gradient' | 'pattern' | 'image';
    colorSolid?: string;
    opacity?: number;
    colorStart?: string;
    colorEnd?: string;
    patternName?: string;
    imageUrl?: string;
  }) => void;
}

export const BackgroundControlPanel: React.FC<BackgroundControlPanelProps> = ({
  label,
  backgroundType = 'solid',
  colorSolid = '#FFFFFF',
  opacity = 1,
  colorStart = '#3B82F6',
  colorEnd = '#1E3A8A',
  patternName = 'dots',
  imageUrl = '',
  onChange,
}) => {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.result) {
        onChange({
          backgroundType: 'image',
          imageUrl: evt.target.result as string,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-blue-600" />
          <span>{label}</span>
        </span>
        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800 uppercase">
          {backgroundType}
        </span>
      </div>

      {/* Type Tabs */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-slate-200/60 dark:bg-slate-800 rounded-lg">
        {[
          { id: 'solid', label: 'Couleur' },
          { id: 'gradient', label: 'Dégradé' },
          { id: 'pattern', label: 'Motif' },
          { id: 'image', label: 'Image' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange({ backgroundType: tab.id as any })}
            className={`py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
              backgroundType === tab.id
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SOLID COLOR */}
      {backgroundType === 'solid' && (
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={colorSolid || '#FFFFFF'}
            onChange={(e) => onChange({ colorSolid: e.target.value })}
            className="w-8 h-8 rounded-lg cursor-pointer border-0"
          />
          <span className="text-xs font-mono font-bold uppercase">{colorSolid}</span>
        </div>
      )}

      {/* GRADIENT */}
      {backgroundType === 'gradient' && (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] font-bold text-slate-500 block">Départ :</label>
            <div className="flex items-center gap-1.5 mt-0.5">
              <input
                type="color"
                value={colorStart || '#3B82F6'}
                onChange={(e) => onChange({ colorStart: e.target.value })}
                className="w-7 h-7 rounded cursor-pointer border-0"
              />
              <span className="text-[11px] font-mono uppercase">{colorStart}</span>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 block">Arrivée :</label>
            <div className="flex items-center gap-1.5 mt-0.5">
              <input
                type="color"
                value={colorEnd || '#1E3A8A'}
                onChange={(e) => onChange({ colorEnd: e.target.value })}
                className="w-7 h-7 rounded cursor-pointer border-0"
              />
              <span className="text-[11px] font-mono uppercase">{colorEnd}</span>
            </div>
          </div>
        </div>
      )}

      {/* PATTERN */}
      {backgroundType === 'pattern' && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-600">Couleur de fond :</span>
            <input
              type="color"
              value={colorSolid || '#FFFFFF'}
              onChange={(e) => onChange({ colorSolid: e.target.value })}
              className="w-6 h-6 rounded cursor-pointer border-0"
            />
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {[
              { id: 'dots', label: 'Points' },
              { id: 'stripes', label: 'Rayures' },
              { id: 'grid', label: 'Grille' },
              { id: 'mesh', label: 'Maille' },
              { id: 'waves', label: 'Vagues' },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onChange({ patternName: p.id })}
                className={`p-1.5 rounded-lg border text-[10px] font-bold cursor-pointer transition-all ${
                  patternName === p.id
                    ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* IMAGE */}
      {backgroundType === 'image' && (
        <div className="space-y-2">
          <label className="block w-full text-center p-3 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl hover:border-blue-500 cursor-pointer bg-white dark:bg-slate-800 transition-colors">
            <ImageIcon className="w-5 h-5 mx-auto text-blue-600 mb-1" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
              {imageUrl ? 'Changer l\'image de fond' : 'Uploader une image de fond'}
            </span>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
          {imageUrl && (
            <div className="flex items-center gap-2">
              <div
                className="w-12 h-12 rounded-lg border border-slate-200 bg-cover bg-center"
                style={{ backgroundImage: `url(${imageUrl})` }}
              />
              <button
                type="button"
                onClick={() => onChange({ imageUrl: '', backgroundType: 'solid' })}
                className="text-xs font-bold text-rose-600 hover:underline"
              >
                Supprimer l'image
              </button>
            </div>
          )}
        </div>
      )}

      {/* OPACITY SLIDER */}
      <div className="space-y-1 pt-1 border-t border-slate-200/60 dark:border-slate-800">
        <div className="flex justify-between items-center text-[11px] font-bold">
          <span className="text-slate-600 dark:text-slate-400">Opacité du fond ({Math.round(opacity * 100)}%) :</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={opacity}
          onChange={(e) => onChange({ opacity: parseFloat(e.target.value) })}
          className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
      </div>
    </div>
  );
};
