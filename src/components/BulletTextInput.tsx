import React, { useState } from 'react';
import { List, ListOrdered, CheckSquare, ArrowRight, Star, Minus, ChevronDown } from 'lucide-react';

interface BulletTextInputProps {
  value: string;
  onChange: (newValue: string) => void;
  placeholder?: string;
  rows?: number;
  label?: string;
  className?: string;
}

export const BulletTextInput: React.FC<BulletTextInputProps> = ({
  value,
  onChange,
  placeholder = 'Saisissez du texte...',
  rows = 3,
  label,
  className = '',
}) => {
  const [showBulletDropdown, setShowBulletDropdown] = useState(false);

  const BULLET_STYLES = [
    { id: 'bullet', symbol: '• ', label: 'Puce ronde (•)', icon: List },
    { id: 'dash', symbol: '- ', label: 'Tiret (-)', icon: Minus },
    { id: 'arrow', symbol: '➔ ', label: 'Flèche (➔)', icon: ArrowRight },
    { id: 'check', symbol: '✔ ', label: 'Coche (✔)', icon: CheckSquare },
    { id: 'star', symbol: '⭐ ', label: 'Étoile (⭐)', icon: Star },
    { id: 'numbered', symbol: '1. ', label: 'Numérotée (1.)', icon: ListOrdered },
  ];

  const handleInsertBullet = (symbol: string) => {
    setShowBulletDropdown(false);
    if (!value) {
      onChange(symbol);
      return;
    }

    // Split lines and prepend symbol to selected or current line
    const lines = value.split('\n');
    const lastIdx = lines.length - 1;

    // Check if last line already has a bullet symbol
    const cleanLast = lines[lastIdx].replace(/^[•\-➔✔⭐\d+\.]\s*/, '');
    lines[lastIdx] = `${symbol}${cleanLast}`;

    onChange(lines.join('\n'));
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <div className="flex justify-between items-center">
          <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 block">
            {label}
          </label>

          {/* Bullet Selector Toolbar Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowBulletDropdown(!showBulletDropdown)}
              className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-bold rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
              title="Insérer des puces"
            >
              <List className="w-3.5 h-3.5 text-blue-600" />
              <span>Insérer puces</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showBulletDropdown && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 p-1 space-y-0.5">
                {BULLET_STYLES.map((b) => {
                  const IconComp = b.icon;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => handleInsertBullet(b.symbol)}
                      className="w-full text-left px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950/60 rounded-lg flex items-center gap-2 cursor-pointer"
                    >
                      <IconComp className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{b.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-sans leading-relaxed"
      />
    </div>
  );
};
