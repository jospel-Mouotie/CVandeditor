import React, { useState } from 'react';
import { SubCompetenceItem, Language } from '../types';
import { Plus, X, Star, Sparkles, Tag, ChevronDown, ChevronUp, Sliders } from 'lucide-react';
import { ClearableInput } from './ClearableInput';

interface SubCompetenceManagerProps {
  items: SubCompetenceItem[] | string[] | undefined;
  onChange: (items: SubCompetenceItem[]) => void;
  langue?: Language;
  label?: string;
  placeholder?: string;
  allowRating?: boolean;
}

export const SubCompetenceManager: React.FC<SubCompetenceManagerProps> = ({
  items = [],
  onChange,
  langue = 'fr',
  label = 'Outils & Sous-compétences',
  placeholder = 'Ex: React, Figma, Docker, Gestion de projet...',
  allowRating = true
}) => {
  // Normalize items to SubCompetenceItem[]
  const normalizedItems: SubCompetenceItem[] = (items || []).map((it, idx) => {
    if (typeof it === 'string') {
      return { id: `tool-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`, nom: it.trim() };
    }
    return it;
  }).filter(it => it.nom && it.nom.trim().length > 0);

  const [inputName, setInputName] = useState('');
  const [includeRating, setIncludeRating] = useState(false);
  const [inputRating, setInputRating] = useState<number>(4); // default 4/5
  const [showBatchImport, setShowBatchImport] = useState(false);
  const [batchText, setBatchText] = useState('');

  const handleAddSingle = () => {
    const trimmed = inputName.trim();
    if (!trimmed) return;

    const newItem: SubCompetenceItem = {
      id: `tool-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      nom: trimmed,
      note: includeRating ? inputRating : undefined,
      niveau: includeRating ? inputRating * 2 : undefined
    };

    onChange([...normalizedItems, newItem]);
    setInputName('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSingle();
    }
  };

  const handleRemove = (idToRemove: string) => {
    onChange(normalizedItems.filter(item => item.id !== idToRemove));
  };

  const handleUpdateRating = (id: string, newNote: number | undefined) => {
    onChange(
      normalizedItems.map(item => {
        if (item.id === id) {
          return {
            ...item,
            note: newNote,
            niveau: newNote ? newNote * 2 : undefined
          };
        }
        return item;
      })
    );
  };

  const handleBatchImport = () => {
    if (!batchText.trim()) return;
    const tokens = batchText
      .split(/[,;\n]+/)
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const newItems: SubCompetenceItem[] = tokens.map((nom, i) => ({
      id: `tool-batch-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
      nom
    }));

    onChange([...normalizedItems, ...newItems]);
    setBatchText('');
    setShowBatchImport(false);
  };

  return (
    <div className="space-y-2.5 p-3.5 bg-neutral-50 dark:bg-neutral-900/60 rounded-xl border border-neutral-200/80 dark:border-neutral-800">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-neutral-500" />
          <span>{label} ({normalizedItems.length})</span>
        </label>

        <button
          type="button"
          onClick={() => setShowBatchImport(!showBatchImport)}
          className="text-xs font-semibold text-neutral-500 hover:text-black dark:hover:text-white underline cursor-pointer transition-colors flex items-center gap-1"
        >
          <span>{showBatchImport ? 'Fermer import groupé' : '+ Import en lot (virgules)'}</span>
        </button>
      </div>

      {/* Batch paste box */}
      {showBatchImport && (
        <div className="p-3 bg-white dark:bg-black rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-2 animate-fadeIn">
          <label className="text-xs font-bold text-neutral-600 dark:text-neutral-400">Coller une liste d'outils séparés par des virgules ou retours à la ligne :</label>
          <textarea
            value={batchText}
            onChange={e => setBatchText(e.target.value)}
            placeholder="Ex: React, TypeScript, TailwindCSS, Docker, CI/CD, Git"
            rows={2}
            className="w-full p-2.5 text-xs rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 outline-none focus:border-black dark:focus:border-white text-black dark:text-white"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowBatchImport(false)}
              className="px-3 py-1.5 text-xs font-bold text-neutral-500 hover:text-neutral-700"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleBatchImport}
              className="px-3.5 py-1.5 bg-black text-white dark:bg-white dark:text-black rounded-xl text-xs font-bold shadow-2xs hover:opacity-90"
            >
              Convertir en outils individuels
            </button>
          </div>
        </div>
      )}

      {/* Interactive Tool Pills / Badges list */}
      {normalizedItems.length > 0 ? (
        <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 bg-white dark:bg-black rounded-xl border border-neutral-200 dark:border-neutral-800/80">
          {normalizedItems.map(item => (
            <div
              key={item.id}
              className="group inline-flex items-center gap-1.5 pl-3 pr-2 py-1 bg-neutral-100 dark:bg-neutral-800/90 text-neutral-900 dark:text-neutral-100 rounded-lg text-xs font-medium border border-neutral-200 dark:border-neutral-700 transition-all hover:border-neutral-400 dark:hover:border-neutral-500 shadow-2xs"
            >
              <span className="font-semibold">{item.nom}</span>

              {/* Optional Rating Display & Modifier */}
              {allowRating && (
                <div className="flex items-center gap-0.5 ml-1 pl-1 border-l border-neutral-300 dark:border-neutral-600">
                  {item.note ? (
                    <button
                      type="button"
                      title="Modifier ou retirer la note"
                      onClick={() => {
                        const next = item.note! >= 5 ? undefined : item.note! + 1;
                        handleUpdateRating(item.id, next);
                      }}
                      className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 transition-colors"
                    >
                      <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                      <span>{item.note}/5</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      title="Ajouter une note (optionnel)"
                      onClick={() => handleUpdateRating(item.id, 4)}
                      className="text-[9px] text-neutral-400 hover:text-amber-500 px-1 py-0.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                    >
                      + note
                    </button>
                  )}
                </div>
              )}

              {/* Remove button */}
              <button
                type="button"
                onClick={() => handleRemove(item.id)}
                title="Supprimer cet outil"
                className="p-0.5 text-neutral-400 hover:text-red-500 rounded hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors ml-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-2.5 text-xs text-neutral-400 dark:text-neutral-500 italic bg-white/50 dark:bg-black/30 rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800">
          Aucun outil ou sous-compétence ajouté pour le moment.
        </div>
      )}

      {/* Add New Tool Input with Optional Rating Toggle */}
      <div className="space-y-2 pt-1">
        <div className="flex gap-2">
          <div className="flex-1 min-w-0">
            <ClearableInput
              value={inputName}
              onChange={e => setInputName(e.target.value)}
              onClear={() => setInputName('')}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 text-black dark:text-white outline-none focus:border-black dark:focus:border-white font-medium"
            />
          </div>

          <button
            type="button"
            onClick={handleAddSingle}
            disabled={!inputName.trim()}
            className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-xl text-xs font-bold shadow-2xs hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shrink-0 cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter</span>
          </button>
        </div>

        {/* Optional Rating Selector when adding */}
        {allowRating && (
          <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-neutral-500 dark:text-neutral-400">
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeRating}
                onChange={e => setIncludeRating(e.target.checked)}
                className="w-4 h-4 rounded accent-black dark:accent-white cursor-pointer"
              />
              <span className="font-semibold">Associer une note / niveau à cet outil (optionnel)</span>
            </label>

            {includeRating && (
              <div className="flex items-center gap-1 bg-white dark:bg-black px-2.5 py-1 rounded-lg border border-neutral-200 dark:border-neutral-800 animate-fadeIn">
                <span className="font-bold text-neutral-700 dark:text-neutral-300">Note:</span>
                {[1, 2, 3, 4, 5].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setInputRating(val)}
                    className="p-0.5 text-neutral-400 hover:text-amber-500 cursor-pointer"
                  >
                    <Star
                      className={`w-3.5 h-3.5 ${
                        val <= inputRating
                          ? 'fill-amber-500 text-amber-500'
                          : 'text-neutral-300 dark:text-neutral-600'
                      }`}
                    />
                  </button>
                ))}
                <span className="font-bold text-black dark:text-white ml-1">{inputRating}/5</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
