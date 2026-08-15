import React from 'react';
import { CV, Section, ProfilContenu, ExperienceItem, FormationItem, CompetenceItem, SubCompetenceItem, LangueItem, PersonnaliseeContenu } from '../types';
import { getBackgroundStyle } from '../utils/backgroundHelpers';
import { SkillLevelRenderer } from './SkillLevelRenderer';
import { Mail, Phone, MapPin, Globe, User, Briefcase, GraduationCap, CheckCircle, Star, FolderTree, X, Palette, Type } from 'lucide-react';

interface SectionSlotProps {
  section: Section;
  cv?: CV;
  isSidebar?: boolean;
  accentColor: string;
  secondaryAccentColor?: string;
  textColor: string;
  headingColor: string;
  headerStyle?: 'underline' | 'pill' | 'banner' | 'left-border' | 'minimal' | 'boxed' | 'stars' | 'double-line';
  skillsDisplayMode?: 'grid' | 'list' | 'badges' | 'progress' | 'stars' | 'tags';
  experienceDatesAlignment?: 'left' | 'top' | 'inline';
  bulletStyle?: 'disc' | 'square' | 'arrow' | 'check' | 'star' | 'dash' | 'numbered' | 'none';
  titleFontSizePt?: number;
  titleCase?: 'uppercase' | 'capitalize' | 'normal';
  titleAlign?: 'left' | 'center' | 'right';
  timelineStyle?: 'none' | 'line-dots' | 'accent-pills' | 'left-bar';
  afficherBadgesIcones?: boolean;
  fontCss?: string;
  dynamicTextStyle?: React.CSSProperties;
  dragHandleProps?: any;
  isReorderActive?: boolean;
  onToggleExpand?: () => void;
  isExpanded?: boolean;
  onUpdateSection?: (updatedSection: Section) => void;
  isSelected?: boolean;
  onSelect?: (sectionId: string) => void;
  onUpdateSectionStyle?: (sectionId: string, stylePatch: Partial<any>) => void;
}

