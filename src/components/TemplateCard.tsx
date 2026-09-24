import React, { useRef, useState, useEffect } from 'react';
import { CVTemplate, Language, CV, SubscriptionTier } from '../types';
import { CVPreview } from './CVPreview';
import { getPresetForTemplate } from '../data/templatePresets';
import { getTranslation, getLocalizedTemplateName, getLocalizedBadgeText, getLocalizedCategory } from '../i18n/translations';
import { Crown, Eye, ArrowRight, Sparkles } from 'lucide-react';
import { isTemplateAllowed } from '../utils/subscriptionGates';

interface TemplateCardProps {
  template: CVTemplate;
  langue: Language;
  userTier?: SubscriptionTier;
  onSelect: (template: CVTemplate) => void;
  onPreviewModal: (template: CVTemplate) => void;
  onApplyToActiveCV?: (template: CVTemplate) => void;
  onOpenUpgradeModal?: () => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  langue,
  userTier = 'freemium',
  onSelect,
  onPreviewModal,
  onApplyToActiveCV,
  onOpenUpgradeModal
}) => {
  const thumbnailRef = useRef<HTMLDivElement>(null);
  const [cardScale, setCardScale] = useState<number>(0.45);

  useEffect(() => {
    if (!thumbnailRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          // Scale so 794px fills 100% of card width seamlessly
          setCardScale((entry.contentRect.width + 2) / 794);
        }
      }
    });
    observer.observe(thumbnailRef.current);
    return () => observer.disconnect();
  }, []);

  const description = template.description[langue] || template.description.fr;
  const preset = getPresetForTemplate(template.id, langue);
  const localizedName = getLocalizedTemplateName(template, langue);
  const localizedBadge = getLocalizedBadgeText(template.badgeText, langue);
  const localizedCategory = getLocalizedCategory(template.category, langue);

  const storedUser = typeof window !== 'undefined' ? localStorage.getItem('cv_builder_user') : null;
  let effectiveTier = userTier;
  if (storedUser) {
    try {
      const parsed = JSON.parse(storedUser);
      if (parsed.role === 'ADMIN' || parsed.subscriptionTier === 'premium') effectiveTier = 'premium';
    } catch (_) {}
  }

  const isAllowed = isTemplateAllowed(effectiveTier as SubscriptionTier, template.id, true);

  const handleAction = (actionCallback: () => void) => {
    if (!isAllowed) {
      if (onOpenUpgradeModal) onOpenUpgradeModal();
      return;
    }
    actionCallback();
  };

  // Construct full dummy CV for gallery preview
  const dummyCv: CV = {
    id: `cv-preview-${template.id}`,
    utilisateurId: 'demo',
    titre: preset.titre,
    templateId: template.id,
    langue: langue,
    couleurAccent: preset.couleurAccent,
    police: preset.police,
    photoUrl: preset.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    afficherPhoto: true,
    photoPosition: preset.photoPosition || (template.layoutFamily === 'single-column' ? 'in-header' : 'in-sidebar'),
    statutPaiement: 'PAYE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...preset,
    pageCibleMode: '1_page',
    sections: preset.sections
  };

  const isPremiumTemplate = !isAllowed || template.badgeText?.toLowerCase().includes('premium') || template.requiredTier === 'premium' || template.requiredTier === 'classique';

  return (
    <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden hover:shadow-2xl hover:border-neutral-700 transition-all flex flex-col group relative w-full h-full">
      
      {/* Thumbnail Container - Full Width Model Preview */}
      <div 
        ref={thumbnailRef}
        className="relative w-full overflow-hidden bg-white border-b border-neutral-800 flex items-start justify-center cursor-pointer select-none group-hover:opacity-95 transition-all"
        style={{ height: `${Math.round(cardScale * 1122)}px` }}
        onClick={() => handleAction(() => onSelect(template))}
      >
        {/* Full Width Scaled A4 Page Paper Box */}
        <div 
          className="w-[794px] h-[1122px] origin-top pointer-events-none select-none overflow-hidden bg-white shrink-0"
          style={{ transform: `scale(${cardScale})` }}
        >
          <CVPreview cv={dummyCv} interactivePreview={false} />
        </div>

        {/* Top Indicators */}
        <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5">
          {!isAllowed && (
            <span className="w-7 h-7 rounded-full bg-neutral-950/90 backdrop-blur-xs border border-amber-500/50 shadow-lg flex items-center justify-center" title="Premium">
              <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
            </span>
          )}
        </div>

        {/* Right Badge if available & not already showing Crown */}
        {localizedBadge && isAllowed && (
          <div className="absolute top-2.5 right-2.5 bg-neutral-950/90 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1 z-10 border border-neutral-700">
            <Sparkles className="w-3 h-3 text-neutral-300" />
            <span>{localizedBadge}</span>
          </div>
        )}

        {/* Hover Overlay Buttons */}
        <div className="absolute inset-0 bg-neutral-950/85 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-200 flex flex-col items-center justify-center p-4 z-20 space-y-2.5">
          {!isAllowed && (
            <div className="text-center text-white space-y-1 mb-2 px-2">
              <div className="w-10 h-10 bg-amber-400/10 rounded-full flex items-center justify-center mx-auto text-amber-400 border border-amber-400/30">
                <Crown className="w-5 h-5 fill-amber-400" />
              </div>
            </div>
          )}

          {onApplyToActiveCV && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleAction(() => onApplyToActiveCV(template));
              }}
              className="w-full bg-white text-neutral-950 hover:bg-neutral-200 font-bold text-xs py-2 px-3 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>{getTranslation(langue, 'applyToMyCVKeepData')}</span>
            </button>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPreviewModal(template);
            }}
            className="w-full bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs py-2 px-3 rounded-xl shadow transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-neutral-700"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{getTranslation(langue, 'fullscreenPreview')}</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleAction(() => onSelect(template));
            }}
            className="w-full bg-white text-neutral-950 hover:bg-neutral-200 font-black text-xs py-2 px-3 rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>{isAllowed ? getTranslation(langue, 'chooseThisTemplate') : 'Débloquer ce modèle'}</span>
          </button>
        </div>
      </div>

      {/* Meta Info Footer */}
      <div className="p-3.5 bg-neutral-900 flex-1 flex flex-col justify-between space-y-2">
        <div>
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-bold text-white text-sm group-hover:text-neutral-200 transition-colors truncate pr-2">
              {localizedName}
            </h3>
            {isPremiumTemplate && !isAllowed && (
              <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
            )}
          </div>
          <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-neutral-800 text-[11px] font-semibold">
          <span className="capitalize px-2 py-0.5 bg-neutral-950 rounded-full text-[10px] font-medium text-neutral-400 border border-neutral-800">
            {localizedCategory}
          </span>
          <button
            type="button"
            onClick={() => handleAction(() => onSelect(template))}
            className="font-bold text-[11px] flex items-center gap-1 cursor-pointer text-white hover:text-neutral-300"
          >
            <span>{isAllowed ? getTranslation(langue, 'chooseThisTemplate') : 'Utiliser ce modèle'}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

    </div>
  );
};

