import React from 'react';
import { CV, Section, CVTemplate } from '../types';
import { CV_TEMPLATES } from '../data/templates';

/**
 * Shared helper to generate CSS style objects for background types (solid, gradient, pattern, image)
 */
export function getBackgroundStyle(
  type?: 'solid' | 'gradient' | 'pattern' | 'image',
  colorSolid?: string,
  opacity: number = 1,
  colorStart?: string,
  colorEnd?: string,
  patternName?: string,
  imageUrl?: string
): React.CSSProperties {
  const baseOpacity = typeof opacity === 'number' ? opacity : 1;

  if (type === 'gradient' && colorStart && colorEnd) {
    return {
      background: `linear-gradient(135deg, ${colorStart}, ${colorEnd})`,
      opacity: baseOpacity,
    };
  }

  if (type === 'pattern') {
    let patternSvg = '';
    const mainColor = colorSolid || '#000000';
    const encodedColor = encodeURIComponent(mainColor);

    switch (patternName) {
      case 'dots':
        patternSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><circle cx="10" cy="10" r="2" fill="${encodedColor}" fill-opacity="0.15"/></svg>`;
        break;
      case 'stripes':
        patternSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><line x1="0" y1="20" x2="20" y2="0" stroke="${encodedColor}" stroke-opacity="0.15" stroke-width="2"/></svg>`;
        break;
      case 'grid':
        patternSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="${encodedColor}" stroke-opacity="0.12" stroke-width="1"/></svg>`;
        break;
      case 'mesh':
        patternSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30"><path d="M0 15 Q15 0 30 15 Q15 30 0 15" fill="none" stroke="${encodedColor}" stroke-opacity="0.15" stroke-width="1.5"/></svg>`;
        break;
      case 'waves':
        patternSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="20"><path d="M0 10 Q10 0 20 10 T40 10" fill="none" stroke="${encodedColor}" stroke-opacity="0.15" stroke-width="1.5"/></svg>`;
        break;
      default:
        patternSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><circle cx="8" cy="8" r="1.5" fill="${encodedColor}" fill-opacity="0.12"/></svg>`;
    }

    return {
      backgroundColor: colorSolid || '#ffffff',
      backgroundImage: `url("${patternSvg}")`,
      backgroundRepeat: 'repeat',
      opacity: baseOpacity,
    };
  }

  if (type === 'image' && imageUrl) {
    return {
      backgroundImage: `url(${imageUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      opacity: baseOpacity,
    };
  }

  // Fallback to solid color
  if (colorSolid) {
    return {
      backgroundColor: colorSolid,
      opacity: baseOpacity,
    };
  }

  return { opacity: baseOpacity };
}

/**
 * Losslessly remaps a CV to a new target template without losing any user data or text.
 */
export function remapContentToTemplate(cv: CV, targetTemplate: CVTemplate): CV {
  const newTemplateId = targetTemplate.id;
  const isTargetTwoColumn = targetTemplate.layoutFamily === 'two-column-left' || targetTemplate.layoutFamily === 'two-column-right';
  const targetCols: 1 | 2 = isTargetTwoColumn ? 2 : 1;
  const targetSidePosition: 'gauche' | 'droite' = targetTemplate.layoutFamily === 'two-column-right' ? 'droite' : 'gauche';

  // Smart section column reassignment preserving all items and custom text
  const updatedSections: Section[] = (cv.sections || []).map((sec) => {
    let newCol = sec.colonne;
    if (targetCols === 1) {
      newCol = 'principale';
    } else {
      if (['competences', 'langues', 'profil', 'interets', 'coordonnees'].includes(sec.type)) {
        newCol = 'gauche';
      } else {
        newCol = 'droite';
      }
    }

    return {
      ...sec,
      colonne: newCol,
    };
  });

  return {
    ...cv,
    templateId: newTemplateId,
    couleurAccent: targetTemplate.defaultAccent || cv.couleurAccent,
    couleurAccentSecondaire: targetTemplate.defaultSecondaryAccent || cv.couleurAccentSecondaire,
    police: targetTemplate.defaultFont || cv.police,
    nombreColonnes: targetCols,
    positionSidebar: targetSidePosition,
    couleurFondSidebar: targetTemplate.themeConfig?.sidebarBackgroundColor || cv.couleurFondSidebar,
    couleurFond: targetTemplate.themeConfig?.backgroundColor || cv.couleurFond,
    styleEnTete: targetTemplate.themeConfig?.headerStyle || cv.styleEnTete,
    styleEnTeteSection: targetTemplate.themeConfig?.sectionHeaderStyle || cv.styleEnTeteSection,
    styleCompetences: targetTemplate.themeConfig?.skillsDisplayMode || cv.styleCompetences,
    photoForme: targetTemplate.themeConfig?.photoFrameStyle || cv.photoForme,
    alignementDatesExperience: targetTemplate.themeConfig?.experienceDatesAlignment || cv.alignementDatesExperience,
    sections: updatedSections,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Universal safe template switcher that accepts either a CVTemplate object or a templateId string,
 * strictly keeping all profile info, contact details, photos, and section content intact.
 */
export function switchTemplateSafely(cv: CV, templateOrId: CVTemplate | string): CV {
  if (typeof templateOrId === 'string') {
    const tmplObj = CV_TEMPLATES.find((t) => t.id === templateOrId) || {
      id: templateOrId,
      name: `Modèle ${templateOrId}`,
      category: 'moderne',
      description: { fr: '', en: '' },
      layoutType: 'standard',
      layoutFamily: 'two-column-left',
      defaultAccent: '#2563EB',
      defaultSecondaryAccent: '#93C5FD',
      defaultFont: 'Inter'
    };
    return remapContentToTemplate(cv, tmplObj as CVTemplate);
  }
  return remapContentToTemplate(cv, templateOrId);
}

/**
 * Reversibly toggles layout between 1 column and 2 columns without losing data.
 */
export function toggleColumnLayout(cv: CV, targetLayout: 1 | 2): CV {
  const updatedSections: Section[] = (cv.sections || []).map((sec, idx) => {
    if (targetLayout === 1) {
      return { ...sec, colonne: 'principale', ordre: idx + 1 };
    } else {
      // 2 columns mapping
      if (['competences', 'langues', 'profil', 'interets', 'coordonnees', 'references'].includes(sec.type) || (sec.type === 'certifications' && !sec.titre?.toLowerCase().includes('diplôme'))) {
        return { ...sec, colonne: 'gauche' };
      } else {
        return { ...sec, colonne: 'droite' };
      }
    }
  });

  return {
    ...cv,
    nombreColonnes: targetLayout,
    largeurColonneGauche: cv.largeurColonneGauche || 34,
    positionSidebar: cv.positionSidebar || 'gauche',
    sections: updatedSections,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Toggles sidebar position between left ('gauche') and right ('droite')
 */
export function toggleSidebarPosition(cv: CV, position: 'gauche' | 'droite'): CV {
  return {
    ...cv,
    positionSidebar: position,
    updatedAt: new Date().toISOString(),
  };
}

