import React, { useState, useRef } from 'react';
import { CV, Language, SavedLetter, JobOfferExtraction, PersonnalisationResult } from '../types';
import { 
  Target, 
  Sparkles, 
  Upload, 
  FileText, 
  Building, 
  Briefcase, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  RefreshCw, 
  Layers, 
  Edit3, 
  Printer, 
  Mail, 
  ChevronRight, 
  HelpCircle, 
  Zap, 
  Check
} from 'lucide-react';

interface JobTargetingViewProps {
  cvs: CV[];
  activeCV: CV | null;
  langue: Language;
  onApplyPersonalizedCV: (newCV: CV) => Promise<void>;
  onSavePersonalizedLetter: (letter: SavedLetter) => Promise<void>;
  onOpenCVEditor: (cv: CV) => void;
  onOpenLetterEditor: (letter: SavedLetter) => void;
  onGoToDashboard: () => void;
  onGoToLetters: () => void;
}

export const JobTargetingView: React.FC<JobTargetingViewProps> = ({
  cvs,
  activeCV,
  langue,
  onApplyPersonalizedCV,
  onSavePersonalizedLetter,
  onOpenCVEditor,
  onOpenLetterEditor,
  onGoToDashboard,
  onGoToLetters
}) => {
  // Step 1: Input | Step 2: Dynamic Questions | Step 3: Result & Tailored Assets
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Selected base CV
  const [selectedCVId, setSelectedCVId] = useState<string>(
    activeCV?.id || (cvs.length > 0 ? cvs[0].id : '')
  );
  const selectedCV = cvs.find(c => c.id === selectedCVId) || activeCV || cvs[0] || null;

  // Job Offer Input modes
  const [inputMode, setInputMode] = useState<'text' | 'image'>('text');
  const [offreTexte, setOffreTexte] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Analysis & questions state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [extractedOffer, setExtractedOffer] = useState<JobOfferExtraction | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});

  // Final Personalization Output
  const [isTailoring, setIsTailoring] = useState(false);
  const [tailoringResult, setTailoringResult] = useState<PersonnalisationResult | null>(null);
  const [createdCV, setCreatedCV] = useState<CV | null>(null);
  const [createdLetter, setCreatedLetter] = useState<SavedLetter | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Handle image upload
  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Veuillez sélectionner un fichier image valide (PNG, JPG, WEBP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
      setImageBase64(result);
    };
    reader.readAsDataURL(file);
  };

  // Step 1: Analyze Job Offer
  const handleAnalyzeOffer = async () => {
    if (!selectedCV) {
      showToast('Veuillez sélectionner un CV source.');
      return;
    }

    if (inputMode === 'text' && !offreTexte.trim()) {
      showToast('Veuillez coller le texte de l\'offre d\'emploi.');
      return;
    }

    if (inputMode === 'image' && !imageBase64) {
      showToast('Veuillez importer une capture d\'écran de l\'offre.');
      return;
    }

    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/ai/cibler-offre', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cv: selectedCV,
          langue,
          offreTexte: inputMode === 'text' ? offreTexte : undefined,
          offreImage: inputMode === 'image' ? imageBase64 : undefined,
          texteOffre: inputMode === 'text' ? offreTexte : undefined,
          imageBase64: inputMode === 'image' ? imageBase64 : undefined
        })
      });

      if (!res.ok) throw new Error('Erreur lors de l\'analyse');
      const data: JobOfferExtraction = await res.json();
      setExtractedOffer(data);

      // Initialize answers object
      const initialAnswers: Record<string, string> = {};
      const questionsList = data.questionsPrecision || data.questionsPersonnalisees || [];
      questionsList.forEach(q => {
        initialAnswers[q.id] = '';
      });
      setUserAnswers(initialAnswers);

      setStep(2);
      showToast('Offre analysée avec succès !');
    } catch (err) {
      console.error('Error analyzing job offer:', err);
      showToast('Une erreur est survenue lors de l\'analyse de l\'offre.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Step 2: Final Tailoring & Creating Modified CV + Letter
  const handleGenerateTailoredAssets = async () => {
    if (!selectedCV || !extractedOffer) return;

    setIsTailoring(true);
    try {
      const res = await fetch('/api/ai/personnaliser-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cv: selectedCV,
          langue,
          offre: extractedOffer,
          offreAnalyse: extractedOffer,
          reponsesCandidat: userAnswers,
          reponsesQuestions: userAnswers
        })
      });

      if (!res.ok) throw new Error('Erreur lors de la personnalisation');
      const data: PersonnalisationResult = await res.json();
      setTailoringResult(data);

      // 1. Build NEW Modified CV (distinct from initial CV)
      const tailoredCvTitle = `CV Adapté - ${extractedOffer.titrePoste || 'Poste'} (${extractedOffer.entreprise || 'Entreprise'})`;
      
      const newModifiedCV: CV = {
        ...JSON.parse(JSON.stringify(selectedCV)),
        id: `cv-mod-${Date.now()}`,
        titre: tailoredCvTitle,
        isModified: true,
        parentCvId: selectedCV.id,
        jobTargetTitle: extractedOffer.titrePoste || 'Poste Visé',
        jobTargetCompany: extractedOffer.entreprise || 'Entreprise Cible',
        jobMatchRate: data.tauxCorrespondanceEstime || 94,
        dateCreation: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        sections: data.cvModifie?.sections || data.cvPersonnalise?.sections || selectedCV.sections
      };

      // 2. Persist modified CV via backend
      await onApplyPersonalizedCV(newModifiedCV);
      setCreatedCV(newModifiedCV);

      // 3. Build & Save matching Cover Letter
      if (data.lettreMotivation) {
        const profilSection = newModifiedCV.sections.find(s => s.type === 'profil')?.contenu || {};
        const newLetter: SavedLetter = {
          id: `lettre-mod-${Date.now()}`,
          utilisateurId: newModifiedCV.utilisateurId || 'u-demo-1',
          cvId: newModifiedCV.id,
          titre: `Lettre - ${extractedOffer.titrePoste || 'Candidature'} (${extractedOffer.entreprise || 'Entreprise'})`,
          destinataire: 'Direction des Ressources Humaines',
          entreprise: extractedOffer.entreprise || 'Entreprise Cible',
          poste: extractedOffer.titrePoste || 'Poste Visé',
          villeDate: `Fait le ${new Date().toLocaleDateString('fr-FR')}`,
          dateCreation: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          langue,
          police: 'Inter',
          taillePolice: 11,
          couleurAccent: '#2563EB',
          expediteur: {
            nomComplet: profilSection.nomComplet || 'Mon Nom',
            titreProfessionnel: profilSection.titreProfessionnel || '',
            email: profilSection.email || '',
            telephone: profilSection.telephone || '',
            adresse: profilSection.adresse || ''
          },
          objet: data.lettreMotivation.objet || `Candidature au poste de ${extractedOffer.titrePoste}`,
          formulePolitesseEntree: data.lettreMotivation.formulePolitesseEntree || 'Madame, Monsieur,',
          paragrapheAccroche: data.lettreMotivation.paragrapheAccroche || '',
          paragrapheValeurAjoutee: data.lettreMotivation.paragrapheValeurAjoutee || '',
          paragrapheAdequationEntreprise: data.lettreMotivation.paragrapheAdequationEntreprise || '',
          paragrapheConclusion: data.lettreMotivation.paragrapheConclusion || '',
          formulePolitesseSortie: data.lettreMotivation.formulePolitesseSortie || 'Veuillez agréer mes salutations distinguées.',
          texteComplet: data.lettreMotivation.texteComplet || '',
          signature: profilSection.nomComplet || 'Mon Nom'
        };

        await onSavePersonalizedLetter(newLetter);
        setCreatedLetter(newLetter);
      }

      setStep(3);
      showToast('CV adapté et Lettre sur-mesure créés et enregistrés avec succès !');
    } catch (err) {
      console.error('Error generating tailored assets:', err);
      showToast('Une erreur est survenue lors de la personnalisation.');
    } finally {
      setIsTailoring(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 dark:bg-slate-800 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-bounce border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Cibler une Offre d'Emploi
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Créez une version sur-mesure de votre CV et une lettre de motivation dédiée pour maximiser vos chances.
              </p>
            </div>
          </div>
        </div>

        {/* Step Progress Pills */}
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/60 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 w-fit">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold ${
            step === 1 ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
          }`}>
            <span>1. Offre</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold ${
            step === 2 ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
          }`}>
            <span>2. Alignement</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold ${
            step === 3 ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
          }`}>
            <span>3. CV & Lettre</span>
          </div>
        </div>
      </div>

      {/* STEP 1: IMPORT & ANALYZE JOB OFFER */}
      {step === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Source CV Selection (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <FileText className="w-4 h-4 text-indigo-500" />
                <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider">1. Choisir le CV Source</h3>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400">
                Votre CV initial reste <strong>strictement intact</strong>. Une nouvelle copie adaptée sera créée et enregistrée dans votre section "Mes CVs modifiés".
              </p>

              <div className="space-y-2">
                {cvs.map(c => (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCVId(c.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      selectedCVId === c.id
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-500 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <p className="font-extrabold text-xs text-slate-900 dark:text-white line-clamp-1">{c.titre}</p>
                      <p className="text-[10px] text-slate-400">
                        {c.isModified ? 'Version modifiée/ciblée' : 'CV Initial'} • Modifié le {c.updatedAt ? new Date(c.updatedAt).toLocaleDateString('fr-FR') : 'Récemment'}
                      </p>
                    </div>
                    {selectedCVId === c.id && (
                      <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Note box */}
            <div className="p-5 rounded-3xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-2 text-xs text-indigo-900 dark:text-indigo-200">
              <div className="flex items-center gap-2 font-black">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Impact sur le recrutement</span>
              </div>
              <p className="text-[11px] leading-relaxed text-indigo-700 dark:text-indigo-300">
                L'IA analyse les mots-clés ATS et les exigences spécifiques de l'offre pour restructurer vos expériences réelles et maximiser votre score d'adéquation sans inventer d'informations.
              </p>
            </div>
          </div>

          {/* Right: Job Offer Input (Text or Image) (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider">2. Importer l'Annonce</h3>
                </div>

                {/* Mode Selector */}
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setInputMode('text')}
                    className={`px-3 py-1 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                      inputMode === 'text' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs' : 'text-slate-500'
                    }`}
                  >
                    Texte de l'offre
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputMode('image')}
                    className={`px-3 py-1 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                      inputMode === 'image' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs' : 'text-slate-500'
                    }`}
                  >
                    Capture d'écran / Image
                  </button>
                </div>
              </div>

              {/* Mode A: Paste Text */}
              {inputMode === 'text' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Collez le texte intégral de l'offre d'emploi
                  </label>
                  <textarea
                    rows={10}
                    value={offreTexte}
                    onChange={(e) => setOffreTexte(e.target.value)}
                    placeholder="Ex: Nous recrutons un Responsable Commercial B2B basé à Douala. Missions : Prospection, négociation grands comptes, animation de l'équipe... Profil recherché : Bac+4/5, minimum 3 ans d'expérience, maîtrise du CRM..."
                    className="w-full p-4 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl focus:border-emerald-500 outline-hidden leading-relaxed resize-y font-mono"
                  />
                </div>
              )}

              {/* Mode B: Upload Image / Screenshot */}
              {inputMode === 'image' && (
                <div className="space-y-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleImageFile(e.target.files[0]);
                      }
                    }}
                    accept="image/*"
                    className="hidden"
                  />

                  {imagePreview ? (
                    <div className="space-y-3">
                      <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 max-h-80 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <img src={imagePreview} alt="Aperçu annonce" className="object-contain max-h-80 w-full" />
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                      >
                        Changer d'image
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 rounded-2xl p-8 text-center cursor-pointer space-y-3 transition-colors bg-slate-50 dark:bg-slate-800/40"
                    >
                      <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-extrabold text-xs text-slate-800 dark:text-slate-200">
                          Cliquez ou glissez une capture d'écran de l'offre
                        </p>
                        <p className="text-[10px] text-slate-400">PNG, JPG, WEBP jusqu'à 10 Mo</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleAnalyzeOffer}
                disabled={isAnalyzing}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs rounded-2xl shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Extraction et analyse IA de l'offre...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Analyser l'Offre & Passer à l'Alignement</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: EXTRACTED DETAILS & DYNAMIC QUESTIONS */}
      {step === 2 && extractedOffer && (
        <div className="space-y-6">
          {/* Extracted Offer Summary Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider">Annonce Détectée</h3>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Modifier l'offre</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 space-y-1">
                <span className="text-[10px] uppercase text-slate-400 font-bold">Poste visé</span>
                <p className="font-black text-slate-900 dark:text-white">{extractedOffer.titrePoste || 'Non spécifié'}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 space-y-1">
                <span className="text-[10px] uppercase text-slate-400 font-bold">Entreprise</span>
                <p className="font-black text-slate-900 dark:text-white">{extractedOffer.entreprise || 'Entreprise'}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 space-y-1">
                <span className="text-[10px] uppercase text-slate-400 font-bold">Localisation</span>
                <p className="font-black text-slate-900 dark:text-white">{extractedOffer.lieu || 'Non spécifié'}</p>
              </div>
            </div>

            {/* Key requirements tags */}
            {(() => {
              const skills = extractedOffer.competencesCles || extractedOffer.competencesClesRequises || extractedOffer.competencesRequises || [];
              if (skills.length === 0) return null;
              return (
                <div className="space-y-1.5 pt-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Compétences clés requises identifiées :</span>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map((comp, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 text-[11px] font-extrabold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-lg"
                      >
                        {comp}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Dynamic Clarifying Questions */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Questions d'alignement précises (Authenticité garantie)
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Répondez brièvement à ces questions pour que l'IA adapte votre CV avec vos vraies réussites sans inventer d'expériences fictives.
              </p>
            </div>

            <div className="space-y-4">
              {(extractedOffer.questionsPrecision || extractedOffer.questionsPersonnalisees || []).map((q, idx) => (
                <div key={q.id || idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    <span className="text-emerald-600 font-extrabold mr-1.5">Q{idx + 1}.</span>
                    {q.question}
                  </label>
                  <input
                    type="text"
                    value={userAnswers[q.id] || ''}
                    onChange={(e) => setUserAnswers({ ...userAnswers, [q.id]: e.target.value })}
                    placeholder="Votre réponse (ex: 2 ans chez MTN, augmentation du CA de 20%, bilingue...)"
                    className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-emerald-500 outline-hidden"
                  />
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
              >
                Retour
              </button>

              <button
                type="button"
                onClick={handleGenerateTailoredAssets}
                disabled={isTailoring}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs rounded-2xl shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {isTailoring ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Génération du CV adapté & de la Lettre sur-mesure...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-amber-300" />
                    <span>Créer mon CV Adapté & ma Lettre Dédiée</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: RESULTS & SAVED ASSETS */}
      {step === 3 && createdCV && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Success Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full text-emerald-100">
                  Candidature Ciblée Prête
                </span>
                <h2 className="text-xl sm:text-2xl font-black">
                  Votre CV adapté & votre Lettre ont été créés avec succès !
                </h2>
                <p className="text-xs text-emerald-100">
                  Votre CV initial est resté intact. Cette version modifiée et la lettre ont été automatiquement enregistrées.
                </p>
              </div>

              {tailoringResult?.tauxCorrespondanceEstime && (
                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 text-center shrink-0">
                  <span className="text-[10px] font-bold uppercase text-emerald-200">Score de Match ATS</span>
                  <p className="text-3xl font-black text-white">{tailoringResult.tauxCorrespondanceEstime}%</p>
                </div>
              )}
            </div>

            {/* Summary Highlights */}
            {tailoringResult?.modificationsApportees && (
              <div className="pt-2 border-t border-white/20 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {tailoringResult.modificationsApportees.map((mod, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-emerald-50">
                    <Check className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                    <span>{mod}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cards for the 2 Generated Assets: Tailored CV + Tailored Letter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* 1. Tailored CV Card */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                    CV Adapté Enregistré
                  </span>
                  <span className="text-xs font-bold text-slate-400">Mes CVs modifiés</span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white line-clamp-1">
                  {createdCV.titre}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Optimisé pour le poste de <strong>{createdCV.jobTargetTitle}</strong> chez <strong>{createdCV.jobTargetCompany}</strong>.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => onOpenCVEditor(createdCV)}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-md"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Ouvrir dans l'Éditeur</span>
                </button>

                <button
                  type="button"
                  onClick={onGoToDashboard}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center cursor-pointer"
                >
                  <span>Voir mes CVs</span>
                </button>
              </div>
            </div>

            {/* 2. Tailored Cover Letter Card */}
            {createdLetter && (
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800">
                      Lettre Dédiée Enregistrée
                    </span>
                    <span className="text-xs font-bold text-slate-400">Mes lettres</span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white line-clamp-1">
                    {createdLetter.titre}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Lettre de motivation percutante prête à être éditée ou imprimée en PDF A4.
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={() => onOpenLetterEditor(createdLetter)}
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-md"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Éditer la Lettre</span>
                  </button>

                  <button
                    type="button"
                    onClick={onGoToLetters}
                    className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center cursor-pointer"
                  >
                    <span>Mes Lettres</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Return to Target Another Offer */}
          <div className="text-center pt-4">
            <button
              type="button"
              onClick={() => {
                setStep(1);
                setOffreTexte('');
                setImagePreview(null);
                setImageBase64(null);
                setTailoringResult(null);
              }}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 cursor-pointer"
            >
              + Cibler une autre offre d'emploi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
