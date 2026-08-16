import React, { useState } from 'react';
import { CV, Language } from '../types';
import { getTranslation } from '../i18n/translations';
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

  // Interactive Modal States for Rename and Delete
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
      showToast('CV renommé avec succès !');
      setRenameTarget(null);
    }
  };

  const handleOpenDelete = (cv: CV) => {
    setDeleteTarget({ id: cv.id, title: cv.titre });
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      onDeleteCV(deleteTarget.id);
      showToast('CV supprimé avec succès.');
      setDeleteTarget(null);
    }
  };

  const handleDuplicate = (cv: CV) => {
    onDuplicateCV(cv.id);
    showToast(`Copie de "${cv.titre}" créée avec succès !`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-bounce border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">{t('myResumes')}</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Gérez vos CVs originaux, vos CVs modifiés par offre et vos candidatures ciblées.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onImportClick}
            className="px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center space-x-2 border border-slate-200 dark:border-slate-700 cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>{t('importCVBtn')}</span>
          </button>

          {onCreateBlankCV && (
            <button
              type="button"
              onClick={onCreateBlankCV}
              className="px-4 py-2.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-2 cursor-pointer border border-slate-800 dark:border-slate-700"
              title="Créer directement un CV vierge sans modèle pre-rempli"
            >
              <FilePlus className="w-4 h-4 text-emerald-400" />
              <span>Page Blanche</span>
            </button>
          )}

          <button
            type="button"
            onClick={onCreateNew}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center space-x-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Galerie de Modèles</span>
          </button>
        </div>
      </div>

      {/* QUICK CAREER SHORTCUTS BANNER */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Shortcut 1: Mes Lettres de Motivation */}
        {onGoToLetters && (
          <div
            onClick={onGoToLetters}
            className="bg-indigo-50/70 dark:bg-indigo-950/40 hover:bg-indigo-100/80 dark:hover:bg-indigo-900/60 p-4 rounded-2xl border border-indigo-200/80 dark:border-indigo-800/80 transition-all cursor-pointer flex items-center justify-between group shadow-2xs"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                <Mail className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-extrabold text-xs text-indigo-950 dark:text-indigo-100 group-hover:text-indigo-600 transition-colors">
                  Mes Lettres de Motivation
                </h4>
                <p className="text-[10px] text-indigo-700 dark:text-indigo-300 font-medium">
                  {lettersCount} lettre{lettersCount > 1 ? 's' : ''} enregistrée{lettersCount > 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-indigo-500 group-hover:translate-x-1 transition-transform" />
          </div>
        )}

        {/* Shortcut 2: Cibler une Offre d'Emploi */}
        {onGoToJobTargeting && (
          <div
            onClick={onGoToJobTargeting}
            className="bg-emerald-50/70 dark:bg-emerald-950/40 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/60 p-4 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/80 transition-all cursor-pointer flex items-center justify-between group shadow-2xs"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                <Target className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-extrabold text-xs text-emerald-950 dark:text-emerald-100 group-hover:text-emerald-600 transition-colors">
                  Cibler une Offre d'Emploi
                </h4>
                <p className="text-[10px] text-emerald-700 dark:text-emerald-300 font-medium">
                  Adapter le CV & créer une lettre
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-500 group-hover:translate-x-1 transition-transform" />
          </div>
        )}

        {/* Shortcut 3: Profil LinkedIn Pro */}
        {onGoToLinkedIn && (
          <div
            onClick={onGoToLinkedIn}
            className="bg-sky-50/70 dark:bg-sky-950/40 hover:bg-sky-100/80 dark:hover:bg-sky-900/60 p-4 rounded-2xl border border-sky-200/80 dark:border-sky-800/80 transition-all cursor-pointer flex items-center justify-between group shadow-2xs"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                <Linkedin className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-extrabold text-xs text-sky-950 dark:text-sky-100 group-hover:text-sky-600 transition-colors">
                  Profil LinkedIn Pro
                </h4>
                <p className="text-[10px] text-sky-700 dark:text-sky-300 font-medium">
                  Optimiser pour les recruteurs
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-sky-500 group-hover:translate-x-1 transition-transform" />
          </div>
        )}
      </div>

      {/* FILTER TABS: TOUS / CVs ORIGINAUX / MES CVS MODIFIES */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        
        {/* Type Filter Buttons */}
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
          <button
            type="button"
            onClick={() => setTypeFilter('ALL')}
            className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              typeFilter === 'ALL'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <span>Tous les CVs</span>
            <span className="text-[10px] bg-slate-200 dark:bg-slate-700 px-1.5 py-0.2 rounded-md">
              {cvs.length}
            </span>
          </button>
          
          <button
            type="button"
            onClick={() => setTypeFilter('ORIGINAL')}
            className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              typeFilter === 'ORIGINAL'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Mes CVs Originaux</span>
            <span className="text-[10px] bg-slate-200 dark:bg-slate-700 px-1.5 py-0.2 rounded-md">
              {originalCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setTypeFilter('MODIFIED')}
            className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              typeFilter === 'MODIFIED'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-700 dark:text-emerald-400'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Mes CVs Modifiés / Adaptés</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
              typeFilter === 'MODIFIED' ? 'bg-emerald-700 text-white' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
            }`}>
              {modifiedCount}
            </span>
          </button>
        </div>

        {/* Search & Status Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          
          {/* Status Filter */}
          <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                statusFilter === 'ALL' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
              }`}
            >
              Tous statuts
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('PAYE')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                statusFilter === 'PAYE' ? 'bg-white dark:bg-slate-800 text-emerald-600 shadow-xs' : 'text-slate-500'
              }`}
            >
              Payés
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('NON_PAYE')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                statusFilter === 'NON_PAYE' ? 'bg-white dark:bg-slate-800 text-amber-600 shadow-xs' : 'text-slate-500'
              }`}
            >
              À régulariser
            </button>
          </div>

          {/* Search Field */}
          <div className="relative w-full sm:w-60">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-xl focus:border-blue-500 outline-hidden"
            />
          </div>
        </div>

      </div>

      {/* Grid of Resumes */}
      {filteredCVs.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-4 shadow-xs">
          <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            {typeFilter === 'MODIFIED' ? 'Aucun CV modifié pour le moment' : t('noCVsFound')}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            {typeFilter === 'MODIFIED'
              ? 'Utilisez l\'outil "Cibler une Offre d\'Emploi" pour créer une version sur-mesure de votre CV adaptée aux mots-clés d\'une annonce spécifique.'
              : t('noCVsSubtitle')}
          </p>
          <div className="pt-2 flex justify-center gap-3">
            {typeFilter === 'MODIFIED' && onGoToJobTargeting ? (
              <button
                type="button"
                onClick={onGoToJobTargeting}
                className="px-6 py-3 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-emerald-700 transition-colors inline-flex items-center space-x-2 cursor-pointer"
              >
                <Target className="w-4 h-4" />
                <span>Cibler une offre maintenant</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onCreateNew}
                className="px-6 py-3 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-blue-700 transition-colors inline-flex items-center space-x-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{t('createNewCV')}</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCVs.map((cv) => {
            const parentCV = cv.parentCvId ? cvs.find(c => c.id === cv.parentCvId) : null;
            return (
              <div
                key={cv.id}
                className={`bg-white dark:bg-slate-900 rounded-3xl border shadow-xs hover:shadow-lg transition-all flex flex-col overflow-hidden group ${
                  cv.isModified
                    ? 'border-emerald-200 dark:border-emerald-900/60 hover:border-emerald-400'
                    : 'border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-600'
                }`}
              >
                {/* Card Header & Status Badge */}
                <div className={`p-4 border-b flex items-center justify-between ${
                  cv.isModified
                    ? 'bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/40'
                    : 'bg-slate-50/60 dark:bg-slate-950/40 border-slate-100 dark:border-slate-800'
                }`}>
                  
                  {/* Tag: Modified vs Original */}
                  {cv.isModified ? (
                    <span className="bg-emerald-600 text-white font-black px-2 py-0.5 rounded-md text-[10px] flex items-center gap-1 shadow-2xs">
                      <Target className="w-3 h-3" />
                      <span>CV Adapté</span>
                    </span>
                  ) : (
                    <span className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold px-2 py-0.5 rounded-md text-[10px]">
                      CV Initial
                    </span>
                  )}

                  {/* Payment Badge */}
                  {cv.statutPaiement === 'PAYE' && (
                    <span className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold px-2.5 py-0.5 rounded-full text-[10px] flex items-center gap-1 border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      {t('statusPaid')}
                    </span>
                  )}
                  {cv.statutPaiement === 'EN_ATTENTE_VALIDATION' && (
                    <span className="bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-bold px-2.5 py-0.5 rounded-full text-[10px] flex items-center gap-1 border border-amber-200 dark:border-amber-800">
                      <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400 animate-pulse" />
                      {t('statusPending')}
                    </span>
                  )}
                  {cv.statutPaiement === 'NON_PAYE' && (
                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold px-2.5 py-0.5 rounded-full text-[10px] border border-slate-200 dark:border-slate-700">
                      {t('statusUnpaid')} (500 FCFA)
                    </span>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cv.couleurAccent }} />
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                      {cv.titre}
                    </h3>
                  </div>

                  {/* Target details for modified CVs */}
                  {cv.isModified && (
                    <div className="p-3 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/30 text-xs space-y-1">
                      <p className="font-bold text-emerald-900 dark:text-emerald-200">
                        Cible : {cv.jobTargetTitle || 'Poste spécifique'}
                      </p>
                      {cv.jobTargetCompany && (
                        <p className="text-emerald-700 dark:text-emerald-400 text-[11px]">
                          Chez {cv.jobTargetCompany}
                        </p>
                      )}
                      {cv.jobMatchRate && (
                        <p className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 pt-0.5">
                          Match ATS estimé : {cv.jobMatchRate}%
                        </p>
                      )}
                    </div>
                  )}

                  <div className="text-xs text-slate-400 dark:text-slate-500 space-y-0.5">
                    <p>{t('lastUpdated')} : {new Date(cv.updatedAt).toLocaleDateString()}</p>
                    {parentCV && (
                      <p className="text-[10px] text-slate-400 truncate">
                        Basé sur : {parentCV.titre}
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  
                  {/* Primary Action Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => onEditCV(cv)}
                      className={`w-full font-bold text-xs py-2 rounded-xl transition-colors flex items-center justify-center space-x-1.5 cursor-pointer ${
                        cv.isModified
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{t('actionEdit')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onPayOrExport(cv)}
                      className={`w-full font-bold text-xs py-2 rounded-xl transition-colors flex items-center justify-center space-x-1.5 cursor-pointer ${
                        cv.statutPaiement === 'PAYE'
                          ? 'bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white'
                          : 'bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white'
                      }`}
                    >
                      {cv.statutPaiement === 'PAYE' ? (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>PDF HD</span>
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Payer (500 FCFA)</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Secondary Actions (Dupliquer, Renommer, Supprimer) */}
                  <div className="flex items-center justify-between pt-2 text-xs text-slate-500 dark:text-slate-400">
                    <button
                      type="button"
                      onClick={() => handleDuplicate(cv)}
                      className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1 cursor-pointer font-medium"
                      title="Dupliquer ce CV"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Dupliquer</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenRename(cv)}
                      className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer font-medium"
                      title="Renommer ce CV"
                    >
                      Renommer
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenDelete(cv)}
                      className="hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer p-1 rounded hover:bg-red-50 dark:hover:bg-red-950/30"
                      title="Supprimer ce CV"
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
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Renommer le CV</h3>
              <button onClick={() => setRenameTarget(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Nouveau nom du document</label>
              <input
                type="text"
                value={newTitleInput}
                onChange={(e) => setNewTitleInput(e.target.value)}
                autoFocus
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:border-blue-500 outline-hidden font-medium"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRenameTarget(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmRename}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/80 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Supprimer ce CV ?</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Cette action est définitive et irréversible.</p>
              </div>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              Voulez-vous vraiment supprimer <span className="font-bold text-slate-900 dark:text-white">"{deleteTarget.title}"</span> ?
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
              >
                Oui, Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
