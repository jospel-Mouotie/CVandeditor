import React, { useState, useMemo, useEffect } from 'react';
import { CVTemplate, Language, TemplateCategory, SubscriptionTier } from '../types';
import { CV_TEMPLATES } from '../data/templates';
import { FREE_TEMPLATE_IDS } from '../utils/subscriptionGates';
import { TemplateCard } from '../components/TemplateCard';
import { TemplatePreviewModal } from '../components/TemplatePreviewModal';
import { TemplateModeModal } from '../components/TemplateModeModal';
import { getTranslation } from '../i18n/translations';
import { Search, Sparkles, FilePlus, ArrowRight, Plus, X, Loader2 } from 'lucide-react';
import { CV } from '../types';

interface GalleryViewProps {
  langue: Language;
  userTier?: SubscriptionTier;
  onSelectTemplate: (template: CVTemplate, mode?: 'visual' | 'form') => void;
  onCreateBlankCV?: () => void;
  activeCV?: CV | null;
  onApplyToActiveCV?: (template: CVTemplate) => void;
  onOpenUpgradeModal?: () => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({
  langue,
  userTier = 'freemium',
  onSelectTemplate,
  onCreateBlankCV,
  activeCV,
  onApplyToActiveCV,
  onOpenUpgradeModal
}) => {
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(langue, key);

  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'all' | 'free'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState<CVTemplate | null>(null);
  const [modeModalTemplate, setModeModalTemplate] = useState<CVTemplate | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 220);
    return () => clearTimeout(timer);
  }, []);

  const categories: Array<{ id: TemplateCategory | 'all' | 'free'; label: string }> = [
    { id: 'all', label: t('catAll') },
    { id: 'free', label: langue === 'ar' ? 'نماذج مجانية' : 'Gratuits' },
    { id: 'moderne', label: t('catModerne') },
    { id: 'classique', label: t('catClassique') },
    { id: 'creatif', label: t('catCreatif') },
    { id: 'executif', label: t('catExecutif') },
    { id: 'technique', label: 'Technique & IT' },
    { id: 'academique', label: 'Académique' }
  ];

  const filteredTemplates = useMemo(() => {
    return CV_TEMPLATES.filter(tpl => {
      let matchesCategory = true;
      if (selectedCategory === 'free') {
        matchesCategory = FREE_TEMPLATE_IDS.includes(tpl.id);
      } else if (selectedCategory !== 'all') {
        matchesCategory = tpl.category === selectedCategory;
      }

      const desc = typeof tpl.description === 'string' ? tpl.description : (tpl.description[langue] || tpl.description.fr || '');
      const matchesSearch = 
        tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        desc.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, langue]);

  const handleTemplatePicked = (template: CVTemplate) => {
    onSelectTemplate(template, 'form');
  };

  const getCategoryCount = (categoryId: string) => {
    if (categoryId === 'all') return CV_TEMPLATES.length;
    if (categoryId === 'free') return CV_TEMPLATES.filter(t => FREE_TEMPLATE_IDS.includes(t.id)).length;
    return CV_TEMPLATES.filter(t => t.category === categoryId).length;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header - Clean & Minimal */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-black/10 dark:border-white/10">
        <div>
          <h1 className="text-2xl font-light text-black dark:text-white tracking-wide">
            {langue === 'en' ? 'Templates' : langue === 'ar' ? 'القوالب' : 'Modèles'}
          </h1>
          <p className="text-sm text-black/50 dark:text-white/50 font-light mt-1">
            {filteredTemplates.length} {langue === 'en' ? 'available' : langue === 'ar' ? 'متاح' : 'disponibles'}
          </p>
        </div>
        {onCreateBlankCV && (
          <button
            onClick={onCreateBlankCV}
            className="group px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-sm font-medium rounded-lg transition-all duration-200 hover:bg-black/80 dark:hover:bg-white/80 flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>{langue === 'en' ? 'Blank Canvas' : langue === 'ar' ? 'صفحة بيضاء' : 'Page vierge'}</span>
          </button>
        )}
      </div>

      {/* Filters - Clean & Minimal */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 w-full lg:w-auto">
          {categories.map(cat => {
            const count = getCategoryCount(cat.id);
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/60 hover:bg-black/10 dark:hover:bg-white/10'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  {cat.label}
                  <span className={`text-[10px] ${isActive ? 'opacity-70' : 'opacity-50'}`}>
                    {count}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Field */}
        <div className="relative w-full lg:w-64 flex-shrink-0">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-black/30 dark:text-white/30" />
          <input
            type="text"
            placeholder={t('searchTemplatePlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className={`w-full pl-9 pr-8 py-1.5 text-sm bg-transparent border rounded-lg text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/30 transition-all duration-200 outline-none ${
              isSearchFocused
                ? 'border-black/40 dark:border-white/40'
                : 'border-black/20 dark:border-white/20 hover:border-black/30 dark:hover:border-white/30'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 dark:text-white/30 hover:text-black/60 dark:hover:text-white/60 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Templates Grid - Wide 320px+ Edge-to-Edge Display */}
      {isInitialLoading ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6 sm:gap-8 pt-2">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] p-5 space-y-4 animate-pulse min-h-[420px] flex flex-col justify-between"
            >
              <div className="w-full h-72 bg-black/5 dark:bg-white/5 rounded-xl flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-6 h-6 text-black/30 dark:text-white/30 animate-spin" />
                <span className="text-xs text-black/40 dark:text-white/40 font-light">Chargement du modèle...</span>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-3/4"></div>
                <div className="h-3 bg-black/5 dark:bg-white/5 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6 sm:gap-8 pt-2">
          {filteredTemplates.map((tpl, index) => (
            <div
              key={tpl.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 40}ms` }}
            >
              <TemplateCard
                template={tpl}
                langue={langue}
                userTier={userTier}
                onSelect={handleTemplatePicked}
                onPreviewModal={setPreviewTemplate}
                onApplyToActiveCV={onApplyToActiveCV}
                onOpenUpgradeModal={onOpenUpgradeModal}
              />
            </div>
          ))}

        {/* Special Action Card - Minimal Black & White */}
        {onCreateBlankCV && (
          <div
            onClick={onCreateBlankCV}
            className="group relative rounded-lg border-2 border-dashed border-black/20 dark:border-white/20 hover:border-black/40 dark:hover:border-white/40 p-8 flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer hover:bg-black/[0.02] dark:hover:bg-white/[0.02] min-h-[380px]"
          >
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full border-2 border-black/20 dark:border-white/20 flex items-center justify-center mx-auto group-hover:border-black/40 dark:group-hover:border-white/40 transition-colors">
                <FilePlus className="w-7 h-7 text-black/40 dark:text-white/40 group-hover:text-black/60 dark:group-hover:text-white/60 transition-colors" />
              </div>

              <div className="space-y-2 max-w-[240px] mx-auto">
                <span className="inline-block px-3 py-0.5 rounded-full text-[10px] font-medium tracking-wider uppercase border border-black/10 dark:border-white/10 text-black/50 dark:text-white/50">
                  {langue === 'en' ? 'Blank Canvas' : langue === 'ar' ? 'صفحة بيضاء' : 'Page vierge'}
                </span>

                <h3 className="text-base font-medium text-black dark:text-white">
                  {langue === 'en' ? 'Start from Scratch' : langue === 'ar' ? 'ابدأ من الصفر' : 'Partez de zéro'}
                </h3>

                <p className="text-sm text-black/50 dark:text-white/50 leading-relaxed font-light">
                  {langue === 'en'
                    ? 'Create your CV with complete freedom'
                    : langue === 'ar'
                    ? 'أنشئ سيرتك الذاتية بحرية كاملة'
                    : 'Créez votre CV en toute liberté'}
                </p>
              </div>

              <button
                type="button"
                className="px-5 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black text-sm font-medium transition-all duration-200 hover:bg-black/80 dark:hover:bg-white/80"
              >
                {langue === 'en' ? 'Create' : langue === 'ar' ? 'أنشئ' : 'Créer'}
              </button>
            </div>
          </div>
        )}
      </div>
      )}

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto border-2 border-black/10 dark:border-white/10 rounded-full flex items-center justify-center mb-4">
            <Search className="w-6 h-6 text-black/30 dark:text-white/30" />
          </div>
          <h3 className="text-base font-medium text-black dark:text-white">
            {langue === 'en' ? 'No templates found' : langue === 'ar' ? 'لم يتم العثور على قوالب' : 'Aucun modèle trouvé'}
          </h3>
          <p className="text-sm text-black/50 dark:text-white/50 mt-1 font-light">
            {langue === 'en' ? 'Try adjusting your search' : langue === 'ar' ? 'حاول تعديل بحثك' : 'Essayez d\'ajuster votre recherche'}
          </p>
        </div>
      )}

      {/* Modals */}
      {previewTemplate && (
        <TemplatePreviewModal
          template={previewTemplate}
          langue={langue}
          userTier={userTier}
          isOpen={!!previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          onSelect={handleTemplatePicked}
          onOpenUpgradeModal={onOpenUpgradeModal}
        />
      )}

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

      {/* Custom Animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.4s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};