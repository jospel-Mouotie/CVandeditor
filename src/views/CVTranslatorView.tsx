import React, { useState, useEffect } from 'react';
import { CV, Language, SubscriptionTier, SavedLetter } from '../types';
import { Languages, Sparkles, Download, Check, RefreshCw, ArrowRight, ShieldAlert, Crown, ArrowLeft, FileText, Lock, Mail } from 'lucide-react';
import { exportCVToPDF } from '../utils/pdfExport';
import { isPaymentActive } from '../utils/adminPaidMatrix';
import { CVPreview } from '../components/CVPreview';

interface CVTranslatorViewProps {
  cvList: CV[];
  activeCv?: CV | null;
  activeCV?: CV | null;
  langue: Language;
  userTier: SubscriptionTier;
  onSaveCv: (cv: CV) => void;
  onOpenCvInEditor?: (cv: CV) => void;
  onOpenUpgradeModal: (tier?: SubscriptionTier) => void;
  onBackToDashboard: () => void;
}

export const CVTranslatorView: React.FC<CVTranslatorViewProps> = ({
  cvList,
  activeCv,
  activeCV,
  langue,
  userTier,
  onSaveCv,
  onOpenCvInEditor,
  onOpenUpgradeModal,
  onBackToDashboard
}) => {
  const isAr = langue === 'ar';
  const isEn = langue === 'en';
  const currentActiveCv = activeCv || activeCV || null;
  
  const [docType, setDocType] = useState<'cv' | 'letter'>('cv');
  const [selectedCvId, setSelectedCvId] = useState<string>(currentActiveCv?.id || cvList[0]?.id || '');
  
  const [lettersList, setLettersList] = useState<SavedLetter[]>([]);
  const [selectedLetterId, setSelectedLetterId] = useState<string>('');
  
  const [targetLang, setTargetLang] = useState<'fr' | 'en' | 'ar'>('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [translatedCv, setTranslatedCv] = useState<CV | null>(null);
  const [translatedLetter, setTranslatedLetter] = useState<SavedLetter | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const selectedCv = cvList.find(c => c.id === selectedCvId) || currentActiveCv || cvList[0];
  const selectedLetter = lettersList.find(l => l.id === selectedLetterId) || lettersList[0];

  useEffect(() => {
    let timer: any;
    if (isTranslating) {
      setProgressPercent(10);
      timer = setInterval(() => {
        setProgressPercent((prev) => {
          if (prev < 30) return prev + 12;
          if (prev < 75) return prev + 7;
          if (prev < 92) return prev + 2;
          return prev;
        });
      }, 350);
    } else {
      setProgressPercent(0);
    }
    return () => clearInterval(timer);
  }, [isTranslating]);

  useEffect(() => {
    const fetchLetters = async () => {
      let loaded: SavedLetter[] = [];
      try {
        const token = localStorage.getItem('cv_builder_token') || localStorage.getItem('token');
        const res = await fetch('/api/lettres', {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (res.ok) {
          const data = await res.json();
          loaded = Array.isArray(data) ? data : (data?.letters || []);
        }
      } catch (err) {
        console.warn('Could not load letters for translation from server:', err);
      }

      if (loaded.length === 0) {
        try {
          const local = JSON.parse(localStorage.getItem('cv_builder_letters') || '[]');
          if (Array.isArray(local) && local.length > 0) {
            loaded = local;
          }
        } catch (_) {}
      }

      setLettersList(loaded);
      if (loaded.length > 0) setSelectedLetterId(loaded[0].id);
    };
    fetchLetters();
  }, []);

  const storedUser = typeof window !== 'undefined' ? localStorage.getItem('cv_builder_user') : null;
  let effectiveTier = userTier;
  if (storedUser) {
    try {
      const parsed = JSON.parse(storedUser);
      if (parsed.role === 'ADMIN' || parsed.subscriptionTier === 'premium') effectiveTier = 'premium';
    } catch (_) {}
  }
  const isLocked = isPaymentActive() && effectiveTier === 'freemium';

  const handleTranslate = async () => {
    if (isLocked) {
      onOpenUpgradeModal('classique');
      return;
    }

    if (docType === 'cv') {
      if (!selectedCv) {
        alert(isAr ? 'يرجى تحديد سيرة ذاتية للترجمة.' : isEn ? 'Please select a resume to translate.' : 'Veuillez sélectionner un CV à traduire.');
        return;
      }

      setIsTranslating(true);
      setStatusMessage(isAr ? 'جاري ترجمة السيرة الذاتية عبر الذكاء الاصطناعي...' : isEn ? 'Translating CV with AI...' : 'Traduction automatique du CV en cours...');

      try {
        const token = localStorage.getItem('cv_builder_token') || localStorage.getItem('token');
        const res = await fetch('/api/ai/translate-cv', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            cv: selectedCv,
            targetLang
          })
        });

        const data = await res.json();
        if (res.ok && data.success && data.translatedCv) {
          const newCv: CV = {
            ...data.translatedCv,
            id: `cv-translated-${Date.now()}`,
            titre: `${selectedCv.titre || 'CV'} (${targetLang.toUpperCase()})`,
            langue: targetLang,
            templateId: selectedCv.templateId || 'classique-minimalist',
            modeleColor: selectedCv.modeleColor,
            couleurPrincipale: selectedCv.couleurPrincipale,
            policeFamille: selectedCv.policeFamille,
            styleTitre: selectedCv.styleTitre,
            shapePhoto: selectedCv.shapePhoto,
            sizePhoto: selectedCv.sizePhoto,
            tailleTexte: selectedCv.tailleTexte,
            espacementLignes: selectedCv.espacementLignes,
            margePage: selectedCv.margePage,
            rechercheEmploiActive: selectedCv.rechercheEmploiActive,
            footerSettings: selectedCv.footerSettings,
            modeDeuxPagesStrict: selectedCv.modeDeuxPagesStrict,
            misAJourLe: new Date().toISOString()
          };
          setTranslatedCv(newCv);
          onSaveCv(newCv);
          setStatusMessage(isAr ? 'تمت ترجمة السيرة الذاتية بنجاح وبناء المستند المنسق!' : isEn ? 'CV translated successfully and formatted document ready!' : 'Traduction terminée ! Votre document PDF traduit est prêt avec le même design.');
        } else {
          throw new Error(data.error || 'Erreur de traduction');
        }
      } catch (err: any) {
        console.error('Translation error:', err);
        setStatusMessage(err.message || (isAr ? 'حدث خطأ أثناء الترجمة.' : isEn ? 'Translation failed. Please try again.' : 'Erreur lors de la traduction. Veuillez réessayer.'));
      } finally {
        setIsTranslating(false);
      }
    } else {
      // Letter mode
      if (!selectedLetter) {
        alert(isAr ? 'يرجى تحديد رسالة تحفيزية للترجمة.' : isEn ? 'Please select a cover letter to translate.' : 'Veuillez sélectionner une lettre de motivation à traduire.');
        return;
      }

      setIsTranslating(true);
      setStatusMessage(isAr ? 'جاري ترجمة رسالة التحفيز عبر الذكاء الاصطناعي...' : isEn ? 'Translating cover letter with AI...' : 'Traduction automatique de la lettre en cours...');

      try {
        const token = localStorage.getItem('cv_builder_token') || localStorage.getItem('token');
        const res = await fetch('/api/ai/translate-lettre', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            letter: selectedLetter,
            targetLang
          })
        });

        const data = await res.json();
        if (res.ok && data.success && data.translatedLetter) {
          setTranslatedLetter(data.translatedLetter);
          setStatusMessage(isAr ? 'تمت ترجمة الرسالة بنجاح!' : isEn ? 'Cover letter translated successfully!' : 'Traduction de la lettre terminée avec succès !');
        } else {
          throw new Error(data.error || 'Erreur de traduction de la lettre');
        }
      } catch (err: any) {
        console.error('Letter translation error:', err);
        setStatusMessage(err.message || (isAr ? 'حدث خطأ أثناء ترجمة الرسالة.' : isEn ? 'Letter translation failed.' : 'Erreur lors de la traduction de la lettre.'));
      } finally {
        setIsTranslating(false);
      }
    }
  };

  const handleSaveAndExport = async () => {
    if (docType === 'cv' && translatedCv) {
      onSaveCv(translatedCv);
      setDownloading(true);
      try {
        await exportCVToPDF('cv-preview-container', `${translatedCv.titre || 'CV_Traduit'}.pdf`, false);
      } catch (e) {
        console.error(e);
      } finally {
        setDownloading(false);
      }
    } else if (translatedLetter) {
      // Copy letter text to clipboard or trigger download
      navigator.clipboard.writeText(translatedLetter.texteComplet || `${translatedLetter.formulePolitesseEntree}\n\n${translatedLetter.paragrapheAccroche}\n\n${translatedLetter.paragrapheValeurAjoutee}\n\n${translatedLetter.paragrapheAdequationEntreprise}\n\n${translatedLetter.paragrapheConclusion}\n\n${translatedLetter.formulePolitesseSortie}`);
      alert(isAr ? 'تم نسخ الرسالة المترجمة إلى الحافظة!' : isEn ? 'Translated letter copied to clipboard!' : 'Lettre traduite copiée dans le presse-papier !');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-4 sm:p-8" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToDashboard}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white rounded-xl font-bold text-xs border border-neutral-800 flex items-center gap-2 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isAr ? 'العودة إلى لوحة التحكم' : isEn ? 'Back to Dashboard' : 'Retour au Tableau de bord'}</span>
          </button>

          {isPaymentActive() && (
            <div className="px-3 py-1 bg-neutral-900 border border-neutral-700 text-neutral-200 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>{isAr ? 'ميزة فورفي كلاسيك / بريميوم' : isEn ? 'Classique & Premium Feature' : 'Inclus Forfait Classique & Premium'}</span>
            </div>
          )}
        </div>

        {/* Header */}
        <div className="bg-neutral-900 p-6 sm:p-8 rounded-3xl border border-neutral-800 shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-800 text-white rounded-full text-xs font-bold border border-neutral-700">
              <Languages className="w-4 h-4 text-white" />
              <span>{isAr ? 'ترجمة فورية بـ 3 لغات' : isEn ? 'Instant Tri-Language Translator' : 'Traducteur Instantané Tri-Langue'}</span>
            </div>
            
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {isAr ? 'ترجمة السيرة الذاتية ورسالة التحفيز' : isEn ? 'Translate your CV & Cover Letter' : 'Traduisez votre CV & Lettre de Motivation'}
            </h1>
            
            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
              {isAr
                ? 'استهدف فرص العمل الدولية من خلال ترجمة سيرتك الذاتية ورسالة التحفيز بدقة عالية وبشكل فوري.'
                : isEn
                ? 'Adapt your application for the international market. AI preserves your layout while accurately translating skills, experiences, and letters.'
                : 'Adaptez votre candidature pour le marché international. L\'IA conserve votre mise en page originale tout en traduisant fidèlement vos compétences, expériences et lettres.'}
            </p>

            {/* Document Type Selector Tabs */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDocType('cv')}
                className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer border ${
                  docType === 'cv'
                    ? 'bg-white text-black border-white shadow-lg'
                    : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>{isAr ? 'السيرة الذاتية (CV)' : isEn ? 'Resume / CV' : 'Savoir-Faire / CV'}</span>
              </button>

              <button
                type="button"
                onClick={() => setDocType('letter')}
                className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer border ${
                  docType === 'letter'
                    ? 'bg-white text-black border-white shadow-lg'
                    : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:text-white'
                }`}
              >
                <Mail className="w-4 h-4" />
                <span>{isAr ? 'رسالة تحفيزية' : isEn ? 'Cover Letter' : 'Lettre de Motivation'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Translation Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Step 1: Select Document */}
          <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-white font-black text-xs uppercase tracking-wider">
              <span className="w-6 h-6 rounded-lg bg-neutral-800 flex items-center justify-center text-white border border-neutral-700">1</span>
              <span>{isAr ? '1. اختر المستند' : isEn ? '1. Select Document' : '1. Choisir le document'}</span>
            </div>

            {docType === 'cv' ? (
              cvList.length === 0 ? (
                <p className="text-xs text-neutral-400 italic">
                  {isAr ? 'لا توجد سير ذاتية متاحة. أنشئ سيرة ذاتية أولاً.' : isEn ? 'No CVs found. Create one first.' : 'Aucun CV trouvé. Veuillez d\'abord créer un CV.'}
                </p>
              ) : (
                <select
                  value={selectedCvId}
                  onChange={(e) => setSelectedCvId(e.target.value)}
                  className="w-full p-3 bg-neutral-950 border border-neutral-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-white"
                >
                  {cvList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.titre || 'CV sans titre'} ({c.langue || 'fr'})
                    </option>
                  ))}
                </select>
              )
            ) : (
              lettersList.length === 0 ? (
                <p className="text-xs text-neutral-400 italic">
                  {isAr ? 'لا توجد رسائل تحفيزية متاحة.' : isEn ? 'No cover letters found.' : 'Aucune lettre de motivation trouvée.'}
                </p>
              ) : (
                <select
                  value={selectedLetterId}
                  onChange={(e) => setSelectedLetterId(e.target.value)}
                  className="w-full p-3 bg-neutral-950 border border-neutral-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-white"
                >
                  {lettersList.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.titre || l.objet || 'Lettre sans titre'}
                    </option>
                  ))}
                </select>
              )
            )}

            {docType === 'cv' && selectedCv && (
              <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs space-y-1">
                <p className="font-bold text-white">{selectedCv.titre}</p>
                <p className="text-neutral-400 text-[11px] truncate">{selectedCv.nomComplet || selectedCv.prenom}</p>
                <div className="flex items-center justify-between text-[10px] text-neutral-500 pt-1">
                  <span>Modèle: {selectedCv.templateId}</span>
                  <span className="uppercase font-bold text-white">{selectedCv.langue || 'FR'}</span>
                </div>
              </div>
            )}

            {docType === 'letter' && selectedLetter && (
              <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs space-y-1">
                <p className="font-bold text-white">{selectedLetter.titre || selectedLetter.objet}</p>
                <p className="text-neutral-400 text-[11px] truncate">{selectedLetter.destinataire || selectedLetter.entreprise}</p>
              </div>
            )}
          </div>

          {/* Step 2: Target Language */}
          <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-white font-black text-xs uppercase tracking-wider">
              <span className="w-6 h-6 rounded-lg bg-neutral-800 flex items-center justify-center text-white border border-neutral-700">2</span>
              <span>{isAr ? 'اختر اللغة الهدف' : isEn ? '2. Select Target Language' : '2. Choisir la langue cible'}</span>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setTargetLang('fr')}
                className={`w-full p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                  targetLang === 'fr'
                    ? 'bg-white text-black border-white shadow-md'
                    : 'bg-neutral-950 text-neutral-300 border-neutral-800 hover:bg-neutral-800'
                }`}
              >
                <span>Français (FR)</span>
                {targetLang === 'fr' && <Check className="w-4 h-4 text-black" />}
              </button>

              <button
                type="button"
                onClick={() => setTargetLang('en')}
                className={`w-full p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                  targetLang === 'en'
                    ? 'bg-white text-black border-white shadow-md'
                    : 'bg-neutral-950 text-neutral-300 border-neutral-800 hover:bg-neutral-800'
                }`}
              >
                <span>English / Anglais (EN)</span>
                {targetLang === 'en' && <Check className="w-4 h-4 text-black" />}
              </button>

              <button
                type="button"
                onClick={() => setTargetLang('ar')}
                className={`w-full p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                  targetLang === 'ar'
                    ? 'bg-white text-black border-white shadow-md'
                    : 'bg-neutral-950 text-neutral-300 border-neutral-800 hover:bg-neutral-800'
                }`}
              >
                <span>العربية / Arabe (AR)</span>
                {targetLang === 'ar' && <Check className="w-4 h-4 text-black" />}
              </button>
            </div>
          </div>

          {/* Step 3: Trigger Translation */}
          <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-4 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-white font-black text-xs uppercase tracking-wider mb-2">
                <span className="w-6 h-6 rounded-lg bg-neutral-800 flex items-center justify-center text-white border border-neutral-700">3</span>
                <span>{isAr ? 'إطلاق الترجمة' : isEn ? '3. Translate Now' : '3. Lancer la traduction'}</span>
              </div>
              <p className="text-xs text-neutral-400">
                {isAr
                  ? 'سيتم توليد نسخة كاملة ومترجمة مع الحفاظ على القالب والتصميم الأصلي.'
                  : isEn
                  ? 'AI will generate a newly translated version preserving full structure and formatting.'
                  : 'L\'IA génèrera une nouvelle version dans la langue sélectionnée.'}
              </p>
            </div>

            {isLocked ? (
              <button
                type="button"
                onClick={() => onOpenUpgradeModal('classique')}
                className="w-full p-3.5 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs rounded-xl shadow-lg border border-amber-300 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Lock className="w-4 h-4" />
                <span>{isAr ? 'ترقية لـ Classique للترجمة' : isEn ? 'Upgrade to Classique to translate' : 'Passer à Classique pour traduire'}</span>
              </button>
            ) : (
              <button
                type="button"
                disabled={isTranslating || (docType === 'cv' ? !selectedCv : !selectedLetter)}
                onClick={handleTranslate}
                className="w-full p-3.5 bg-white hover:bg-neutral-200 text-black font-black text-xs rounded-xl shadow-lg border border-white flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                {isTranslating ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-black" />
                ) : (
                  <Sparkles className="w-4 h-4 text-black" />
                )}
                <span>{isTranslating ? (isAr ? 'جاري الترجمة...' : isEn ? 'Translating...' : 'Traduction en cours...') : (isAr ? 'ترجمة المستند الآن' : isEn ? 'Translate Document' : 'Traduire mon document')}</span>
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar Section */}
        {isTranslating && (
          <div className="p-6 bg-neutral-900 border border-blue-500/40 rounded-2xl space-y-3 shadow-2xl">
            <div className="flex items-center justify-between text-xs font-bold text-blue-300">
              <span className="flex items-center gap-2 text-white">
                <RefreshCw className="w-4 h-4 animate-spin text-blue-400 shrink-0" />
                {progressPercent < 30
                  ? (isAr ? '1. تحضير وتنظيف بيانات المستند...' : isEn ? '1. Preparing document structure...' : '1. Préparation du document...')
                  : progressPercent < 75
                  ? (isAr ? '2. ترجمة ذكية دقيقة عبر الذكاء الاصطناعي...' : isEn ? '2. AI Multilingual Translation...' : '2. Traduction intelligente par l\'IA...')
                  : (isAr ? '3. إعادة هيكلة وتطبيق القالب الأصلي...' : isEn ? '3. Rebuilding template structure...' : '3. Reconstitution du formatage & structure...')}
              </span>
              <span className="font-mono text-emerald-400 font-black text-sm">{progressPercent}%</span>
            </div>
            <div className="w-full bg-neutral-950 rounded-full h-3.5 p-0.5 border border-neutral-800 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-300 shadow-md"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-neutral-400 text-center pt-1">
              {isAr ? 'يرجى الانتظار بضع ثوانٍ بينما يقوم المترجم الذكي بمعالجة النص.' : isEn ? 'Please hold on a moment while AI processes your document.' : 'Veuillez patienter quelques instants pendant que l\'IA traduit votre document.'}
            </p>
          </div>
        )}

        {/* Status Message */}
        {statusMessage && !isTranslating && (
          <div className="p-4 bg-slate-900 border border-blue-500/30 rounded-2xl text-xs text-blue-300 flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Translated Result Output - CV */}
        {docType === 'cv' && translatedCv && (
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {isAr ? 'تمت الترجمة بنجاح' : isEn ? 'Translation Complete' : 'Traduction Réussie'}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    • Modèle: {translatedCv.templateId}
                  </span>
                </div>
                <h3 className="text-xl font-black text-white mt-1">
                  {translatedCv.titre}
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  disabled={downloading}
                  onClick={handleSaveAndExport}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-lg flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>
                    {downloading
                      ? (isAr ? 'جاري التصدير...' : isEn ? 'Generating PDF...' : 'Génération PDF HD...')
                      : (isAr ? 'تصدير PDF HD المترجم' : isEn ? 'Download Translated PDF (HD)' : 'Télécharger le PDF Traduit (HD)')}
                  </span>
                </button>

                {onOpenCvInEditor && (
                  <button
                    type="button"
                    onClick={() => onOpenCvInEditor(translatedCv)}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>{isAr ? 'تعديل في المحرر' : isEn ? 'Edit in Studio' : 'Ouvrir dans l\'Éditeur'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Document Rendered Canvas - Identical Layout, Translated Text */}
            <div className="bg-slate-950 p-4 sm:p-6 rounded-2xl border border-slate-800 overflow-x-auto flex justify-center">
              <div className="w-full max-w-[850px] shadow-2xl">
                <CVPreview
                  cv={translatedCv}
                  id="cv-preview-container"
                  interactivePreview={false}
                />
              </div>
            </div>
          </div>
        )}

        {/* Translated Result Output - Letter */}
        {docType === 'letter' && translatedLetter && (
          <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {isAr ? 'تمت ترجمة الرسالة' : isEn ? 'Letter Translation Complete' : 'Traduction de Lettre Réussie'}
                </span>
                <h3 className="text-xl font-black text-white mt-1">
                  {translatedLetter.titre || translatedLetter.objet}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSaveAndExport}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-lg flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>{isAr ? 'نسخ النص المترجم' : isEn ? 'Copy Translated Text' : 'Copier le texte traduit'}</span>
                </button>
              </div>
            </div>

            <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4 text-xs leading-relaxed text-slate-200">
              <p className="font-bold">{translatedLetter.formulePolitesseEntree}</p>
              <p>{translatedLetter.paragrapheAccroche}</p>
              <p>{translatedLetter.paragrapheValeurAjoutee}</p>
              <p>{translatedLetter.paragrapheAdequationEntreprise}</p>
              <p>{translatedLetter.paragrapheConclusion}</p>
              <p className="font-bold">{translatedLetter.formulePolitesseSortie}</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
