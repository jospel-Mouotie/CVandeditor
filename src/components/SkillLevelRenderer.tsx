import React from 'react';
import { Star } from 'lucide-react';

interface SkillLevelRendererProps {
  nom: string;
  niveau?: number; // 0 to 10
  sousTitre?: string;
  displayMode?: 'numeric' | 'progress' | 'stars' | 'dots' | 'none';
  accentColor?: string;
  textColor?: string;
  editableName?: boolean;
  onUpdateName?: (newName: string) => void;
  onUpdateLevel?: (newLevel: number) => void;
}

export const SkillLevelRenderer: React.FC<SkillLevelRendererProps> = ({
  nom,
  niveau = 8,
  sousTitre,
  displayMode = 'progress',
  accentColor = '#2563EB',
  textColor = '#1E293B',
  editableName = false,
  onUpdateName,
  onUpdateLevel
}) => {
  const levelVal = Math.min(10, Math.max(0, niveau ?? 8));
  const percent = Math.round((levelVal / 10) * 100);

  return (
    <div className="w-full space-y-1">
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <span
            contentEditable={editableName}
            suppressContentEditableWarning
            onBlur={(e) => onUpdateName?.(e.currentTarget.innerText)}
            className={`font-extrabold outline-none text-xs leading-tight ${editableName ? 'cursor-text hover:bg-slate-100 dark:hover:bg-slate-800 rounded px-1' : ''}`}
            style={{ color: textColor }}
          >
            {nom}
          </span>
          {sousTitre && (
            <span className="text-[10px] font-medium opacity-70 italic">{sousTitre}</span>
          )}
        </div>

        {/* Level Numeric Indicator */}
        {displayMode === 'numeric' && (
          <span
            className="text-[10px] font-bold px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
            style={{ color: accentColor }}
          >
            {levelVal}/10
          </span>
        )}
      </div>

      {/* Progress Bar */}
      {displayMode === 'progress' && (
        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${percent}%`, backgroundColor: accentColor }}
          />
        </div>
      )}

      {/* Stars (5 stars) */}
      {displayMode === 'stars' && (
        <div className="flex items-center space-x-0.5" style={{ color: accentColor }}>
          {[1, 2, 3, 4, 5].map((s) => {
            const filled = s <= Math.round(levelVal / 2);
            return (
              <button
                key={s}
                type="button"
                onClick={() => onUpdateLevel?.(s * 2)}
                className={`p-0.5 ${onUpdateLevel ? 'cursor-pointer hover:scale-125' : ''}`}
              >
                <Star className={`w-3 h-3 ${filled ? 'fill-current' : 'opacity-25'}`} />
              </button>
            );
          })}
        </div>
      )}

      {/* Dots (5 dots) */}
      {displayMode === 'dots' && (
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((d) => {
            const filled = d <= Math.round(levelVal / 2);
            return (
              <span
                key={d}
                onClick={() => onUpdateLevel?.(d * 2)}
                className={`w-2 h-2 rounded-full transition-all ${
                  filled ? 'shadow-2xs' : 'opacity-30'
                } ${onUpdateLevel ? 'cursor-pointer' : ''}`}
                style={{ backgroundColor: filled ? accentColor : '#94A3B8' }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
