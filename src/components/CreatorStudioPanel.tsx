import React, { useState } from 'react';
import { CV, CVTemplate, Section, CustomPreset, Language } from '../types';
import { CV_TEMPLATES, ACCENT_COLORS, FONT_OPTIONS } from '../data/templates';
import { remapContentToTemplate, toggleColumnLayout } from '../state/cvActions';
import { BackgroundControlPanel } from './BackgroundControlPanel';
import { HeaderProfileModal } from '../editor/HeaderProfileModal';
import { getTranslation, getLocalizedTemplateName, getLocalizedCategory } from '../i18n/translations';
import {
  Palette,
  Layout,
  Type,
  Sliders,
  RotateCcw,
  Save,
  Check,
  Sparkles,
  Layers,
  Grid,
  User,
  Trash2,
  Columns,
  Square,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';

interface CreatorStudioPanelProps {
  cv: CV;
  onChangeCV: (updatedCV: CV) => void;
  template: CVTemplate;
  langue?: Language;
}

export const CreatorStudioPanel: React.FC<CreatorStudioPanelProps> = ({
  cv,
  onChangeCV,
  template,
  langue = 'fr' as Language
}) => {
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(langue as Language, key);

  const [selectedSectionId, setSelectedSectionId] = useState<string>(cv.sections[0]?.id || '');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);

  // Quick helper to update CV root properties
  const updateCvProp = (key: keyof CV, value: any) => {
    onChangeCV({ ...cv, [key]: value });
  };

  // Helper for updating section overrides
  const selectedSection = cv.sections.find(s => s.id === selectedSectionId);

  const updateSectionStyle = (overrideKey: string, val: any) => {
    if (!selectedSectionId) return;
    const updatedSections = cv.sections.map(sec => {
      if (sec.id !== selectedSectionId) return sec;
      const currentOverrides = sec.styleSection || {};
      return {
        ...sec,
        styleSection: {
          ...currentOverrides,
          [overrideKey]: val
        }
      };
    });
    onChangeCV({ ...cv, sections: updatedSections });
  };

  // Switch Template without losing data (Chantier C)
  const handleSelectTemplate = (targetTmpl: CVTemplate) => {
    if (cv.templateId === targetTmpl.id) return;
    const remappedCV = remapContentToTemplate(cv, targetTmpl);
    onChangeCV(remappedCV);
    const locName = getLocalizedTemplateName(targetTmpl, langue as Language);
    setSaveSuccessMsg(`${t('templatePrefix')} "${locName}" ${t('liveUpdate')} !`);
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  // Toggle Column Layout (Chantier D)
  const handleToggleColumns = (targetCols: 1 | 2) => {
    const updated = toggleColumnLayout(cv, targetCols);
    onChangeCV(updated);
  };

  // Reset custom studio styles to default template theme
  const handleResetToTemplateDefault = () => {
    const theme = template.themeConfig || {};
    onChangeCV({
      ...cv,
      couleurAccent: template.defaultAccent || theme.primaryColor || '#006666',
      couleurAccentSecondaire: template.defaultSecondaryAccent || theme.secondaryColor || '#E6F0F2',
      couleurFond: theme.backgroundColor || '#FFFFFF',
      couleurFondSidebar: theme.sidebarBackgroundColor || '#F8FAFC',
      couleurFondProfil: undefined,
      couleurTexteProfil: undefined,
      couleurTexte: theme.textColor || '#1E293B',
      couleurTexteSidebar: theme.sidebarTextColor || '#0F172A',
      couleurTitreSection: theme.headingColor || template.defaultAccent || '#006666',
      police: template.defaultFont || 'Inter',
      taillePoliceValeur: 10,
      hauteurLigneValeur: 1.3,
      largeurColonneGauche: theme.defaultLeftWidth || 34,
      margeGlobalePage: 0,
      styleEnTete: theme.headerStyle || 'banner',
      styleEnTeteSection: theme.sectionHeaderStyle || 'underline',
      styleCompetences: theme.skillsDisplayMode || 'grid',
      alignementDatesExperience: theme.experienceDatesAlignment || 'left'
    });
    setSaveSuccessMsg(t('resetBtn'));
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  // Save current style as Custom Preset in localStorage
  const handleSaveCustomPreset = () => {
    const presetName = prompt(t('saveStyleBtn')) || 'Custom Style';
    const newPreset: CustomPreset = {
      id: `preset-custom-${Date.now()}`,
      name: presetName,
      updatedAt: new Date().toISOString(),
      cvData: {
        couleurAccent: cv.couleurAccent,
        couleurAccentSecondaire: cv.couleurAccentSecondaire,
        couleurFond: cv.couleurFond,
        couleurFondSidebar: cv.couleurFondSidebar,
        couleurFondProfil: cv.couleurFondProfil,
        couleurTexteProfil: cv.couleurTexteProfil,
        couleurTexte: cv.couleurTexte,
        couleurTexteSidebar: cv.couleurTexteSidebar,
        couleurTitreSection: cv.couleurTitreSection,
        police: cv.police,
        styleEnTete: cv.styleEnTete,
        styleEnTeteSection: cv.styleEnTeteSection,
        styleCompetences: cv.styleCompetences,
        alignementDatesExperience: cv.alignementDatesExperience
      }
    };

    try {
      const existingPresetsRaw = localStorage.getItem('cv_custom_presets');
      const existingPresets: CustomPreset[] = existingPresetsRaw ? JSON.parse(existingPresetsRaw) : [];
      existingPresets.push(newPreset);
      localStorage.setItem('cv_custom_presets', JSON.stringify(existingPresets));
      setSaveSuccessMsg(`"${presetName}" - ${t('autoSaveSaved')} !`);
      setTimeout(() => setSaveSuccessMsg(null), 4000);
    } catch (err) {
      console.error('Failed to save preset', err);
    }
  };

  // Helper to remove profile photo only
  const handleRemovePhotoOnly = () => {
    onChangeCV({
      ...cv,
      photoUrl: '',
      afficherPhoto: false
    });
    setSaveSuccessMsg(t('removeOnlyPhoto'));
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  return (
    <div className="space-y-6 text-slate-800 dark:text-slate-100">
      {/* Toast Banner */}
      {saveSuccessMsg && (
        <div className="p-3 bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-between shadow-lg animate-fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{saveSuccessMsg}</span>
          </div>
        </div>
      )}

      {/* HEADER BAR FOR BUILDER MODE */}
      <div className="p-4 bg-gradient-to-r from-blue-900 to-slate-900 text-white rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600 rounded-xl">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider">{t('studioTitle')}</h3>
            <p className="text-[11px] text-blue-200">{t('studioSubtitle')}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetToTemplateDefault}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('resetBtn')}</span>
          </button>
          <button
            type="button"
            onClick={handleSaveCustomPreset}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{t('saveStyleBtn')}</span>
          </button>
        </div>
      </div>

      {/* SECTION PHOTO, COORDONNÉES & COULEUR DU PROFIL */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black uppercase tracking-wider flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <User className="w-4 h-4 text-blue-600" />
            <span>{t('photoAndCoords')}</span>
          </label>

          <button
            type="button"
            onClick={() => setShowProfileModal(true)}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-xs transition-all cursor-pointer"
          >
            {t('editCoords')}
          </button>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{t('showPhotoLabel')}</span>
              <button
                type="button"
                onClick={() => updateCvProp('afficherPhoto', cv.afficherPhoto === false ? true : false)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg border cursor-pointer transition-all ${
                  cv.afficherPhoto !== false
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {cv.afficherPhoto !== false ? '✓' : '✕'}
              </button>
            </div>

            {cv.photoUrl && (
              <button
                type="button"
                onClick={handleRemovePhotoOnly}
                className="px-2.5 py-1 bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-lg border border-rose-200 dark:border-rose-800 flex items-center gap-1 cursor-pointer hover:bg-rose-200"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t('removeOnlyPhoto')}</span>
              </button>
            )}
          </div>

          {/* Profile Section Background Color & Text Color Controls */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-blue-600" />
                <span>{t('profileBackgroundColor')}</span>
              </span>
              {cv.couleurFondProfil && (
                <button
                  type="button"
                  onClick={() => updateCvProp('couleurFondProfil', undefined)}
                  className="text-[10px] text-slate-400 hover:text-red-500 font-bold"
                >
                  {t('defaultChoice')}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                <input
                  type="color"
                  value={cv.couleurFondProfil || cv.couleurAccent || '#2563EB'}
                  onChange={(e) => updateCvProp('couleurFondProfil', e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent shrink-0"
                />
                <input
                  type="text"
                  value={cv.couleurFondProfil || ''}
                  onChange={(e) => updateCvProp('couleurFondProfil', e.target.value)}
                  placeholder={t('defaultChoice')}
                  className="w-full text-xs font-mono font-bold bg-transparent outline-none text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-bold text-slate-500 px-1">{t('mainTextColor')}</span>
                <input
                  type="color"
                  value={cv.couleurTexteProfil || '#FFFFFF'}
                  onChange={(e) => updateCvProp('couleurTexteProfil', e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent shrink-0"
                />
                <input
                  type="text"
                  value={cv.couleurTexteProfil || '#FFFFFF'}
                  onChange={(e) => updateCvProp('couleurTexteProfil', e.target.value)}
                  placeholder="#FFFFFF"
                  className="w-full text-xs font-mono font-bold bg-transparent outline-none text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>

            {/* Quick swatches for profile header background */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                { name: 'Royal Blue', color: '#1E40AF' },
                { name: 'Night Slate', color: '#0F172A' },
                { name: 'Deep Cyan', color: '#0E7490' },
                { name: 'Emerald', color: '#047857' },
                { name: 'Purple', color: '#581C87' },
                { name: 'Ruby', color: '#881337' },
                { name: 'Charcoal', color: '#18181B' },
                { name: 'Clean White', color: '#FFFFFF', text: '#0F172A' },
                { name: 'Light Gray', color: '#F1F5F9', text: '#0F172A' }
              ].map((swatch) => (
                <button
                  key={swatch.color}
                  type="button"
                  onClick={() => {
                    updateCvProp('couleurFondProfil', swatch.color);
                    updateCvProp('couleurTexteProfil', swatch.text || '#FFFFFF');
                  }}
                  className="w-5 h-5 rounded-md border border-black/20 hover:scale-110 transition-transform cursor-pointer shadow-2xs"
                  style={{ backgroundColor: swatch.color }}
                  title={swatch.name}
                />
              ))}
            </div>
          </div>

          {cv.afficherPhoto !== false && (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
              {/* Forme de photo */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-500 block">{t('photoShape')}</span>
                <select
                  value={cv.photoForme || 'ronde'}
                  onChange={(e) => updateCvProp('photoForme', e.target.value)}
                  className="w-full p-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-bold"
                >
                  <option value="ronde">{t('round')}</option>
                  <option value="carree">{t('square')}</option>
                  <option value="arrondie">{t('rounded')}</option>
                  <option value="arche">{t('arch')}</option>
                  <option value="hexagone">{t('hexagon')}</option>
                  <option value="galet">{t('pebble')}</option>
                </select>
              </div>

              {/* Taille photo */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-slate-500">
                  <span>{t('photoSize')}</span>
                  <span className="text-blue-600">{cv.photoTaille || 110}px</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="200"
                  value={cv.photoTaille || 110}
                  onChange={(e) => updateCvProp('photoTaille', Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* Position photo */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-500 block">{t('photoPlacement')}</span>
                <select
                  value={cv.photoPosition || 'in-header'}
                  onChange={(e) => updateCvProp('photoPosition', e.target.value)}
                  className="w-full p-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-bold"
                >
                  <option value="in-header">{t('inHeader')}</option>
                  <option value="in-sidebar">{t('inSidebar')}</option>
                </select>
              </div>

              {/* Hauteur du Profil / En-tête */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-slate-500">
                  <span>{t('headerProfileHeight')}</span>
                  <span className="text-blue-600">{cv.hauteurEnTetePx || 80}px</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="250"
                  value={cv.hauteurEnTetePx || 80}
                  onChange={(e) => updateCvProp('hauteurEnTetePx', Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 1: CHANGER DE TEMPLATE EN 1 CLIC (Chantier C) */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black uppercase tracking-wider flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <Grid className="w-4 h-4 text-blue-600" />
            <span>{t('sec1StyleAndTemplates')} ({CV_TEMPLATES.length} {t('modelsCount')})</span>
          </label>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-56 overflow-y-auto p-1 custom-scrollbar">
          {CV_TEMPLATES.map(tmpl => {
            const isSelected = cv.templateId === tmpl.id;
            const localizedName = getLocalizedTemplateName(tmpl, langue as Language);
            const isTwoCol = tmpl.layoutFamily?.includes('two');
            return (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => handleSelectTemplate(tmpl)}
                className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/90 dark:bg-blue-950/80 ring-2 ring-blue-500/40 font-bold shadow-md'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 hover:border-blue-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-black truncate text-slate-900 dark:text-white">
                      {localizedName.split('—')[0]}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 stroke-[3]" />}
                  </div>

                  {/* Real user data preview snippet */}
                  <div className="text-[9px] text-slate-500 line-clamp-1 mb-2 font-mono">
                    {cv.nom ? `${cv.prenom || ''} ${cv.nom}` : t('realCVPreview')}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 pt-1 border-t border-slate-200/60 dark:border-slate-800">
                  <div className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: tmpl.defaultAccent }} />
                  {tmpl.defaultSecondaryAccent && (
                    <div className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: tmpl.defaultSecondaryAccent }} />
                  )}
                  <span className="text-[9px] font-bold text-slate-400 ml-auto uppercase">
                    {isTwoCol ? `2 ${t('columnsWord')}` : `1 ${t('columnWord')}`}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: BASCULE 1 COLONNE / 2 COLONNES (Chantier D) */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <label className="text-xs font-black uppercase tracking-wider flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <Layout className="w-4 h-4 text-blue-600" />
          <span>{t('sec2ColumnsAndLayout')}</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Column Count Buttons */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{t('layoutAndColumns')} :</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleToggleColumns(1)}
                className={`py-2.5 px-3 rounded-xl text-xs font-black border flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  (cv.nombreColonnes || 2) === 1
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <Square className="w-4 h-4" />
                <span>{t('singleColumn')}</span>
              </button>
              <button
                type="button"
                onClick={() => handleToggleColumns(2)}
                className={`py-2.5 px-3 rounded-xl text-xs font-black border flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  (cv.nombreColonnes || 2) === 2
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <Columns className="w-4 h-4" />
                <span>{t('twoColumns')}</span>
              </button>
            </div>
          </div>

          {/* Sidebar Position */}
          {(cv.nombreColonnes || 2) === 2 && (
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{t('photoPlacement')}</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => updateCvProp('positionSidebar', 'gauche')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border cursor-pointer transition-all ${
                    (cv.positionSidebar || 'gauche') === 'gauche'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {t('sidebarLeft')}
                </button>
                <button
                  type="button"
                  onClick={() => updateCvProp('positionSidebar', 'droite')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border cursor-pointer transition-all ${
                    (cv.positionSidebar || 'gauche') === 'droite'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {t('sidebarRight')}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Column Width & Margins Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
          {(cv.nombreColonnes || 2) === 2 && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span>{t('sidebarWidth')}</span>
                <span className="text-blue-600 dark:text-blue-400">{cv.largeurColonneGauche || 34}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="50"
                value={cv.largeurColonneGauche || 34}
                onChange={(e) => updateCvProp('largeurColonneGauche', Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          )}

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold">
              <span>{t('globalPageMargin')}</span>
              <span className="text-blue-600 dark:text-blue-400">{cv.margeGlobalePage || 0}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              value={cv.margeGlobalePage || 0}
              onChange={(e) => updateCvProp('margeGlobalePage', Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>

        {/* Format & Mode Cible Page */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{t('numPagesTarget')}</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => updateCvProp('pageCibleMode', '1_page')}
              className={`py-2 px-3 rounded-xl text-xs font-black border flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                (cv.pageCibleMode || '1_page') !== '2_pages'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
            >
              {t('strict1Page')}
            </button>
            <button
              type="button"
              onClick={() => updateCvProp('pageCibleMode', '2_pages')}
              className={`py-2 px-3 rounded-xl text-xs font-black border flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                cv.pageCibleMode === '2_pages'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
            >
              {t('spacious2Pages')}
            </button>
          </div>
        </div>
      </div>

      {/* SECTION CRÉATIVITÉ & DESSINS D'ÉLÉMENTS DYNAMIQUES */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <label className="text-xs font-black uppercase tracking-wider flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>{t('sec3ShapesAndTimeline')}</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Forme Décorative de la Sidebar */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-500 block">{t('sidebarShape')}</span>
            <select
              value={cv.formeSidebarDecor || 'straight'}
              onChange={(e) => updateCvProp('formeSidebarDecor', e.target.value)}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold"
            >
              <option value="straight">Standard</option>
              <option value="arch-top">Arch Top</option>
              <option value="wave-cut">Wave Cut</option>
              <option value="diagonal-cut">Diagonal Cut</option>
              <option value="card-float">Card Float</option>
            </select>
          </div>

          {/* Ligne de Temps / Timeline */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-500 block">{t('timelineStyleLabel')}</span>
            <select
              value={cv.timelineStyle || 'none'}
              onChange={(e) => updateCvProp('timelineStyle', e.target.value)}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold"
            >
              <option value="none">Standard</option>
              <option value="line-dots">Timeline Dots</option>
              <option value="left-bar">Left Accent Bar</option>
            </select>
          </div>

          {/* Anneau Décoratif Photo */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-500 block">{t('decorativeRing')}</span>
            <select
              value={cv.cadrePhotoRing || 'none'}
              onChange={(e) => updateCvProp('cadrePhotoRing', e.target.value)}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold"
            >
              <option value="none">Border</option>
              <option value="double-ring">Double Ring</option>
              <option value="gold-ring">Gold Ring</option>
            </select>
          </div>
        </div>
      </div>

      {/* SECTION 3: ARRIÈRE-PLANS & OPACITÉ */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <label className="text-xs font-black uppercase tracking-wider flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <Palette className="w-4 h-4 text-blue-600" />
          <span>{t('sec4BackgroundsAndOpacity')}</span>
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Document Background */}
          <BackgroundControlPanel
            label={t('globalDocBg')}
            backgroundType={cv.backgroundType}
            colorSolid={cv.couleurFond}
            opacity={cv.backgroundOpacity}
            colorStart={cv.backgroundColorStart}
            colorEnd={cv.backgroundColorEnd}
            patternName={cv.backgroundPattern}
            imageUrl={cv.backgroundImage}
            onChange={(updates) => {
              if (updates.backgroundType !== undefined) updateCvProp('backgroundType', updates.backgroundType);
              if (updates.colorSolid !== undefined) updateCvProp('couleurFond', updates.colorSolid);
              if (updates.opacity !== undefined) updateCvProp('backgroundOpacity', updates.opacity);
              if (updates.colorStart !== undefined) updateCvProp('backgroundColorStart', updates.colorStart);
              if (updates.colorEnd !== undefined) updateCvProp('backgroundColorEnd', updates.colorEnd);
              if (updates.patternName !== undefined) updateCvProp('backgroundPattern', updates.patternName);
              if (updates.imageUrl !== undefined) updateCvProp('backgroundImage', updates.imageUrl);
            }}
          />

          {/* Sidebar Background */}
          {(cv.nombreColonnes || 2) === 2 && (
            <BackgroundControlPanel
              label={t('sidebarColBg')}
              backgroundType={cv.sidebarBackgroundType}
              colorSolid={cv.couleurFondSidebar}
              opacity={cv.sidebarBackgroundOpacity}
              colorStart={cv.sidebarBackgroundColorStart}
              colorEnd={cv.sidebarBackgroundColorEnd}
              patternName={cv.sidebarBackgroundPattern}
              imageUrl={cv.sidebarBackgroundImage}
              onChange={(updates) => {
                if (updates.backgroundType !== undefined) updateCvProp('sidebarBackgroundType', updates.backgroundType);
                if (updates.colorSolid !== undefined) updateCvProp('couleurFondSidebar', updates.colorSolid);
                if (updates.opacity !== undefined) updateCvProp('sidebarBackgroundOpacity', updates.opacity);
                if (updates.colorStart !== undefined) updateCvProp('sidebarBackgroundColorStart', updates.colorStart);
                if (updates.colorEnd !== undefined) updateCvProp('sidebarBackgroundColorEnd', updates.colorEnd);
                if (updates.patternName !== undefined) updateCvProp('sidebarBackgroundPattern', updates.patternName);
                if (updates.imageUrl !== undefined) updateCvProp('sidebarBackgroundImage', updates.imageUrl);
              }}
            />
          )}
        </div>
      </div>

      {/* SECTION 4: TYPOGRAPHIE GLOBALE, ESPACEMENTS & MARGES */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <label className="text-xs font-black uppercase tracking-wider flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <Type className="w-4 h-4 text-blue-600" />
          <span>{t('sec5TypographyAndSpacing')}</span>
        </label>

        {/* Font Select */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{t('fontFamily')} :</span>
          <select
            value={cv.police || template.defaultFont || 'Inter'}
            onChange={(e) => updateCvProp('police', e.target.value)}
            className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 outline-none"
          >
            {FONT_OPTIONS.map(font => (
              <option key={font.id} value={font.id} style={{ fontFamily: font.family }}>
                {font.name}
              </option>
            ))}
          </select>
        </div>

        {/* Typography & Spacing Sliders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
          
          {/* Taille du texte du corps */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold">
              <span>{t('bodyFontSize')}</span>
              <span className="text-blue-600 dark:text-blue-400">{cv.taillePoliceValeur ?? 6} pt</span>
            </div>
            <input
              type="range"
              min="4"
              max="16"
              step="0.5"
              value={cv.taillePoliceValeur ?? 6}
              onChange={(e) => updateCvProp('taillePoliceValeur', Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Hauteur de ligne / Interligne */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold">
              <span>{t('lineHeightLabel')}</span>
              <span className="text-blue-600 dark:text-blue-400">{cv.hauteurLigneValeur ?? 0.8}x</span>
            </div>
            <input
              type="range"
              min="0.6"
              max="2.0"
              step="0.05"
              value={cv.hauteurLigneValeur ?? 0.8}
              onChange={(e) => updateCvProp('hauteurLigneValeur', Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Taille des titres de section */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold">
              <span>{t('sectionTitleSize')}</span>
              <span className="text-blue-600 dark:text-blue-400">{cv.tailleTitreSectionValeur ?? 8} pt</span>
            </div>
            <input
              type="range"
              min="6"
              max="24"
              step="0.5"
              value={cv.tailleTitreSectionValeur ?? 8}
              onChange={(e) => updateCvProp('tailleTitreSectionValeur', Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Espacement entre les sections */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold">
              <span>{t('spaceBetweenSections')}</span>
              <span className="text-blue-600 dark:text-blue-400">{cv.espacementSectionsPx ?? 12} px</span>
            </div>
            <input
              type="range"
              min="0"
              max="32"
              step="1"
              value={cv.espacementSectionsPx ?? 12}
              onChange={(e) => updateCvProp('espacementSectionsPx', Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Alignement des titres de section */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 block">Alignement des titres de section</span>
            <div className="grid grid-cols-3 gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => updateCvProp('alignementTitreSection', 'left')}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  (cv.alignementTitreSection || 'left') === 'left'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <AlignLeft className="w-3.5 h-3.5" />
                <span>Gauche</span>
              </button>
              <button
                type="button"
                onClick={() => updateCvProp('alignementTitreSection', 'center')}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  cv.alignementTitreSection === 'center'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <AlignCenter className="w-3.5 h-3.5" />
                <span>Centre</span>
              </button>
              <button
                type="button"
                onClick={() => updateCvProp('alignementTitreSection', 'right')}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  cv.alignementTitreSection === 'right'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <AlignRight className="w-3.5 h-3.5" />
                <span>Droite</span>
              </button>
            </div>
          </div>

          {/* Casse des titres */}
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 block">{t('titlesCase')}</span>
            <select
              value={cv.casseTitreSection || 'uppercase'}
              onChange={(e) => updateCvProp('casseTitreSection', e.target.value)}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
            >
              <option value="uppercase">MAJUSCULES (EXEMPLE)</option>
              <option value="capitalize">Première Lettre (Exemple)</option>
              <option value="normal">Minuscules normales (exemple)</option>
            </select>
          </div>

          {/* Style d'En-tête de Section */}
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 block">{t('sectionHeadersStyle')}</span>
            <select
              value={cv.styleEnTeteSection || 'badge-line'}
              onChange={(e) => updateCvProp('styleEnTeteSection', e.target.value)}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
            >
              <option value="badge-line">Badge icône + Liseré dynamique (Style Tech)</option>
              <option value="underline">Souligné classique moderne</option>
              <option value="pill">Badge Pillule coloré</option>
              <option value="banner">Bannière pleine largeur</option>
              <option value="left-border">Ligne latérale d'accent</option>
              <option value="boxed">Encadré plein moderne</option>
              <option value="stars">Étoiles d'accentuation</option>
              <option value="double-line">Double ligne supérieure/inférieure</option>
              <option value="arch-block">Bloc Arche courbé</option>
              <option value="badge-header">Badge latéral bicolore</option>
              <option value="minimal">Minimaliste épuré</option>
            </select>
          </div>

          {/* Style d'En-tête de Profil / Page */}
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 block">Style de l'En-tête Profil</span>
            <select
              value={cv.styleEnTete || template?.headerStyle || 'tech-arches'}
              onChange={(e) => updateCvProp('styleEnTete', e.target.value)}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
            >
              <option value="tech-arches">Arches géométriques Tech (Yann Landy)</option>
              <option value="banner">Bannière pleine largeur</option>
              <option value="clean">Moderne épuré</option>
              <option value="card">Carte flottante</option>
              <option value="arch">Arche supérieure</option>
              <option value="modern-split">Séparation moderne 2 tons</option>
              <option value="minimal">Minimaliste</option>
              <option value="luxury-gold">Or & Luxe</option>
              <option value="ocean-wave">Vague océan</option>
              <option value="diagonal-split">Découpe diagonale</option>
              <option value="organic-arch">Arche organique</option>
              <option value="sidebar-top">En-tête de colonne latérale</option>
            </select>
          </div>

          {/* Style d'affichage des compétences */}
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 block">Style des Compétences</span>
            <select
              value={cv.styleCompetences || 'tech-cards'}
              onChange={(e) => updateCvProp('styleCompetences', e.target.value)}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
            >
              <option value="tech-cards">Cartes modulaires Tech avec puces (Yann Landy)</option>
              <option value="grid">Grille de badges interactifs</option>
              <option value="badges">Badges arrondis avec puces</option>
              <option value="badges-multicolor">Badges multicolores</option>
              <option value="progress">Barres de progression</option>
              <option value="stars">Notation par étoiles</option>
              <option value="tags">Étiquettes compactes</option>
              <option value="circular-progress">Jauges circulaires</option>
              <option value="list">Liste détaillée</option>
            </select>
          </div>

        </div>

        {/* Accent Quick Swatches */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-bold text-slate-500">{t('accentPresets')}</span>
          <div className="flex flex-wrap gap-2">
            {ACCENT_COLORS.map(color => (
              <button
                key={color.hex}
                type="button"
                onClick={() => updateCvProp('couleurAccent', color.hex)}
                className={`w-7 h-7 rounded-full transition-transform cursor-pointer border-2 shadow-2xs ${
                  cv.couleurAccent === color.hex ? 'scale-125 border-blue-600 ring-2 ring-blue-400' : 'border-white'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
        </div>

        {/* Individual Color Pickers Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          {/* Couleur Accent Principale */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">{t('primaryAccentColor')}</span>
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <input
                type="color"
                value={cv.couleurAccent || '#006666'}
                onChange={(e) => updateCvProp('couleurAccent', e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
              />
              <span className="text-xs font-mono font-bold uppercase">{cv.couleurAccent || '#006666'}</span>
            </div>
          </div>

          {/* Couleur Accent Secondaire */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">{t('secondaryAccentColor')}</span>
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <input
                type="color"
                value={cv.couleurAccentSecondaire || '#E6F0F2'}
                onChange={(e) => updateCvProp('couleurAccentSecondaire', e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
              />
              <span className="text-xs font-mono font-bold uppercase">{cv.couleurAccentSecondaire || '#E6F0F2'}</span>
            </div>
          </div>

          {/* Couleur Texte Principal */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">{t('mainTextColor')}</span>
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <input
                type="color"
                value={cv.couleurTexte || '#1E293B'}
                onChange={(e) => updateCvProp('couleurTexte', e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
              />
              <span className="text-xs font-mono font-bold uppercase">{cv.couleurTexte || '#1E293B'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 5: PERSONNALISATION PAR SECTION INDIVIDUELLE */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <label className="text-xs font-black uppercase tracking-wider flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <Layers className="w-4 h-4 text-blue-600" />
          <span>{t('sec6CustomPerSection')}</span>
        </label>

        {/* Section Select */}
        <div className="space-y-2">
          <select
            value={selectedSectionId}
            onChange={(e) => setSelectedSectionId(e.target.value)}
            className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold"
          >
            {cv.sections.map(s => (
              <option key={s.id} value={s.id}>
                {s.titre} ({t('columnWord')} : {s.type})
              </option>
            ))}
          </select>
        </div>

        {selectedSection && (
          <div className="p-3 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <span className="text-xs font-extrabold uppercase text-blue-600">
              "{selectedSection.titre}"
            </span>

            {/* Background Control for this section */}
            <BackgroundControlPanel
              label={`${t('sectionBg')} ${selectedSection.titre}`}
              backgroundType={selectedSection.styleSection?.backgroundType}
              colorSolid={selectedSection.styleSection?.couleurFond}
              opacity={selectedSection.styleSection?.backgroundOpacity}
              colorStart={selectedSection.styleSection?.backgroundColorStart}
              colorEnd={selectedSection.styleSection?.backgroundColorEnd}
              patternName={selectedSection.styleSection?.backgroundPattern}
              imageUrl={selectedSection.styleSection?.backgroundImage}
              onChange={(updates) => {
                if (updates.backgroundType !== undefined) updateSectionStyle('backgroundType', updates.backgroundType);
                if (updates.colorSolid !== undefined) updateSectionStyle('couleurFond', updates.colorSolid);
                if (updates.opacity !== undefined) updateSectionStyle('backgroundOpacity', updates.opacity);
                if (updates.colorStart !== undefined) updateSectionStyle('backgroundColorStart', updates.colorStart);
                if (updates.colorEnd !== undefined) updateSectionStyle('backgroundColorEnd', updates.colorEnd);
                if (updates.patternName !== undefined) updateSectionStyle('backgroundPattern', updates.patternName);
                if (updates.imageUrl !== undefined) updateSectionStyle('backgroundImage', updates.imageUrl);
              }}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {/* Position Colonne de cette section */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-500">{t('displayColumn')}</span>
                <select
                  value={selectedSection.colonne || 'principale'}
                  onChange={(e) => {
                    const updated = cv.sections.map(sec => sec.id === selectedSectionId ? { ...sec, colonne: e.target.value as any } : sec);
                    onChangeCV({ ...cv, sections: updated });
                  }}
                  className="w-full p-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                >
                  <option value="principale">{t('mainColumn')}</option>
                  <option value="gauche">{t('leftColumn')}</option>
                  <option value="droite">{t('sidebarRight')}</option>
                </select>
              </div>

              {/* Couleur Titre Spécifique */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-500">{t('titleColor')}</span>
                <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                  <input
                    type="color"
                    value={selectedSection.styleSection?.couleurTitre || cv.couleurAccent || '#006666'}
                    onChange={(e) => updateSectionStyle('couleurTitre', e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer border-0"
                  />
                  <span className="text-xs font-mono">{selectedSection.styleSection?.couleurTitre || t('defaultChoice')}</span>
                </div>
              </div>

              {/* Alignement Titre Spécifique */}
              <div className="space-y-1 sm:col-span-2">
                <span className="text-[11px] font-bold text-slate-500">Alignement du titre de cette section</span>
                <div className="grid grid-cols-3 gap-1 bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => updateSectionStyle('alignementTitre', 'left')}
                    className={`py-1 px-2 rounded text-xs font-bold flex items-center justify-center gap-1 ${
                      (selectedSection.styleSection?.alignementTitre || cv.alignementTitreSection || 'left') === 'left'
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    <AlignLeft className="w-3 h-3" />
                    <span>Gauche</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => updateSectionStyle('alignementTitre', 'center')}
                    className={`py-1 px-2 rounded text-xs font-bold flex items-center justify-center gap-1 ${
                      (selectedSection.styleSection?.alignementTitre || cv.alignementTitreSection) === 'center'
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    <AlignCenter className="w-3 h-3" />
                    <span>Centre</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => updateSectionStyle('alignementTitre', 'right')}
                    className={`py-1 px-2 rounded text-xs font-bold flex items-center justify-center gap-1 ${
                      (selectedSection.styleSection?.alignementTitre || cv.alignementTitreSection) === 'right'
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    <AlignRight className="w-3 h-3" />
                    <span>Droite</span>
                  </button>
                </div>
              </div>

              {/* Style d'En-tête Spécifique */}
              <div className="space-y-1 sm:col-span-2">
                <span className="text-[11px] font-bold text-slate-500">Style d'en-tête pour cette section</span>
                <select
                  value={selectedSection.styleSection?.styleEntete || cv.styleEnTeteSection || 'badge-line'}
                  onChange={(e) => updateSectionStyle('styleEntete', e.target.value as any)}
                  className="w-full p-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-bold"
                >
                  <option value="badge-line">Badge icône + Liseré dynamique (Style Tech)</option>
                  <option value="underline">Souligné classique moderne</option>
                  <option value="pill">Badge Pillule coloré</option>
                  <option value="banner">Bannière pleine largeur</option>
                  <option value="left-border">Ligne latérale d'accent</option>
                  <option value="boxed">Encadré plein moderne</option>
                  <option value="stars">Étoiles d'accentuation</option>
                  <option value="double-line">Double ligne supérieure/inférieure</option>
                  <option value="arch-block">Bloc Arche courbé</option>
                  <option value="badge-header">Badge latéral bicolore</option>
                  <option value="minimal">Minimaliste épuré</option>
                </select>
              </div>

              {/* Style Compétences si la section est compétences */}
              {selectedSection.type === 'competences' && (
                <div className="space-y-1 sm:col-span-2">
                  <span className="text-[11px] font-bold text-slate-500">Mode d'affichage des compétences</span>
                  <select
                    value={selectedSection.styleSection?.styleCompetences || cv.styleCompetences || 'tech-cards'}
                    onChange={(e) => updateSectionStyle('styleCompetences', e.target.value as any)}
                    className="w-full p-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-bold"
                  >
                    <option value="tech-cards">Cartes modulaires Tech avec puces (Yann Landy)</option>
                    <option value="grid">Grille de badges interactifs</option>
                    <option value="badges">Badges arrondis avec puces</option>
                    <option value="badges-multicolor">Badges multicolores</option>
                    <option value="progress">Barres de progression</option>
                    <option value="stars">Notation par étoiles</option>
                    <option value="tags">Étiquettes compactes</option>
                    <option value="circular-progress">Jauges circulaires</option>
                    <option value="list">Liste détaillée</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Profile & Header Coordinates Modal */}
      {showProfileModal && (
        <HeaderProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          cv={cv}
          onUpdateCV={(updates) => onChangeCV({ ...cv, ...updates })}
        />
      )}
    </div>
  );
};


