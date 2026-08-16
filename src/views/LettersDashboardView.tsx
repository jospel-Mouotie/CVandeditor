import React, { useState } from 'react';
import { SavedLetter, Language, CV } from '../types';
import { 
  FileText, 
  Plus, 
  Search, 
  Edit3, 
  Copy, 
  Trash2, 
  Printer, 
  CheckCircle2, 
  Briefcase, 
  Building, 
  Calendar, 
  Sparkles,
  ExternalLink,
  Target,
  FileCheck,
  Download
} from 'lucide-react';

interface LettersDashboardViewProps {
  letters?: SavedLetter[];
  cvs?: CV[];
  langue: Language;
  onCreateNewLetter: () => void;
  onEditLetter: (letter: SavedLetter) => void;
  onDuplicateLetter?: (letterId: string) => void;
  onRenameLetter?: (letterId: string, newTitle: string) => void;
  onDeleteLetter?: (letterId: string) => void;
  onPrintLetter?: (letter: SavedLetter) => void;
  onGoToJobTargeting?: () => void;
  onGoToDashboard?: () => void;
}

export const LettersDashboardView: React.FC<LettersDashboardViewProps> = ({
  letters: initialLetters,
  cvs = [],
  langue,
  onCreateNewLetter,
  onEditLetter,
  onDuplicateLetter,
  onRenameLetter,
  onDeleteLetter,
  onPrintLetter,
  onGoToJobTargeting,
  onGoToDashboard
}) => {
  const [lettersList, setLettersList] = useState<SavedLetter[]>(initialLetters || []);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [renameTarget, setRenameTarget] = useState<{ id: string; title: string } | null>(null);
  const [newTitleInput, setNewTitleInput] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Fetch letters from API if not supplied
  const fetchLetters = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/lettres');
      if (res.ok) {
        const data = await res.json();
        setLettersList(data.letters || []);
      }
    } catch (err) {
      console.error('Error fetching letters:', err);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (initialLetters) {
      setLettersList(initialLetters);
    } else {
      fetchLetters();
    }
  }, [initialLetters]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleCopyText = (letter: SavedLetter) => {
    const fullContent = `${letter.expediteur?.nomComplet || ''}
${letter.expediteur?.adresse || ''}
${letter.expediteur?.telephone || ''} | ${letter.expediteur?.email || ''}

${letter.entreprise || ''}
${letter.destinataire || 'Direction des Ressources Humaines'}

${letter.villeDate || ''}

Objet : ${letter.objet || 'Candidature'}

${letter.formulePolitesseEntree || 'Madame, Monsieur,'}

${letter.paragrapheAccroche || ''}

${letter.paragrapheValeurAjoutee || ''}

${letter.paragrapheAdequationEntreprise || ''}

${letter.paragrapheConclusion || ''}

${letter.formulePolitesseSortie || 'Cordialement,'}

${letter.signature || letter.expediteur?.nomComplet || ''}`;

    navigator.clipboard.writeText(letter.texteComplet || fullContent);
    setCopiedId(letter.id);
    showToast('Texte complet de la lettre copié dans le presse-papier !');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const safeLetters = lettersList || [];
  const filteredLetters = safeLetters.filter(l => {
    const q = searchQuery.toLowerCase();
    const matchesTitle = (l.titre || '').toLowerCase().includes(q);
    const matchesCompany = (l.entreprise || '').toLowerCase().includes(q);
    const matchesPoste = (l.poste || '').toLowerCase().includes(q);
    const matchesObjet = (l.objet || '').toLowerCase().includes(q);
    return matchesTitle || matchesCompany || matchesPoste || matchesObjet;
  });

  const handleOpenRename = (letter: SavedLetter) => {
    setRenameTarget({ id: letter.id, title: letter.titre });
    setNewTitleInput(letter.titre);
  };

  const handleConfirmRename = async () => {
    if (renameTarget && newTitleInput.trim()) {
      if (onRenameLetter) {
        onRenameLetter(renameTarget.id, newTitleInput.trim());
      } else {
        try {
          await fetch(`/api/lettres/${renameTarget.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ titre: newTitleInput.trim() })
          });
          setLettersList(prev => prev.map(l => l.id === renameTarget.id ? { ...l, titre: newTitleInput.trim() } : l));
        } catch (e) {
          console.error(e);
        }
      }
      showToast('Lettre renommée avec succès !');
      setRenameTarget(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (deleteTarget) {
      if (onDeleteLetter) {
        onDeleteLetter(deleteTarget.id);
      } else {
        try {
          await fetch(`/api/lettres/${deleteTarget.id}`, { method: 'DELETE' });
          setLettersList(prev => prev.filter(l => l.id !== deleteTarget.id));
        } catch (e) {
          console.error(e);
        }
      }
      showToast('Lettre supprimée.');
      setDeleteTarget(null);
    }
  };

  const handleDuplicate = async (letterId: string) => {
    if (onDuplicateLetter) {
      onDuplicateLetter(letterId);
    } else {
      try {
        const res = await fetch(`/api/lettres/${letterId}/duplicate`, { method: 'POST' });
        if (res.ok) {
          const data = await res.json();
          if (data.letter) {
            setLettersList(prev => [data.letter, ...prev]);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    showToast('Copie de la lettre créée avec succès !');
  };

  const handlePrint = (letter: SavedLetter) => {
    if (onPrintLetter) {
      onPrintLetter(letter);
    } else {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${letter.titre}</title>
              <style>
                @page { size: A4; margin: 20mm; }
                body { font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 11pt; line-height: 1.6; color: #1e293b; }
                .expediteur { margin-bottom: 25px; }
                .destinataire { margin-left: 55%; margin-bottom: 25px; }
                .ville-date { margin-bottom: 25px; text-align: right; }
                .objet { font-weight: bold; margin-bottom: 20px; text-decoration: underline; }
                .content { white-space: pre-wrap; margin-bottom: 30px; }
                .signature { margin-top: 30px; margin-left: 55%; font-weight: bold; }
              </style>
            </head>
            <body>
              <div class="expediteur">
                <strong>${letter.expediteur?.nomComplet || ''}</strong><br/>
                ${letter.expediteur?.adresse ? letter.expediteur.adresse + '<br/>' : ''}
                ${letter.expediteur?.telephone ? letter.expediteur.telephone + ' | ' : ''}${letter.expediteur?.email || ''}
              </div>
              <div class="destinataire">
                <strong>${letter.entreprise || ''}</strong><br/>
                ${letter.destinataire || 'Direction des Ressources Humaines'}
              </div>
              <div class="ville-date">${letter.villeDate || ''}</div>
              <div class="objet">Objet : ${letter.objet || 'Candidature'}</div>
              <div class="content">${letter.texteComplet || `${letter.formulePolitesseEntree || 'Madame, Monsieur,'}\n\n${letter.paragrapheAccroche || ''}\n\n${letter.paragrapheValeurAjoutee || ''}\n\n${letter.paragrapheAdequationEntreprise || ''}\n\n${letter.paragrapheConclusion || ''}\n\n${letter.formulePolitesseSortie || 'Cordialement,'}`}</div>
              <div class="signature">${letter.signature || letter.expediteur?.nomComplet || ''}</div>
              <script>
                window.onload = function() { window.print(); }
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 dark:bg-slate-800 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-bounce border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <FileText className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              {langue === 'en' ? 'My Cover Letters' : langue === 'ar' ? 'رسائل التحفيز الخاصة بي' : 'Mes Lettres de Motivation'}
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {langue === 'en'
              ? 'Manage, edit, customize and print your targeted application cover letters.'
              : langue === 'ar'
              ? 'إدارة وتعديل وتخصيص وطباعة رسائل التحفيز الخاصة بك.'
              : 'Gérez, éditez, personnalisez et imprimez vos lettres de candidature enregistrées.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onGoToJobTargeting}
            className="px-4 py-2.5 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs rounded-xl border border-emerald-300/60 dark:border-emerald-800/60 transition-all flex items-center space-x-2 cursor-pointer shadow-2xs"
          >
            <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{langue === 'en' ? 'Tailor to Job Offer' : langue === 'ar' ? 'تخصيص حسب عرض عمل' : 'Cibler une Offre d\'Emploi'}</span>
          </button>

          <button
            type="button"
            onClick={onCreateNewLetter}
            className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-500/20 transition-all flex items-center space-x-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{langue === 'en' ? 'New Cover Letter' : langue === 'ar' ? 'رسالة جديدة' : 'Rédiger une Lettre'}</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder={langue === 'en' ? 'Search by title, company, position...' : langue === 'ar' ? 'بحث بالعنوان أو الشركة...' : 'Rechercher par titre, entreprise, poste...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 rounded-xl focus:border-indigo-500 outline-hidden"
          />
        </div>

        <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
          <span>{filteredLetters.length} {filteredLetters.length > 1 ? 'lettres enregistrées' : 'lettre enregistrée'}</span>
        </div>
      </div>

      {/* Grid of Letters */}
      {filteredLetters.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {langue === 'en' ? 'No cover letters found' : langue === 'ar' ? 'لا توجد رسائل تحفيزية' : 'Aucune lettre de motivation trouvée'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            {langue === 'en'
              ? 'Generate a personalized cover letter using your CV, or tailor one directly for a job offer.'
              : langue === 'ar'
              ? 'أنشئ رسالة تحفيز مخصصة باستخدام سيرتك الذاتية أو استهدف عرض عمل.'
              : 'Générez une lettre de motivation percutante avec l\'IA à partir de votre CV, ou créez-en une sur-mesure pour une offre d\'emploi.'}
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={onCreateNewLetter}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all inline-flex items-center space-x-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{langue === 'en' ? 'Create Cover Letter' : langue === 'ar' ? 'إنشاء رسالة' : 'Rédiger une Lettre'}</span>
            </button>
            <button
              type="button"
              onClick={onGoToJobTargeting}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all inline-flex items-center space-x-2 cursor-pointer"
            >
              <Target className="w-4 h-4" />
              <span>{langue === 'en' ? 'Target a Job Offer' : langue === 'ar' ? 'استهداف وظيفة' : 'Cibler une Offre'}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLetters.map((letter) => {
            const linkedCV = cvs.find(c => c.id === letter.cvId);
            return (
              <div
                key={letter.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 shadow-xs hover:shadow-lg transition-all flex flex-col overflow-hidden group"
              >
                {/* Header Card Info */}
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800">
                      Lettre IA Pro
                    </span>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                      {letter.titre}
                    </h3>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-5 flex-1 space-y-3">
                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-2 font-medium">
                      <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-bold text-slate-800 dark:text-slate-200">{letter.entreprise || 'Entreprise Cible'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="text-slate-600 dark:text-slate-400 line-clamp-1">{letter.poste || 'Poste visé'}</span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500 pt-1">
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      <span>{letter.updatedAt ? new Date(letter.updatedAt).toLocaleDateString('fr-FR') : 'Récemment'}</span>
                      {linkedCV && (
                        <span className="ml-auto bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[10px] text-slate-500 font-medium truncate max-w-[120px]">
                          CV: {linkedCV.titre}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Letter Snippet Preview */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 italic line-clamp-3 leading-relaxed">
                    "{letter.paragrapheAccroche || letter.texteComplet?.slice(0, 150) || 'Contenu de la lettre...'}"
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  
                  {/* Primary Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => onEditLetter(letter)}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-2xs"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Éditer & Peaufiner</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handlePrint(letter)}
                      className="w-full bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white font-bold text-xs py-2 rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                      title="Imprimer ou enregistrer en PDF A4"
                    >
                      <Printer className="w-3.5 h-3.5 text-indigo-300" />
                      <span>Imprimer PDF</span>
                    </button>
                  </div>

                  {/* Secondary Quick Actions */}
                  <div className="flex items-center justify-between pt-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <button
                      type="button"
                      onClick={() => handleCopyText(letter)}
                      className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1 cursor-pointer"
                      title="Copier le texte complet"
                    >
                      {copiedId === letter.id ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Copié !
                        </span>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copier</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDuplicate(letter.id)}
                      className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                    >
                      Dupliquer
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenRename(letter)}
                      className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                    >
                      Renommer
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteTarget({ id: letter.id, title: letter.titre })}
                      className="hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer p-1 rounded hover:bg-red-50 dark:hover:bg-red-950/30"
                      title="Supprimer la lettre"
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

      {/* Rename Modal Dialog */}
      {renameTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Renommer la lettre de motivation</h3>
            <input
              type="text"
              value={newTitleInput}
              onChange={(e) => setNewTitleInput(e.target.value)}
              placeholder="Nouveau titre de la lettre..."
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 outline-hidden"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleConfirmRename();
                if (e.key === 'Escape') setRenameTarget(null);
              }}
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRenameTarget(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmRename}
                className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl cursor-pointer shadow-md"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Confirmer la suppression</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Êtes-vous sûr de vouloir supprimer définitivement la lettre <strong>"{deleteTarget.title}"</strong> ? Cette action est irréversible.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl cursor-pointer shadow-md"
              >
                Supprimer définitivement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