export const SectionSlot: React.FC<SectionSlotProps> = ({
  section,
  cv,
  isSidebar = false,
  accentColor,
  secondaryAccentColor = '#F1F5F9',
  textColor,
  headingColor,
  headerStyle = 'underline',
  skillsDisplayMode = 'grid',
  experienceDatesAlignment = 'left',
  bulletStyle = 'disc',
  titleFontSizePt,
  titleCase = 'uppercase',
  titleAlign = 'left',
  timelineStyle = 'none',
  afficherBadgesIcones = false,
  fontCss,
  dynamicTextStyle,
  dragHandleProps,
  isReorderActive = false,
  onToggleExpand,
  isExpanded = true,
  onUpdateSection,
  isSelected = false,
  onSelect,
  onUpdateSectionStyle
}) => {
  if (!section.visible) return null;

  // Custom Section Overrides
  const secStyle = section.styleSection;
  const effectiveHeaderStyle = secStyle?.styleEntete || headerStyle;
  const effectiveSkillsMode = secStyle?.styleCompetences || skillsDisplayMode;
  const effectiveDatesAlign = secStyle?.alignementDates || experienceDatesAlignment;
  const effectiveHeadingColor = secStyle?.couleurTitre || headingColor;
  const effectiveTextColor = secStyle?.couleurTexte || textColor;
  const effectiveBgColor = secStyle?.couleurFond;

  // Formatting Title Text
  const formatTitleText = (rawTitle: string) => {
    if (titleCase === 'capitalize') {
      return rawTitle.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());
    }
    if (titleCase === 'normal') {
      return rawTitle;
    }
    return rawTitle.toUpperCase();
  };

  const formattedTitle = formatTitleText(section.titre);
  const titleStyleObj: React.CSSProperties = {
    color: effectiveHeadingColor,
    fontSize: titleFontSizePt ? `${titleFontSizePt}pt` : '1.1em',
    textAlign: titleAlign
  };

  const titleAlignClass = titleAlign === 'center' ? 'text-center justify-center' : titleAlign === 'right' ? 'text-right justify-end' : 'text-left justify-start';

  const handleTitleBlur = (e: React.FocusEvent<HTMLElement>) => {
    if (!onUpdateSection) return;
    const newTitle = e.currentTarget.innerText;
    if (newTitle !== section.titre) {
      onUpdateSection({ ...section, titre: newTitle });
    }
  };

  const handleProfilBlur = (field: string, value: string) => {
    if (!onUpdateSection) return;
    onUpdateSection({
      ...section,
      contenu: {
        ...(section.contenu || {}),
        [field]: value
      }
    });
  };

  const updateExpItem = (idx: number, field: string, val: string) => {
    if (!onUpdateSection) return;
    const list = Array.isArray(section.contenu) ? [...(section.contenu as ExperienceItem[])] : [];
    if (list[idx]) {
      list[idx] = { ...list[idx], [field]: val };
      onUpdateSection({ ...section, contenu: list });
    }
  };

  const updateEduItem = (idx: number, field: string, val: string) => {
    if (!onUpdateSection) return;
    const list = Array.isArray(section.contenu) ? [...(section.contenu as FormationItem[])] : [];
    if (list[idx]) {
      list[idx] = { ...list[idx], [field]: val };
      onUpdateSection({ ...section, contenu: list });
    }
  };

  const updateSkillItem = (idx: number, field: string, val: string) => {
    if (!onUpdateSection) return;
    const list = Array.isArray(section.contenu) ? [...(section.contenu as CompetenceItem[])] : [];
    if (list[idx]) {
      list[idx] = { ...list[idx], [field]: val };
      onUpdateSection({ ...section, contenu: list });
    }
  };

  const updateLangueItem = (idx: number, field: string, val: string) => {
    if (!onUpdateSection) return;
    const list = Array.isArray(section.contenu) ? [...(section.contenu as LangueItem[])] : [];
    if (list[idx]) {
      list[idx] = { ...list[idx], [field]: val };
      onUpdateSection({ ...section, contenu: list });
    }
  };

  // Helper for Section Titles
  const renderHeader = () => {
    const headerFontSize = titleFontSizePt ? `${titleFontSizePt}pt` : '1.1em';

    const renderTitleEditable = (extraClass: string = '') => (
      <span
        contentEditable={Boolean(onUpdateSection)}
        suppressContentEditableWarning
        onBlur={handleTitleBlur}
        className={`outline-none cursor-text ${extraClass}`}
      >
        {formattedTitle}
      </span>
    );

    switch (effectiveHeaderStyle) {
      case 'pill':
        return (
          <div className={`mb-2.5 flex ${titleAlignClass}`}>
            <span
              className="px-3 py-1 font-bold rounded-full inline-block shadow-2xs"
              style={{ backgroundColor: accentColor, color: '#FFFFFF', fontSize: headerFontSize }}
            >
              {renderTitleEditable()}
            </span>
          </div>
        );
      case 'banner':
        return (
          <div
            className={`mb-2.5 px-3 py-1.5 rounded-md font-black tracking-wider shadow-2xs ${titleAlignClass}`}
            style={{ backgroundColor: accentColor, color: '#FFFFFF', fontSize: headerFontSize }}
          >
            {renderTitleEditable()}
          </div>
        );
      case 'left-border':
        return (
          <div className={`mb-1 flex items-center gap-1.5 ${titleAlignClass}`}>
            <div className="w-1 h-3.5 rounded-full shrink-0" style={{ backgroundColor: accentColor }} />
            <h3 className="font-extrabold tracking-wide" style={titleStyleObj}>
              {renderTitleEditable()}
            </h3>
          </div>
        );
      case 'boxed':
        return (
          <div
            className="mb-1 p-1 rounded border font-black tracking-wider text-center"
            style={{ borderColor: accentColor, backgroundColor: secondaryAccentColor + '33', ...titleStyleObj }}
          >
            {renderTitleEditable()}
          </div>
        );
      case 'stars':
        return (
          <div className="mb-1 flex items-center justify-between border-b pb-0.5" style={{ borderColor: accentColor + '44' }}>
            <h3 className="font-black tracking-wider" style={titleStyleObj}>
              {renderTitleEditable()}
            </h3>
            <div className="flex items-center space-x-0.5" style={{ color: accentColor }}>
              <Star className="w-2.5 h-2.5 fill-current" />
              <Star className="w-2.5 h-2.5 fill-current" />
            </div>
          </div>
        );
      case 'double-line':
        return (
          <div className="mb-1 border-b border-t py-0.5" style={{ borderColor: accentColor }}>
            <h3 className="font-black tracking-widest text-center" style={titleStyleObj}>
              {renderTitleEditable()}
            </h3>
          </div>
        );
      case 'arch-block':
        return (
          <div
            className={`mb-1 px-2.5 py-1 rounded-t-xl rounded-b-xs font-black tracking-wider text-white ${titleAlignClass}`}
            style={{ backgroundColor: accentColor, fontSize: headerFontSize }}
          >
            {renderTitleEditable()}
          </div>
        );
      case 'badge-header':
        return (
          <div className={`mb-1 flex ${titleAlignClass}`}>
            <span
              className="px-2.5 py-0.5 font-black rounded inline-block border-l-2"
              style={{ backgroundColor: secondaryAccentColor + '44', borderColor: accentColor, color: effectiveHeadingColor, fontSize: headerFontSize }}
            >
              {renderTitleEditable()}
            </span>
          </div>
        );
      case 'minimal':
        return (
          <div className={`mb-1 ${titleAlignClass}`}>
            <h3 className="font-extrabold tracking-widest" style={titleStyleObj}>
              {renderTitleEditable()}
            </h3>
          </div>
        );
      case 'underline':
      default:
        return (
          <div className="mb-1 border-b pb-0.5" style={{ borderColor: accentColor }}>
            <h3 className="font-extrabold tracking-wider" style={titleStyleObj}>
              {renderTitleEditable()}
            </h3>
          </div>
        );
    }
  };

  // Helper Bullet Prefix
  const getBulletPrefix = (index: number) => {
    switch (bulletStyle) {
      case 'square': return '▪ ';
      case 'arrow': return '▸ ';
      case 'check': return '✓ ';
      case 'star': return '★ ';
      case 'dash': return '— ';
      case 'numbered': return `${index + 1}. `;
      case 'none': return '';
      case 'disc':
      default: return '• ';
    }
  };

  // Helper for multi-line description & bullet lists
  const renderFormattedDescription = (desc: string | undefined, onUpdate?: (val: string) => void) => {
    if (!desc && !onUpdate) return null;
    const textVal = desc || '';

    return (
      <div
        contentEditable={Boolean(onUpdate)}
        suppressContentEditableWarning
        onBlur={(e) => onUpdate?.(e.currentTarget.innerText)}
        className="opacity-90 mt-0.5 text-[0.95em] outline-none cursor-text whitespace-pre-line"
      >
        {textVal}
      </div>
    );
  };

  const sectionBgStyle = getBackgroundStyle({
    backgroundType: secStyle?.backgroundType,
    colorSolid: secStyle?.couleurFond,
    opacity: secStyle?.backgroundOpacity,
    colorStart: secStyle?.backgroundColorStart,
    colorEnd: secStyle?.backgroundColorEnd,
    patternName: secStyle?.backgroundPattern,
    imageUrl: secStyle?.backgroundImage,
    fallbackColor: 'transparent'
  });

  return (
    <div className="section-slot-container w-full">
      {section.pageBreakBefore && (
        <div className="w-full my-3 flex items-center gap-2 text-blue-600 dark:text-blue-400 font-extrabold text-[10px] uppercase tracking-wider print:hidden select-none">
          <div className="h-0.5 bg-blue-500/40 flex-1 border-t border-dashed border-blue-500" />
          <span>Saut de Page Impératif</span>
          <div className="h-0.5 bg-blue-500/40 flex-1 border-t border-dashed border-blue-500" />
        </div>
      )}

      <div
        onClick={(e) => {
          if (onSelect) {
            e.stopPropagation();
            onSelect(section.id);
          }
        }}
        className={`relative group transition-all rounded-md p-1 cursor-pointer transition-all ${
          isSelected
            ? 'ring-2 ring-blue-500 border-2 border-blue-500 shadow-lg bg-blue-50/10'
            : 'border border-transparent hover:border-blue-300 hover:bg-slate-50/30'
        } ${
          secStyle?.ombre === 'sm' ? 'shadow-xs' : secStyle?.ombre === 'md' ? 'shadow-md' : secStyle?.ombre === 'lg' ? 'shadow-xl' : ''
        }`}
        style={{
          ...sectionBgStyle,
          borderWidth: secStyle?.epaisseurBordure !== undefined && secStyle?.epaisseurBordure > 0 ? `${secStyle.epaisseurBordure}px` : undefined,
          borderStyle: secStyle?.epaisseurBordure !== undefined && secStyle?.epaisseurBordure > 0 ? 'solid' : undefined,
          borderColor: isSelected ? '#2563EB' : (secStyle?.epaisseurBordure ? (secStyle?.couleurBordure || accentColor) : undefined),
          borderRadius: secStyle?.rayonBordure !== undefined ? `${secStyle.rayonBordure}px` : undefined,
          fontFamily: fontCss,
          color: effectiveTextColor,
          fontSize: secStyle?.tailleTextePt ? `${secStyle.tailleTextePt}pt` : undefined,
          pageBreakBefore: section.pageBreakBefore ? 'always' : 'auto',
          breakBefore: section.pageBreakBefore ? 'page' : 'auto',
          ...dynamicTextStyle
        }}
      >
      {/* Interactive Floating Section Toolbar when Selected */}
      {isSelected && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute -top-11 left-0 z-50 bg-slate-900/95 backdrop-blur-md text-white rounded-xl shadow-2xl p-1.5 flex items-center gap-2 border border-slate-700 text-xs animate-in fade-in zoom-in duration-150 print:hidden whitespace-nowrap overflow-x-auto max-w-full"
        >
          <div className="flex items-center gap-1 font-black px-1 text-blue-300 text-[11px]">
            <FolderTree className="w-3.5 h-3.5" />
            <span className="max-w-[100px] truncate">{section.titre}</span>
          </div>

          <div className="h-4 w-px bg-slate-700 shrink-0" />

          {/* Couleur du Texte de la Section */}
          <label className="flex items-center gap-1 cursor-pointer hover:text-blue-300 text-[10px] font-bold shrink-0" title="Définir la couleur du texte pour cette section">
            <span>Texte:</span>
            <input
              type="color"
              value={effectiveTextColor || '#1E293B'}
              onChange={(e) => onUpdateSectionStyle?.(section.id, { couleurTexte: e.target.value })}
              className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent p-0"
            />
          </label>

          {/* Couleur du Titre de la Section */}
          <label className="flex items-center gap-1 cursor-pointer hover:text-blue-300 text-[10px] font-bold shrink-0" title="Définir la couleur du titre pour cette section">
            <span>Titre:</span>
            <input
              type="color"
              value={effectiveHeadingColor || '#2563EB'}
              onChange={(e) => onUpdateSectionStyle?.(section.id, { couleurTitre: e.target.value })}
              className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent p-0"
            />
          </label>

          {/* Background / Couleur de Fond de la Section */}
          <label className="flex items-center gap-1 cursor-pointer hover:text-blue-300 text-[10px] font-bold shrink-0" title="Définir le background/arrière-plan de cette section">
            <span>Fond:</span>
            <input
              type="color"
              value={effectiveBgColor || '#FFFFFF'}
              onChange={(e) => onUpdateSectionStyle?.(section.id, { couleurFond: e.target.value, backgroundType: 'solid' })}
              className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent p-0"
            />
          </label>

          {/* Quick Clear Background */}
          {effectiveBgColor && (
            <button
              onClick={() => onUpdateSectionStyle?.(section.id, { couleurFond: undefined, backgroundType: 'transparent' })}
              className="text-[9px] text-slate-400 hover:text-red-300 underline font-semibold shrink-0"
              title="Effacer le fond"
            >
              Effacer
            </button>
          )}

          <div className="h-4 w-px bg-slate-700 shrink-0" />

          {/* Taille du Texte (pt) */}
          <div className="flex items-center gap-1 shrink-0 text-[10px] font-bold">
            <span>Taille:</span>
            <select
              value={secStyle?.tailleTextePt || 10}
              onChange={(e) => onUpdateSectionStyle?.(section.id, { tailleTextePt: Number(e.target.value) })}
              className="bg-slate-800 text-white rounded text-[10px] font-bold px-1 py-0.5 outline-none border border-slate-700"
            >
              <option value={8}>8 pt</option>
              <option value={9}>9 pt</option>
              <option value={10}>10 pt</option>
              <option value={11}>11 pt</option>
              <option value={12}>12 pt</option>
              <option value={14}>14 pt</option>
            </select>
          </div>

          <div className="h-4 w-px bg-slate-700 shrink-0" />

          {/* Position Colonne */}
          <button
            onClick={() => onUpdateSection?.({ ...section, colonne: section.colonne === 'gauche' ? 'principale' : 'gauche' })}
            className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-blue-300 rounded font-bold text-[10px] cursor-pointer shrink-0"
            title="Déplacer vers l'autre colonne"
          >
            {section.colonne === 'gauche' ? 'Gauche' : 'Principale'}
          </button>

          {/* Close Floating Bar */}
          <button
            onClick={() => onSelect?.('')}
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white cursor-pointer shrink-0"
            title="Fermer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
      {/* Reorder Mode Touch Handle Bar */}
      {isReorderActive && dragHandleProps && (
        <div
          {...dragHandleProps}
          className="print:hidden mb-2 p-2 bg-blue-600 text-white rounded-lg cursor-grab active:cursor-grabbing flex items-center justify-between font-bold shadow-md select-none touch-none hover:bg-blue-700 transition-colors"
          style={{ minHeight: '44px' }}
        >
          <span className="flex items-center gap-1.5">
            <span className="text-[1.1em]">☰</span>
            <span>Déplacer: {section.titre}</span>
          </span>
          <span className="text-[0.8em] bg-white/20 px-2 py-0.5 rounded uppercase">Zone {section.colonne || 'principale'}</span>
        </div>
      )}

      {renderHeader()}

      {/* SECTION CONTENT TYPES */}
      <div className="space-y-1">
        {/* PROFIL / CONTACT */}
        {section.type === 'profil' && (
          <div className="space-y-1">
            {section.contenu?.resume !== undefined && (
              <p
                contentEditable={Boolean(onUpdateSection)}
                suppressContentEditableWarning
                onBlur={(e) => handleProfilBlur('resume', e.currentTarget.innerText)}
                className="opacity-90 whitespace-pre-line mb-1 outline-none cursor-text"
              >
                {section.contenu.resume}
              </p>
            )}
            {/* Contact Items Badge Styling Helper */}
            {(() => {
              const bStyle = cv?.styleBadgesCoordonnees || 'none';
              const bBg = cv?.couleurFondBadgeCoordonnees || (bStyle === 'solid-accent' ? accentColor : bStyle === 'soft-tint' ? `${accentColor}20` : bStyle === 'glass' ? 'rgba(255,255,255,0.2)' : 'transparent');
              const bText = cv?.couleurTexteBadgeCoordonnees || (bStyle === 'solid-accent' ? '#FFFFFF' : 'inherit');
              const bBorderCol = cv?.couleurBordureBadgeCoordonnees || accentColor;
              const bBorderW = cv?.tailleBordureBadgeCoordonnees ?? (bStyle === 'outline' || bStyle === 'glass' ? 1 : 0);
              const bRadius = cv?.rayonBordureBadgeCoordonnees ?? (bStyle === 'pill' ? 9999 : bStyle === 'rounded' || bStyle === 'glass' ? 8 : 4);
              const bOpacity = cv?.opaciteBadgeCoordonnees ?? 1;

              const getBadgeItemStyle = (): React.CSSProperties => {
                if (bStyle === 'none') {
                  return { display: 'flex', alignItems: 'center', gap: '6px' };
                }
                return {
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: bBg,
                  color: bText,
                  borderColor: bBorderCol,
                  borderWidth: `${bBorderW}px`,
                  borderStyle: bBorderW > 0 ? 'solid' : 'none',
                  borderRadius: `${bRadius}px`,
                  opacity: bOpacity,
                  padding: '3px 8px',
                  boxShadow: bStyle === 'glass' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
                  backdropFilter: bStyle === 'glass' ? 'blur(4px)' : 'none'
                };
              };

              const badgeItemStyle = getBadgeItemStyle();

              return (
                <div className={`grid grid-cols-1 gap-1.5 ${bStyle !== 'none' ? 'flex flex-wrap gap-1.5' : ''}`}>
                  {section.contenu?.email !== undefined && (
                    <div style={badgeItemStyle}>
                      <Mail className="w-3 h-3 shrink-0 opacity-80" style={{ color: bStyle === 'solid-accent' ? '#FFFFFF' : (isSidebar || effectiveTextColor === '#FFFFFF') ? 'currentColor' : accentColor }} />
                      <span
                        contentEditable={Boolean(onUpdateSection)}
                        suppressContentEditableWarning
                        onBlur={(e) => handleProfilBlur('email', e.currentTarget.innerText)}
                        className="break-all outline-none cursor-text text-[11px]"
                      >
                        {section.contenu.email}
                      </span>
                    </div>
                  )}
                  {section.contenu?.telephone !== undefined && (
                    <div style={badgeItemStyle}>
                      <Phone className="w-3 h-3 shrink-0 opacity-80" style={{ color: bStyle === 'solid-accent' ? '#FFFFFF' : (isSidebar || effectiveTextColor === '#FFFFFF') ? 'currentColor' : accentColor }} />
                      <span
                        contentEditable={Boolean(onUpdateSection)}
                        suppressContentEditableWarning
                        onBlur={(e) => handleProfilBlur('telephone', e.currentTarget.innerText)}
                        className="outline-none cursor-text text-[11px]"
                      >
                        {section.contenu.telephone}
                      </span>
                    </div>
                  )}
                  {section.contenu?.adresse !== undefined && (
                    <div style={badgeItemStyle}>
                      <MapPin className="w-3 h-3 shrink-0 opacity-80" style={{ color: bStyle === 'solid-accent' ? '#FFFFFF' : (isSidebar || effectiveTextColor === '#FFFFFF') ? 'currentColor' : accentColor }} />
                      <span
                        contentEditable={Boolean(onUpdateSection)}
                        suppressContentEditableWarning
                        onBlur={(e) => handleProfilBlur('adresse', e.currentTarget.innerText)}
                        className="outline-none cursor-text text-[11px]"
                      >
                        {section.contenu.adresse}
                      </span>
                    </div>
                  )}
                  {section.contenu?.siteWeb !== undefined && (
                    <div style={badgeItemStyle}>
                      <Globe className="w-3 h-3 shrink-0 opacity-80" style={{ color: bStyle === 'solid-accent' ? '#FFFFFF' : (isSidebar || effectiveTextColor === '#FFFFFF') ? 'currentColor' : accentColor }} />
                      <span
                        contentEditable={Boolean(onUpdateSection)}
                        suppressContentEditableWarning
                        onBlur={(e) => handleProfilBlur('siteWeb', e.currentTarget.innerText)}
                        className="break-all outline-none cursor-text text-[11px]"
                      >
                        {section.contenu.siteWeb}
                      </span>
                    </div>
                  )}
                  {section.contenu?.linkedin !== undefined && (
                    <div style={badgeItemStyle}>
                      <Globe className="w-3 h-3 shrink-0 opacity-80" style={{ color: bStyle === 'solid-accent' ? '#FFFFFF' : (isSidebar || effectiveTextColor === '#FFFFFF') ? 'currentColor' : accentColor }} />
                      <span
                        contentEditable={Boolean(onUpdateSection)}
                        suppressContentEditableWarning
                        onBlur={(e) => handleProfilBlur('linkedin', e.currentTarget.innerText)}
                        className="break-all outline-none cursor-text text-[11px]"
                      >
                        {section.contenu.linkedin}
                      </span>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* EXPÉRIENCES */}
        {section.type === 'experience' && (
          <div className={`space-y-1.5 ${timelineStyle === 'line-dots' ? 'border-l-2 pl-3 ml-1.5 relative' : ''}`} style={timelineStyle === 'line-dots' ? { borderColor: accentColor + '66' } : {}}>
            {(section.contenu as ExperienceItem[])?.map((exp, expIdx) => {
              const datesText = `${exp.dateDebut || ''} ${exp.dateFin ? `- ${exp.dateFin}` : exp.actuel ? '- Présent' : ''}`.trim();

              if (effectiveDatesAlign === 'left' && !isSidebar) {
                return (
                  <div key={exp.id || expIdx} className="grid grid-cols-1 sm:grid-cols-4 gap-2 border-b border-slate-100 last:border-0 pb-2 last:pb-0 relative">
                    {timelineStyle === 'line-dots' && (
                      <span className="absolute -left-[17px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white shadow-xs" style={{ backgroundColor: accentColor }} />
                    )}
                    <div className="font-bold opacity-75 sm:col-span-1" style={{ color: accentColor }}>
                      <span
                        contentEditable={Boolean(onUpdateSection)}
                        suppressContentEditableWarning
                        onBlur={(e) => updateExpItem(expIdx, 'dateDebut', e.currentTarget.innerText)}
                        className="outline-none cursor-text"
                      >
                        {datesText}
                      </span>
                    </div>
                    <div className="sm:col-span-3 space-y-1">
                      <div
                        contentEditable={Boolean(onUpdateSection)}
                        suppressContentEditableWarning
                        onBlur={(e) => updateExpItem(expIdx, 'poste', e.currentTarget.innerText)}
                        className="font-extrabold uppercase tracking-tight outline-none cursor-text"
                      >
                        {exp.poste}
                      </div>
                      <div className="font-semibold opacity-90">
                        <span
                          contentEditable={Boolean(onUpdateSection)}
                          suppressContentEditableWarning
                          onBlur={(e) => updateExpItem(expIdx, 'entreprise', e.currentTarget.innerText)}
                          className="outline-none cursor-text"
                        >
                          {exp.entreprise}
                        </span>
                        {exp.ville && (
                          <span> | <span
                            contentEditable={Boolean(onUpdateSection)}
                            suppressContentEditableWarning
                            onBlur={(e) => updateExpItem(expIdx, 'ville', e.currentTarget.innerText)}
                            className="outline-none cursor-text"
                          >{exp.ville}</span></span>
                        )}
                      </div>
                      {renderFormattedDescription(exp.description, (val) => updateExpItem(expIdx, 'description', val))}
                    </div>
                  </div>
                );
              }

              return (
                <div key={exp.id || expIdx} className="space-y-1 border-b border-slate-100/50 last:border-0 pb-1.5 last:pb-0 relative">
                  {timelineStyle === 'line-dots' && (
                    <span className="absolute -left-[17px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white shadow-xs" style={{ backgroundColor: accentColor }} />
                  )}
                  <div className="flex items-start justify-between flex-wrap gap-1">
                    <span
                      contentEditable={Boolean(onUpdateSection)}
                      suppressContentEditableWarning
                      onBlur={(e) => updateExpItem(expIdx, 'poste', e.currentTarget.innerText)}
                      className="font-bold uppercase tracking-tight outline-none cursor-text"
                    >
                      {exp.poste}
                    </span>
                    {datesText && (
                      <span
                        contentEditable={Boolean(onUpdateSection)}
                        suppressContentEditableWarning
                        onBlur={(e) => updateExpItem(expIdx, 'dateDebut', e.currentTarget.innerText)}
                        className="text-[0.85em] font-bold px-1.5 py-0.5 rounded outline-none cursor-text"
                        style={{ backgroundColor: secondaryAccentColor + '44', color: accentColor }}
                      >
                        {datesText}
                      </span>
                    )}
                  </div>
                  <div className="font-semibold opacity-90">
                    <span
                      contentEditable={Boolean(onUpdateSection)}
                      suppressContentEditableWarning
                      onBlur={(e) => updateExpItem(expIdx, 'entreprise', e.currentTarget.innerText)}
                      className="outline-none cursor-text"
                    >
                      {exp.entreprise}
                    </span>
                    {exp.ville && (
                      <span> | <span
                        contentEditable={Boolean(onUpdateSection)}
                        suppressContentEditableWarning
                        onBlur={(e) => updateExpItem(expIdx, 'ville', e.currentTarget.innerText)}
                        className="outline-none cursor-text"
                      >{exp.ville}</span></span>
                    )}
                  </div>
                  {renderFormattedDescription(exp.description, (val) => updateExpItem(expIdx, 'description', val))}
                </div>
              );
            })}
          </div>
        )}

        {/* FORMATION */}
        {section.type === 'formation' && (
          <div className={`space-y-2 ${timelineStyle === 'line-dots' ? 'border-l-2 pl-3 ml-1.5 relative' : ''}`} style={timelineStyle === 'line-dots' ? { borderColor: accentColor + '66' } : {}}>
            {(section.contenu as FormationItem[])?.map((edu, eduIdx) => {
              const datesText = `${edu.dateDebut || ''} ${edu.dateFin ? `- ${edu.dateFin}` : ''}`.trim();

              if (effectiveDatesAlign === 'left' && !isSidebar) {
                return (
                  <div key={edu.id || eduIdx} className="grid grid-cols-1 sm:grid-cols-4 gap-2 border-b border-slate-100 last:border-0 pb-1.5 last:pb-0 relative">
                    {timelineStyle === 'line-dots' && (
                      <span className="absolute -left-[17px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white shadow-xs" style={{ backgroundColor: accentColor }} />
                    )}
                    <div className="font-bold opacity-75 sm:col-span-1" style={{ color: accentColor }}>
                      <span
                        contentEditable={Boolean(onUpdateSection)}
                        suppressContentEditableWarning
                        onBlur={(e) => updateEduItem(eduIdx, 'dateDebut', e.currentTarget.innerText)}
                        className="outline-none cursor-text"
                      >
                        {datesText}
                      </span>
                    </div>
                    <div className="sm:col-span-3 space-y-0.5">
                      <div
                        contentEditable={Boolean(onUpdateSection)}
                        suppressContentEditableWarning
                        onBlur={(e) => updateEduItem(eduIdx, 'diplome', e.currentTarget.innerText)}
                        className="font-extrabold uppercase tracking-tight outline-none cursor-text"
                      >
                        {edu.diplome}
                      </div>
                      <div className="font-semibold opacity-90">
                        <span
                          contentEditable={Boolean(onUpdateSection)}
                          suppressContentEditableWarning
                          onBlur={(e) => updateEduItem(eduIdx, 'etablissement', e.currentTarget.innerText)}
                          className="outline-none cursor-text"
                        >
                          {edu.etablissement}
                        </span>
                        {edu.ville && (
                          <span> | <span
                            contentEditable={Boolean(onUpdateSection)}
                            suppressContentEditableWarning
                            onBlur={(e) => updateEduItem(eduIdx, 'ville', e.currentTarget.innerText)}
                            className="outline-none cursor-text"
                          >{edu.ville}</span></span>
                        )}
                      </div>
                      {renderFormattedDescription(edu.description, (val) => updateEduItem(eduIdx, 'description', val))}
                    </div>
                  </div>
                );
              }

              return (
                <div key={edu.id || eduIdx} className="space-y-1 border-b border-slate-100/50 last:border-0 pb-1.5 last:pb-0">
                  <div className="flex items-start justify-between flex-wrap gap-1">
                    <span
                      contentEditable={Boolean(onUpdateSection)}
                      suppressContentEditableWarning
                      onBlur={(e) => updateEduItem(eduIdx, 'diplome', e.currentTarget.innerText)}
                      className="font-bold uppercase tracking-tight outline-none cursor-text"
                    >
                      {edu.diplome}
                    </span>
                    {datesText && (
                      <span
                        contentEditable={Boolean(onUpdateSection)}
                        suppressContentEditableWarning
                        onBlur={(e) => updateEduItem(eduIdx, 'dateDebut', e.currentTarget.innerText)}
                        className="text-[0.85em] font-bold px-1.5 py-0.5 rounded outline-none cursor-text"
                        style={{ backgroundColor: secondaryAccentColor + '44', color: accentColor }}
                      >
                        {datesText}
                      </span>
                    )}
                  </div>
                  <div className="font-semibold opacity-90">
                    <span
                      contentEditable={Boolean(onUpdateSection)}
                      suppressContentEditableWarning
                      onBlur={(e) => updateEduItem(eduIdx, 'etablissement', e.currentTarget.innerText)}
                      className="outline-none cursor-text"
                    >
                      {edu.etablissement}
                    </span>
                    {edu.ville && (
                      <span> | <span
                        contentEditable={Boolean(onUpdateSection)}
                        suppressContentEditableWarning
                        onBlur={(e) => updateEduItem(eduIdx, 'ville', e.currentTarget.innerText)}
                        className="outline-none cursor-text"
                      >{edu.ville}</span></span>
                    )}
                  </div>
                  {renderFormattedDescription(edu.description, (val) => updateEduItem(eduIdx, 'description', val))}
                </div>
              );
            })}
          </div>
        )}

        {/* COMPÉTENCES */}
        {/* COMPÉTENCES */}
        {section.type === 'competences' && (() => {
          const rawItems = (Array.isArray(section.contenu) ? section.contenu : []) as CompetenceItem[];

          const formatSubWithNote = (sub: SubCompetenceItem) => {
            if (sub.note !== undefined && sub.note !== null) {
              return `${sub.nom} (${sub.note}/5)`;
            }
            return sub.nom;
          };

          const renderSkillItemList = (itemsList: CompetenceItem[]) => {
            if (effectiveSkillsMode === 'grid') {
              return (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {itemsList.map((sk) => {
                    const idx = rawItems.findIndex(i => i.id === sk.id || i === sk);
                    return (
                      <div
                        key={sk.id || idx}
                        className="p-1.5 rounded text-center font-bold border transition-all"
                        style={{ backgroundColor: secondaryAccentColor + '33', borderColor: accentColor + '44' }}
                      >
                        <div className="flex items-center justify-center gap-1">
                          <span
                            contentEditable={Boolean(onUpdateSection)}
                            suppressContentEditableWarning
                            onBlur={(e) => updateSkillItem(idx >= 0 ? idx : 0, 'nom', e.currentTarget.innerText)}
                            className="outline-none cursor-text"
                          >
                            {sk.nom}
                          </span>
                          {sk.niveau !== undefined && (
                            <span className="text-[0.75em] opacity-75 font-mono">({sk.niveau}/10)</span>
                          )}
                        </div>
                        {sk.listSousCompetences && sk.listSousCompetences.length > 0 && (
                          <div className="flex flex-wrap justify-center gap-1 mt-1">
                            {sk.listSousCompetences.map((sub, sIdx) => (
                              <span key={sub.id || sIdx} className="text-[0.75em] px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 opacity-90 font-medium">
                                {sub.nom}
                                {sub.note !== undefined && (
                                  <span className="ml-1 opacity-75 font-mono">★{sub.note}</span>
                                )}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            }

            if (effectiveSkillsMode === 'badges') {
              return (
                <div className="flex flex-wrap gap-1.5">
                  {itemsList.map((sk) => {
                    const idx = rawItems.findIndex(i => i.id === sk.id || i === sk);
                    return (
                      <span
                        key={sk.id || idx}
                        className="px-2.5 py-1 rounded-full font-bold shadow-2xs inline-flex items-center gap-1.5"
                        style={{ backgroundColor: accentColor, color: '#FFFFFF' }}
                      >
                        <span
                          contentEditable={Boolean(onUpdateSection)}
                          suppressContentEditableWarning
                          onBlur={(e) => updateSkillItem(idx >= 0 ? idx : 0, 'nom', e.currentTarget.innerText)}
                          className="outline-none cursor-text"
                        >
                          {sk.nom}
                        </span>
                        {sk.listSousCompetences && sk.listSousCompetences.length > 0 && (
                          <span className="text-[0.8em] opacity-90 font-normal">
                            ({sk.listSousCompetences.map(formatSubWithNote).join(', ')})
                          </span>
                        )}
                      </span>
                    );
                  })}
                </div>
              );
            }

            if (effectiveSkillsMode === 'tags') {
              return (
                <div className="flex flex-wrap gap-1.5">
                  {itemsList.map((sk) => {
                    const idx = rawItems.findIndex(i => i.id === sk.id || i === sk);
                    return (
                      <span
                        key={sk.id || idx}
                        className="px-2 py-0.5 rounded-lg font-extrabold border inline-flex items-center gap-1"
                        style={{ backgroundColor: secondaryAccentColor + '55', color: textColor, borderColor: accentColor + '55' }}
                      >
                        #<span
                          contentEditable={Boolean(onUpdateSection)}
                          suppressContentEditableWarning
                          onBlur={(e) => updateSkillItem(idx >= 0 ? idx : 0, 'nom', e.currentTarget.innerText)}
                          className="outline-none cursor-text"
                        >
                          {sk.nom}
                        </span>
                        {sk.listSousCompetences && sk.listSousCompetences.length > 0 && (
                          <span className="text-[0.8em] opacity-80 font-normal ml-0.5">
                            [{sk.listSousCompetences.map(formatSubWithNote).join(', ')}]
                          </span>
                        )}
                      </span>
                    );
                  })}
                </div>
              );
            }

            if (effectiveSkillsMode === 'stars') {
              return (
                <div className="space-y-2">
                  {itemsList.map((sk) => {
                    const idx = rawItems.findIndex(i => i.id === sk.id || i === sk);
                    const level = sk.niveau || 3;
                    return (
                      <div key={sk.id || idx} className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            contentEditable={Boolean(onUpdateSection)}
                            suppressContentEditableWarning
                            onBlur={(e) => updateSkillItem(idx >= 0 ? idx : 0, 'nom', e.currentTarget.innerText)}
                            className="font-bold outline-none cursor-text"
                          >
                            {sk.nom}
                          </span>
                          <div className="flex items-center space-x-0.5 shrink-0" style={{ color: accentColor }}>
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-3 h-3 ${s <= (level > 5 ? Math.round(level / 2) : level) ? 'fill-current' : 'opacity-25'}`}
                              />
                            ))}
                          </div>
                        </div>
                        {sk.listSousCompetences && sk.listSousCompetences.length > 0 && (
                          <div className="pl-2 space-y-0.5 border-l border-slate-200 dark:border-slate-700">
                            {sk.listSousCompetences.map((sub, sIdx) => (
                              <div key={sub.id || sIdx} className="flex items-center justify-between text-[0.85em] opacity-80">
                                <span>{sub.nom}</span>
                                {sub.note !== undefined && (
                                  <div className="flex items-center space-x-0.5" style={{ color: accentColor }}>
                                    {[1, 2, 3, 4, 5].map((s) => (
                                      <Star
                                        key={s}
                                        className={`w-2.5 h-2.5 ${s <= sub.note! ? 'fill-current' : 'opacity-20'}`}
                                      />
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            }

            if (effectiveSkillsMode === 'progress') {
              return (
                <div className="space-y-2">
                  {itemsList.map((sk) => {
                    const idx = rawItems.findIndex(i => i.id === sk.id || i === sk);
                    const levelPercent = Math.min(100, Math.max(20, (sk.niveau || 3) * 10));
                    return (
                      <div key={sk.id || idx} className="space-y-1">
                        <div className="flex justify-between font-bold">
                          <span
                            contentEditable={Boolean(onUpdateSection)}
                            suppressContentEditableWarning
                            onBlur={(e) => updateSkillItem(idx >= 0 ? idx : 0, 'nom', e.currentTarget.innerText)}
                            className="outline-none cursor-text"
                          >
                            {sk.nom}
                          </span>
                          <span className="opacity-70 text-[0.85em]">{levelPercent}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${levelPercent}%`, backgroundColor: accentColor }}
                          />
                        </div>
                        {sk.listSousCompetences && sk.listSousCompetences.length > 0 && (
                          <div className="pl-2 pt-0.5 space-y-1">
                            {sk.listSousCompetences.map((sub, sIdx) => {
                              const subPercent = sub.note ? Math.min(100, sub.note * 20) : null;
                              return (
                                <div key={sub.id || sIdx} className="space-y-0.5">
                                  <div className="flex justify-between text-[0.8em] opacity-80">
                                    <span>{sub.nom}</span>
                                    {subPercent !== null && <span>{subPercent}%</span>}
                                  </div>
                                  {subPercent !== null && (
                                    <div className="w-full h-1 bg-slate-200/60 dark:bg-slate-700/60 rounded-full overflow-hidden">
                                      <div
                                        className="h-full rounded-full"
                                        style={{ width: `${subPercent}%`, backgroundColor: accentColor, opacity: 0.8 }}
                                      />
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            }

            if (effectiveSkillsMode === 'badges-multicolor') {
              return (
                <div className="flex flex-wrap gap-1.5">
                  {itemsList.map((sk) => {
                    const idx = rawItems.findIndex(i => i.id === sk.id || i === sk);
                    return (
                      <span
                        key={sk.id || idx}
                        className="px-2.5 py-1 rounded-md font-bold text-white shadow-2xs"
                        style={{ backgroundColor: idx % 2 === 0 ? accentColor : (secondaryAccentColor && secondaryAccentColor !== '#FFFFFF' ? secondaryAccentColor : '#1E293B') }}
                      >
                        <span
                          contentEditable={Boolean(onUpdateSection)}
                          suppressContentEditableWarning
                          onBlur={(e) => updateSkillItem(idx >= 0 ? idx : 0, 'nom', e.currentTarget.innerText)}
                          className="outline-none cursor-text"
                        >
                          {sk.nom}
                        </span>
                        {sk.listSousCompetences && sk.listSousCompetences.length > 0 && (
                          <span className="text-[0.8em] opacity-90 font-normal ml-1">
                            ({sk.listSousCompetences.map(formatSubWithNote).join(', ')})
                          </span>
                        )}
                      </span>
                    );
                  })}
                </div>
              );
            }

            if (effectiveSkillsMode === 'circular-progress') {
              return (
                <div className="grid grid-cols-2 gap-2">
                  {itemsList.map((sk) => {
                    const idx = rawItems.findIndex(i => i.id === sk.id || i === sk);
                    const levelPercent = Math.min(100, Math.max(20, (sk.niveau || 3) * 10));
                    const radius = 14;
                    const circumference = 2 * Math.PI * radius;
                    const strokeDashoffset = circumference - (levelPercent / 100) * circumference;
                    return (
                      <div key={sk.id || idx} className="flex items-center gap-2 p-1 bg-black/5 dark:bg-white/5 rounded-xl">
                        <div className="relative w-9 h-9 shrink-0 flex items-center justify-center">
                          <svg className="w-9 h-9 transform -rotate-90">
                            <circle cx="18" cy="18" r={radius} stroke="currentColor" strokeWidth="3" className="opacity-20" fill="transparent" />
                            <circle
                              cx="18" cy="18" r={radius}
                              stroke={accentColor} strokeWidth="3"
                              strokeDasharray={circumference}
                              strokeDashoffset={strokeDashoffset}
                              strokeLinecap="round"
                              fill="transparent"
                            />
                          </svg>
                          <span className="absolute text-[0.75em] font-black">{levelPercent}%</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <span
                            contentEditable={Boolean(onUpdateSection)}
                            suppressContentEditableWarning
                            onBlur={(e) => updateSkillItem(idx >= 0 ? idx : 0, 'nom', e.currentTarget.innerText)}
                            className="font-bold text-[0.9em] leading-tight block truncate outline-none cursor-text"
                          >
                            {sk.nom}
                          </span>
                          {sk.listSousCompetences && sk.listSousCompetences.length > 0 && (
                            <div className="text-[0.75em] opacity-75 truncate font-normal">
                              {sk.listSousCompetences.map(formatSubWithNote).join(', ')}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            }

            // Default list style
            return (
              <div className="space-y-1 opacity-90">
                {itemsList.map((sk) => {
                  const idx = rawItems.findIndex(i => i.id === sk.id || i === sk);
                  return (
                    <div key={sk.id || idx} className="font-semibold flex items-start gap-1.5">
                      <span className="mt-0.5" style={{ color: accentColor }}>{getBulletPrefix(idx >= 0 ? idx : 0)}</span>
                      <div className="flex-1">
                        <span
                          contentEditable={Boolean(onUpdateSection)}
                          suppressContentEditableWarning
                          onBlur={(e) => updateSkillItem(idx >= 0 ? idx : 0, 'nom', e.currentTarget.innerText)}
                          className="outline-none cursor-text"
                        >
                          {sk.nom}
                        </span>
                        {sk.listSousCompetences && sk.listSousCompetences.length > 0 && (
                          <div className="text-[0.8em] opacity-75 font-normal pl-2 border-l border-slate-300 dark:border-slate-700 mt-0.5">
                            {sk.listSousCompetences.map(formatSubWithNote).join(' • ')}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          };

          // Check if any items have a subtitle
          const hasSubtitles = rawItems.some(it => it.sousTitre && it.sousTitre.trim().length > 0);

          if (!hasSubtitles) {
            return renderSkillItemList(rawItems);
          }

          // Group items by subtitle
          const groupsMap = new Map<string, CompetenceItem[]>();
          rawItems.forEach(it => {
            const groupKey = it.sousTitre && it.sousTitre.trim().length > 0 ? it.sousTitre.trim() : '';
            if (!groupsMap.has(groupKey)) {
              groupsMap.set(groupKey, []);
            }
            groupsMap.get(groupKey)!.push(it);
          });

          return (
            <div className="space-y-3">
              {Array.from(groupsMap.entries()).map(([subTitleKey, groupedSkills], gIdx) => (
                <div key={subTitleKey || gIdx} className="space-y-1.5">
                  {subTitleKey && (
                    <div className="flex items-center gap-2 pt-1 first:pt-0">
                      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: accentColor }} />
                      <span 
                        className="text-[0.85em] font-extrabold uppercase tracking-wider opacity-90"
                        style={{ color: accentColor }}
                      >
                        {subTitleKey}
                      </span>
                      <div className="flex-1 h-[1px] opacity-20" style={{ backgroundColor: accentColor }} />
                    </div>
                  )}
                  {renderSkillItemList(groupedSkills)}
                </div>
              ))}
            </div>
          );
        })()}

        {/* LANGUES */}
        {section.type === 'langues' && (
          <div className="space-y-1.5">
            {(section.contenu as LangueItem[])?.map((l, idx) => (
              <div key={l.id || idx} className="flex justify-between items-center border-b border-slate-100/40 pb-1 last:border-0">
                <span
                  contentEditable={Boolean(onUpdateSection)}
                  suppressContentEditableWarning
                  onBlur={(e) => updateLangueItem(idx, 'langue', e.currentTarget.innerText)}
                  className="font-extrabold outline-none cursor-text"
                >
                  {l.langue}
                </span>
                <span
                  contentEditable={Boolean(onUpdateSection)}
                  suppressContentEditableWarning
                  onBlur={(e) => updateLangueItem(idx, 'niveau', e.currentTarget.innerText)}
                  className="italic opacity-80 outline-none cursor-text"
                >
                  {l.niveau}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* PROJETS & RÉALISATIONS */}
        {section.type === 'projets' && (
          <div className="space-y-3">
            {Array.isArray(section.contenu) && (section.contenu as any[]).map((p, idx) => (
              <div key={p.id || idx} className="space-y-1 border-b border-slate-100/30 pb-2 last:border-0">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-[0.95em]">{p.titre}</span>
                    {p.sousTitre && <span className="opacity-75 text-[0.85em]">({p.sousTitre})</span>}
                  </div>
                  {(p.dateDebut || p.dateFin) && (
                    <span className="text-[0.8em] opacity-75 font-mono">
                      {p.dateDebut} {p.dateFin ? `– ${p.dateFin}` : ''}
                    </span>
                  )}
                </div>
                {p.technologies && (
                  <div className="flex flex-wrap gap-1 my-0.5">
                    {p.technologies.split(/[,•|]/).map((tech: string, tIdx: number) => tech.trim() && (
                      <span key={tIdx} className="text-[0.75em] px-1.5 py-0.5 rounded font-mono font-bold" style={{ backgroundColor: secondaryAccentColor + '44', color: accentColor }}>
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                )}
                {p.lien && (
                  <div className="text-[0.8em] font-mono opacity-80" style={{ color: accentColor }}>
                    🔗 {p.lien}
                  </div>
                )}
                {p.description && (
                  <p className="text-[0.88em] opacity-90 whitespace-pre-line leading-relaxed">{p.description}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* CERTIFICATIONS */}
        {section.type === 'certifications' && (
          <div className="space-y-2">
            {Array.isArray(section.contenu) && (section.contenu as any[]).map((c, idx) => (
              <div key={c.id || idx} className="flex items-start justify-between gap-2 border-b border-slate-100/30 pb-1.5 last:border-0">
                <div>
                  <div className="font-extrabold text-[0.9em]">{c.nom}</div>
                  <div className="text-[0.8em] opacity-80">{c.organisme} {c.idCertification ? `• ID: ${c.idCertification}` : ''}</div>
                </div>
                {(c.annee || c.dateObtention) && (
                  <span className="text-[0.8em] opacity-75 font-mono shrink-0">
                    {c.annee || c.dateObtention}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* CENTRES D'INTÉRÊT / HOBBIES */}
        {section.type === 'interets' && (
          <div className="flex flex-wrap gap-1.5">
            {Array.isArray(section.contenu) ? (
              (section.contenu as any[]).map((it, idx) => (
                <span
                  key={it.id || idx}
                  className="px-2.5 py-1 rounded-full text-[0.85em] font-bold border inline-flex items-center gap-1"
                  style={{ backgroundColor: secondaryAccentColor + '44', borderColor: accentColor + '44', color: textColor }}
                >
                  {it.icone && <span>{it.icone}</span>}
                  <span>{typeof it === 'string' ? it : it.nom}</span>
                </span>
              ))
            ) : (
              <div className="text-[0.9em] opacity-90">{String(section.contenu || '')}</div>
            )}
          </div>
        )}

        {/* RÉFÉRENCES PROFESSIONNELLES */}
        {section.type === 'references' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {Array.isArray(section.contenu) && (section.contenu as any[]).map((ref, idx) => (
              <div key={ref.id || idx} className="p-2 rounded-xl border border-slate-200/60 dark:border-slate-700/60 space-y-0.5" style={{ backgroundColor: secondaryAccentColor + '22' }}>
                <div className="font-extrabold text-[0.9em]">{ref.nomComplet}</div>
                <div className="text-[0.8em] opacity-80">{ref.poste} • {ref.entreprise}</div>
                {ref.email && <div className="text-[0.75em] opacity-75 font-mono">✉️ {ref.email}</div>}
                {ref.telephone && <div className="text-[0.75em] opacity-75 font-mono">📞 {ref.telephone}</div>}
              </div>
            ))}
          </div>
        )}

        {/* PERSONNALISÉE / LOISIRS */}
        {section.type === 'personnalisee' && (
          <div
            contentEditable={Boolean(onUpdateSection)}
            suppressContentEditableWarning
            onBlur={(e) => onUpdateSection?.({ ...section, contenu: { ...(section.contenu || {}), texteLibre: e.currentTarget.innerText } })}
            className="whitespace-pre-line opacity-90 outline-none cursor-text"
          >
            {(section.contenu as PersonnaliseeContenu)?.texteLibre}
          </div>
        )}
      </div>
    </div>
    </div>
  );
};
