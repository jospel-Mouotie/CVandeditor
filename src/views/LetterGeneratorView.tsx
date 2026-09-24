import React, { useState, useEffect, useRef } from 'react';
import { CV, Language, SavedLetter, LettreMotivationResult, SubscriptionTier } from '../types';
import { 
  FileText, 
  Sparkles, 
  ArrowLeft, 
  Save, 
  Printer, 
  Copy, 
  CheckCircle2, 
  RefreshCw, 
  Building, 
  Briefcase, 
  User as UserIcon, 
  Sliders, 
  Download, 
  Eye, 
  Edit2,
  ChevronDown,
  FileType,
  RotateCcw,
  Crown,
  Lock,
  FileCheck
} from 'lucide-react';
import { LetterPreviewModal } from '../components/LetterPreviewModal';
import { 
  exportLetterToPDF, 
  exportLetterToWord, 
  exportLetterToPlainText, 
  printLetterDocument 
} from '../utils/pdfExport';
import { isPaymentActive } from '../utils/adminPaidMatrix';

interface LetterGeneratorViewProps {
  cvs: CV[];
  activeCV: CV | null;
  langue: Language;
  initialLetter?: SavedLetter | null;
  letterToEdit?: SavedLetter | null;
  userTier?: SubscriptionTier;
  onSaveLetter?: (letter: SavedLetter) => Promise<void> | void;
  onLetterSaved?: () => void;
  onBackToLetters?: () => void;
  onGoToLettersDashboard?: () => void;
  onGoToDashboard?: () => void;
  onOpenUpgrade?: () => void;
  onOpenPayment?: () => void;
}

