import React, { useRef, useState, useLayoutEffect, useEffect } from 'react';
import { CV, CVTemplate, Section, ProfilContenu } from '../types';
import { SectionSlot } from './SectionSlot';
import { FONT_OPTIONS } from '../data/templates';
import { getPresetForTemplate } from '../data/templatePresets';
import { getBackgroundStyle } from '../utils/backgroundHelpers';
import { getTranslation } from '../i18n/translations';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDroppable
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface UnifiedCVCanvasProps {
  id?: string;
  cv: CV;
  template: CVTemplate;
  isReorderActive?: boolean;
  onSectionsReorder?: (newSections: Section[]) => void;
  onUpdateSectionZone?: (sectionId: string, newZone: 'gauche' | 'droite' | 'principale') => void;
  onUpdateCV?: (updated: Partial<CV>) => void;
  watermarkContent?: React.ReactNode;
  interactiveToolbar?: React.ReactNode;
}

// Draggable Wrapper Component for Section Slot inside preview
const SortablePreviewSection: React.FC<{
  section: Section;
  isSidebar: boolean;
  accentColor: string;
  secondaryAccentColor: string;
  textColor: string;
  headingColor: string;
  headerStyle: any;
  skillsDisplayMode: any;
  experienceDatesAlignment: any;
  bulletStyle: any;
  titleFontSizePt?: number;
  titleCase?: any;
  titleAlign?: any;
  fontCss: string;
  dynamicTextStyle: React.CSSProperties;
  isReorderActive: boolean;
  selectedSectionId?: string | null;
  onSelectSection?: (sectionId: string) => void;
  onUpdateSection?: (updatedSection: Section) => void;
  onUpdateSectionStyle?: (sectionId: string, stylePatch: Partial<any>) => void;
}> = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: props.section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`transition-shadow ${isDragging ? 'z-40 ring-4 ring-blue-500/80 rounded-2xl shadow-2xl bg-blue-50/20' : ''}`}
    >
      <SectionSlot
        {...props}
        isSelected={props.selectedSectionId === props.section.id}
        onSelect={props.onSelectSection}
        onUpdateSection={props.onUpdateSection}
        onUpdateSectionStyle={props.onUpdateSectionStyle}
        isReorderActive={props.isReorderActive}
        dragHandleProps={props.isReorderActive ? { ...attributes, ...listeners } : undefined}
      />
    </div>
  );
};

// Droppable Column Wrapper Component for Cross-Column DnD
const DroppableZone: React.FC<{
  id: string;
  zoneName: 'gauche' | 'droite' | 'principale';
  sectionsList: Section[];
  isSidebar: boolean;
  isReorderActive: boolean;
  sectionGapPx: number;
  [key: string]: any;
}> = ({ id, zoneName, sectionsList, isSidebar, isReorderActive, sectionGapPx, ...props }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <SortableContext items={sectionsList.map(s => s.id)} strategy={verticalListSortingStrategy}>
      <div
        ref={setNodeRef}
        className={`flex flex-col transition-all duration-150 min-h-[100px] ${
          isOver && isReorderActive
            ? 'bg-blue-100/70 border-2 border-dashed border-blue-600 rounded-2xl p-3 shadow-inner'
            : ''
        }`}
        style={{ gap: `${sectionGapPx}px` }}
      >
        {sectionsList.map((sec) => (
          <SortablePreviewSection
            key={sec.id}
            section={sec}
            isSidebar={isSidebar}
            isReorderActive={isReorderActive}
            {...props}
          />
        ))}

        {/* Drop target indicator when empty or hovered during reorder mode */}
        {(sectionsList.length === 0 || (isOver && isReorderActive)) && isReorderActive && (
          <div
            className={`border-2 border-dashed p-3 rounded-2xl text-center text-xs font-black transition-all ${
              isOver
                ? 'border-blue-600 bg-blue-500 text-white shadow-lg scale-[1.02]'
                : 'border-blue-400/80 bg-blue-50/60 text-blue-700 hover:bg-blue-100/80'
            }`}
          >
            <span>
              {isOver ? 'Relâchez pour déposer dans la' : 'Déposez une section ici ('} Zone{' '}
              {zoneName === 'gauche' ? 'Gauche' : zoneName === 'droite' ? 'Droite' : 'Principale'}
              {!isOver && ')'}
            </span>
          </div>
        )}
      </div>
    </SortableContext>
  );
};

// COMPACTNESS LEVEL PRESETS (Default font 6pt, titles 8pt, line height 0.8)
const COMPACTNESS_LEVELS = [
  { fontSize: 6.00, lineHeight: 0.80, sectionGap: 6, itemGap: 2.5, padding: 8, titleSize: 8.00 },
  { fontSize: 5.50, lineHeight: 0.75, sectionGap: 5, itemGap: 2.0, padding: 6, titleSize: 7.50 },
  { fontSize: 5.00, lineHeight: 0.72, sectionGap: 4, itemGap: 1.8, padding: 5, titleSize: 7.00 },
  { fontSize: 4.50, lineHeight: 0.70, sectionGap: 3, itemGap: 1.5, padding: 4, titleSize: 6.50 }
];

