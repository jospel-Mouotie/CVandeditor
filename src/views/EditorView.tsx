import React, { useState, useEffect } from 'react';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';

import { CV, Section, Language, User, ExperienceItem, FormationItem, CompetenceItem, LangueItem, PersonnaliseeContenu } from '../types';
import { CV_TEMPLATES } from '../data/templates';
import { getTranslation, getLocalizedTemplateName } from '../i18n/translations';
import { SortableSectionItem } from '../components/SortableSectionItem';
import { SpellCheckField } from '../components/SpellCheckField';
import { PhotoCropper } from '../components/PhotoCropper';
import { CVPreview } from '../components/CVPreview';
import { CreatorStudioPanel } from '../components/CreatorStudioPanel';
import { FormWizard } from '../components/FormWizard';
import { VisualCVEditor } from '../editor/VisualCVEditor';
import { toggleColumnLayout } from '../state/cvActions';
import { exportCVToPDF, exportCVToImage } from '../utils/pdfExport';

import {
  ArrowLeft,
  Save,
  Download,
  CreditCard,
  Plus,
  Palette,
  Eye,
  Trash2,
  AlertCircle,
  Sliders,
  FileText,
  X,
  Sparkles,
  ArrowUp,
  ArrowDown,
  FolderClosed,
  FolderOpen,
  Columns,
  Loader2,
  Layers
} from 'lucide-react';

interface EditorViewProps {
  cv: CV;
  user: User | null;
  langue: Language;
  initialMode?: 'visual' | 'form';
  onBack: () => void;
  onSaveCV: (cv: CV) => Promise<void>;
  onOpenPayment: (cv: CV) => void;
  onOpenAuth: () => void;
}

