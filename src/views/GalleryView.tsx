import React, { useState } from 'react';
import { CVTemplate, Language, TemplateCategory } from '../types';
import { CV_TEMPLATES } from '../data/templates';
import { TemplateCard } from '../components/TemplateCard';
import { TemplatePreviewModal } from '../components/TemplatePreviewModal';
import { TemplateModeModal } from '../components/TemplateModeModal';
import { getTranslation } from '../i18n/translations';
import { Search, Sparkles, FilePlus, ArrowRight, Plus } from 'lucide-react';

import { CV } from '../types';

interface GalleryViewProps {
  langue: Language;
  onSelectTemplate: (template: CVTemplate, mode?: 'visual' | 'form') => void;
  onCreateBlankCV?: () => void;
  activeCV?: CV | null;
  onApplyToActiveCV?: (template: CVTemplate) => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({ langue, onSelectTemplate, onCreateBlankCV, activeCV, onApplyToActiveCV }) => {
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(langue, key);

  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState<CVTemplate | null>(null);
  const [modeModalTemplate, setModeModalTemplate] = useState<CVTemplate | null>(null);

  const categories: Array<{ id: TemplateCategory | 'all'; label: string }> = [
    { id: 'all', label: t('catAll') },
    { id: 'moderne', label: t('catModerne') },
    { id: 'classique', label: t('catClassique') },
    { id: 'creatif', label: t('catCreatif') },
    { id: 'executif', label: t('catExecutif') },
    { id: 'technique', label: 'Technique & IT' }
  ];

  const filteredTemplates = CV_TEMPLATES.filter(tpl => {
    const matchesCategory = selectedCategory === 'all' || tpl.category === selectedCategory;
    const desc = tpl.description[langue] || tpl.description.fr;
    const matchesSearch = 
      tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      desc.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleTemplatePicked = (template: CVTemplate) => {
    onSelectTemplate(template, 'form');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Gallery Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-slate-800 space-y-4 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-bold border border-blue-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('catalogHD')}</span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{t('chooseYourModelTitle')}</h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {t('chooseYourModelDesc')}
          </p>
        </div>

        {onCreateBlankCV && (
          <div className="shrink-0">
            <button
              onClick={onCreateBlankCV}
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-2xl shadow-xl transition-all flex items-center space-x-2 border border-emerald-400/30 cursor-pointer"
            >
              <FilePlus className="w-4 h-4" />
              <span>{t('createBlankPage')}</span>
            </button>
          </div>
        )}
      </div>

      {/* Active CV Change Notice Banner */}
      {activeCV && onApplyToActiveCV && (
        <div className="bg-gradient-to-r from-purple-900/90 via-indigo-900/90 to-blue-900/90 border border-purple-500/40 text-white p-3.5 rounded-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-xl text-amber-300 border border-purple-400/30 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black flex items-center gap-2">
                <span>{t('currentEditedCV')}</span>
                <span className="bg-purple-500/30 text-purple-200 px-2 py-0.5 rounded-md border border-purple-400/30">{activeCV.titreCV || activeCV.titre || 'Mon CV'}</span>
              </div>
              <p className="text-[11px] text-purple-200 mt-0.5">
                {t('applyToMyCVDesc')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Category Filter Pills & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        
        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {categories.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder={t('searchTemplatePlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-blue-500 outline-hidden"
          />
        </div>

      </div>

      {/* Compact Templates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        {filteredTemplates.map(tpl => (
          <TemplateCard
            key={tpl.id}
            template={tpl}
            langue={langue}
            onSelect={handleTemplatePicked}
            onPreviewModal={setPreviewTemplate}
            onApplyToActiveCV={onApplyToActiveCV}
          />
        ))}

        {/* Special Action Card: CREATE MY OWN MODEL / BLANK CANVAS */}
        {onCreateBlankCV && (
          <div
            onClick={onCreateBlankCV}
            className="group rounded-3xl bg-gradient-to-b from-blue-50/70 via-white to-indigo-50/50 dark:from-slate-800/90 dark:via-slate-900 dark:to-indigo-950/50 border-2 border-dashed border-blue-400/60 dark:border-blue-600/60 hover:border-blue-600 dark:hover:border-blue-400 p-6 flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer shadow-xs hover:shadow-xl hover:-translate-y-1 min-h-[380px] space-y-4"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-110 group-hover:rotate-3 transition-transform">
              <FilePlus className="w-8 h-8" />
            </div>

            <div className="space-y-2 max-w-[240px]">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                {langue === 'en' ? 'Blank Canvas' : langue === 'ar' ? 'صفحة بيضاء' : 'Page Vierge'}
              </span>

              <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {langue === 'en' ? 'Create My Own Model' : langue === 'ar' ? 'إنشاء نموذجي الخاص' : 'Créer mon propre modèle'}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                {langue === 'en'
                  ? 'Start directly on a clean blank page and design your CV from scratch with full creative control.'
                  : langue === 'ar'
                  ? 'ابدأ مباشرة على صفحة بيضاء نظيفة وصمّم سيرتك الذاتية من الصفر بحرية إبداعية كاملة.'
                  : 'Démarrez directement sur une page blanche et créez votre propre modèle avec une liberté totale.'}
              </p>
            </div>

            <button
              type="button"
              className="mt-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-extrabold shadow-md shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>{langue === 'en' ? 'Open Blank Page' : langue === 'ar' ? 'فتح صفحة بيضاء' : 'Ouvrir page blanche'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>

      {/* Full Screen Template Preview Modal */}
      {previewTemplate && (
        <TemplatePreviewModal
          template={previewTemplate}
          langue={langue}
          isOpen={!!previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          onSelect={handleTemplatePicked}
        />
      )}

      {/* Mode Choice Modal (Visual Editor vs Form) */}
      {modeModalTemplate && (
        <TemplateModeModal
          template={modeModalTemplate}
          langue={langue}
          isOpen={!!modeModalTemplate}
          onClose={() => setModeModalTemplate(null)}
          onConfirm={(template, mode) => {
            onSelectTemplate(template, mode);
            setModeModalTemplate(null);
          }}
        />
      )}

    </div>
  );
};
