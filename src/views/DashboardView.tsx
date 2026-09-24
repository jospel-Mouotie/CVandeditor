import React, { useState } from 'react';
import { CV, Language } from '../types';
import { getTranslation } from '../i18n/translations';
import { getActiveCVDraft, getLastSavedTime, formatSavedTimeAgo } from '../utils/cvDraftStorage';
import { 
  Plus, 
  Search, 
  Edit3, 
  Copy, 
  Trash2, 
  Download, 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  FileText, 
  Upload, 
  X, 
  AlertTriangle, 
  FilePlus,
  Target,
  Mail,
  Linkedin,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';

interface DashboardViewProps {
  cvs: CV[];
  langue: Language;
  lettersCount?: number;
  initialTypeFilter?: 'ALL' | 'ORIGINAL' | 'MODIFIED';
  onCreateNew: () => void;
  onCreateBlankCV?: () => void;
  onImportClick: () => void;
  onEditCV: (cv: CV) => void;
  onDuplicateCV: (cvId: string) => void;
  onRenameCV: (cvId: string, currentTitle: string) => void;
  onDeleteCV: (cvId: string) => void;
  onPayOrExport: (cv: CV) => void;
  onGoToLetters?: () => void;
  onGoToJobTargeting?: () => void;
  onGoToLetterGenerator?: () => void;
  onGoToLinkedIn?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  cvs = [],
  langue,
  lettersCount = 0,
  initialTypeFilter = 'ALL',
  onCreateNew,
  onCreateBlankCV,
  onImportClick,
  onEditCV,
  onDuplicateCV,
  onRenameCV,
  onDeleteCV,
  onPayOrExport,
  onGoToLetters,
  onGoToJobTargeting,
  onGoToLetterGenerator,
  onGoToLinkedIn
}) => {
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(langue, key);

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'ORIGINAL' | 'MODIFIED'>(initialTypeFilter);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PAYE' | 'NON_PAYE'>('ALL');

  const [renameTarget, setRenameTarget] = useState<{ id: string; title: string } | null>(null);
  const [newTitleInput, setNewTitleInput] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const safeCvs = Array.isArray(cvs) ? cvs : [];
  const originalCount = safeCvs.filter(c => !c.isModified).length;
  const modifiedCount = safeCvs.filter(c => c.isModified).length;

  const filteredCVs = safeCvs.filter(cv => {
    const matchesSearch = (cv.titre || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cv.jobTargetTitle || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cv.jobTargetCompany || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = 
      typeFilter === 'ALL' ||
      (typeFilter === 'ORIGINAL' && !cv.isModified) ||
      (typeFilter === 'MODIFIED' && cv.isModified === true);

    const matchesStatus = 
      statusFilter === 'ALL' ||
      (statusFilter === 'PAYE' && cv.statutPaiement === 'PAYE') ||
      (statusFilter === 'NON_PAYE' && cv.statutPaiement !== 'PAYE');

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleOpenRename = (cv: CV) => {
    setRenameTarget({ id: cv.id, title: cv.titre });
    setNewTitleInput(cv.titre);
  };

  const handleConfirmRename = () => {
    if (renameTarget && newTitleInput.trim()) {
      onRenameCV(renameTarget.id, newTitleInput.trim());
      showToast('CV renommé avec succès');
      setRenameTarget(null);
    }
  };

  const handleOpenDelete = (cv: CV) => {
    setDeleteTarget({ id: cv.id, title: cv.titre });
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      onDeleteCV(deleteTarget.id);
      showToast('CV supprimé avec succès');
      setDeleteTarget(null);
    }
  };

  const handleDuplicate = (cv: CV) => {
    onDuplicateCV(cv.id);
    showToast(`Copie de "${cv.titre}" créée`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 relative">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-black text-white px-5 py-3 rounded-lg shadow-2xl flex items-center gap-2 text-xs font-medium animate-fade-in border border-white/10">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-black/10 dark:border-white/10">
        <div>
          <h1 className="text-2xl font-light text-black dark:text-white tracking-wide">
            {t('myResumes')}
          </h1>
          <p className="text-sm text-black/50 dark:text-white/50 font-light mt-1">
            {safeCvs.length} {langue === 'en' ? 'resumes' : langue === 'ar' ? 'سير ذاتية' : 'CVs'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onImportClick}
            className="px-4 py-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-black/70 dark:text-white/70 text-sm font-medium rounded-lg transition-all border border-black/10 dark:border-white/10 flex items-center gap-2 cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>{t('importCVBtn')}</span>
          </button>

          {onCreateBlankCV && (
            <button
              type="button"
              onClick={onCreateBlankCV}
              className="px-4 py-2 bg-black dark:bg-white hover:bg-black/80 dark:hover:bg-white/80 text-white dark:text-black text-sm font-medium rounded-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <FilePlus className="w-4 h-4" />
              <span>{langue === 'en' ? 'Blank' : langue === 'ar' ? 'صفحة بيضاء' : 'Vierge'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onCreateNew}
            className="px-4 py-2 bg-black dark:bg-white hover:bg-black/80 dark:hover:bg-white/80 text-white dark:text-black text-sm font-medium rounded-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{langue === 'en' ? 'New CV' : langue === 'ar' ? 'سيرة جديدة' : 'Nouveau CV'}</span>
          </button>
        </div>
      </div>

      {/* Quick Shortcuts - Minimal */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {onGoToLetters && (
          <div
            onClick={onGoToLetters}
            className="border border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 p-4 rounded-lg transition-all cursor-pointer flex items-center justify-between group bg-white dark:bg-transparent"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center shrink-0 group-hover:border-black/30 dark:group-hover:border-white/30 transition-colors">
                <Mail className="w-4 h-4 text-black/50 dark:text-white/50" />
              </div>
              <div>
                <h4 className="font-medium text-sm text-black dark:text-white">
                  {langue === 'en' ? 'Cover Letters' : langue === 'ar' ? 'رسائل الدافع' : 'Lettres'}
                </h4>
                <p className="text-xs text-black/40 dark:text-white/40">
                  {lettersCount} {langue === 'en' ? 'saved' : langue === 'ar' ? 'محفوظة' : 'enregistrée'}
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-black/30 dark:text-white/30 group-hover:translate-x-1 transition-transform" />
          </div>
        )}

        {onGoToJobTargeting && (
          <div
            onClick={onGoToJobTargeting}
            className="border border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 p-4 rounded-lg transition-all cursor-pointer flex items-center justify-between group bg-white dark:bg-transparent"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center shrink-0 group-hover:border-black/30 dark:group-hover:border-white/30 transition-colors">
                <Target className="w-4 h-4 text-black/50 dark:text-white/50" />
              </div>
              <div>
                <h4 className="font-medium text-sm text-black dark:text-white">
                  {langue === 'en' ? 'Target Job' : langue === 'ar' ? 'استهداف وظيفة' : 'Cibler offre'}
                </h4>
                <p className="text-xs text-black/40 dark:text-white/40">
                  {langue === 'en' ? 'Adapt your CV' : langue === 'ar' ? 'تكييف السيرة' : 'Adapter le CV'}
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-black/30 dark:text-white/30 group-hover:translate-x-1 transition-transform" />
          </div>
        )}

        {onGoToLinkedIn && (
          <div
            onClick={onGoToLinkedIn}
            className="border border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 p-4 rounded-lg transition-all cursor-pointer flex items-center justify-between group bg-white dark:bg-transparent"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center shrink-0 group-hover:border-black/30 dark:group-hover:border-white/30 transition-colors">
                <Linkedin className="w-4 h-4 text-black/50 dark:text-white/50" />
              </div>
              <div>
                <h4 className="font-medium text-sm text-black dark:text-white">
                  {langue === 'en' ? 'LinkedIn Pro' : langue === 'ar' ? 'لينكد إن احترافي' : 'LinkedIn Pro'}
                </h4>
                <p className="text-xs text-black/40 dark:text-white/40">
                  {langue === 'en' ? 'Optimize profile' : langue === 'ar' ? 'تحسين الملف' : 'Optimiser le profil'}
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-black/30 dark:text-white/30 group-hover:translate-x-1 transition-transform" />
          </div>
        )}
      </div>

      {/* In-Progress Auto-Saved Draft Quick Resume */}
      {(() => {
        const activeDraft = getActiveCVDraft();
        if (!activeDraft || !activeDraft.id) return null;
        const lastTime = formatSavedTimeAgo(activeDraft.updatedAt || getLastSavedTime(activeDraft.id), langue);
        return (
          <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                <Edit3 className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                    {langue === 'en' ? 'Active Work Session' : langue === 'ar' ? 'جلسة العمل الحالية' : 'Session en cours'}
                  </span>
                  <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    {lastTime}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-neutral-900 dark:text-white mt-0.5 line-clamp-1">
                  {activeDraft.titre || (activeDraft as any).titreCV || 'Mon CV'}
                </h4>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onEditCV(activeDraft)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-xs"
            >
              <span>{langue === 'en' ? 'Resume editing' : langue === 'ar' ? 'متابعة التعديل' : 'Reprendre l\'édition'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })()}

      {/* Filter Tabs - Minimal */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        
        {/* Type Filter Buttons */}
        <div className="flex bg-black/5 dark:bg-white/5 p-1 rounded-lg border border-black/10 dark:border-white/10 overflow-x-auto">
          <button
            type="button"
            onClick={() => setTypeFilter('ALL')}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              typeFilter === 'ALL'
                ? 'bg-white dark:bg-black text-black dark:text-white shadow-sm'
                : 'text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white'
            }`}
          >
            {langue === 'en' ? 'All' : langue === 'ar' ? 'الكل' : 'Tous'}
            <span className="ml-1.5 text-[10px] opacity-50">{safeCvs.length}</span>
          </button>
          
          <button
            type="button"
            onClick={() => setTypeFilter('ORIGINAL')}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              typeFilter === 'ORIGINAL'
                ? 'bg-white dark:bg-black text-black dark:text-white shadow-sm'
                : 'text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{langue === 'en' ? 'Original' : langue === 'ar' ? 'أصلي' : 'Originaux'}</span>
            <span className="text-[10px] opacity-50">{originalCount}</span>
          </button>

          <button
            type="button"
            onClick={() => setTypeFilter('MODIFIED')}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              typeFilter === 'MODIFIED'
                ? 'bg-white dark:bg-black text-black dark:text-white shadow-sm'
                : 'text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>{langue === 'en' ? 'Adapted' : langue === 'ar' ? 'مكيف' : 'Adaptés'}</span>
            <span className="text-[10px] opacity-50">{modifiedCount}</span>
          </button>
        </div>

        {/* Search & Status Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          
          {/* Status Filter */}
          <div className="flex bg-black/5 dark:bg-white/5 p-0.5 rounded-lg border border-black/10 dark:border-white/10 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                statusFilter === 'ALL' ? 'bg-white dark:bg-black text-black dark:text-white shadow-sm' : 'text-black/50 dark:text-white/50'
              }`}
            >
              {langue === 'en' ? 'All' : langue === 'ar' ? 'الكل' : 'Tous'}
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('PAYE')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                statusFilter === 'PAYE' ? 'bg-white dark:bg-black text-black dark:text-white shadow-sm' : 'text-black/50 dark:text-white/50'
              }`}
            >
              {langue === 'en' ? 'Paid' : langue === 'ar' ? 'مدفوع' : 'Payés'}
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('NON_PAYE')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                statusFilter === 'NON_PAYE' ? 'bg-white dark:bg-black text-black dark:text-white shadow-sm' : 'text-black/50 dark:text-white/50'
              }`}
            >
              {langue === 'en' ? 'Unpaid' : langue === 'ar' ? 'غير مدفوع' : 'À payer'}
            </button>
          </div>

          {/* Search Field */}
          <div className="relative w-full sm:w-56">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-black/30 dark:text-white/30" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-sm bg-transparent border border-black/20 dark:border-white/20 hover:border-black/30 dark:hover:border-white/30 rounded-lg text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/30 focus:border-black/50 dark:focus:border-white/50 outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Grid of Resumes */}
      {filteredCVs.length === 0 ? (
        <div className="border border-black/10 dark:border-white/10 rounded-lg p-12 text-center space-y-4 bg-white dark:bg-transparent">
          <FileText className="w-10 h-10 text-black/20 dark:text-white/20 mx-auto" />
          <h3 className="text-base font-medium text-black dark:text-white">
            {typeFilter === 'MODIFIED' 
              ? (langue === 'en' ? 'No adapted CVs yet' : langue === 'ar' ? 'لا توجد سير مكيفة' : 'Aucun CV adapté')
              : t('noCVsFound')}
          </h3>
          <p className="text-sm text-black/50 dark:text-white/50 max-w-md mx-auto font-light">
            {typeFilter === 'MODIFIED'
              ? (langue === 'en' ? 'Use "Target Job" to create a tailored version' : langue === 'ar' ? 'استخدم "استهداف وظيفة" لإنشاء نسخة مخصصة' : 'Utilisez "Cibler offre" pour créer une version sur-mesure')
              : t('noCVsSubtitle')}
          </p>
          <div className="pt-2 flex justify-center gap-3">
            {typeFilter === 'MODIFIED' && onGoToJobTargeting ? (
              <button
                type="button"
                onClick={onGoToJobTargeting}
                className="px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black text-sm font-medium rounded-lg hover:bg-black/80 dark:hover:bg-white/80 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Target className="w-4 h-4" />
                <span>{langue === 'en' ? 'Target a job' : langue === 'ar' ? 'استهدف وظيفة' : 'Cibler une offre'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onCreateNew}
                className="px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black text-sm font-medium rounded-lg hover:bg-black/80 dark:hover:bg-white/80 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{t('createNewCV')}</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCVs.map((cv) => {
            const parentCV = cv.parentCvId ? cvs.find(c => c.id === cv.parentCvId) : null;
            const isModified = cv.isModified === true;
            
            return (
              <div
                key={cv.id}
                className={`bg-white dark:bg-transparent border rounded-lg transition-all duration-200 hover:shadow-md flex flex-col overflow-hidden group ${
                  isModified
                    ? 'border-black/20 dark:border-white/20 hover:border-black/40 dark:hover:border-white/40'
                    : 'border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30'
                }`}
              >
                {/* Card Header */}
                <div className={`px-4 py-3 border-b flex items-center justify-between ${
                  isModified
                    ? 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10'
                    : 'bg-white dark:bg-transparent border-black/10 dark:border-white/10'
                }`}>
                  
                  <span className={`text-[10px] font-medium uppercase tracking-wider ${
                    isModified ? 'text-black/60 dark:text-white/60' : 'text-black/40 dark:text-white/40'
                  }`}>
                    {isModified 
                      ? (langue === 'en' ? 'Adapted' : langue === 'ar' ? 'مكيف' : 'Adapté')
                      : (langue === 'en' ? 'Original' : langue === 'ar' ? 'أصلي' : 'Original')}
                  </span>

                  {cv.statutPaiement === 'PAYE' && (
                    <span className="text-[10px] font-medium text-black/50 dark:text-white/50 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {langue === 'en' ? 'Paid' : langue === 'ar' ? 'مدفوع' : 'Payé'}
                    </span>
                  )}
                  {cv.statutPaiement === 'EN_ATTENTE_VALIDATION' && (
                    <span className="text-[10px] font-medium text-black/50 dark:text-white/50 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {langue === 'en' ? 'Pending' : langue === 'ar' ? 'قيد الانتظار' : 'En attente'}
                    </span>
                  )}
                  {cv.statutPaiement === 'NON_PAYE' && (
                    <span className="text-[10px] font-medium text-black/40 dark:text-white/40">
                      {langue === 'en' ? 'Unpaid' : langue === 'ar' ? 'غير مدفوع' : 'Non payé'}
                    </span>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-black/40 dark:bg-white/40 shrink-0" />
                    <h3 className="font-medium text-black dark:text-white text-sm line-clamp-1">
                      {cv.titre}
                    </h3>
                  </div>

                  {isModified && (
                    <div className="p-3 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-xs space-y-1">
                      <p className="font-medium text-black/80 dark:text-white/80">
                        {cv.jobTargetTitle || (langue === 'en' ? 'Specific position' : langue === 'ar' ? 'منصب محدد' : 'Poste spécifique')}
                      </p>
                      {cv.jobTargetCompany && (
                        <p className="text-black/50 dark:text-white/50 text-[11px]">
                          {cv.jobTargetCompany}
                        </p>
                      )}
                      {cv.jobMatchRate && (
                        <p className="text-[10px] font-medium text-black/60 dark:text-white/60 pt-0.5">
                          {langue === 'en' ? 'ATS Match' : langue === 'ar' ? 'مطابقة ATS' : 'Match ATS'} : {cv.jobMatchRate}%
                        </p>
                      )}
                    </div>
                  )}

                  <div className="text-xs text-black/40 dark:text-white/40 space-y-0.5">
                    <p>{t('lastUpdated')} : {new Date(cv.updatedAt).toLocaleDateString()}</p>
                    {parentCV && (
                      <p className="text-[10px] text-black/30 dark:text-white/30 truncate">
                        {langue === 'en' ? 'Based on' : langue === 'ar' ? 'مبني على' : 'Basé sur'} : {parentCV.titre}
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="px-4 py-3 border-t border-black/10 dark:border-white/10 bg-white dark:bg-transparent space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onEditCV(cv);
                      }}
                      className="w-full text-xs font-medium py-2 rounded-lg border border-black/20 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-black dark:text-white"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{t('actionEdit')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onPayOrExport(cv);
                      }}
                      className={`w-full text-xs font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                        cv.statutPaiement === 'PAYE'
                          ? 'border border-black/20 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 text-black dark:text-white'
                          : 'bg-black dark:bg-white text-white dark:text-black hover:bg-black/80 dark:hover:bg-white/80'
                      }`}
                    >
                      {cv.statutPaiement === 'PAYE' ? (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>PDF</span>
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>{langue === 'en' ? 'Pay' : langue === 'ar' ? 'ادفع' : 'Payer'}</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs text-black/40 dark:text-white/40">
                    <button
                      type="button"
                      onClick={() => handleDuplicate(cv)}
                      className="hover:text-black dark:hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{langue === 'en' ? 'Duplicate' : langue === 'ar' ? 'نسخ' : 'Dupliquer'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenRename(cv)}
                      className="hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                    >
                      {langue === 'en' ? 'Rename' : langue === 'ar' ? 'إعادة تسمية' : 'Renommer'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenDelete(cv)}
                      className="hover:text-black dark:hover:text-white transition-colors cursor-pointer p-1 rounded hover:bg-black/5 dark:hover:bg-white/5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* RENAME MODAL */}
      {renameTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-black border border-black/20 dark:border-white/20 rounded-lg max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-base text-black dark:text-white">
                {langue === 'en' ? 'Rename CV' : langue === 'ar' ? 'إعادة تسمية السيرة' : 'Renommer le CV'}
              </h3>
              <button onClick={() => setRenameTarget(null)} className="text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-black/60 dark:text-white/60">
                {langue === 'en' ? 'New name' : langue === 'ar' ? 'اسم جديد' : 'Nouveau nom'}
              </label>
              <input
                type="text"
                value={newTitleInput}
                onChange={(e) => setNewTitleInput(e.target.value)}
                autoFocus
                className="w-full px-3.5 py-2 text-sm bg-transparent border border-black/20 dark:border-white/20 rounded-lg text-black dark:text-white focus:border-black/50 dark:focus:border-white/50 outline-none transition-colors"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRenameTarget(null)}
                className="px-4 py-2 border border-black/20 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 text-black/60 dark:text-white/60 font-medium text-xs rounded-lg cursor-pointer transition-colors"
              >
                {langue === 'en' ? 'Cancel' : langue === 'ar' ? 'إلغاء' : 'Annuler'}
              </button>
              <button
                type="button"
                onClick={handleConfirmRename}
                className="px-5 py-2 bg-black dark:bg-white text-white dark:text-black font-medium text-xs rounded-lg hover:bg-black/80 dark:hover:bg-white/80 transition-colors cursor-pointer"
              >
                {langue === 'en' ? 'Save' : langue === 'ar' ? 'حفظ' : 'Sauvegarder'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-black border border-black/20 dark:border-white/20 rounded-lg max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-black/20 dark:border-white/20 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-black/60 dark:text-white/60" />
              </div>
              <div>
                <h3 className="font-medium text-base text-black dark:text-white">
                  {langue === 'en' ? 'Delete CV?' : langue === 'ar' ? 'حذف السيرة؟' : 'Supprimer le CV ?'}
                </h3>
                <p className="text-xs text-black/50 dark:text-white/50 mt-0.5 font-light">
                  {langue === 'en' ? 'This action cannot be undone' : langue === 'ar' ? 'لا يمكن التراجع عن هذا الإجراء' : 'Cette action est irréversible'}
                </p>
              </div>
            </div>

            <p className="text-sm text-black/70 dark:text-white/70 border border-black/10 dark:border-white/10 p-3 rounded-lg">
              {langue === 'en' ? 'Delete' : langue === 'ar' ? 'حذف' : 'Supprimer'} <span className="font-medium text-black dark:text-white">"{deleteTarget.title}"</span> ?
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 border border-black/20 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 text-black/60 dark:text-white/60 font-medium text-xs rounded-lg cursor-pointer transition-colors"
              >
                {langue === 'en' ? 'Cancel' : langue === 'ar' ? 'إلغاء' : 'Annuler'}
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-black dark:bg-white text-white dark:text-black font-medium text-xs rounded-lg hover:bg-black/80 dark:hover:bg-white/80 transition-colors cursor-pointer"
              >
                {langue === 'en' ? 'Delete' : langue === 'ar' ? 'حذف' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};