export const EditorView: React.FC<EditorViewProps> = ({
  cv: initialCV,
  user,
  langue,
  initialMode,
  onBack,
  onSaveCV,
  onOpenPayment,
  onOpenAuth
}) => {
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(langue, key);

  const [cv, setCv] = useState<CV>(initialCV);
  const [editorMode, setEditorMode] = useState<'visual' | 'form'>(initialMode || 'form');
  const [activeTab, setActiveTab] = useState<'wizard' | 'sections' | 'style' | 'visual' | 'preview'>(
    initialMode === 'visual' ? 'visual' : 'wizard'
  );

  useEffect(() => {
    if (initialMode) {
      setEditorMode(initialMode);
      setActiveTab(initialMode === 'visual' ? 'visual' : 'wizard');
    }
  }, [initialMode]);
  const [useWizardMode, setUseWizardMode] = useState<boolean>(true);
  const [expandedSectionIds, setExpandedSectionIds] = useState<Record<string, boolean>>({});
  const [columnFilter, setColumnFilter] = useState<'toutes' | 'gauche' | 'droite'>('toutes');
  const [showMobilePreviewModal, setShowMobilePreviewModal] = useState<boolean>(false);
  const [mobileZoom, setMobileZoom] = useState<number>(0.65);

  // Collapse or Expand All Sections
  const collapseAllSections = () => {
    const map: Record<string, boolean> = {};
    cv.sections.forEach(s => { map[s.id] = false; });
    setExpandedSectionIds(map);
  };

  const expandAllSections = () => {
    const map: Record<string, boolean> = {};
    cv.sections.forEach(s => { map[s.id] = true; });
    setExpandedSectionIds(map);
  };

  // Reorder Sub-items inside a Section Array
  const moveSubItem = (secId: string, fromIndex: number, toIndex: number) => {
    setCv(prev => {
      const updatedSections = prev.sections.map(s => {
        if (s.id !== secId || !Array.isArray(s.contenu)) return s;
        const list = [...s.contenu];
        if (fromIndex < 0 || fromIndex >= list.length || toIndex < 0 || toIndex >= list.length) return s;
        const [moved] = list.splice(fromIndex, 1);
        list.splice(toIndex, 0, moved);
        return { ...s, contenu: list };
      });
      return { ...prev, sections: updatedSections };
    });
  };

  const [cropperImageSrc, setCropperImageSrc] = useState<string | null>(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving'>('saved');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [exportNotice, setExportNotice] = useState<{ type: 'loading' | 'success' | 'error'; message: string } | null>(null);

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Sync state if prop updates
  useEffect(() => {
    setCv(initialCV);
  }, [initialCV.id]);

  // Auto-save debounce effect
  useEffect(() => {
    const timer = setTimeout(async () => {
      setAutoSaveStatus('saving');
      await onSaveCV(cv);
      setAutoSaveStatus('saved');
    }, 1500);

    return () => clearTimeout(timer);
  }, [cv]);

  // Handle DnD Drag End
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setCv(prev => {
        const oldIndex = prev.sections.findIndex(s => s.id === active.id);
        const newIndex = prev.sections.findIndex(s => s.id === over.id);
        const reordered = arrayMove(prev.sections, oldIndex, newIndex).map((sec: Section, idx: number) => ({
          ...sec,
          ordre: idx + 1
        }));
        return { ...prev, sections: reordered };
      });
    }
  };

  // Direct Reorder from Preview Canvas
  const handleSectionsReorder = (newSections: Section[]) => {
    setCv(prev => ({ ...prev, sections: newSections }));
  };

  const handleUpdateSectionZone = (secId: string, newZone: 'gauche' | 'droite' | 'principale') => {
    setCv(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === secId ? { ...s, colonne: newZone } : s)
    }));
  };

  const handleMoveSectionUp = (secId: string) => {
    setCv(prev => {
      const idx = prev.sections.findIndex(s => s.id === secId);
      if (idx <= 0) return prev;
      const reordered = arrayMove(prev.sections, idx, idx - 1).map((s: Section, i: number) => Object.assign({}, s, { ordre: i + 1 }));
      return { ...prev, sections: reordered };
    });
  };

  const handleMoveSectionDown = (secId: string) => {
    setCv(prev => {
      const idx = prev.sections.findIndex(s => s.id === secId);
      if (idx === -1 || idx >= prev.sections.length - 1) return prev;
      const reordered = arrayMove(prev.sections, idx, idx + 1).map((s: Section, i: number) => Object.assign({}, s, { ordre: i + 1 }));
      return { ...prev, sections: reordered };
    });
  };

  // Section Toggle Expand - Default state is expanded (true), so first click toggles to false
  const toggleExpandSection = (id: string) => {
    setExpandedSectionIds(prev => {
      const isCurrentlyExpanded = prev[id] !== false;
      return { ...prev, [id]: !isCurrentlyExpanded };
    });
  };

  // Section Visibility Toggle
  const toggleSectionVisibility = (id: string) => {
    setCv(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === id ? { ...s, visible: !s.visible } : s)
    }));
  };

  // Duplicate Section
  const duplicateSection = (id: string) => {
    const target = cv.sections.find(s => s.id === id);
    if (!target) return;

    const newSection: Section = {
      ...JSON.parse(JSON.stringify(target)),
      id: `sec-dup-${Date.now()}`,
      titre: `${target.titre} (Copie)`,
      ordre: cv.sections.length + 1
    };

    setCv(prev => ({ ...prev, sections: [...prev.sections, newSection] }));
  };

  // Delete Section
  const deleteSection = (id: string) => {
    setCv(prev => ({ ...prev, sections: prev.sections.filter(s => s.id !== id) }));
  };

  // Update Section Title
  const updateSectionTitle = (id: string, title: string) => {
    setCv(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === id ? { ...s, titre: title } : s)
    }));
  };

  // Add Custom Section
  const addCustomSection = () => {
    const newSec: Section = {
      id: `sec-custom-${Date.now()}`,
      type: 'personnalisee',
      titre: 'Nouvelle Section',
      ordre: cv.sections.length + 1,
      visible: true,
      contenu: {
        typeLayout: 'texte_libre',
        texteLibre: 'Saisissez ici le texte de votre section personnalisée (certifications, bénévolat, projets...)'
      } as PersonnaliseeContenu
    };

    setCv(prev => ({ ...prev, sections: [...prev.sections, newSec] }));
    setExpandedSectionIds(prev => ({ ...prev, [newSec.id]: true }));
  };

  // Handle Photo File Upload
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setCropperImageSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // PDF Export Action
  const handleExportPDF = async () => {
    setExportNotice({ type: 'loading', message: 'Génération du PDF HD en cours...' });
    setShowExportMenu(false);

    const result = await exportCVToPDF('cv-preview-container', `${cv.titreCV || 'CV'}.pdf`, cv.pageCibleMode === '2_pages');

    if (result.success) {
      setExportNotice({ type: 'success', message: 'PDF téléchargé avec succès !' });
      setTimeout(() => setExportNotice(null), 4000);
    } else {
      setExportNotice({ type: 'error', message: `Échec de l'export PDF : ${result.message || 'Erreur inconnue'}` });
    }
  };

  // Image Export Action
  const handleExportImage = async () => {
    setExportNotice({ type: 'loading', message: "Génération de l'image haute définition..." });
    setShowExportMenu(false);

    const result = await exportCVToImage('cv-preview-container', `${cv.titreCV || 'CV'}.png`);

    if (result.success) {
      setExportNotice({ type: 'success', message: 'Image téléchargée avec succès !' });
      setTimeout(() => setExportNotice(null), 4000);
    } else {
      setExportNotice({ type: 'error', message: `Échec de l'export image : ${result.message || 'Erreur inconnue'}` });
    }
  };

  const templateObj = CV_TEMPLATES.find(t => t.id === cv.templateId) || CV_TEMPLATES[0];

  if (editorMode === 'visual' || activeTab === 'visual') {
    return (
      <VisualCVEditor
        cv={cv}
        langue={langue}
        onSaveCV={async (updatedCV) => {
          setCv(updatedCV);
          await onSaveCV(updatedCV);
        }}
        onToggleViewMode={(mode) => {
          setEditorMode(mode);
          setActiveTab(mode === 'form' ? 'wizard' : 'visual');
        }}
        viewMode={editorMode}
        onBack={onBack}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 pb-28 md:pb-12 text-slate-800 dark:text-slate-100 font-sans">
      
      {/* TOP NAVIGATION HEADER - HORIZONTAL BAR */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-2.5 shadow-2xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          {/* Back & Document Title */}
          <div className="flex items-center space-x-3 shrink-0">
            <button
              type="button"
              onClick={onBack}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer border border-slate-300 dark:border-slate-700 shrink-0"
              title={getTranslation(langue, 'backToResumes')}
            >
              <ArrowLeft className="w-4 h-4 text-blue-600 dark:text-blue-400 stroke-[2.5]" />
              <span className="hidden sm:inline">{getTranslation(langue, 'backToResumes')}</span>
            </button>
            <div className="flex flex-col">
              <input
                type="text"
                value={cv.titreCV}
                onChange={(e) => setCv(prev => ({ ...prev, titreCV: e.target.value }))}
                className="font-black text-xs sm:text-sm bg-transparent border-0 border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-blue-600 outline-none px-1 py-0.5 text-slate-900 dark:text-white max-w-[160px] sm:max-w-[220px]"
                placeholder={getTranslation(langue, 'docTitleLabel')}
              />
              <span className={`text-[9px] font-bold px-1 ${autoSaveStatus === 'saving' ? 'text-amber-500 animate-pulse' : 'text-emerald-600 dark:text-emerald-400'}`}>
                {autoSaveStatus === 'saving' ? getTranslation(langue, 'autoSaveSaving') : getTranslation(langue, 'autoSaveSaved')}
              </span>
            </div>
          </div>

          {/* Center: Horizontal Navigation Tabs & Quick Column Switch */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-slate-100 dark:bg-slate-800/90 p-1 rounded-xl border border-slate-200 dark:border-slate-700/80 gap-1 shadow-2xs">
              <button
                type="button"
                onClick={() => { setEditorMode('form'); setActiveTab('wizard'); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'wizard' && editorMode === 'form'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Assistant</span>
              </button>

              <button
                type="button"
                onClick={() => { setEditorMode('form'); setActiveTab('sections'); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'sections' && editorMode === 'form'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Sections</span>
              </button>

              <button
                type="button"
                onClick={() => { setEditorMode('form'); setActiveTab('style'); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'style' && editorMode === 'form'
                    ? 'bg-purple-600 text-white shadow-xs ring-2 ring-purple-400/40'
                    : 'text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-950/40'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Style & Studio</span>
              </button>

              <button
                type="button"
                onClick={() => { setEditorMode('visual'); setActiveTab('visual'); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                  editorMode === 'visual' || activeTab === 'visual'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Édition Visuelle</span>
              </button>
            </div>

            {/* Quick 1 Col / 2 Col Switch */}
            <div className="hidden lg:flex items-center bg-slate-100 dark:bg-slate-800/90 p-1 rounded-xl border border-slate-200 dark:border-slate-700/80 gap-1 shadow-2xs">
              <button
                type="button"
                onClick={() => setCv(toggleColumnLayout(cv, 1))}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-extrabold flex items-center gap-1 transition-all cursor-pointer ${
                  (cv.nombreColonnes || 2) === 1
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Passer en disposition 1 colonne"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>1 Col</span>
              </button>
              <button
                type="button"
                onClick={() => setCv(toggleColumnLayout(cv, 2))}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-extrabold flex items-center gap-1 transition-all cursor-pointer ${
                  (cv.nombreColonnes || 2) === 2
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Passer en disposition 2 colonnes"
              >
                <Columns className="w-3.5 h-3.5" />
                <span>2 Col</span>
              </button>
            </div>
          </div>

          {/* Right: Download Button + Payment */}
          <div className="flex items-center space-x-2 shrink-0">
            {/* Download Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                style={{ minHeight: '36px' }}
              >
                <Download className="w-4 h-4" />
                <span>{getTranslation(langue, 'actionDownloadPDF')}</span>
              </button>

              {/* Export Menu Dropdown */}
              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <button
                    type="button"
                    onClick={handleExportPDF}
                    className="w-full text-left px-3 py-2.5 hover:bg-blue-50 dark:hover:bg-blue-950/60 rounded-xl text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-2.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-blue-600" />
                    <div>
                      <div>{getTranslation(langue, 'actionDownloadPDF')} (A4 HD)</div>
                      <div className="text-[10px] text-slate-400 font-normal">Strict 1 Page Print Guarantee</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={handleExportImage}
                    className="w-full text-left px-3 py-2.5 hover:bg-blue-50 dark:hover:bg-blue-950/60 rounded-xl text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-2.5 cursor-pointer border-t border-slate-100 dark:border-slate-800 mt-1 pt-2"
                  >
                    <Download className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div>Image (PNG HD)</div>
                      <div className="text-[10px] text-slate-400 font-normal">High Resolution Image</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Payment Button if not paid */}
            {cv.statutPaiement !== 'PAYE' && (
              <button
                type="button"
                onClick={() => onOpenPayment(cv)}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                style={{ minHeight: '36px' }}
              >
                <CreditCard className="w-4 h-4" />
                <span className="hidden md:inline">Valider (1,99 €)</span>
              </button>
            )}
          </div>

        </div>
      </header>

      {/* Full-screen Loading Overlay for Asynchronous Operations */}
      {exportNotice?.type === 'loading' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center text-white animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-3xl shadow-2xl flex flex-col items-center max-w-sm text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Opération en cours...</h3>
              <p className="text-xs text-slate-300 mt-1">{exportNotice.message}</p>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full w-2/3 animate-pulse rounded-full" />
            </div>
          </div>
        </div>
      )}

      {/* EXPORT / NOTIFICATION TOAST BANNER */}
      {exportNotice && exportNotice.type !== 'loading' && (
        <div className={`max-w-7xl mx-auto px-4 mt-3`}>
          <div className={`p-3.5 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-lg border ${
            exportNotice.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
              : 'bg-red-50 dark:bg-red-950/80 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800'
          }`}>
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{exportNotice.message}</span>
          </div>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* LEFT PANEL: CONTENT EDITOR OR CREATOR STUDIO TAB (Cols 1-6) */}
          <div className={`md:col-span-6 space-y-6 ${activeTab === 'preview' ? 'hidden md:block' : 'block'}`}>
            
            {/* 1. STYLE & STUDIO TAB */}
            {activeTab === 'style' && (
              <CreatorStudioPanel
                cv={cv}
                onChangeCV={setCv}
                template={templateObj}
              />
            )}

            {/* 2. ASSISTANT (FORM WIZARD) TAB */}
            {activeTab === 'wizard' && (
              <div className="space-y-3">
                <FormWizard
                  cv={cv}
                  onChangeCV={setCv}
                  langue={langue}
                  onFinishWizard={() => setActiveTab('style')}
                />
              </div>
            )}

            {/* 3. SECTIONS TAB */}
            {activeTab === 'sections' && (
              <div className="space-y-4">
                {/* 1 / 2 COLUMNS LAYOUT SELECTOR CARD */}
                <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Columns className="w-4 h-4 text-blue-600" />
                      <span>Disposition & Colonnes (1 ou 2 Colonnes)</span>
                    </label>
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-800">
                      Mise à jour en direct
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setCv(prev => toggleColumnLayout(prev, 1))}
                      className={`py-2.5 px-3 rounded-xl text-xs font-extrabold border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                        (cv.nombreColonnes || 2) === 1
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>1 Colonne Simple</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCv(prev => toggleColumnLayout(prev, 2))}
                      className={`py-2.5 px-3 rounded-xl text-xs font-extrabold border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                        (cv.nombreColonnes || 2) === 2
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>2 Colonnes</span>
                    </button>
                  </div>

                  {/* 2-Columns Settings */}
                  {(cv.nombreColonnes || 2) === 2 && (
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3 animate-fadeIn">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setCv(prev => ({ ...prev, positionSidebar: 'gauche' }))}
                          className={`py-1.5 px-2.5 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                            (cv.positionSidebar || 'gauche') === 'gauche'
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          Sidebar à Gauche
                        </button>
                        <button
                          type="button"
                          onClick={() => setCv(prev => ({ ...prev, positionSidebar: 'droite' }))}
                          className={`py-1.5 px-2.5 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                            (cv.positionSidebar || 'gauche') === 'droite'
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          Sidebar à Droite
                        </button>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] font-bold text-slate-600 dark:text-slate-400">
                          <span>Largeur de la Sidebar :</span>
                          <span className="text-blue-600 dark:text-blue-400">{cv.largeurColonneGauche || 34}%</span>
                        </div>
                        <input
                          type="range"
                          min="20"
                          max="50"
                          value={cv.largeurColonneGauche || 34}
                          onChange={(e) => setCv(prev => ({ ...prev, largeurColonneGauche: parseInt(e.target.value) }))}
                          className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* DYNAMIC PHOTO CUSTOMIZATION SECTION */}
                <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <CameraIcon className="w-4 h-4 text-blue-600" />
                      <span>Photo de Profil Personnalisée</span>
                    </label>
                    {cv.photoUrl && (
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                        Totalement Dynamique
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    {cv.photoUrl ? (
                      <div className="relative group shrink-0">
                        <img
                          src={cv.photoUrl}
                          alt="Profil"
                          className="object-cover border-2 border-blue-600 shadow-md transition-all"
                          style={{
                            width: `${cv.photoTaille || 72}px`,
                            height: `${cv.photoTaille || 72}px`,
                            borderRadius: cv.photoRayon !== undefined ? `${cv.photoRayon}px` : (
                              cv.photoForme === 'carree' ? '0px' :
                              cv.photoForme === 'arrondie' ? '12px' :
                              cv.photoForme === 'arche' ? '999px 999px 8px 8px' : '9999px'
                            )
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setCv(prev => ({ ...prev, photoUrl: undefined }))}
                          className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full shadow-lg hover:bg-red-700 transition-transform hover:scale-110 cursor-pointer"
                          title="Supprimer la photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-400 shrink-0">
                        <CameraIcon className="w-6 h-6" />
                      </div>
                    )}

                    <div className="flex-1 space-y-2">
                      <label className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl cursor-pointer shadow-md shadow-blue-500/20 transition-all">
                        <span>{cv.photoUrl ? 'Changer la photo' : 'Importer une photo'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoSelect}
                          className="hidden"
                        />
                      </label>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Position, taille, forme et bordures 100% configurables en temps réel.
                      </p>
                    </div>
                  </div>

                  {/* ADVANCED DYNAMIC PHOTO CONTROLS (AVAILABLE WHEN PHOTO EXISTS) */}
                  {cv.photoUrl && (
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3.5 animate-fadeIn">
                      
                      {/* 1. Size Slider */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                          <span>Taille de la photo :</span>
                          <span className="text-blue-600 dark:text-blue-400 font-mono">{cv.photoTaille || 80} px</span>
                        </div>
                        <input
                          type="range"
                          min="40"
                          max="220"
                          value={cv.photoTaille || 80}
                          onChange={(e) => setCv(prev => ({ ...prev, photoTaille: parseInt(e.target.value) }))}
                          className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
                        />
                      </div>

                      {/* 2. Position / Emplacement */}
                      <div className="space-y-1.5">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Emplacement de la photo :</span>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setCv(prev => ({ ...prev, photoPosition: 'in-header' }))}
                            className={`py-1.5 px-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              (cv.photoPosition || 'in-header') === 'in-header'
                                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            Dans l'En-tête (Top)
                          </button>
                          <button
                            type="button"
                            onClick={() => setCv(prev => ({ ...prev, photoPosition: 'in-sidebar' }))}
                            className={`py-1.5 px-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              cv.photoPosition === 'in-sidebar'
                                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            Dans la Sidebar
                          </button>
                        </div>
                      </div>

                      {/* 3. Shape Selector & Custom Border Radius */}
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Forme de la photo :</span>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                          {[
                            { id: 'ronde', label: 'Ronde' },
                            { id: 'carree', label: 'Carrée' },
                            { id: 'arrondie', label: 'Arrondie' },
                            { id: 'arche', label: 'Arche' },
                            { id: 'hexagone', label: 'Hexagone' },
                            { id: 'galet', label: 'Galet' },
                          ].map(shape => (
                            <button
                              key={shape.id}
                              type="button"
                              onClick={() => setCv(prev => ({ ...prev, photoForme: shape.id as any, photoRayon: undefined }))}
                              className={`py-1.5 px-1 rounded-xl text-[11px] font-bold border transition-all cursor-pointer text-center ${
                                (cv.photoForme || 'ronde') === shape.id && cv.photoRayon === undefined
                                  ? 'bg-blue-600 text-white border-blue-600'
                                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                              }`}
                            >
                              {shape.label}
                            </button>
                          ))}
                        </div>

                        {/* Custom Border Radius Slider */}
                        <div className="space-y-1 pt-1">
                          <div className="flex justify-between text-[11px] font-bold text-slate-600 dark:text-slate-400">
                            <span>Rayon d'arrondi sur-mesure (0px = carré, 100px = rond) :</span>
                            <span className="text-blue-600 dark:text-blue-400 font-mono">{cv.photoRayon ?? (cv.photoForme === 'carree' ? 0 : 50)} px</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={cv.photoRayon ?? (cv.photoForme === 'carree' ? 0 : 50)}
                            onChange={(e) => setCv(prev => ({ ...prev, photoRayon: parseInt(e.target.value) }))}
                            className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
                          />
                        </div>
                      </div>

                      {/* 4. Border Thickness & Color */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] font-bold text-slate-600 dark:text-slate-400">
                            <span>Épaisseur de bordure :</span>
                            <span className="text-blue-600 dark:text-blue-400 font-mono">{cv.photoBordureEpaisseur ?? 2} px</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="10"
                            value={cv.photoBordureEpaisseur ?? 2}
                            onChange={(e) => setCv(prev => ({ ...prev, photoBordureEpaisseur: parseInt(e.target.value) }))}
                            className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
                          />
                        </div>

                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Couleur de bordure :</span>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={cv.photoBordureCouleur || '#FFFFFF'}
                              onChange={(e) => setCv(prev => ({ ...prev, photoBordureCouleur: e.target.value }))}
                              className="w-8 h-8 rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer p-0.5 bg-white dark:bg-slate-800"
                            />
                            <span className="text-xs font-mono text-slate-600 dark:text-slate-400 uppercase">
                              {cv.photoBordureCouleur || '#FFFFFF'}
                            </span>
                          </div>
                        </div>
                      </div>

                    </div>
                  )}
                </div>

                {/* SECTIONS LIST WITH DND & CONTROLS */}
                <div className="bg-slate-100/80 dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center space-x-1.5">
                    <button
                      type="button"
                      onClick={collapseAllSections}
                      className="px-2.5 py-1 text-[11px] font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                      title="Réduire toutes les sections"
                    >
                      <FolderClosed className="w-3.5 h-3.5 text-slate-500" />
                      <span>Tout réduire</span>
                    </button>
                    <button
                      type="button"
                      onClick={expandAllSections}
                      className="px-2.5 py-1 text-[11px] font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                      title="Déplier toutes les sections"
                    >
                      <FolderOpen className="w-3.5 h-3.5 text-blue-500" />
                      <span>Tout déplier</span>
                    </button>
                  </div>

                  {(cv.nombreColonnes || 2) === 2 && (
                    <div className="flex items-center space-x-1 bg-white dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700 text-[10px] font-bold">
                      <button
                        type="button"
                        onClick={() => setColumnFilter('toutes')}
                        className={`px-2 py-0.5 rounded-lg transition-colors ${
                          columnFilter === 'toutes' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        Toutes ({cv.sections.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setColumnFilter('gauche')}
                        className={`px-2 py-0.5 rounded-lg transition-colors ${
                          columnFilter === 'gauche' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        ◀ Col. Gauche ({cv.sections.filter(s => (s.colonne || 'principale') === 'gauche').length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setColumnFilter('droite')}
                        className={`px-2 py-0.5 rounded-lg transition-colors ${
                          columnFilter === 'droite' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        ▶ Col. Droite ({cv.sections.filter(s => (s.colonne || 'principale') === 'droite' || (s.colonne || 'principale') === 'principale').length})
                      </button>
                    </div>
                  )}
                </div>

                <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                  <SortableContext items={cv.sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                    {cv.sections
                      .filter(s => {
                        if (columnFilter === 'gauche') return (s.colonne || 'principale') === 'gauche';
                        if (columnFilter === 'droite') return (s.colonne || 'principale') === 'droite' || (s.colonne || 'principale') === 'principale';
                        return true;
                      })
                      .map((sec, secIdx, arr) => (
                      <SortableSectionItem
                        key={sec.id}
                        section={sec}
                        isExpanded={expandedSectionIds[sec.id] !== false}
                        onToggleExpand={() => toggleExpandSection(sec.id)}
                        onToggleVisibility={() => toggleSectionVisibility(sec.id)}
                        onDuplicate={() => duplicateSection(sec.id)}
                        onDelete={() => deleteSection(sec.id)}
                        onUpdateTitle={(title) => updateSectionTitle(sec.id, title)}
                        onMoveUp={() => handleMoveSectionUp(sec.id)}
                        onMoveDown={() => handleMoveSectionDown(sec.id)}
                        isFirst={secIdx === 0}
                        isLast={secIdx === arr.length - 1}
                        isTwoColumnMode={(cv.nombreColonnes || 2) === 2}
                        onUpdateColonne={(col) => {
                          const updated = cv.sections.map(s => s.id === sec.id ? { ...s, colonne: col } : s);
                          setCv(prev => ({ ...prev, sections: updated }));
                        }}
                      >
                        {/* SECTION 1: PROFIL / CONTACT */}
                        {sec.type === 'profil' && (
                          <div className="space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Nom & Prénom :</label>
                                <input
                                  type="text"
                                  value={(sec.contenu as any)?.nomComplet || ''}
                                  onChange={(e) => {
                                    setCv(prev => ({
                                      ...prev,
                                      sections: prev.sections.map(s => s.id === sec.id ? { ...s, contenu: { ...s.contenu, nomComplet: e.target.value } } : s)
                                    }));
                                  }}
                                  className="w-full px-3 py-1.5 text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                                  placeholder="ex: Jean Dupont"
                                />
                              </div>

                              <div>
                                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Titre professionnel :</label>
                                <input
                                  type="text"
                                  value={(sec.contenu as any)?.titreProfessionnel || ''}
                                  onChange={(e) => {
                                    setCv(prev => ({
                                      ...prev,
                                      sections: prev.sections.map(s => s.id === sec.id ? { ...s, contenu: { ...s.contenu, titreProfessionnel: e.target.value } } : s)
                                    }));
                                  }}
                                  className="w-full px-3 py-1.5 text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                                  placeholder="ex: Développeur Full-Stack"
                                />
                              </div>

                              <div>
                                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Email :</label>
                                <input
                                  type="email"
                                  value={(sec.contenu as any)?.email || ''}
                                  onChange={(e) => {
                                    setCv(prev => ({
                                      ...prev,
                                      sections: prev.sections.map(s => s.id === sec.id ? { ...s, contenu: { ...s.contenu, email: e.target.value } } : s)
                                    }));
                                  }}
                                  className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                                  placeholder="ex: jean.dupont@email.com"
                                />
                              </div>

                              <div>
                                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Téléphone :</label>
                                <input
                                  type="tel"
                                  value={(sec.contenu as any)?.telephone || ''}
                                  onChange={(e) => {
                                    setCv(prev => ({
                                      ...prev,
                                      sections: prev.sections.map(s => s.id === sec.id ? { ...s, contenu: { ...s.contenu, telephone: e.target.value } } : s)
                                    }));
                                  }}
                                  className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                                  placeholder="ex: +33 6 12 34 56 78"
                                />
                              </div>

                              <div>
                                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Adresse / Ville :</label>
                                <input
                                  type="text"
                                  value={(sec.contenu as any)?.adresse || ''}
                                  onChange={(e) => {
                                    setCv(prev => ({
                                      ...prev,
                                      sections: prev.sections.map(s => s.id === sec.id ? { ...s, contenu: { ...s.contenu, adresse: e.target.value } } : s)
                                    }));
                                  }}
                                  className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                                  placeholder="ex: Paris, France"
                                />
                              </div>

                              <div>
                                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Site Web / LinkedIn :</label>
                                <input
                                  type="text"
                                  value={(sec.contenu as any)?.linkedin || ''}
                                  onChange={(e) => {
                                    setCv(prev => ({
                                      ...prev,
                                      sections: prev.sections.map(s => s.id === sec.id ? { ...s, contenu: { ...s.contenu, linkedin: e.target.value } } : s)
                                    }));
                                  }}
                                  className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                                  placeholder="ex: linkedin.com/in/jeandupont"
                                />
                              </div>
                            </div>

                            {/* GRAND TITRE EN-TÊTE & DÉPLACEMENT PHOTO */}
                            <div className="p-3 bg-blue-50/50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-900/50 space-y-3">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="text-[11px] font-bold text-blue-900 dark:text-blue-300">Grand Titre de l'En-tête :</label>
                                  <select
                                    value={cv.grandTitreMode || 'nom'}
                                    onChange={(e) => setCv(prev => ({ ...prev, grandTitreMode: e.target.value as any }))}
                                    className="w-full px-2.5 py-1.5 text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none cursor-pointer"
                                  >
                                    <option value="nom">Prénom & Nom (Par défaut)</option>
                                    <option value="poste">Intitulé de Poste en grand</option>
                                    <option value="custom">Titre Personnalisé (Libre)</option>
                                  </select>
                                </div>

                                <div>
                                  <label className="text-[11px] font-bold text-blue-900 dark:text-blue-300">Emplacement de la Photo :</label>
                                  <select
                                    value={cv.photoPosition || 'in-header'}
                                    onChange={(e) => setCv(prev => ({ ...prev, photoPosition: e.target.value as any }))}
                                    className="w-full px-2.5 py-1.5 text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none cursor-pointer"
                                  >
                                    <option value="in-header">En-tête (Haut)</option>
                                    <option value="in-sidebar">Sidebar (Colonne)</option>
                                    <option value="free">Libre (Déplaçable à la souris)</option>
                                  </select>
                                </div>
                              </div>

                              {cv.grandTitreMode === 'custom' && (
                                <div>
                                  <label className="text-[11px] font-bold text-blue-800 dark:text-blue-300">Texte du Grand Titre Personnalisé :</label>
                                  <input
                                    type="text"
                                    value={cv.grandTitreTexte || ''}
                                    onChange={(e) => setCv(prev => ({ ...prev, grandTitreTexte: e.target.value }))}
                                    className="w-full px-3 py-1.5 text-xs font-bold bg-white dark:bg-slate-900 border-2 border-blue-500 rounded-lg outline-none"
                                    placeholder="ex: ARCHITECTE CLOUD & CONSULTANT DIGITAL"
                                  />
                                </div>
                              )}

                              {/* PHOTO SLIDERS POSITION X & Y */}
                              <div className="pt-2 border-t border-blue-200 dark:border-blue-800/60">
                                <div className="flex justify-between items-center mb-1 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                                  <span>Position Horizontale (X) & Verticale (Y)</span>
                                  <span className="font-mono text-blue-600">X: {cv.photoX ?? 10}% | Y: {cv.photoY ?? 5}%</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <span className="text-[10px] text-slate-500">X ({cv.photoX ?? 10}%)</span>
                                    <input
                                      type="range"
                                      min={0}
                                      max={95}
                                      value={cv.photoX ?? 10}
                                      onChange={(e) => setCv(prev => ({ ...prev, photoX: parseInt(e.target.value, 10), photoPosition: 'free' }))}
                                      className="w-full accent-blue-600 cursor-pointer"
                                    />
                                  </div>
                                  <div>
                                    <span className="text-[10px] text-slate-500">Y ({cv.photoY ?? 5}%)</span>
                                    <input
                                      type="range"
                                      min={0}
                                      max={95}
                                      value={cv.photoY ?? 5}
                                      onChange={(e) => setCv(prev => ({ ...prev, photoY: parseInt(e.target.value, 10), photoPosition: 'free' }))}
                                      className="w-full accent-blue-600 cursor-pointer"
                                    />
                                  </div>
                                </div>
                              </div>
                              {/* PROFILE BACKGROUND & TEXT COLOR */}
                              <div className="pt-2 border-t border-blue-200 dark:border-blue-800/60">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div>
                                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1">
                                      <Palette className="w-3.5 h-3.5 text-blue-600" />
                                      <span>Couleur de fond du profil :</span>
                                    </label>
                                    <div className="flex items-center gap-2">
                                      <input
                                        type="color"
                                        value={cv.couleurFondProfil || sec.styleSection?.couleurFond || cv.couleurAccent || '#2563EB'}
                                        onChange={(e) => {
                                          const val = e.target.value;
                                          setCv(prev => ({
                                            ...prev,
                                            couleurFondProfil: val,
                                            sections: prev.sections.map(s => s.id === sec.id ? {
                                              ...s,
                                              styleSection: { ...(s.styleSection || {}), couleurFond: val }
                                            } : s)
                                          }));
                                        }}
                                        className="w-8 h-8 rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer p-0.5 bg-white dark:bg-slate-800"
                                      />
                                      <input
                                        type="text"
                                        value={cv.couleurFondProfil || sec.styleSection?.couleurFond || ''}
                                        onChange={(e) => {
                                          const val = e.target.value;
                                          setCv(prev => ({
                                            ...prev,
                                            couleurFondProfil: val,
                                            sections: prev.sections.map(s => s.id === sec.id ? {
                                              ...s,
                                              styleSection: { ...(s.styleSection || {}), couleurFond: val }
                                            } : s)
                                          }));
                                        }}
                                        placeholder="ex: #2563EB"
                                        className="flex-1 px-2.5 py-1 text-xs font-mono font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none"
                                      />
                                      {(cv.couleurFondProfil || sec.styleSection?.couleurFond) && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setCv(prev => ({
                                              ...prev,
                                              couleurFondProfil: undefined,
                                              sections: prev.sections.map(s => s.id === sec.id ? {
                                                ...s,
                                                styleSection: { ...(s.styleSection || {}), couleurFond: undefined }
                                              } : s)
                                            }));
                                          }}
                                          className="px-2 py-1 text-[10px] font-bold text-slate-500 hover:text-red-500 border border-slate-200 dark:border-slate-700 rounded-md cursor-pointer"
                                        >
                                          Reset
                                        </button>
                                      )}
                                    </div>
                                  </div>

                                  <div>
                                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1">
                                      <Palette className="w-3.5 h-3.5 text-blue-600" />
                                      <span>Couleur de texte du profil :</span>
                                    </label>
                                    <div className="flex items-center gap-2">
                                      <input
                                        type="color"
                                        value={cv.couleurTexteProfil || sec.styleSection?.couleurTexte || '#FFFFFF'}
                                        onChange={(e) => {
                                          const val = e.target.value;
                                          setCv(prev => ({
                                            ...prev,
                                            couleurTexteProfil: val,
                                            sections: prev.sections.map(s => s.id === sec.id ? {
                                              ...s,
                                              styleSection: { ...(s.styleSection || {}), couleurTexte: val }
                                            } : s)
                                          }));
                                        }}
                                        className="w-8 h-8 rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer p-0.5 bg-white dark:bg-slate-800"
                                      />
                                      <input
                                        type="text"
                                        value={cv.couleurTexteProfil || sec.styleSection?.couleurTexte || '#FFFFFF'}
                                        onChange={(e) => {
                                          const val = e.target.value;
                                          setCv(prev => ({
                                            ...prev,
                                            couleurTexteProfil: val,
                                            sections: prev.sections.map(s => s.id === sec.id ? {
                                              ...s,
                                              styleSection: { ...(s.styleSection || {}), couleurTexte: val }
                                            } : s)
                                          }));
                                        }}
                                        placeholder="#FFFFFF"
                                        className="flex-1 px-2.5 py-1 text-xs font-mono font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <SpellCheckField
                              label="Résumé / Profil Professionnel"
                              multiline
                              rows={3}
                              value={(sec.contenu as any)?.resume || ''}
                              onChange={(val) => {
                                setCv(prev => ({
                                  ...prev,
                                  sections: prev.sections.map(s => s.id === sec.id ? { ...s, contenu: { ...s.contenu, resume: val } } : s)
                                }));
                              }}
                              langue={langue}
                            />
                          </div>
                        )}

                        {/* SECTION 2: EXPERIENCES */}
                        {sec.type === 'experience' && (
                          <div className="space-y-4">
                            {(sec.contenu as ExperienceItem[])?.map((exp, expIdx) => (
                              <div key={exp.id} className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-black uppercase text-blue-600">Expérience #{expIdx + 1}</span>
                                  <div className="flex items-center space-x-1">
                                    <button
                                      type="button"
                                      disabled={expIdx === 0}
                                      onClick={() => moveSubItem(sec.id, expIdx, expIdx - 1)}
                                      className="p-1 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-20 rounded cursor-pointer"
                                      title="Monter cet élément"
                                    >
                                      <ArrowUp className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      disabled={expIdx === (sec.contenu as ExperienceItem[]).length - 1}
                                      onClick={() => moveSubItem(sec.id, expIdx, expIdx + 1)}
                                      className="p-1 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-20 rounded cursor-pointer"
                                      title="Descendre cet élément"
                                    >
                                      <ArrowDown className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const list = (sec.contenu as ExperienceItem[]).filter((_, i) => i !== expIdx);
                                        setCv(prev => ({
                                          ...prev,
                                          sections: prev.sections.map(s => s.id === sec.id ? { ...s, contenu: list } : s)
                                        }));
                                      }}
                                      className="text-slate-400 hover:text-red-600 p-1 rounded-lg cursor-pointer ml-1"
                                      title="Supprimer cet élément"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  <input
                                    type="text"
                                    value={exp.poste}
                                    placeholder="Intitulé du poste (ex: Chef de Projet)"
                                    onChange={(e) => {
                                      const list = [...(sec.contenu as ExperienceItem[])];
                                      list[expIdx].poste = e.target.value;
                                      setCv(prev => ({
                                        ...prev,
                                        sections: prev.sections.map(s => s.id === sec.id ? { ...s, contenu: list } : s)
                                      }));
                                    }}
                                    className="px-3 py-1.5 text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                                  />
                                  <input
                                    type="text"
                                    value={exp.entreprise}
                                    placeholder="Entreprise / Organisation"
                                    onChange={(e) => {
                                      const list = [...(sec.contenu as ExperienceItem[])];
                                      list[expIdx].entreprise = e.target.value;
                                      setCv(prev => ({
                                        ...prev,
                                        sections: prev.sections.map(s => s.id === sec.id ? { ...s, contenu: list } : s)
                                      }));
                                    }}
                                    className="px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                                  />
                                  <input
                                    type="text"
                                    value={exp.dateDebut}
                                    placeholder="Date début (ex: Jan 2020)"
                                    onChange={(e) => {
                                      const list = [...(sec.contenu as ExperienceItem[])];
                                      list[expIdx].dateDebut = e.target.value;
                                      setCv(prev => ({
                                        ...prev,
                                        sections: prev.sections.map(s => s.id === sec.id ? { ...s, contenu: list } : s)
                                      }));
                                    }}
                                    className="px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                                  />
                                  <input
                                    type="text"
                                    value={exp.dateFin}
                                    placeholder="Date fin (ex: Présent)"
                                    onChange={(e) => {
                                      const list = [...(sec.contenu as ExperienceItem[])];
                                      list[expIdx].dateFin = e.target.value;
                                      setCv(prev => ({
                                        ...prev,
                                        sections: prev.sections.map(s => s.id === sec.id ? { ...s, contenu: list } : s)
                                      }));
                                    }}
                                    className="px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                                  />
                                </div>

                                <SpellCheckField
                                  label="Missions & Réalisations"
                                  multiline
                                  rows={3}
                                  value={exp.description || ''}
                                  onChange={(val) => {
                                    const list = [...(sec.contenu as ExperienceItem[])];
                                    list[expIdx].description = val;
                                    setCv(prev => ({
                                      ...prev,
                                      sections: prev.sections.map(s => s.id === sec.id ? { ...s, contenu: list } : s)
                                    }));
                                  }}
                                  langue={langue}
                                />
                              </div>
                            ))}

                            <button
                              type="button"
                              onClick={() => {
                                const list = [...(sec.contenu as ExperienceItem[] || [])];
                                list.push({
                                  id: `exp-${Date.now()}`,
                                  poste: 'Nouvelle expérience',
                                  entreprise: 'Entreprise',
                                  ville: 'Paris',
                                  dateDebut: '2022',
                                  dateFin: 'Présent',
                                  actuel: true,
                                  description: 'Description des tâches et réalisations...'
                                });
                                setCv(prev => ({
                                  ...prev,
                                  sections: prev.sections.map(s => s.id === sec.id ? { ...s, contenu: list } : s)
                                }));
                              }}
                              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
                            >
                              <Plus className="w-4 h-4" />
                              <span>Ajouter une expérience</span>
                            </button>
                          </div>
                        )}

                        {/* SECTION 3: FORMATION */}
                        {sec.type === 'formation' && (
                          <div className="space-y-4">
                            {(sec.contenu as FormationItem[])?.map((edu, eduIdx) => (
                              <div key={edu.id} className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-black uppercase text-blue-600">Formation #{eduIdx + 1}</span>
                                  <div className="flex items-center space-x-1">
                                    <button
                                      type="button"
                                      disabled={eduIdx === 0}
                                      onClick={() => moveSubItem(sec.id, eduIdx, eduIdx - 1)}
                                      className="p-1 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-20 rounded cursor-pointer"
                                      title="Monter cette formation"
                                    >
                                      <ArrowUp className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      disabled={eduIdx === (sec.contenu as FormationItem[]).length - 1}
                                      onClick={() => moveSubItem(sec.id, eduIdx, eduIdx + 1)}
                                      className="p-1 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-20 rounded cursor-pointer"
                                      title="Descendre cette formation"
                                    >
                                      <ArrowDown className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const list = (sec.contenu as FormationItem[]).filter((_, i) => i !== eduIdx);
                                        setCv(prev => ({
                                          ...prev,
                                          sections: prev.sections.map(s => s.id === sec.id ? { ...s, contenu: list } : s)
                                        }));
                                      }}
                                      className="text-slate-400 hover:text-red-600 p-1 rounded-lg cursor-pointer ml-1"
                                      title="Supprimer cette formation"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  <input
                                    type="text"
                                    value={edu.diplome}
                                    placeholder="Diplôme / Intitulé"
                                    onChange={(e) => {
                                      const list = [...(sec.contenu as FormationItem[])];
                                      list[eduIdx].diplome = e.target.value;
                                      setCv(prev => ({
                                        ...prev,
                                        sections: prev.sections.map(s => s.id === sec.id ? { ...s, contenu: list } : s)
                                      }));
                                    }}
                                    className="px-3 py-1.5 text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                                  />
                                  <input
                                    type="text"
                                    value={edu.etablissement}
                                    placeholder="École / Université"
                                    onChange={(e) => {
                                      const list = [...(sec.contenu as FormationItem[])];
                                      list[eduIdx].etablissement = e.target.value;
                                      setCv(prev => ({
                                        ...prev,
                                        sections: prev.sections.map(s => s.id === sec.id ? { ...s, contenu: list } : s)
                                      }));
                                    }}
                                    className="px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                                  />
                                  <input
                                    type="text"
                                    value={edu.dateDebut}
                                    placeholder="Date début (ex: 2018)"
                                    onChange={(e) => {
                                      const list = [...(sec.contenu as FormationItem[])];
                                      list[eduIdx].dateDebut = e.target.value;
                                      setCv(prev => ({
                                        ...prev,
                                        sections: prev.sections.map(s => s.id === sec.id ? { ...s, contenu: list } : s)
                                      }));
                                    }}
                                    className="px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                                  />
                                  <input
                                    type="text"
                                    value={edu.dateFin}
                                    placeholder="Date fin (ex: 2021)"
                                    onChange={(e) => {
                                      const list = [...(sec.contenu as FormationItem[])];
                                      list[eduIdx].dateFin = e.target.value;
                                      setCv(prev => ({
                                        ...prev,
                                        sections: prev.sections.map(s => s.id === sec.id ? { ...s, contenu: list } : s)
                                      }));
                                    }}
                                    className="px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                                  />
                                </div>
                              </div>
                            ))}

                            <button
                              type="button"
                              onClick={() => {
                                const list = [...(sec.contenu as FormationItem[] || [])];
                                list.push({
                                  id: `edu-${Date.now()}`,
                                  diplome: 'Nouveau diplôme',
                                  etablissement: 'Université / École',
                                  ville: 'Paris',
                                  dateDebut: '2019',
                                  dateFin: '2022'
                                });
                                setCv(prev => ({
                                  ...prev,
                                  sections: prev.sections.map(s => s.id === sec.id ? { ...s, contenu: list } : s)
                                }));
                              }}
                              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
                            >
                              <Plus className="w-4 h-4" />
                              <span>Ajouter une formation</span>
                            </button>
                          </div>
                        )}

                        {/* SECTION 4: COMPETENCES */}
                        {sec.type === 'competences' && (
                          <div className="space-y-3">
                            {(sec.contenu as CompetenceItem[])?.map((sk, skIdx) => (
                              <div key={sk.id} className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2">
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="text"
                                    value={sk.nom}
                                    placeholder="Nom de la compétence"
                                    onChange={(e) => {
                                      const list = [...(sec.contenu as CompetenceItem[])];
                                      list[skIdx].nom = e.target.value;
                                      setCv(prev => ({
                                        ...prev,
                                        sections: prev.sections.map(s => s.id === sec.id ? { ...s, contenu: list } : s)
                                      }));
                                    }}
                                    className="flex-1 px-3 py-1.5 text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                                  />
                                  <input
                                    type="range"
                                    min="1"
                                    max="5"
                                    value={sk.niveau || 4}
                                    onChange={(e) => {
                                      const list = [...(sec.contenu as CompetenceItem[])];
                                      list[skIdx].niveau = Number(e.target.value);
                                      setCv(prev => ({
                                        ...prev,
                                        sections: prev.sections.map(s => s.id === sec.id ? { ...s, contenu: list } : s)
                                      }));
                                    }}
                                    className="w-20 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                  />
                                  <div className="flex items-center space-x-0.5">
                                    <button
                                      type="button"
                                      disabled={skIdx === 0}
                                      onClick={() => moveSubItem(sec.id, skIdx, skIdx - 1)}
                                      className="p-1 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-20 rounded cursor-pointer"
                                      title="Monter cette compétence"
                                    >
                                      <ArrowUp className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      disabled={skIdx === (sec.contenu as CompetenceItem[]).length - 1}
                                      onClick={() => moveSubItem(sec.id, skIdx, skIdx + 1)}
                                      className="p-1 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-20 rounded cursor-pointer"
                                      title="Descendre cette compétence"
                                    >
                                      <ArrowDown className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const list = (sec.contenu as CompetenceItem[]).filter((_, i) => i !== skIdx);
                                        setCv(prev => ({
                                          ...prev,
                                          sections: prev.sections.map(s => s.id === sec.id ? { ...s, contenu: list } : s)
                                        }));
                                      }}
                                      className="text-slate-400 hover:text-red-600 p-1 rounded-lg cursor-pointer"
                                      title="Supprimer cette compétence"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}

                            <button
                              type="button"
                              onClick={() => {
                                const list = [...(sec.contenu as CompetenceItem[] || [])];
                                list.push({ id: `sk-${Date.now()}`, nom: 'Nouvelle compétence', niveau: 4 });
                                setCv(prev => ({
                                  ...prev,
                                  sections: prev.sections.map(s => s.id === sec.id ? { ...s, contenu: list } : s)
                                }));
                              }}
                              className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1"
                            >
                              <Plus className="w-4 h-4" />
                              <span>Ajouter une compétence</span>
                            </button>
                          </div>
                        )}

                        {/* SECTION 5: LANGUES */}
                        {sec.type === 'langues' && (
                          <div className="space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {(sec.contenu as LangueItem[])?.map((lg, lgIdx) => (
                                <div key={lg.id} className="p-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center space-x-2">
                                  <input
                                    type="text"
                                    value={lg.langue}
                                    placeholder="Langue"
                                    onChange={(e) => {
                                      const list = [...(sec.contenu as LangueItem[])];
                                      list[lgIdx].langue = e.target.value;
                                      setCv(prev => ({
                                        ...prev,
                                        sections: prev.sections.map(s => s.id === sec.id ? { ...s, contenu: list } : s)
                                      }));
                                    }}
                                    className="flex-1 px-2 py-1 text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none"
                                  />
                                  <input
                                    type="text"
                                    value={lg.niveau}
                                    placeholder="Niveau"
                                    onChange={(e) => {
                                      const list = [...(sec.contenu as LangueItem[])];
                                      list[lgIdx].niveau = e.target.value;
                                      setCv(prev => ({
                                        ...prev,
                                        sections: prev.sections.map(s => s.id === sec.id ? { ...s, contenu: list } : s)
                                      }));
                                    }}
                                    className="w-24 px-2 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none"
                                  />
                                  <div className="flex items-center space-x-0.5">
                                    <button
                                      type="button"
                                      disabled={lgIdx === 0}
                                      onClick={() => moveSubItem(sec.id, lgIdx, lgIdx - 1)}
                                      className="p-1 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-20 rounded cursor-pointer"
                                      title="Monter cette langue"
                                    >
                                      <ArrowUp className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      disabled={lgIdx === (sec.contenu as LangueItem[]).length - 1}
                                      onClick={() => moveSubItem(sec.id, lgIdx, lgIdx + 1)}
                                      className="p-1 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-20 rounded cursor-pointer"
                                      title="Descendre cette langue"
                                    >
                                      <ArrowDown className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const list = (sec.contenu as LangueItem[]).filter((_, i) => i !== lgIdx);
                                        setCv(prev => ({
                                          ...prev,
                                          sections: prev.sections.map(s => s.id === sec.id ? { ...s, contenu: list } : s)
                                        }));
                                      }}
                                      className="text-slate-400 hover:text-red-600 p-1 rounded-lg cursor-pointer"
                                      title="Supprimer cette langue"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                const list = [...(sec.contenu as LangueItem[] || [])];
                                list.push({ id: `lg-${Date.now()}`, langue: 'Nouveau langage', niveau: 'Intermédiaire' });
                                setCv(prev => ({
                                  ...prev,
                                  sections: prev.sections.map(s => s.id === sec.id ? { ...s, contenu: list } : s)
                                }));
                              }}
                              className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1"
                            >
                              <Plus className="w-4 h-4" />
                              <span>Ajouter une langue</span>
                            </button>
                          </div>
                        )}

                        {/* SECTION 6: PERSONNALISEE */}
                        {sec.type === 'personnalisee' && (
                          <div className="space-y-3">
                            <SpellCheckField
                              label="Contenu texte libre de la section"
                              multiline
                              rows={4}
                              value={(sec.contenu as PersonnaliseeContenu)?.texteLibre || ''}
                              onChange={(val) => {
                                setCv(prev => ({
                                  ...prev,
                                  sections: prev.sections.map(s => s.id === sec.id ? { ...s, contenu: { ...s.contenu, texteLibre: val } } : s)
                                }));
                              }}
                              langue={langue}
                            />
                          </div>
                        )}
                      </SortableSectionItem>
                    ))}
                  </SortableContext>
                </DndContext>

                {/* Add Custom Section Button */}
                <button
                  type="button"
                  onClick={addCustomSection}
                  className="w-full py-3 bg-white dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-blue-500 text-slate-700 dark:text-slate-300 hover:text-blue-600 font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter une nouvelle section personnalisée</span>
                </button>
              </div>
            )}
          </div>

          {/* RIGHT PANEL: LIVE CV PREVIEW (Cols 7-12) */}
          <div className={`md:col-span-6 sticky top-24 self-start ${activeTab === 'preview' ? 'block' : 'hidden md:block'}`}>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold px-1">
                <span>Rendu A4 Temps Réel</span>
                <span className="text-[10px] bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">Format d'impression officiel A4</span>
              </div>

              <CVPreview
                cv={cv}
                onMoveSectionUp={handleMoveSectionUp}
                onMoveSectionDown={handleMoveSectionDown}
                onUpdateColor={(color) => setCv(prev => ({ ...prev, couleurAccent: color }))}
                onUpdatePhotoShape={(shape) => setCv(prev => ({ ...prev, photoForme: shape }))}
                onUpdatePhotoSize={(size) => setCv(prev => ({ ...prev, photoTaille: size }))}
                onSectionsReorder={handleSectionsReorder}
                onUpdateSectionZone={handleUpdateSectionZone}
                onUpdateCV={(updated) => setCv(prev => ({ ...prev, ...updated }))}
                interactivePreview={true}
              />
            </div>
          </div>

        </div>
      </main>

      {/* MOBILE BOTTOM TOOLBAR (OPTIMIZED TOUCH NAVIGATION) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-3 py-2 flex items-center justify-between md:hidden shadow-2xl safe-area-bottom">
        {/* Assistant / Wizard */}
        <button
          type="button"
          onClick={() => { setEditorMode('form'); setActiveTab('wizard'); }}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'wizard' && editorMode === 'form' ? 'text-blue-400 font-extrabold' : 'text-slate-400'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Assistant</span>
        </button>

        {/* Sections */}
        <button
          type="button"
          onClick={() => { setEditorMode('form'); setActiveTab('sections'); }}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'sections' && editorMode === 'form' ? 'text-blue-400 font-extrabold' : 'text-slate-400'
          }`}
        >
          <Layers className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Sections</span>
        </button>

        {/* Studio / Design */}
        <button
          type="button"
          onClick={() => { setEditorMode('form'); setActiveTab('style'); }}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'style' && editorMode === 'form' ? 'text-purple-400 font-extrabold' : 'text-slate-400'
          }`}
        >
          <Sliders className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Design</span>
        </button>

        {/* Édition Visuelle */}
        <button
          type="button"
          onClick={() => { setEditorMode('visual'); setActiveTab('visual'); }}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all cursor-pointer ${
            editorMode === 'visual' ? 'text-emerald-400 font-extrabold' : 'text-slate-400'
          }`}
        >
          <Palette className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Visuel</span>
        </button>

        {/* Aperçu Plein Écran */}
        <button
          type="button"
          onClick={() => setShowMobilePreviewModal(true)}
          className="flex flex-col items-center justify-center p-1.5 rounded-xl bg-blue-600 text-white shadow-md cursor-pointer active:scale-95 transition-transform"
        >
          <Eye className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 font-bold">Aperçu</span>
        </button>

        {/* Télécharger PDF */}
        <button
          type="button"
          onClick={handleExportPDF}
          className="flex flex-col items-center justify-center p-1.5 rounded-xl bg-emerald-600 text-white shadow-md cursor-pointer active:scale-95 transition-transform"
        >
          <Download className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 font-bold">PDF</span>
        </button>
      </div>

      {/* MOBILE PREVIEW MODAL WITH ZOOM CONTROL */}
      {showMobilePreviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md p-2 sm:p-4 flex flex-col items-center justify-between overflow-hidden">
          {/* Header Controls */}
          <div className="w-full max-w-2xl bg-slate-900 rounded-2xl px-4 py-2.5 border border-slate-800 flex items-center justify-between shadow-xl shrink-0">
            <span className="text-xs font-black uppercase text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-500" />
              <span>Aperçu Document A4</span>
            </span>

            {/* Zoom Slider */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-slate-400">Zoom: {Math.round(mobileZoom * 100)}%</span>
              <input
                type="range"
                min="0.35"
                max="1.1"
                step="0.05"
                value={mobileZoom}
                onChange={(e) => setMobileZoom(parseFloat(e.target.value))}
                className="w-20 accent-blue-600 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportPDF}
                className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PDF</span>
              </button>
              <button
                type="button"
                onClick={() => setShowMobilePreviewModal(false)}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scaled Preview Canvas Body */}
          <div className="w-full flex-1 overflow-auto flex items-start justify-center p-2">
            <div
              style={{
                transform: `scale(${mobileZoom})`,
                transformOrigin: 'top center',
                transition: 'transform 0.15s ease'
              }}
              className="shrink-0 shadow-2xl rounded-lg overflow-hidden my-2"
            >
              <CVPreview
                cv={cv}
                onSectionsReorder={handleSectionsReorder}
                onUpdateSectionZone={handleUpdateSectionZone}
                onUpdateCV={(updated) => setCv(prev => ({ ...prev, ...updated }))}
                interactivePreview={false}
              />
            </div>
          </div>
        </div>
      )}

      {/* Photo Cropper Modal */}
      {cropperImageSrc && (
        <PhotoCropper
          imageSrc={cropperImageSrc}
          onCropComplete={(croppedUrl) => {
            setCv(prev => ({ ...prev, photoUrl: croppedUrl }));
            setCropperImageSrc(null);
          }}
          onCancel={() => setCropperImageSrc(null)}
        />
      )}

    </div>
  );
};

const CameraIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