export const UnifiedCVCanvas: React.FC<UnifiedCVCanvasProps> = ({
  id = 'cv-preview-container',
  cv,
  template,
  isReorderActive = false,
  onSectionsReorder,
  onUpdateSectionZone,
  onUpdateCV,
  watermarkContent,
  interactiveToolbar
}) => {
  // Layout setup
  const templateTheme = template?.themeConfig || {};
  const preset = getPresetForTemplate(cv.templateId || template?.id || 'modele-1', cv.langue || 'fr');

  const isTwoColumn = (cv.nombreColonnes ?? preset?.nombreColonnes ?? (template?.layoutFamily === 'single-column' ? 1 : 2)) === 2;
  const sidebarPosition = cv.positionSidebar || preset?.positionSidebar || (template?.layoutFamily === 'two-column-right' ? 'droite' : 'gauche');
  const leftColWidth = cv.largeurColonneGauche || preset?.largeurColonneGauche || templateTheme.defaultLeftWidth || 34; // %
  const rightColWidth = 100 - leftColWidth;

  // Colors & Backgrounds
  const primaryAccent = cv.couleurAccent || preset?.couleurAccent || templateTheme.primaryColor || '#006666';
  const secondaryAccent = cv.couleurAccentSecondaire || preset?.couleurAccentSecondaire || templateTheme.secondaryColor || '#E2E8F0';
  const mainTextColor = cv.couleurTexte || preset?.couleurTexte || templateTheme.textColor || '#1E293B';
  const sidebarTextColor = cv.couleurTexteSidebar || preset?.couleurTexteSidebar || templateTheme.sidebarTextColor || '#FFFFFF';
  const mainHeadingColor = cv.couleurTitreSection || preset?.couleurTitreSection || templateTheme.headingColor || primaryAccent;
  const sidebarHeadingColor = cv.couleurTitreSectionSidebar || preset?.couleurTitreSectionSidebar || templateTheme.sidebarHeadingColor || primaryAccent;

  const mainBgStyle = getBackgroundStyle({
    backgroundType: cv.backgroundType,
    colorSolid: cv.couleurFond || preset?.couleurFond,
    opacity: cv.backgroundOpacity,
    colorStart: cv.backgroundColorStart,
    colorEnd: cv.backgroundColorEnd,
    patternName: cv.backgroundPattern,
    imageUrl: cv.backgroundImage,
    fallbackColor: cv.couleurFond || preset?.couleurFond || templateTheme.backgroundColor || '#FFFFFF'
  });

  const sidebarBgStyle = getBackgroundStyle({
    backgroundType: cv.sidebarBackgroundType,
    colorSolid: cv.couleurFondSidebar || preset?.couleurFondSidebar,
    opacity: cv.sidebarBackgroundOpacity,
    colorStart: cv.sidebarBackgroundColorStart,
    colorEnd: cv.sidebarBackgroundColorEnd,
    patternName: cv.sidebarBackgroundPattern,
    imageUrl: cv.sidebarBackgroundImage,
    fallbackColor: cv.couleurFondSidebar || preset?.couleurFondSidebar || templateTheme.sidebarBackgroundColor || primaryAccent
  });

  // Styles & Typography
  const headerStyle = cv.styleEnTete || preset?.styleEnTete || templateTheme.headerStyle || 'banner';
  const sectionHeaderStyle = cv.styleEnTeteSection || preset?.styleEnTeteSection || templateTheme.sectionHeaderStyle || 'underline';
  const skillsDisplayMode = cv.styleCompetences || preset?.styleCompetences || templateTheme.skillsDisplayMode || 'grid';
  const datesAlignment = cv.alignementDatesExperience || preset?.alignementDatesExperience || templateTheme.experienceDatesAlignment || 'left';

  const fontObj = FONT_OPTIONS.find(f => f.id === cv.police) || FONT_OPTIONS.find(f => f.id === template.defaultFont) || FONT_OPTIONS[0];
  const fontCss = fontObj ? fontObj.family : 'Inter, sans-serif';

  // Compactness & Scaling State
  const [compactnessLevel, setCompactnessLevel] = useState<number>(0);
  const cvInnerRef = useRef<HTMLDivElement>(null);
  const [scaleFactor, setScaleFactor] = useState<number>(1);
  const [measuredHeightPx, setMeasuredHeightPx] = useState<number>(0);

  // Default to 1 page strict mode unless explicitly requested to be 2 pages
  const is2Pages = cv.pageCibleMode === '2_pages';
  const isStrict1Page = !is2Pages;

  const activeLevel = COMPACTNESS_LEVELS[compactnessLevel] || COMPACTNESS_LEVELS[0];

  const fontSizePx = cv.taillePoliceValeur ?? activeLevel.fontSize;
  const lineHeightVal = cv.hauteurLigneValeur ?? activeLevel.lineHeight;
  const sectionGapPx = cv.espacementSectionsPx ?? activeLevel.sectionGap;
  const titleFontSizePt = cv.tailleTitreSectionValeur ?? activeLevel.titleSize;
  const pagePaddingPx = cv.margeGlobalePage ?? activeLevel.padding;

  const dynamicTextStyle: React.CSSProperties = {
    fontSize: `${fontSizePx}pt`,
    lineHeight: lineHeightVal
  };

  const bulletStyle = cv.stylePucesListes || 'disc';
  const titleCase = cv.casseTitreSection || 'uppercase';
  const titleAlign = cv.alignementTitreSection || 'left';

  // Adaptive Auto-Compacting Layout Effect
  useLayoutEffect(() => {
    if (!cvInnerRef.current) return;

    const SINGLE_PAGE_PX = 1122; // Standard A4 page height @ 96 DPI
    const currentHeight = cvInnerRef.current.scrollHeight;
    setMeasuredHeightPx(currentHeight);

    let maxTargetPx = SINGLE_PAGE_PX;
    if (is2Pages) {
      maxTargetPx = SINGLE_PAGE_PX * 2;
    }

    if (currentHeight > maxTargetPx) {
      if (compactnessLevel < COMPACTNESS_LEVELS.length - 1) {
        // Increment compactness level
        setCompactnessLevel(prev => prev + 1);
        setScaleFactor(1);
      } else {
        // At Level 3 Floor
        if (is2Pages) {
          setScaleFactor(1);
        } else {
          // In 1_page, compact or auto mode: strictly scale to fit 1 page
          const computedScale = Math.max(0.65, maxTargetPx / currentHeight);
          setScaleFactor(computedScale);
        }
      }
    } else {
      // Content fits within budget
      if (compactnessLevel > 0 && currentHeight < maxTargetPx * 0.82) {
        setCompactnessLevel(prev => Math.max(0, prev - 1));
      }
      setScaleFactor(1);
    }
  }, [cv, isTwoColumn, leftColWidth, isStrict1Page, is2Pages, compactnessLevel]);

  // Section Selection & Quick Styling State
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

  const handleUpdateSection = (updatedSec: Section) => {
    if (!onUpdateCV) return;
    const newSections = (cv.sections || []).map(s => s.id === updatedSec.id ? updatedSec : s);
    onUpdateCV({ sections: newSections });
  };

  const handleUpdateSectionStyle = (secId: string, stylePatch: Partial<any>) => {
    if (!onUpdateCV) return;
    const newSections = (cv.sections || []).map(s => {
      if (s.id === secId) {
        return {
          ...s,
          styleSection: {
            ...(s.styleSection || {}),
            ...stylePatch
          }
        };
      }
      return s;
    });
    onUpdateCV({ sections: newSections });
  };

  // Section grouping by zones
  const leftZoneSections: Section[] = [];
  const rightZoneSections: Section[] = [];
  const mainZoneSections: Section[] = [];

  cv.sections.forEach(sec => {
    if (!sec.visible) return;
    const targetZone = sec.colonne || 'principale';

    if (!isTwoColumn) {
      mainZoneSections.push(sec);
    } else {
      if (targetZone === 'gauche') {
        leftZoneSections.push(sec);
      } else if (targetZone === 'droite') {
        rightZoneSections.push(sec);
      } else {
        if (sec.type === 'experience' || sec.type === 'formation') {
          rightZoneSections.push(sec);
        } else {
          leftZoneSections.push(sec);
        }
      }
    }
  });

  // dnd sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } })
  );

  // Live Cross-Column Drag Over Handler
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    let targetZone: 'gauche' | 'droite' | 'principale' | null = null;
    if (over.id === 'zone-droppable-gauche') targetZone = 'gauche';
    else if (over.id === 'zone-droppable-droite') targetZone = 'droite';
    else if (over.id === 'zone-droppable-principale') targetZone = 'principale';
    else {
      const overSec = cv.sections.find(s => s.id === over.id);
      if (overSec) {
        targetZone =
          overSec.colonne ||
          (isTwoColumn
            ? overSec.type === 'experience' || overSec.type === 'formation'
              ? 'droite'
              : 'gauche'
            : 'principale');
      }
    }

    if (targetZone && onUpdateSectionZone) {
      const activeSec = cv.sections.find(s => s.id === active.id);
      if (activeSec && activeSec.colonne !== targetZone) {
        onUpdateSectionZone(activeSec.id, targetZone);
      }
    }
  };

  // Cross-Column Drag End Handler
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || !onSectionsReorder) return;

    let targetZone: 'gauche' | 'droite' | 'principale' = 'principale';
    if (over.id === 'zone-droppable-gauche') targetZone = 'gauche';
    else if (over.id === 'zone-droppable-droite') targetZone = 'droite';
    else if (over.id === 'zone-droppable-principale') targetZone = 'principale';
    else {
      const overSec = cv.sections.find(s => s.id === over.id);
      if (overSec) {
        targetZone =
          overSec.colonne ||
          (isTwoColumn
            ? overSec.type === 'experience' || overSec.type === 'formation'
              ? 'droite'
              : 'gauche'
            : 'principale');
      }
    }

    const updated = cv.sections.map(s => {
      if (s.id === active.id) {
        return { ...s, colonne: targetZone };
      }
      return s;
    });

    const activeIdx = updated.findIndex(s => s.id === active.id);
    const overIdx = updated.findIndex(s => s.id === over.id);

    if (activeIdx !== -1 && overIdx !== -1 && activeIdx !== overIdx) {
      const [moved] = updated.splice(activeIdx, 1);
      updated.splice(overIdx, 0, moved);
    }

    updated.forEach((s, idx) => {
      s.ordre = idx + 1;
    });

    onSectionsReorder(updated);
  };

  // Candidate profil info
  const lang = cv.langue || 'fr';
  const profilSection = cv.sections.find(s => s.type === 'profil');
  const profilContenu = (profilSection?.contenu || {}) as ProfilContenu;
  const nomComplet = profilContenu.nomComplet || getTranslation(lang, 'firstNameLastName');
  const titrePro = profilContenu.titreProfessionnel || getTranslation(lang, 'jobTitlePlaceholder');

  let displayedMainTitle = nomComplet;
  let displayedSubTitle = titrePro;

  if (cv.grandTitreMode === 'poste') {
    displayedMainTitle = titrePro;
    displayedSubTitle = nomComplet;
  } else if (cv.grandTitreMode === 'custom') {
    displayedMainTitle = cv.grandTitreTexte || nomComplet;
    displayedSubTitle = `${nomComplet} • ${titrePro}`;
  }

  const showPhoto = cv.afficherPhoto !== false && Boolean(cv.photoUrl);
  const rawShape = cv.formePhoto || cv.photoForme || templateTheme.photoFrameStyle || 'ronde';
  const photoSize = cv.photoTaille ?? (isStrict1Page ? 64 : 96);
  const photoPos = cv.photoPosition || templateTheme.photoPosition || (headerStyle === 'sidebar-top' ? 'in-sidebar' : 'in-header');
  const showHeaderPhoto = showPhoto && photoPos === 'in-header';
  const showSidebarPhoto = showPhoto && photoPos === 'in-sidebar';
  const decorativeShape = templateTheme.decorativeShapes || 'none';

  // Photo mouse & touch drag handler
  const isDraggingPhotoRef = useRef(false);

  const handlePhotoMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (!cvInnerRef.current || !onUpdateCV) return;
    e.stopPropagation();
    isDraggingPhotoRef.current = true;

    const clientX = 'touches' in e ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY;

    const rect = cvInnerRef.current.getBoundingClientRect();
    const updatePosition = (moveX: number, moveY: number) => {
      const relX = Math.min(92, Math.max(0, Math.round(((moveX - rect.left) / rect.width) * 100)));
      const relY = Math.min(95, Math.max(0, Math.round(((moveY - rect.top) / rect.height) * 100)));
      onUpdateCV({ photoX: relX, photoY: relY, photoPosition: 'free' });
    };

    updatePosition(clientX, clientY);

    const onMove = (moveEvent: MouseEvent | TouchEvent) => {
      if (!isDraggingPhotoRef.current) return;
      const mX = 'touches' in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const mY = 'touches' in moveEvent ? moveEvent.touches[0].clientY : moveEvent.clientY;
      updatePosition(mX, mY);
    };

    const onEnd = () => {
      isDraggingPhotoRef.current = false;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchmove', onMove);
    window.addEventListener('touchend', onEnd);
  };

  let photoShapeClass = 'rounded-full';
  let photoInlineStyle: React.CSSProperties = {};
  if (rawShape === 'carree' || rawShape === 'square') {
    photoShapeClass = 'rounded-none';
  } else if (rawShape === 'arrondie' || rawShape === 'rounded') {
    photoShapeClass = 'rounded-2xl';
  } else if (rawShape === 'arche' || rawShape === 'arch') {
    photoShapeClass = 'rounded-t-full rounded-b-md';
  } else if (rawShape === 'hexagone') {
    photoShapeClass = 'rounded-none';
    photoInlineStyle = { clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' };
  } else if (rawShape === 'galet' || rawShape === 'squircle') {
    photoShapeClass = 'rounded-[30%_70%_70%_30%_/_30%_30%_70%_70%]';
  } else {
    photoShapeClass = 'rounded-full';
  }

  const customPhotoStyle: React.CSSProperties = {
    width: `${photoSize}px`,
    height: (rawShape === 'galet' || rawShape === 'squircle') ? `${photoSize * 1.25}px` : `${photoSize}px`,
    borderColor: cv.photoBordureCouleur || primaryAccent || '#FFFFFF',
    borderWidth: cv.photoBordureEpaisseur !== undefined ? `${cv.photoBordureEpaisseur}px` : '2px',
    borderStyle: 'solid',
    borderRadius: cv.photoRayon !== undefined ? `${cv.photoRayon}px` : undefined,
    ...photoInlineStyle,
    ...(cv.cadrePhotoRing === 'double-ring' ? {
      outline: `3px solid ${primaryAccent}`,
      outlineOffset: '3px',
      boxShadow: `0 0 0 5px ${secondaryAccent || '#FFFFFF'}`
    } : cv.cadrePhotoRing === 'gold-ring' ? {
      outline: '3px solid #D97706',
      outlineOffset: '3px'
    } : {})
  };

  // Render Top Header
  const renderTopHeader = () => {
    const customHeaderHeight = cv.hauteurEnTetePx ? `${cv.hauteurEnTetePx}px` : undefined;
    const profileBgColor = cv.couleurFondProfil || profilSection?.styleSection?.couleurFond || primaryAccent;
    const profileTextColor = profilSection?.styleSection?.couleurTexte || '#FFFFFF';

    if (headerStyle === 'diagonal-split') {
      return (
        <div
          className="w-full relative overflow-hidden px-4 py-2 sm:px-5 sm:py-2.5 border-b flex justify-between items-center shrink-0 shadow-xs"
          style={{ backgroundColor: profileBgColor, color: profileTextColor, minHeight: customHeaderHeight || '60px' }}
        >
          <div
            className="absolute -right-8 -bottom-10 w-1/2 h-36 transform -skew-x-12 opacity-80 pointer-events-none"
            style={{ backgroundColor: secondaryAccent && secondaryAccent !== '#FFFFFF' ? secondaryAccent : '#0F172A' }}
          />
          <div className="relative z-10 space-y-0.5">
            <h1 className="text-base sm:text-lg font-black uppercase tracking-tight leading-tight">{displayedMainTitle}</h1>
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider opacity-90">{displayedSubTitle}</p>
          </div>
          {showHeaderPhoto && (
            <div
              onMouseDown={handlePhotoMouseDown}
              onTouchStart={handlePhotoMouseDown}
              className={`relative z-10 overflow-hidden border-2 border-white shadow-md cursor-grab active:cursor-grabbing hover:scale-105 transition-transform ${photoShapeClass}`}
              style={{ width: `${photoSize}px`, height: (rawShape === 'galet' || rawShape === 'squircle') ? `${photoSize * 1.25}px` : `${photoSize}px`, ...photoInlineStyle }}
              title="Glissez à la souris pour déplacer la photo n'importe où !"
            >
              <img src={cv.photoUrl} alt="Portrait" className={`w-full h-full object-cover pointer-events-none ${photoShapeClass}`} />
            </div>
          )}
        </div>
      );
    }

    if (headerStyle === 'banner' || headerStyle === 'modern-split') {
      return (
        <div
          className="w-full relative overflow-hidden flex items-center px-3.5 py-2 sm:px-4 sm:py-2.5 border-b transition-all shrink-0"
          style={{ backgroundColor: profileBgColor, color: profileTextColor, minHeight: customHeaderHeight || '60px' }}
        >
          {decorativeShape === 'circle-photo' && (
            <div
              className="absolute -top-8 -right-8 rounded-full opacity-80 pointer-events-none"
              style={{
                width: `${photoSize * 1.8}px`,
                height: `${photoSize * 1.8}px`,
                backgroundColor: secondaryAccent && secondaryAccent !== '#FFFFFF' ? secondaryAccent : '#003366'
              }}
            />
          )}
          {showHeaderPhoto && (
            <div className="shrink-0 mr-3 relative z-10">
              <div
                onMouseDown={handlePhotoMouseDown}
                onTouchStart={handlePhotoMouseDown}
                className={`overflow-hidden border-2 bg-white/20 shadow-md cursor-grab active:cursor-grabbing hover:scale-105 transition-transform ${photoShapeClass}`}
                style={{
                  width: `${photoSize}px`,
                  height: (rawShape === 'galet' || rawShape === 'squircle') ? `${photoSize * 1.25}px` : `${photoSize}px`,
                  borderColor: cv.photoBordureCouleur || '#FFFFFF',
                  borderWidth: cv.photoBordureEpaisseur ? `${cv.photoBordureEpaisseur}px` : undefined,
                  ...photoInlineStyle
                }}
                title="Glissez à la souris pour déplacer la photo n'importe où !"
              >
                <img src={cv.photoUrl} alt="Portrait" className={`w-full h-full object-cover pointer-events-none ${photoShapeClass}`} />
              </div>
            </div>
          )}
          <div className="flex-1 space-y-0.5 relative z-10">
            <h1 className="text-base sm:text-lg font-black uppercase tracking-tight leading-tight">
              {displayedMainTitle}
            </h1>
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider opacity-90">
              {displayedSubTitle}
            </p>
          </div>
        </div>
      );
    }

    if (headerStyle === 'arch') {
      return (
        <div
          className="w-full px-3 py-2 text-center bg-slate-900 text-white rounded-b-xl shadow-xs mb-1 shrink-0 flex flex-col justify-center items-center"
          style={{ backgroundColor: profileBgColor, color: profileTextColor, minHeight: customHeaderHeight }}
        >
          {showHeaderPhoto && (
            <div className="mx-auto mb-1.5 flex justify-center">
              <div
                onMouseDown={handlePhotoMouseDown}
                onTouchStart={handlePhotoMouseDown}
                className={`overflow-hidden border-2 border-white shadow-md cursor-grab active:cursor-grabbing hover:scale-105 transition-transform ${photoShapeClass}`}
                style={{ width: `${photoSize}px`, height: (rawShape === 'galet' || rawShape === 'squircle') ? `${photoSize * 1.25}px` : `${photoSize}px`, ...photoInlineStyle }}
                title="Glissez à la souris pour déplacer la photo n'importe où !"
              >
                <img src={cv.photoUrl} alt="Portrait" className={`w-full h-full object-cover pointer-events-none ${photoShapeClass}`} />
              </div>
            </div>
          )}
          <h1 className="text-base sm:text-lg font-black uppercase tracking-wide">{displayedMainTitle}</h1>
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest opacity-80 mt-0.5">{displayedSubTitle}</p>
        </div>
      );
    }

    if (headerStyle === 'sidebar-top') {
      return null; // Header info will render directly in the sidebar column
    }

    // Default header
    const defaultBg = cv.couleurFondProfil || profilSection?.styleSection?.couleurFond;
    return (
      <div
        className="w-full px-3.5 py-1.5 sm:px-4 sm:py-2 border-b flex justify-between items-center"
        style={{
          backgroundColor: defaultBg,
          borderColor: secondaryAccent,
          minHeight: customHeaderHeight
        }}
      >
        <div className="space-y-0.5">
          <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight" style={{ color: defaultBg ? profileTextColor : mainHeadingColor }}>
            {displayedMainTitle}
          </h1>
          <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider" style={{ color: defaultBg ? profileTextColor : primaryAccent }}>
            {displayedSubTitle}
          </p>
        </div>
        {showHeaderPhoto && (
          <div
            onMouseDown={handlePhotoMouseDown}
            onTouchStart={handlePhotoMouseDown}
            className={`overflow-hidden border-2 border-slate-200 shadow-xs cursor-grab active:cursor-grabbing hover:scale-105 transition-transform ${photoShapeClass}`}
            style={{ width: `${photoSize}px`, height: (rawShape === 'galet' || rawShape === 'squircle') ? `${photoSize * 1.25}px` : `${photoSize}px`, ...photoInlineStyle }}
            title="Glissez à la souris pour déplacer la photo n'importe où !"
          >
            <img src={cv.photoUrl} alt="Portrait" className={`w-full h-full object-cover pointer-events-none ${photoShapeClass}`} />
          </div>
        )}
      </div>
    );
  };

  // Status Badge Indicators
  const SINGLE_PAGE_PX = 1122;
  const calculatedPages = is2Pages
    ? 2
    : isStrict1Page || measuredHeightPx <= SINGLE_PAGE_PX + 60
    ? 1
    : Math.max(1, Math.ceil((measuredHeightPx * scaleFactor - 60) / SINGLE_PAGE_PX));
  let statusBadgeColor = 'bg-emerald-900 border-emerald-700 text-emerald-100';
  let statusText = getTranslation(lang, 'calibrated1Page');

  if (calculatedPages === 2) {
    statusBadgeColor = 'bg-blue-900 border-blue-700 text-blue-100';
    statusText = getTranslation(lang, 'calibrated2Pages');
  } else if (calculatedPages >= 3) {
    statusBadgeColor = 'bg-amber-900 border-amber-700 text-amber-100';
    statusText = getTranslation(lang, 'contentTooLarge');
  }

  return (
    <DndContext sensors={sensors} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
      <div className="relative w-full overflow-hidden">
        {/* Real-time Page Budget Status Banner */}
        <div className={`mb-2 p-2.5 rounded-xl text-xs font-bold flex flex-wrap items-center justify-between gap-2 shadow-md border print:hidden transition-all ${statusBadgeColor}`}>
          <div className="flex items-center gap-2">
            <span>{statusText}</span>
            {compactnessLevel > 0 && (
              <span className="bg-white/20 px-2 py-0.5 rounded-md text-[10px] font-mono">
                {getTranslation(lang, 'compactLevel')} {compactnessLevel}/3
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold">
            {scaleFactor < 1 && (
              <span className="bg-amber-500 text-slate-950 px-2 py-0.5 rounded-md">
                {getTranslation(lang, 'pageFit1')}: {Math.round(scaleFactor * 100)}%
              </span>
            )}
            <span className="bg-black/30 px-2.5 py-1 rounded-md border border-white/20">
              {calculatedPages} {getTranslation(lang, 'pagesTotal')}
            </span>
          </div>
        </div>

        {/* CANVAS A4 CONTAINER */}
        <div
          id={id}
          ref={cvInnerRef}
          className="bg-white text-slate-900 w-full shadow-2xl rounded-none sm:rounded-lg border border-slate-300 relative select-none flex flex-col overflow-hidden transition-all duration-200"
          style={{
            fontFamily: fontCss,
            ...mainBgStyle,
            color: mainTextColor,
            padding: `${pagePaddingPx}px`,
            boxSizing: 'border-box',
            minHeight: is2Pages ? '2244px' : '1122px',
            height: isStrict1Page ? '1122px' : 'auto',
            maxHeight: isStrict1Page ? '1122px' : undefined,
            transform: scaleFactor < 1 ? `scale(${scaleFactor})` : undefined,
            transformOrigin: 'top center',
          }}
        >
          {watermarkContent}
          {interactiveToolbar}

          {renderTopHeader()}

          {/* FLOATING FREE PHOTO ELEMENT (DRAGGABLE ANYWHERE ON CANVAS WITH MOUSE OR TOUCH) */}
          {showPhoto && photoPos === 'free' && (
            <div
              onMouseDown={handlePhotoMouseDown}
              onTouchStart={handlePhotoMouseDown}
              className={`absolute z-45 overflow-hidden border-2 shadow-2xl cursor-grab active:cursor-grabbing hover:scale-105 transition-transform ${photoShapeClass}`}
              style={{
                left: `${cv.photoX ?? 10}%`,
                top: `${cv.photoY ?? 5}%`,
                width: `${photoSize}px`,
                height: rawShape === 'galet' ? `${photoSize * 1.3}px` : `${photoSize}px`,
                borderColor: cv.photoBordureCouleur || primaryAccent,
                borderWidth: cv.photoBordureEpaisseur !== undefined ? `${cv.photoBordureEpaisseur}px` : '2px',
                borderRadius: cv.photoRayon !== undefined ? `${cv.photoRayon}px` : undefined,
                ...(cv.cadrePhotoRing === 'double-ring' ? {
                  outline: `3px solid ${primaryAccent}`,
                  outlineOffset: '3px',
                  boxShadow: `0 0 0 5px ${secondaryAccent || '#FFFFFF'}`
                } : cv.cadrePhotoRing === 'gold-ring' ? {
                  outline: '3px solid #D97706',
                  outlineOffset: '3px'
                } : {})
              }}
              title={lang === 'en' ? "Drag photo freely anywhere!" : lang === 'ar' ? "اسحب الصورة بحرية إلى أي مكان!" : "Déplacez la photo librement à la souris n'importe où !"}
            >
              <img src={cv.photoUrl} alt="Portrait" className={`w-full h-full object-cover pointer-events-none ${photoShapeClass}`} />
            </div>
          )}

          {/* PAGE BREAK VISUAL INDICATORS AT 1122PX AND 2244PX ONLY IF MULTI-PAGE */}
          {calculatedPages > 1 && (
            <div
              className="absolute left-0 right-0 border-b-2 border-dashed border-red-400 z-30 pointer-events-none opacity-50 print:hidden flex items-center justify-end px-3 text-[9px] font-black uppercase text-red-600 bg-red-50/20"
              style={{ top: '1122px' }}
            >
              {getTranslation(lang, 'endOfPage1')}
            </div>
          )}
          {calculatedPages > 2 && (
            <div
              className="absolute left-0 right-0 border-b-2 border-dashed border-red-400 z-30 pointer-events-none opacity-50 print:hidden flex items-center justify-end px-3 text-[9px] font-black uppercase text-red-600 bg-red-50/20"
              style={{ top: '2244px' }}
            >
              {getTranslation(lang, 'endOfPage2')}
            </div>
          )}

          {/* CANVAS BODY: 1 OR 2 COLUMNS WITH DROPPABLE ZONES */}
          <div className="flex-1 flex flex-col w-full min-h-0 h-full">
            {!isTwoColumn ? (
              /* SINGLE COLUMN LAYOUT */
              <div className="flex-1 px-2.5 py-1.5 sm:px-3 sm:py-2">
                <DroppableZone
                  id="zone-droppable-principale"
                  zoneName="principale"
                  sectionsList={mainZoneSections}
                  isSidebar={false}
                  isReorderActive={isReorderActive}
                  sectionGapPx={sectionGapPx}
                  accentColor={primaryAccent}
                  secondaryAccentColor={secondaryAccent}
                  textColor={mainTextColor}
                  headingColor={mainHeadingColor}
                  headerStyle={sectionHeaderStyle}
                  skillsDisplayMode={skillsDisplayMode}
                  experienceDatesAlignment={datesAlignment}
                  bulletStyle={bulletStyle}
                  titleFontSizePt={titleFontSizePt}
                  titleCase={titleCase}
                  titleAlign={titleAlign}
                  timelineStyle={cv.timelineStyle || 'none'}
                  afficherBadgesIcones={cv.afficherBadgesIcones}
                  fontCss={fontCss}
                  dynamicTextStyle={dynamicTextStyle}
                  selectedSectionId={selectedSectionId}
                  onSelectSection={setSelectedSectionId}
                  onUpdateSection={handleUpdateSection}
                  onUpdateSectionStyle={handleUpdateSectionStyle}
                />
              </div>
            ) : (
              /* TWO COLUMN LAYOUT */
              <div className={`flex-1 flex flex-row w-full min-h-0 h-full ${sidebarPosition === 'droite' ? 'flex-row-reverse' : ''}`}>
                {/* COLUMN 1: SIDEBAR / LATÉRAL */}
                <div
                  className={`px-2 py-1.5 sm:px-2.5 sm:py-2 shrink-0 transition-all border-r border-slate-200/80 relative ${
                    cv.formeSidebarDecor === 'arch-top'
                      ? 'rounded-t-[60px] sm:rounded-t-[90px] shadow-lg mt-1'
                      : cv.formeSidebarDecor === 'wave-cut'
                      ? 'rounded-r-3xl sm:rounded-br-[80px] shadow-md'
                      : cv.formeSidebarDecor === 'diagonal-cut'
                      ? '[clip-path:polygon(0_0,100%_15px,100%_100%,0_100%)]'
                      : cv.formeSidebarDecor === 'card-float'
                      ? 'rounded-2xl shadow-xl my-2 ml-1 border border-slate-200/60'
                      : ''
                  }`}
                  style={{
                    width: `${leftColWidth}%`,
                    ...sidebarBgStyle,
                    color: sidebarTextColor,
                    borderColor: secondaryAccent
                  }}
                >
                  {showSidebarPhoto && (
                    <div className="mb-2 flex justify-center">
                      <div
                        onMouseDown={handlePhotoMouseDown}
                        onTouchStart={handlePhotoMouseDown}
                        className={`overflow-hidden border-2 shadow-md cursor-grab active:cursor-grabbing hover:scale-105 transition-transform ${photoShapeClass}`}
                        style={{
                          width: `${photoSize}px`,
                          height: (rawShape === 'galet' || rawShape === 'squircle') ? `${photoSize * 1.25}px` : `${photoSize}px`,
                          borderColor: cv.photoBordureCouleur || primaryAccent,
                          ...photoInlineStyle,
                          ...(cv.cadrePhotoRing === 'double-ring' ? {
                            outline: `3px solid ${primaryAccent}`,
                            outlineOffset: '3px',
                            boxShadow: `0 0 0 5px ${secondaryAccent || '#FFFFFF'}`
                          } : cv.cadrePhotoRing === 'gold-ring' ? {
                            outline: '3px solid #D97706',
                            outlineOffset: '3px'
                          } : {})
                        }}
                        title="Glissez à la souris pour déplacer la photo n'importe où !"
                      >
                        <img src={cv.photoUrl} alt="Portrait" className={`w-full h-full object-cover pointer-events-none ${photoShapeClass}`} />
                      </div>
                    </div>
                  )}
                  {headerStyle === 'sidebar-top' && (
                    <div className="mb-2 text-center space-y-0.5 pb-1 border-b border-current opacity-90">
                      <h1 className="text-xs font-black uppercase tracking-tight">{displayedMainTitle}</h1>
                      <p className="text-[9px] font-bold uppercase opacity-80">{displayedSubTitle}</p>
                    </div>
                  )}
                  <DroppableZone
                    id="zone-droppable-gauche"
                    zoneName="gauche"
                    sectionsList={leftZoneSections}
                    isSidebar={true}
                    isReorderActive={isReorderActive}
                    sectionGapPx={sectionGapPx}
                    accentColor={primaryAccent}
                    secondaryAccentColor={secondaryAccent}
                    textColor={sidebarTextColor}
                    headingColor={sidebarHeadingColor}
                    headerStyle={sectionHeaderStyle}
                    skillsDisplayMode={skillsDisplayMode}
                    experienceDatesAlignment={datesAlignment}
                    bulletStyle={bulletStyle}
                    titleFontSizePt={titleFontSizePt}
                    titleCase={titleCase}
                    titleAlign={titleAlign}
                    timelineStyle={cv.timelineStyle || 'none'}
                    afficherBadgesIcones={cv.afficherBadgesIcones}
                    fontCss={fontCss}
                    dynamicTextStyle={dynamicTextStyle}
                    selectedSectionId={selectedSectionId}
                    onSelectSection={setSelectedSectionId}
                    onUpdateSection={handleUpdateSection}
                    onUpdateSectionStyle={handleUpdateSectionStyle}
                  />
                </div>

                {/* COLUMN 2: MAIN / PRINCIPALE */}
                <div
                  className="px-2.5 py-1.5 sm:px-3 sm:py-2 flex-1 transition-all"
                  style={{
                    width: `${rightColWidth}%`,
                    ...mainBgStyle,
                    color: mainTextColor
                  }}
                >
                  <DroppableZone
                    id="zone-droppable-droite"
                    zoneName="droite"
                    sectionsList={rightZoneSections}
                    isSidebar={false}
                    isReorderActive={isReorderActive}
                    sectionGapPx={sectionGapPx}
                    accentColor={primaryAccent}
                    secondaryAccentColor={secondaryAccent}
                    textColor={mainTextColor}
                    headingColor={mainHeadingColor}
                    headerStyle={sectionHeaderStyle}
                    skillsDisplayMode={skillsDisplayMode}
                    experienceDatesAlignment={datesAlignment}
                    bulletStyle={bulletStyle}
                    titleFontSizePt={titleFontSizePt}
                    titleCase={titleCase}
                    titleAlign={titleAlign}
                    timelineStyle={cv.timelineStyle || 'none'}
                    afficherBadgesIcones={cv.afficherBadgesIcones}
                    fontCss={fontCss}
                    dynamicTextStyle={dynamicTextStyle}
                    selectedSectionId={selectedSectionId}
                    onSelectSection={setSelectedSectionId}
                    onUpdateSection={handleUpdateSection}
                    onUpdateSectionStyle={handleUpdateSectionStyle}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DndContext>
  );
};