export const LetterGeneratorView: React.FC<LetterGeneratorViewProps> = ({
  cvs,
  activeCV,
  langue,
  initialLetter,
  letterToEdit,
  userTier = 'freemium',
  onSaveLetter,
  onLetterSaved,
  onBackToLetters,
  onGoToLettersDashboard,
  onGoToDashboard,
  onOpenUpgrade,
  onOpenPayment
}) => {
  const currentLetterSource = initialLetter || letterToEdit || null;

  // Source CV selection
  const [selectedCVId, setSelectedCVId] = useState<string>(
    currentLetterSource?.cvId || activeCV?.id || (cvs.length > 0 ? cvs[0].id : '')
  );

  const selectedCV = cvs.find(c => c.id === selectedCVId) || activeCV || cvs[0] || null;

  // Extract profil sender details from CV
  const profilSection = selectedCV?.sections?.find(s => s.type === 'profil');
  const profilContent = profilSection?.contenu || {};

  // Form parameters
  const [entreprise, setEntreprise] = useState(currentLetterSource?.entreprise || '');
  const [poste, setPoste] = useState(currentLetterSource?.poste || profilContent.titreProfessionnel || '');
  const [destinataire, setDestinataire] = useState(currentLetterSource?.destinataire || 'Direction des Ressources Humaines');
  const [ton, setTon] = useState('professionnel');
  const [pointsCles, setPointsCles] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Letter editable fields
  const [letterId, setLetterId] = useState<string>(currentLetterSource?.id || `lettre-${Date.now()}`);
  const [titreLettre, setTitreLettre] = useState<string>(
    currentLetterSource?.titre || `Lettre de motivation - ${entreprise || 'Candidature'}`
  );
  const [villeDate, setVilleDate] = useState<string>(
    currentLetterSource?.villeDate || `Fait le ${new Date().toLocaleDateString('fr-FR')}`
  );
  const [police, setPolice] = useState<string>(currentLetterSource?.police || 'Inter');
  const [taillePolice, setTaillePolice] = useState<number>(currentLetterSource?.taillePolice || 11);
  const [couleurAccent, setCouleurAccent] = useState<string>(currentLetterSource?.couleurAccent || '#2563EB');

  // Sender details
  const [expediteurNom, setExpediteurNom] = useState(currentLetterSource?.expediteur?.nomComplet || profilContent.nomComplet || 'Mon Nom');
  const [expediteurTitre, setExpediteurTitre] = useState(currentLetterSource?.expediteur?.titreProfessionnel || profilContent.titreProfessionnel || '');
  const [expediteurEmail, setExpediteurEmail] = useState(currentLetterSource?.expediteur?.email || profilContent.email || '');
  const [expediteurTel, setExpediteurTel] = useState(currentLetterSource?.expediteur?.telephone || profilContent.telephone || '');
  const [expediteurAdresse, setExpediteurAdresse] = useState(currentLetterSource?.expediteur?.adresse || profilContent.adresse || '');

  // Body content
  const [objet, setObjet] = useState(currentLetterSource?.objet || `Candidature au poste de ${poste || 'Professionnel'}`);
  const [formuleEntree, setFormuleEntree] = useState(currentLetterSource?.formulePolitesseEntree || 'Madame, Monsieur,');
  const [accroche, setAccroche] = useState(currentLetterSource?.paragrapheAccroche || '');
  const [valeurAjoutee, setValeurAjoutee] = useState(currentLetterSource?.paragrapheValeurAjoutee || '');
  const [adequation, setAdequation] = useState(currentLetterSource?.paragrapheAdequationEntreprise || '');
  const [conclusion, setConclusion] = useState(currentLetterSource?.paragrapheConclusion || '');
  const [formuleSortie, setFormuleSortie] = useState(currentLetterSource?.formulePolitesseSortie || 'Je vous prie d\'agréer, Madame, Monsieur, l\'expression de mes salutations distinguées.');
  const [signature, setSignature] = useState(currentLetterSource?.signature || expediteurNom);

  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);
  const [showExportMenu, setShowExportMenu] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportNotice, setExportNotice] = useState<{ type: 'loading' | 'success' | 'error'; message: string } | null>(null);
  const [isSaved, setIsSaved] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  // AI Paragraph Optimization State
  const [optimizingSection, setOptimizingSection] = useState<string | null>(null);
  const [undoHistory, setUndoHistory] = useState<Record<string, string>>({});
  const [showPaywallAlert, setShowPaywallAlert] = useState<boolean>(false);

  const exportMenuRef = useRef<HTMLDivElement>(null);

  // Close export dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBack = () => {
    if (onBackToLetters) onBackToLetters();
    else if (onGoToLettersDashboard) onGoToLettersDashboard();
    else if (onGoToDashboard) onGoToDashboard();
    else window.history.back();
  };

  const getCurrentLetterObject = (): SavedLetter => ({
    id: letterId,
    utilisateurId: selectedCV?.utilisateurId || 'user-default',
    cvId: selectedCVId,
    titre: titreLettre,
    destinataire,
    entreprise,
    poste,
    villeDate,
    dateCreation: currentLetterSource?.dateCreation || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    langue,
    police,
    taillePolice,
    couleurAccent,
    expediteur: {
      nomComplet: expediteurNom,
      titreProfessionnel: expediteurTitre,
      email: expediteurEmail,
      telephone: expediteurTel,
      adresse: expediteurAdresse
    },
    objet,
    formulePolitesseEntree: formuleEntree,
    paragrapheAccroche: accroche,
    paragrapheValeurAjoutee: valeurAjoutee,
    paragrapheAdequationEntreprise: adequation,
    paragrapheConclusion: conclusion,
    formulePolitesseSortie: formuleSortie,
    signature,
    texteComplet: `${formuleEntree}\n\n${accroche}\n\n${valeurAjoutee}\n\n${adequation}\n\n${conclusion}\n\n${formuleSortie}\n\n${signature}`
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Sync sender info when CV selection changes if not loaded from an existing letter
  useEffect(() => {
    if (!currentLetterSource && selectedCV) {
      const p = selectedCV.sections?.find(s => s.type === 'profil')?.contenu || {};
      if (p.nomComplet) setExpediteurNom(p.nomComplet);
      if (p.titreProfessionnel) {
        setExpediteurTitre(p.titreProfessionnel);
        if (!poste) setPoste(p.titreProfessionnel);
      }
      if (p.email) setExpediteurEmail(p.email);
      if (p.telephone) setExpediteurTel(p.telephone);
      if (p.adresse) setExpediteurAdresse(p.adresse);
    }
  }, [selectedCVId]);

  // Generate Letter with Gemini AI
  const handleGenerateWithAI = async () => {
    if (!selectedCV) {
      showToast('Veuillez sélectionner un CV source.');
      return;
    }

    setIsGenerating(true);
    try {
      const token = localStorage.getItem('cv_builder_token') || localStorage.getItem('token');
      const res = await fetch('/api/ai/lettre-motivation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          cv: selectedCV,
          langue,
          entreprise,
          poste,
          ton,
          pointsCles
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erreur lors de la génération de la lettre');
      }

      const data: LettreMotivationResult = await res.json();

      if (data.objet) setObjet(data.objet);
      if (data.formulePolitesseEntree) setFormuleEntree(data.formulePolitesseEntree);
      if (data.paragrapheAccroche) setAccroche(data.paragrapheAccroche);
      if (data.paragrapheValeurAjoutee) setValeurAjoutee(data.paragrapheValeurAjoutee);
      if (data.paragrapheAdequationEntreprise) setAdequation(data.paragrapheAdequationEntreprise);
      if (data.paragrapheConclusion) setConclusion(data.paragrapheConclusion);
      if (data.formulePolitesseSortie) setFormuleSortie(data.formulePolitesseSortie);
      if (data.destinataire) setDestinataire(data.destinataire);
      if (data.entreprise) setEntreprise(data.entreprise);

      setTitreLettre(`Lettre ${poste || 'Candidature'} - ${entreprise || 'Entreprise'}`);
      setIsSaved(false);
      showToast('Lettre générée avec succès par l\'IA !');

      // Auto-save the generated letter
      const constructedLetter = getCurrentLetterObject();
      if (onSaveLetter) {
        await onSaveLetter(constructedLetter);
      }
      if (onLetterSaved) {
        onLetterSaved();
      }
      setIsSaved(true);
    } catch (err) {
      console.error('Error generating cover letter:', err);
      showToast('Une erreur est survenue lors de la génération.');
    } finally {
      setIsGenerating(false);
    }
  };

  // AI Paragraph Optimization (Paid Feature)
  const handleOptimizeParagraph = async (
    paragraphType: 'accroche' | 'valeurAjoutee' | 'adequation' | 'conclusion'
  ) => {
    // 1. Check paid feature gate
    const isPaidSystemActive = isPaymentActive();
    const isUserFreemium = !userTier || userTier === 'freemium';

    if (isPaidSystemActive && isUserFreemium) {
      setShowPaywallAlert(true);
      if (onOpenUpgrade) {
        onOpenUpgrade();
      }
      return;
    }

    // 2. Identify the text to optimize
    let rawText = '';
    if (paragraphType === 'accroche') rawText = accroche;
    else if (paragraphType === 'valeurAjoutee') rawText = valeurAjoutee;
    else if (paragraphType === 'adequation') rawText = adequation;
    else if (paragraphType === 'conclusion') rawText = conclusion;

    if (!rawText || !rawText.trim()) {
      showToast('Veuillez d\'abord saisir du texte dans ce paragraphe pour que l\'IA puisse l\'optimiser.');
      return;
    }

    // Save previous version for undo
    setUndoHistory(prev => ({ ...prev, [paragraphType]: rawText }));
    setOptimizingSection(paragraphType);

    try {
      const token = localStorage.getItem('cv_builder_token') || localStorage.getItem('token');
      const res = await fetch('/api/ai/optimiser-paragraphe-lettre', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          texte: rawText,
          paragrapheType: paragraphType,
          poste,
          entreprise,
          ton,
          langue
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erreur lors de l\'optimisation');
      }

      const data = await res.json();
      if (data.texteOptimise) {
        if (paragraphType === 'accroche') setAccroche(data.texteOptimise);
        else if (paragraphType === 'valeurAjoutee') setValeurAjoutee(data.texteOptimise);
        else if (paragraphType === 'adequation') setAdequation(data.texteOptimise);
        else if (paragraphType === 'conclusion') setConclusion(data.texteOptimise);

        setIsSaved(false);
        showToast('✨ Paragraphe optimisé par l\'IA avec succès !');
      }
    } catch (err: any) {
      console.error('Paragraph AI optimization failed:', err);
      showToast(err?.message || 'Erreur lors de l\'optimisation du paragraphe');
    } finally {
      setOptimizingSection(null);
    }
  };

  // Undo AI paragraph optimization
  const handleUndoParagraph = (
    paragraphType: 'accroche' | 'valeurAjoutee' | 'adequation' | 'conclusion'
  ) => {
    const previous = undoHistory[paragraphType];
    if (!previous) return;

    if (paragraphType === 'accroche') setAccroche(previous);
    else if (paragraphType === 'valeurAjoutee') setValeurAjoutee(previous);
    else if (paragraphType === 'adequation') setAdequation(previous);
    else if (paragraphType === 'conclusion') setConclusion(previous);

    setUndoHistory(prev => {
      const copy = { ...prev };
      delete copy[paragraphType];
      return copy;
    });

    setIsSaved(false);
    showToast('Version initiale du paragraphe restaurée.');
  };

  // Robust Save function: saves to server and updates local cache
  const handleSave = async () => {
    const letter = getCurrentLetterObject();
    try {
      setIsSaving(true);
      const token = localStorage.getItem('cv_builder_token') || localStorage.getItem('token');
      
      // 1. Send to server
      try {
        const res = await fetch('/api/lettres', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify(letter)
        });
        if (res.ok) {
          const data = await res.json();
          if (data.letter?.id) {
            setLetterId(data.letter.id);
          }
        }
      } catch (err) {
        console.warn('Backend server save skipped, using local persistence:', err);
      }

      // 2. Call parent callback if provided
      if (typeof onSaveLetter === 'function') {
        await onSaveLetter(letter);
      }
      if (typeof onLetterSaved === 'function') {
        onLetterSaved();
      }

      // 3. LocalStorage persistence
      try {
        const stored = JSON.parse(localStorage.getItem('cv_builder_letters') || '[]');
        const idx = stored.findIndex((l: any) => l.id === letter.id);
        if (idx >= 0) {
          stored[idx] = letter;
        } else {
          stored.unshift(letter);
        }
        localStorage.setItem('cv_builder_letters', JSON.stringify(stored));
      } catch {
        // Ignore localStorage quota errors
      }

      setIsSaved(true);
      showToast('Lettre de motivation enregistrée avec succès !');
    } catch (err: any) {
      console.error('Error saving letter:', err);
      showToast('Lettre enregistrée dans le navigateur.');
      setIsSaved(true);
    } finally {
      setIsSaving(false);
    }
  };

  // Copy full text
  const handleCopy = () => {
    const letter = getCurrentLetterObject();
    const formatted = `${letter.expediteur.nomComplet}
${letter.expediteur.adresse}
${letter.expediteur.telephone} | ${letter.expediteur.email}

${letter.entreprise}
${letter.destinataire}

${letter.villeDate}

Objet : ${letter.objet}

${letter.formulePolitesseEntree}

${letter.paragrapheAccroche}

${letter.paragrapheValeurAjoutee}

${letter.paragrapheAdequationEntreprise}

${letter.paragrapheConclusion}

${letter.formulePolitesseSortie}

${letter.signature}`;

    navigator.clipboard.writeText(formatted);
    showToast('Texte complet de la lettre copié !');
  };

  // Multi-format Export Actions
  const handleExportPDF = async () => {
    setShowExportMenu(false);
    setIsExporting(true);
    setExportNotice({ type: 'loading', message: 'Génération du PDF HD avec respect des couleurs...' });
    
    try {
      const letterObj = getCurrentLetterObject();
      // Pass the letter object directly to guarantee high-definition SVG vector color rendering
      const res = await exportLetterToPDF(letterObj, titreLettre || 'Lettre_de_Motivation');
      if (res.success) {
        setExportNotice({ type: 'success', message: 'PDF HD téléchargé avec succès !' });
        showToast('✓ PDF généré et téléchargé !');
        setTimeout(() => setExportNotice(null), 3500);
      } else {
        setExportNotice({ type: 'error', message: res.message || 'Échec de l\'export PDF' });
        showToast(res.message || 'Échec de l\'export PDF');
      }
    } catch (err: any) {
      console.error('Error exporting PDF in LetterGeneratorView:', err);
      setExportNotice({ type: 'error', message: `Erreur : ${err?.message || 'Erreur'}` });
      showToast(`Erreur export PDF : ${err?.message || 'Erreur'}`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportWord = async () => {
    setShowExportMenu(false);
    setIsExporting(true);
    setExportNotice({ type: 'loading', message: 'Génération du document Word (.doc)...' });
    
    try {
      const letterObj = getCurrentLetterObject();
      const res = await exportLetterToWord(letterObj, titreLettre || 'Lettre_de_Motivation');
      if (res.success) {
        setExportNotice({ type: 'success', message: 'Document Word exporté avec succès !' });
        showToast('✓ Document Word (.doc) téléchargé !');
        setTimeout(() => setExportNotice(null), 3500);
      } else {
        setExportNotice({ type: 'error', message: res.message || 'Échec de l\'export Word' });
        showToast(res.message || 'Échec de l\'export Word');
      }
    } catch (err: any) {
      console.error('Error exporting Word in LetterGeneratorView:', err);
      setExportNotice({ type: 'error', message: `Erreur : ${err?.message || 'Erreur'}` });
      showToast(`Erreur export Word : ${err?.message || 'Erreur'}`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPlainText = async () => {
    setShowExportMenu(false);
    setIsExporting(true);
    setExportNotice({ type: 'loading', message: 'Génération du fichier texte brut (.txt)...' });
    
    try {
      const letterObj = getCurrentLetterObject();
      const res = await exportLetterToPlainText(letterObj, titreLettre || 'Lettre_de_Motivation');
      if (res.success) {
        setExportNotice({ type: 'success', message: 'Fichier Texte (.txt) exporté avec succès !' });
        showToast('✓ Fichier Texte (.txt) téléchargé !');
        setTimeout(() => setExportNotice(null), 3500);
      } else {
        setExportNotice({ type: 'error', message: res.message || 'Échec de l\'export texte' });
        showToast(res.message || 'Échec de l\'export texte');
      }
    } catch (err: any) {
      console.error('Error exporting plain text in LetterGeneratorView:', err);
      setExportNotice({ type: 'error', message: `Erreur : ${err?.message || 'Erreur'}` });
      showToast(`Erreur export texte : ${err?.message || 'Erreur'}`);
    } finally {
      setIsExporting(false);
    }
  };

  // High-fidelity print with exact color preservation
  const handlePrint = () => {
    setShowExportMenu(false);
    const letterObj = getCurrentLetterObject();
    printLetterDocument(letterObj);
    showToast('Lancement de l\'impression avec couleurs préservées...');
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 pb-16 transition-colors">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-black dark:bg-white text-white dark:text-black px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-bounce border border-neutral-800 dark:border-neutral-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>{toast}</span>
        </div>
      )}

      {/* Export Status Notification Banner */}
      {exportNotice && (
        <div className="fixed top-20 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className={`px-5 py-3.5 rounded-2xl shadow-xl border flex items-center gap-3 text-xs font-bold ${
            exportNotice.type === 'loading'
              ? 'bg-blue-600 text-white border-blue-500'
              : exportNotice.type === 'success'
              ? 'bg-emerald-600 text-white border-emerald-500'
              : 'bg-red-600 text-white border-red-500'
          }`}>
            {exportNotice.type === 'loading' && <RefreshCw className="w-4 h-4 animate-spin shrink-0" />}
            {exportNotice.type === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0" />}
            {exportNotice.type === 'error' && <Lock className="w-4 h-4 shrink-0" />}
            <span>{exportNotice.message}</span>
          </div>
        </div>
      )}

      {/* Paywall Alert Modal for AI Paragraph Optimization */}
      {showPaywallAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-neutral-900 dark:text-white">
                Optimisation IA par Paragraphe
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1.5 leading-relaxed">
                L'optimisation individuelle et ciblée de chaque paragraphe par l'intelligence artificielle est une fonctionnalité réservée aux formules Pro / Premium.
              </p>
            </div>
            <div className="pt-2 flex gap-2.5">
              <button
                type="button"
                onClick={() => setShowPaywallAlert(false)}
                className="flex-1 py-2.5 px-4 text-xs font-bold rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
              >
                Fermer
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPaywallAlert(false);
                  if (onOpenUpgrade) onOpenUpgrade();
                  else if (onOpenPayment) onOpenPayment();
                }}
                className="flex-1 py-2.5 px-4 text-xs font-extrabold rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Débloquer Pro</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Header Sticky Bar */}
      <div className="letter-generator-header sticky top-16 z-20 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={handleBack}
            className="p-2 rounded-xl text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer border border-neutral-200 dark:border-neutral-700"
            title="Retour à mes lettres"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <input
              type="text"
              value={titreLettre}
              onChange={(e) => { setTitreLettre(e.target.value); setIsSaved(false); }}
              className="font-extrabold text-sm sm:text-base text-neutral-900 dark:text-white bg-transparent border-b border-dashed border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-white focus:border-black dark:focus:border-white outline-none px-1 py-0.5"
              placeholder="Titre de la lettre..."
            />
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5 mt-0.5">
              <span>{isSaved ? '✓ Enregistré automatiquement' : '• Modifications non enregistrées'}</span>
            </p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Copy Text */}
          <button
            type="button"
            onClick={handleCopy}
            className="px-3.5 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 font-bold text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Copier le texte"
          >
            <Copy className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Copier</span>
          </button>

          {/* Full Modal Preview */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('preview');
              setShowPreviewModal(true);
            }}
            className="px-3.5 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-100 font-extrabold text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Aperçu du document A4 en pleine page"
          >
            <Eye className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-300" />
            <span>Prévisualiser</span>
          </button>

          {/* Enregistrer Button */}
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-3.5 py-2 bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
          >
            {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Enregistrer</span>
          </button>

          {/* Multi-format Export Dropdown Menu */}
          <div className="relative" ref={exportMenuRef}>
            <button
              type="button"
              onClick={() => setShowExportMenu(!showExportMenu)}
              disabled={isExporting}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Exporter dans plusieurs formats (PDF, Word, Texte)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exporter</span>
              <ChevronDown className="w-3 h-3 ml-0.5" />
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1.5 border-b border-neutral-100 dark:border-neutral-800">
                  <p className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">Formats d'export</p>
                </div>

                {/* 1. PDF Standard / HD */}
                <button
                  type="button"
                  onClick={handleExportPDF}
                  className="w-full px-3 py-2 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center gap-2.5 text-xs font-semibold cursor-pointer transition-colors"
                >
                  <div className="w-6 h-6 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-neutral-900 dark:text-white">PDF Haute Définition</div>
                    <div className="text-[10px] text-neutral-500">Document .pdf prêt à l'envoi</div>
                  </div>
                </button>

                {/* 2. Word (.doc) */}
                <button
                  type="button"
                  onClick={handleExportWord}
                  className="w-full px-3 py-2 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center gap-2.5 text-xs font-semibold cursor-pointer transition-colors"
                >
                  <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <FileType className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-neutral-900 dark:text-white">Document Word (.doc)</div>
                    <div className="text-[10px] text-neutral-500">Éditable dans Microsoft Word</div>
                  </div>
                </button>

                {/* 3. Texte Brut (.txt) */}
                <button
                  type="button"
                  onClick={handleExportPlainText}
                  className="w-full px-3 py-2 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center gap-2.5 text-xs font-semibold cursor-pointer transition-colors"
                >
                  <div className="w-6 h-6 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 flex items-center justify-center shrink-0">
                    <FileCheck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-neutral-900 dark:text-white">Texte Brut (.txt)</div>
                    <div className="text-[10px] text-neutral-500">Pour copier-coller ATS / formulaires</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Imprimer Button (Exact Colors Preserved) */}
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 bg-black hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-black font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            title="Imprimer avec couleurs exactes préservées"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer</span>
          </button>
        </div>
      </div>

      {/* Main Studio Content: 2-Column Responsive Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: PARAMETERS & AI GENERATOR (lg:col-span-5) */}
          <div className="letter-editor-left-column lg:col-span-5 space-y-6">
            
            {/* 1. CV Source & Target Details Card */}
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-5">
              <div className="flex items-center space-x-2.5 pb-2 border-b border-neutral-100 dark:border-neutral-800">
                <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white">Générateur IA & Paramètres</h3>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">Configurez votre candidature ciblée</p>
                </div>
              </div>

              {/* Source CV Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-neutral-500" />
                  <span>CV Source utilisé comme base</span>
                </label>
                <select
                  value={selectedCVId}
                  onChange={(e) => setSelectedCVId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white rounded-xl focus:border-black dark:focus:border-white outline-none font-medium"
                >
                  {cvs.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.titre} {c.isModified ? '(Modifié / Adapté)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Company & Position */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Entreprise ciblée</span>
                  </label>
                  <input
                    type="text"
                    value={entreprise}
                    onChange={(e) => { setEntreprise(e.target.value); setIsSaved(false); }}
                    placeholder="Ex: Orange, Total, Société Générale..."
                    className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white rounded-xl focus:border-black dark:focus:border-white outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Poste visé</span>
                  </label>
                  <input
                    type="text"
                    value={poste}
                    onChange={(e) => { setPoste(e.target.value); setIsSaved(false); }}
                    placeholder="Ex: Chef de Projet, Développeur..."
                    className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white rounded-xl focus:border-black dark:focus:border-white outline-none"
                  />
                </div>
              </div>

              {/* Recipient & Tone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">Destinataire</label>
                  <input
                    type="text"
                    value={destinataire}
                    onChange={(e) => { setDestinataire(e.target.value); setIsSaved(false); }}
                    placeholder="Ex: Direction des RH"
                    className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white rounded-xl focus:border-black dark:focus:border-white outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">Ton de rédaction</label>
                  <select
                    value={ton}
                    onChange={(e) => setTon(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white rounded-xl focus:border-black dark:focus:border-white outline-none font-medium"
                  >
                    <option value="professionnel">Professionnel & Équilibré</option>
                    <option value="dynamique">Dynamique & Innovant</option>
                    <option value="formel">Formel & Rigoureux</option>
                    <option value="executif">Exécutif & Stratégique</option>
                  </select>
                </div>
              </div>

              {/* Specific focus points */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">Points forts particuliers à valoriser (optionnel)</label>
                <textarea
                  value={pointsCles}
                  onChange={(e) => setPointsCles(e.target.value)}
                  placeholder="Ex: Maîtrise avancée de React, bilingue anglais, gestion d'équipe de 5 personnes..."
                  rows={2}
                  className="w-full px-3.5 py-2 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white rounded-xl focus:border-black dark:focus:border-white outline-none resize-none"
                />
              </div>

              {/* Generate AI Button */}
              <button
                type="button"
                onClick={handleGenerateWithAI}
                disabled={isGenerating}
                className="w-full py-3 bg-black hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black font-black text-xs rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Rédaction IA complète en cours...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-400 dark:text-amber-600" />
                    <span>Rédiger / Régénérer la lettre complète avec l'IA</span>
                  </>
                )}
              </button>
            </div>

            {/* 2. Formatting & Typography Controls Card */}
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b border-neutral-100 dark:border-neutral-800">
                <Sliders className="w-4 h-4 text-neutral-400" />
                <h3 className="text-xs font-black uppercase text-neutral-500 tracking-wider">Mise en Page & Typographie</h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-neutral-600 dark:text-neutral-400">Police de caractères</label>
                  <select
                    value={police}
                    onChange={(e) => { setPolice(e.target.value); setIsSaved(false); }}
                    className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white rounded-xl focus:border-black dark:focus:border-white outline-none font-medium"
                  >
                    <option value="Inter">Inter (Moderne)</option>
                    <option value="Playfair Display">Playfair Display (Élégant)</option>
                    <option value="Merriweather">Merriweather (Classique)</option>
                    <option value="Roboto">Roboto (Clair)</option>
                    <option value="Montserrat">Montserrat (Dynamique)</option>
                    <option value="Lora">Lora (Littéraire)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-neutral-600 dark:text-neutral-400">Taille du texte ({taillePolice}pt)</label>
                  <input
                    type="range"
                    min="9"
                    max="14"
                    step="0.5"
                    value={taillePolice}
                    onChange={(e) => { setTaillePolice(parseFloat(e.target.value)); setIsSaved(false); }}
                    className="w-full accent-black dark:accent-white cursor-pointer mt-2"
                  />
                </div>
              </div>

              {/* Accent Color Picker */}
              <div className="space-y-1.5 pt-1">
                <label className="text-[11px] font-bold text-neutral-600 dark:text-neutral-400">Couleur d'accentuation</label>
                <div className="flex items-center gap-2 flex-wrap">
                  {['#171717', '#2563EB', '#059669', '#0891B2', '#D97706', '#DC2626', '#4F46E5', '#9333EA'].map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => { setCouleurAccent(col); setIsSaved(false); }}
                      className={`w-7 h-7 rounded-full transition-transform cursor-pointer border-2 ${
                        couleurAccent === col ? 'scale-110 border-black dark:border-white shadow-xs' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: col }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Sender Contact Overrides */}
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-3">
              <div className="flex items-center space-x-2 pb-2 border-b border-neutral-100 dark:border-neutral-800">
                <UserIcon className="w-4 h-4 text-neutral-400" />
                <h3 className="text-xs font-black uppercase text-neutral-500 tracking-wider">Vos Coordonnées (Expéditeur)</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <input
                  type="text"
                  value={expediteurNom}
                  onChange={(e) => { setExpediteurNom(e.target.value); setIsSaved(false); }}
                  placeholder="Nom complet"
                  className="px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white rounded-xl outline-none"
                />
                <input
                  type="text"
                  value={expediteurTitre}
                  onChange={(e) => { setExpediteurTitre(e.target.value); setIsSaved(false); }}
                  placeholder="Titre professionnel"
                  className="px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white rounded-xl outline-none"
                />
                <input
                  type="email"
                  value={expediteurEmail}
                  onChange={(e) => { setExpediteurEmail(e.target.value); setIsSaved(false); }}
                  placeholder="Email"
                  className="px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white rounded-xl outline-none"
                />
                <input
                  type="text"
                  value={expediteurTel}
                  onChange={(e) => { setExpediteurTel(e.target.value); setIsSaved(false); }}
                  placeholder="Téléphone"
                  className="px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white rounded-xl outline-none"
                />
              </div>
              <input
                type="text"
                value={expediteurAdresse}
                onChange={(e) => { setExpediteurAdresse(e.target.value); setIsSaved(false); }}
                placeholder="Adresse postale / Ville"
                className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white rounded-xl outline-none"
              />
            </div>
          </div>

          {/* RIGHT COLUMN: REAL-TIME A4 LETTER SHEET PREVIEW & INLINE EDITING (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* View Tab Selector: Éditer Champs vs Aperçu Feuille A4 */}
            <div className="flex bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-1 rounded-2xl w-fit">
              <button
                type="button"
                onClick={() => setActiveTab('editor')}
                className={`px-4 py-1.5 text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'editor'
                    ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                }`}
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Édition Détaillée</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-4 py-1.5 text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'preview'
                    ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Aperçu Document A4</span>
              </button>
            </div>

            {/* TAB 1: STRUCTURED INLINE FIELD EDITOR WITH INDIVIDUAL AI PARAGRAPH OPTIMIZATION */}
            {activeTab === 'editor' && (
              <div className="bg-white dark:bg-neutral-900 p-6 sm:p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-6">
                
                {/* Subject / Objet */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase text-neutral-900 dark:text-neutral-200 tracking-wider">Objet de la lettre</label>
                  <input
                    type="text"
                    value={objet}
                    onChange={(e) => { setObjet(e.target.value); setIsSaved(false); }}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm font-bold bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white rounded-xl focus:border-black dark:focus:border-white outline-none"
                  />
                </div>

                {/* Formule d'ouverture */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">Formule de politesse d'ouverture</label>
                  <input
                    type="text"
                    value={formuleEntree}
                    onChange={(e) => { setFormuleEntree(e.target.value); setIsSaved(false); }}
                    className="w-full px-4 py-2 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white rounded-xl focus:border-black dark:focus:border-white outline-none"
                  />
                </div>

                {/* Paragraphe 1 : Accroche & Motivation + AI OPTIMIZER BUTTON */}
                <div className="space-y-1.5 bg-neutral-50/50 dark:bg-neutral-950/40 p-4 rounded-2xl border border-neutral-200/70 dark:border-neutral-800">
                  <div className="flex items-center justify-between gap-2 flex-wrap pb-1">
                    <div>
                      <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">1. Paragraphe d'Accroche & Motivation</span>
                      <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block">Présentation percutante & poste ciblé</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {undoHistory['accroche'] && (
                        <button
                          type="button"
                          onClick={() => handleUndoParagraph('accroche')}
                          className="px-2.5 py-1 text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white border border-neutral-300 dark:border-neutral-700 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                          title="Restaurer le texte initial"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Annuler</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleOptimizeParagraph('accroche')}
                        disabled={optimizingSection === 'accroche'}
                        className="px-3 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-[11px] rounded-lg shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        title="Optimiser ce paragraphe avec l'IA (Premium)"
                      >
                        {optimizingSection === 'accroche' ? (
                          <>
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            <span>Optimisation...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3 h-3 text-amber-300" />
                            <span>Optimiser avec l'IA</span>
                            <span className="text-[9px] bg-amber-400/30 text-amber-200 px-1 py-0.2 rounded font-black">PRO</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  <textarea
                    value={accroche}
                    onChange={(e) => { setAccroche(e.target.value); setIsSaved(false); }}
                    rows={3}
                    className="w-full p-3.5 text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white rounded-xl focus:border-black dark:focus:border-white outline-none leading-relaxed"
                  />
                </div>

                {/* Paragraphe 2 : Valeur Ajoutée & Réalisations + AI OPTIMIZER BUTTON */}
                <div className="space-y-1.5 bg-neutral-50/50 dark:bg-neutral-950/40 p-4 rounded-2xl border border-neutral-200/70 dark:border-neutral-800">
                  <div className="flex items-center justify-between gap-2 flex-wrap pb-1">
                    <div>
                      <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">2. Paragraphe Valeur Ajoutée & Réalisations</span>
                      <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block">Compétences prouvées, résultats & expertise</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {undoHistory['valeurAjoutee'] && (
                        <button
                          type="button"
                          onClick={() => handleUndoParagraph('valeurAjoutee')}
                          className="px-2.5 py-1 text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white border border-neutral-300 dark:border-neutral-700 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                          title="Restaurer le texte initial"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Annuler</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleOptimizeParagraph('valeurAjoutee')}
                        disabled={optimizingSection === 'valeurAjoutee'}
                        className="px-3 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-[11px] rounded-lg shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        title="Optimiser ce paragraphe avec l'IA (Premium)"
                      >
                        {optimizingSection === 'valeurAjoutee' ? (
                          <>
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            <span>Optimisation...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3 h-3 text-amber-300" />
                            <span>Optimiser avec l'IA</span>
                            <span className="text-[9px] bg-amber-400/30 text-amber-200 px-1 py-0.2 rounded font-black">PRO</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  <textarea
                    value={valeurAjoutee}
                    onChange={(e) => { setValeurAjoutee(e.target.value); setIsSaved(false); }}
                    rows={4}
                    className="w-full p-3.5 text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white rounded-xl focus:border-black dark:focus:border-white outline-none leading-relaxed"
                  />
                </div>

                {/* Paragraphe 3 : Adéquation Entreprise + AI OPTIMIZER BUTTON */}
                <div className="space-y-1.5 bg-neutral-50/50 dark:bg-neutral-950/40 p-4 rounded-2xl border border-neutral-200/70 dark:border-neutral-800">
                  <div className="flex items-center justify-between gap-2 flex-wrap pb-1">
                    <div>
                      <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">3. Paragraphe Adéquation avec l'Entreprise</span>
                      <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block">Vision partagée, valeurs & synergie</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {undoHistory['adequation'] && (
                        <button
                          type="button"
                          onClick={() => handleUndoParagraph('adequation')}
                          className="px-2.5 py-1 text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white border border-neutral-300 dark:border-neutral-700 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                          title="Restaurer le texte initial"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Annuler</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleOptimizeParagraph('adequation')}
                        disabled={optimizingSection === 'adequation'}
                        className="px-3 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-[11px] rounded-lg shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        title="Optimiser ce paragraphe avec l'IA (Premium)"
                      >
                        {optimizingSection === 'adequation' ? (
                          <>
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            <span>Optimisation...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3 h-3 text-amber-300" />
                            <span>Optimiser avec l'IA</span>
                            <span className="text-[9px] bg-amber-400/30 text-amber-200 px-1 py-0.2 rounded font-black">PRO</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  <textarea
                    value={adequation}
                    onChange={(e) => { setAdequation(e.target.value); setIsSaved(false); }}
                    rows={3}
                    className="w-full p-3.5 text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white rounded-xl focus:border-black dark:focus:border-white outline-none leading-relaxed"
                  />
                </div>

                {/* Paragraphe 4 : Conclusion & Appel Entretien + AI OPTIMIZER BUTTON */}
                <div className="space-y-1.5 bg-neutral-50/50 dark:bg-neutral-950/40 p-4 rounded-2xl border border-neutral-200/70 dark:border-neutral-800">
                  <div className="flex items-center justify-between gap-2 flex-wrap pb-1">
                    <div>
                      <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">4. Paragraphe Conclusion & Entretien</span>
                      <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block">Disponibilité, motivation & appel à l'action</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {undoHistory['conclusion'] && (
                        <button
                          type="button"
                          onClick={() => handleUndoParagraph('conclusion')}
                          className="px-2.5 py-1 text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white border border-neutral-300 dark:border-neutral-700 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                          title="Restaurer le texte initial"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Annuler</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleOptimizeParagraph('conclusion')}
                        disabled={optimizingSection === 'conclusion'}
                        className="px-3 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-[11px] rounded-lg shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        title="Optimiser ce paragraphe avec l'IA (Premium)"
                      >
                        {optimizingSection === 'conclusion' ? (
                          <>
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            <span>Optimisation...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3 h-3 text-amber-300" />
                            <span>Optimiser avec l'IA</span>
                            <span className="text-[9px] bg-amber-400/30 text-amber-200 px-1 py-0.2 rounded font-black">PRO</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  <textarea
                    value={conclusion}
                    onChange={(e) => { setConclusion(e.target.value); setIsSaved(false); }}
                    rows={2}
                    className="w-full p-3.5 text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white rounded-xl focus:border-black dark:focus:border-white outline-none leading-relaxed"
                  />
                </div>

                {/* Formule de sortie & Signature */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">Formule de politesse finale</label>
                    <input
                      type="text"
                      value={formuleSortie}
                      onChange={(e) => { setFormuleSortie(e.target.value); setIsSaved(false); }}
                      className="w-full px-3.5 py-2 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white rounded-xl focus:border-black dark:focus:border-white outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">Signature</label>
                    <input
                      type="text"
                      value={signature}
                      onChange={(e) => { setSignature(e.target.value); setIsSaved(false); }}
                      className="w-full px-3.5 py-2 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white rounded-xl focus:border-black dark:focus:border-white outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2 / REAL-TIME A4 LETTER SHEET PREVIEW */}
            <div
              id="letter-a4-sheet"
              className={`letter-a4-sheet bg-white text-neutral-900 p-8 sm:p-12 md:p-16 rounded-3xl shadow-xl border border-neutral-200 dark:border-neutral-800 min-h-[750px] relative transition-all ${
                activeTab === 'editor' ? 'hidden md:block' : 'block'
              }`}
              style={{
                fontFamily: police,
                fontSize: `${taillePolice}pt`,
                lineHeight: 1.6
              }}
            >
              {/* Header Accent Line with print color adjust */}
              <div 
                className="h-1.5 w-16 rounded-full mb-8"
                style={{ 
                  backgroundColor: couleurAccent,
                  WebkitPrintColorAdjust: 'exact',
                  printColorAdjust: 'exact'
                }}
              />

              {/* Sender & Recipient Blocks */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-neutral-100">
                {/* Sender Left */}
                <div className="space-y-1 text-xs">
                  <p className="font-extrabold text-sm text-neutral-900">{expediteurNom}</p>
                  {expediteurTitre && <p className="font-semibold text-neutral-600">{expediteurTitre}</p>}
                  {expediteurAdresse && <p className="text-neutral-500">{expediteurAdresse}</p>}
                  <p className="text-neutral-500">{expediteurTel} {expediteurEmail && `• ${expediteurEmail}`}</p>
                </div>

                {/* Recipient Right */}
                <div className="sm:text-right space-y-1 text-xs">
                  <p className="font-extrabold text-sm text-neutral-900">{entreprise || 'Entreprise'}</p>
                  <p className="font-medium text-neutral-600">{destinataire || 'Direction des Ressources Humaines'}</p>
                  <p className="text-neutral-400 pt-1 italic">{villeDate}</p>
                </div>
              </div>

              {/* Objet Banner */}
              <div 
                className="my-6 p-3 rounded-xl bg-neutral-50 border-l-4" 
                style={{ 
                  borderColor: couleurAccent,
                  WebkitPrintColorAdjust: 'exact',
                  printColorAdjust: 'exact'
                }}
              >
                <p className="font-black text-xs sm:text-sm text-neutral-900">
                  <span className="text-neutral-500 uppercase tracking-wider text-[10px] mr-2">Objet :</span>
                  {objet}
                </p>
              </div>

              {/* Body Content */}
              <div className="space-y-4 text-neutral-800 text-justify">
                <p className="font-semibold">{formuleEntree}</p>

                {accroche && <p className="leading-relaxed">{accroche}</p>}
                {valeurAjoutee && <p className="leading-relaxed">{valeurAjoutee}</p>}
                {adequation && <p className="leading-relaxed">{adequation}</p>}
                {conclusion && <p className="leading-relaxed">{conclusion}</p>}

                <p className="pt-2 font-medium">{formuleSortie}</p>
              </div>

              {/* Signature Block */}
              <div className="mt-8 pt-4 flex flex-col items-end">
                <p className="font-extrabold text-neutral-900 text-sm">{signature || expediteurNom}</p>
                <div 
                  className="h-0.5 w-24 mt-2 rounded" 
                  style={{ 
                    backgroundColor: couleurAccent, 
                    opacity: 0.7,
                    WebkitPrintColorAdjust: 'exact',
                    printColorAdjust: 'exact'
                  }}
                />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Real-time Full A4 Letter Preview Modal */}
      <LetterPreviewModal
        letter={getCurrentLetterObject()}
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        onPrint={() => handlePrint()}
      />
    </div>
  );
};
