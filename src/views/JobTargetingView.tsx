import React, { useState, useRef } from 'react';
import { CV, Language, SavedLetter, JobOfferExtraction, PersonnalisationResult, ProfilContenu } from '../types';
import { 
  Target, 
  Sparkles, 
  Upload, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  RefreshCw, 
  Edit3, 
  Mail, 
  Zap, 
  Check,
  Palette,
  Eye,
  Briefcase,
  Award,
  ShieldCheck,
  UserCheck,
  Plus,
  X,
  ListOrdered,
  RotateCcw,
  ArrowLeftRight,
  Layers
} from 'lucide-react';
import { extractDominantColorFromImage, getKnownBrandColor } from '../utils/brandColorExtractor';
import { LetterPreviewModal } from '../components/LetterPreviewModal';
import { buildAdaptedCvLocally, generateTargetingSuggestions } from '../utils/jobTargetingEngine';
import { saveActiveCVDraft } from '../utils/cvDraftStorage';

interface JobTargetingViewProps {
  cvs: CV[];
  activeCV: CV | null;
  langue: Language;
  onApplyPersonalizedCV?: (newCV: CV) => Promise<void> | void;
  onCVPersonalized?: (newCV: CV) => void;
  onSavePersonalizedLetter?: (letter: SavedLetter) => Promise<void> | void;
  onLetterGenerated?: (letter?: SavedLetter) => void;
  onOpenCVEditor?: (cv: CV) => void;
  onOpenLetterEditor?: (letter: SavedLetter) => void;
  onGoToDashboard?: () => void;
  onGoToLetters?: () => void;
}

export const JobTargetingView: React.FC<JobTargetingViewProps> = ({
  cvs,
  activeCV,
  langue,
  onApplyPersonalizedCV,
  onCVPersonalized,
  onSavePersonalizedLetter,
  onLetterGenerated,
  onOpenCVEditor,
  onOpenLetterEditor,
  onGoToDashboard,
  onGoToLetters
}) => {
  // Step 1: Input | Step 2: Dynamic Questions & Suggestions | Step 3: Result & Tailored Assets
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

  // Analysis & extracted offer state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [extractedOffer, setExtractedOffer] = useState<JobOfferExtraction | null>(null);

  // Mode de mise à jour : mise à jour directe du CV en cours OU création d'une nouvelle copie ciblée
  const [updateMode, setUpdateMode] = useState<'update_current' | 'create_copy'>('update_current');

  // 1. Profil Pro ciblé (Titre & Résumé)
  const [customProfileTitle, setCustomProfileTitle] = useState<string>('');
  const [customProfileResume, setCustomProfileResume] = useState<string>('');
  const [isEditingResume, setIsEditingResume] = useState<boolean>(false);

  // 2. Compétences (Ne rien inventer, priorisées)
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [extraSkills, setExtraSkills] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState<string>('');

  // 3. Questions ciblées & Expériences reformulées
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [experienceReformulations, setExperienceReformulations] = useState<Record<string, string>>({});
  const [acceptedReformulations, setAcceptedReformulations] = useState<Record<string, boolean>>({});
  const [editingExpId, setEditingExpId] = useState<string | null>(null);

  // 4. Couleur de marque identifiée & palette bicolore
  const [targetBrandColor, setTargetBrandColor] = useState<string>('#1E40AF');
  const [targetBrandSecondaryColor, setTargetBrandSecondaryColor] = useState<string>('#60A5FA');
  const [brandColorName, setBrandColorName] = useState<string>('Bleu Corporate');
  const [colorHarmonizationMode, setColorHarmonizationMode] = useState<'duo' | 'primary_dominant' | 'secondary_dominant'>('duo');
  const [selectedTemplateStyle, setSelectedTemplateStyle] = useState<string>(activeCV?.styleEnTete || 'baxter-diagonal');
  const [selectedExpVariants, setSelectedExpVariants] = useState<Record<string, 'resultats' | 'technique' | 'impact' | 'original'>>({});

  const handleSwapColors = () => {
    const oldP = targetBrandColor;
    const oldS = targetBrandSecondaryColor;
    setTargetBrandColor(oldS);
    setTargetBrandSecondaryColor(oldP);
    showToast('Couleurs primaire et secondaire inversées avec succès !');
  };

  // Preview Modal State for Cover Letter
  const [showLetterPreviewModal, setShowLetterPreviewModal] = useState<boolean>(false);
  const [previewLetterData, setPreviewLetterData] = useState<SavedLetter | null>(null);

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

  // Handle image upload with automatic client-side canvas dominant color extraction
  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Veuillez sélectionner un fichier image valide (PNG, JPG, WEBP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = async (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
      setImageBase64(result);

      // Extract dominant brand color from image/logo immediately via canvas
      try {
        const extracted = await extractDominantColorFromImage(result);
        if (extracted?.primary) {
          setTargetBrandColor(extracted.primary);
          setTargetBrandSecondaryColor(extracted.secondary);
          setBrandColorName(extracted.name);
        }
      } catch (err) {
        console.warn('Could not extract color from image:', err);
      }
    };
    reader.readAsDataURL(file);
  };

  // Step 1: Analyze Job Offer & Prepare Suggestions
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
      const token = localStorage.getItem('cv_builder_token') || localStorage.getItem('token');
      const res = await fetch('/api/ai/cibler-offre', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          cv: selectedCV,
          langue,
          offreTexte: inputMode === 'text' ? offreTexte : undefined,
          offreImage: inputMode === 'image' ? imageBase64 : undefined,
          texteOffre: inputMode === 'text' ? offreTexte : undefined,
          imageBase64: inputMode === 'image' ? imageBase64 : undefined
        })
      });

      let data: JobOfferExtraction;
      if (res.ok) {
        data = await res.json();
      } else {
        // Fallback local instant analysis if server/quota unavailable
        data = generateTargetingSuggestions({
          cv: selectedCV,
          rawText: offreTexte,
          langue
        });
      }

      // Ensure deterministic suggestions are present
      const localSuggestions = generateTargetingSuggestions({
        cv: selectedCV,
        offre: data,
        rawText: offreTexte,
        langue
      });

      const mergedData: JobOfferExtraction = {
        ...localSuggestions,
        ...data,
        suggestionsProfil: data.suggestionsProfil || localSuggestions.suggestionsProfil,
        competencesPriorisees: data.competencesPriorisees || localSuggestions.competencesPriorisees,
        suggestionsExperiences: data.suggestionsExperiences || localSuggestions.suggestionsExperiences,
        questionsCompetences: data.questionsCompetences || localSuggestions.questionsCompetences,
        questionsExperiences: data.questionsExperiences || localSuggestions.questionsExperiences
      };

      setExtractedOffer(mergedData);

      // Harmonize detected brand color
      const known = getKnownBrandColor(mergedData.entreprise);
      const chosenPrimary = mergedData.couleurDetectee || (known ? known.primary : targetBrandColor) || '#1E40AF';
      const chosenSecondary = mergedData.couleurSecondaire || (known ? known.secondary : targetBrandSecondaryColor) || '#60A5FA';
      const chosenName = mergedData.nomCouleurMarque || (known ? known.name : brandColorName) || 'Couleur identifiée sur l\'annonce';

      setTargetBrandColor(chosenPrimary);
      setTargetBrandSecondaryColor(chosenSecondary);
      setBrandColorName(chosenName);

      // 1. Initialiser le profil professionnel (Titre & Résumé d'accroche ciblé)
      setCustomProfileTitle(mergedData.suggestionsProfil?.titreSuggere || mergedData.titrePoste || 'Poste Cible');
      setCustomProfileResume(mergedData.suggestionsProfil?.resumeSuggere || '');

      // 2. Initialiser les compétences sélectionnées (uniquement les compétences prioritaires ou déjà présentes)
      const allPrioritizedSkills = mergedData.competencesPriorisees || [];
      const defaultChecked = allPrioritizedSkills
        .filter(s => s.priorite === 'haute' || s.dejaPresente)
        .map(s => s.nom);
      
      const rawReq = [
        ...(mergedData.competencesClesRequises || []),
        ...(mergedData.competencesRequises || []),
        ...(mergedData.competencesCles || [])
      ].filter(Boolean);

      setSelectedSkills(defaultChecked.length > 0 ? defaultChecked : rawReq.slice(0, 5));

      // 3. Initialiser les reformulations d'expériences suggérées
      const expReformMap: Record<string, string> = {};
      const expAcceptedMap: Record<string, boolean> = {};

      if (Array.isArray(mergedData.suggestionsExperiences)) {
        mergedData.suggestionsExperiences.forEach((expSug) => {
          const id = expSug.experienceId || expSug.poste;
          expReformMap[id] = expSug.descriptionSuggeree;
          expAcceptedMap[id] = true;
        });
      }
      setExperienceReformulations(expReformMap);
      setAcceptedReformulations(expAcceptedMap);

      // 4. Initialiser les réponses aux questions
      const initialAnswers: Record<string, string> = {};
      const questionsList = [
        ...(mergedData.questionsCompetences || []),
        ...(mergedData.questionsExperiences || []),
        ...(mergedData.questionsPrecision || [])
      ];
      questionsList.forEach(q => {
        initialAnswers[q.id] = '';
      });
      setUserAnswers(initialAnswers);

      setStep(2);
      showToast('Offre analysée avec succès ! Personnalisez et validez les suggestions ci-dessous.');
    } catch (err: any) {
      console.error('Error analyzing job offer:', err);
      // Fallback local instant
      const localSuggestions = generateTargetingSuggestions({
        cv: selectedCV,
        rawText: offreTexte,
        langue
      });
      setExtractedOffer(localSuggestions);
      setCustomProfileTitle(localSuggestions.suggestionsProfil?.titreSuggere || 'Poste Cible');
      setCustomProfileResume(localSuggestions.suggestionsProfil?.resumeSuggere || '');
      const defaultChecked = (localSuggestions.competencesPriorisees || [])
        .filter((s: any) => s.priorite === 'haute' || s.dejaPresente)
        .map((s: any) => s.nom);
      setSelectedSkills(defaultChecked);

      const expReformMap: Record<string, string> = {};
      const expAcceptedMap: Record<string, boolean> = {};
      (localSuggestions.suggestionsExperiences || []).forEach((expSug: any) => {
        const id = expSug.experienceId || expSug.poste;
        expReformMap[id] = expSug.descriptionSuggeree;
        expAcceptedMap[id] = true;
      });
      setExperienceReformulations(expReformMap);
      setAcceptedReformulations(expAcceptedMap);

      setStep(2);
      showToast('Suggestions prêtes ! Vous pouvez les ajuster et valider.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Step 2: Final Tailoring & Updating the CV + Letter
  const handleGenerateTailoredAssets = async () => {
    if (!selectedCV || !extractedOffer) return;

    setIsTailoring(true);
    try {
      // Préparer les reformulations d'expériences validées par l'utilisateur
      const validatedExperienceReformulations: Record<string, string> = {};
      Object.entries(experienceReformulations).forEach(([expId, reformText]) => {
        const text = typeof reformText === 'string' ? reformText : String(reformText || '');
        if (acceptedReformulations[expId] && text.trim()) {
          validatedExperienceReformulations[expId] = text;
        }
      });

      // 1. Moteur déterministe complet garanti
      const localAdaptedCv = buildAdaptedCvLocally({
        cv: selectedCV,
        offre: {
          ...extractedOffer,
          titrePoste: customProfileTitle,
          competencesClesRequises: selectedSkills,
          couleurDetectee: targetBrandColor,
          couleurSecondaire: targetBrandSecondaryColor,
          nomCouleurMarque: brandColorName
        },
        reponsesQuestions: {
          ...userAnswers,
          confirmedSkills: selectedSkills,
          extraSkills,
          customProfileTitle,
          customProfileResume,
          experienceReformulations: validatedExperienceReformulations,
          updateExistingCv: updateMode === 'update_current',
          targetColor: targetBrandColor,
          targetSecondaryColor: targetBrandSecondaryColor,
          colorHarmonizationMode,
          recommendedTemplateStyle: selectedTemplateStyle
        },
        langue,
        targetColor: targetBrandColor,
        targetSecondaryColor: targetBrandSecondaryColor,
        colorHarmonizationMode,
        recommendedTemplateStyle: selectedTemplateStyle,
        customProfileTitle,
        customProfileResume,
        experienceReformulations: validatedExperienceReformulations,
        updateExistingCv: updateMode === 'update_current'
      });

      // 2. Appel serveur pour enrichissement IA et génération de lettre
      let aiResult: PersonnalisationResult | null = null;
      try {
        const token = localStorage.getItem('cv_builder_token') || localStorage.getItem('token');
        const res = await fetch('/api/ai/personnaliser-cv', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            cv: selectedCV,
            langue,
            offre: {
              ...extractedOffer,
              titrePoste: customProfileTitle,
              competencesClesRequises: selectedSkills,
              couleurDetectee: targetBrandColor,
              couleurSecondaire: targetBrandSecondaryColor,
              nomCouleurMarque: brandColorName
            },
            reponsesQuestions: {
              ...userAnswers,
              confirmedSkills: selectedSkills,
              extraSkills,
              customProfileTitle,
              customProfileResume,
              experienceReformulations: validatedExperienceReformulations,
              updateExistingCv: updateMode === 'update_current',
              colorHarmonizationMode,
              recommendedTemplateStyle: selectedTemplateStyle
            }
          })
        });
        if (res.ok) {
          aiResult = await res.json();
        }
      } catch (err) {
        console.warn('AI personalization fallback to deterministic engine:', err);
      }

      // Construction du CV final adapté avec respect rigoureux des couleurs
      const targetCvId = updateMode === 'update_current' ? selectedCV.id : `cv-targeted-${Date.now()}`;
      
      let resolvedPrimary = targetBrandColor;
      let resolvedSecondary = targetBrandSecondaryColor;
      if (colorHarmonizationMode === 'secondary_dominant') {
        resolvedPrimary = targetBrandSecondaryColor;
        resolvedSecondary = targetBrandColor;
      } else if (colorHarmonizationMode === 'primary_dominant') {
        resolvedSecondary = '#F1F5F9';
      }

      const newModifiedCV: CV = {
        ...selectedCV,
        ...(aiResult?.cvModifie || localAdaptedCv),
        id: targetCvId,
        titre: updateMode === 'update_current' 
          ? (selectedCV.titre || `CV - ${customProfileTitle}`)
          : `CV - ${customProfileTitle} (${extractedOffer.entreprise || 'Candidature'})`,
        titreCV: `CV - ${customProfileTitle}`,
        isModified: true,
        parentCVId: selectedCV.id,
        jobTargetTitle: customProfileTitle,
        jobTargetCompany: extractedOffer.entreprise,
        scoreCorrespondance: aiResult?.tauxCorrespondanceEstime || 94,
        couleurAccent: resolvedPrimary,
        couleurAccentSecondaire: resolvedSecondary,
        couleurTitreSection: resolvedPrimary,
        couleurSousTitrePrincipal: colorHarmonizationMode === 'duo' ? resolvedSecondary : undefined,
        styleEnTete: selectedTemplateStyle || selectedCV.styleEnTete || 'baxter-diagonal',
        styleCompetences: colorHarmonizationMode === 'duo' ? 'badges-multicolor' : (selectedCV.styleCompetences || 'badges'),
        couleurFondProfil: (selectedTemplateStyle === 'baxter-diagonal' || selectedTemplateStyle === 'clean' || selectedTemplateStyle === 'minimal')
          ? '#FFFFFF'
          : (selectedTemplateStyle === 'modern-split' ? 'transparent' : resolvedPrimary),
        theme: {
          ...(selectedCV.theme || {}),
          primaryColor: resolvedPrimary,
          secondaryColor: resolvedSecondary,
          headingColor: resolvedPrimary,
          headerBackgroundColor: resolvedPrimary,
          badgeColor: resolvedPrimary
        },
        langue: selectedCV.langue || 'fr',
        sections: (() => {
          const rawSections = (aiResult?.cvModifie?.sections && aiResult.cvModifie.sections.length > 0)
            ? aiResult.cvModifie.sections
            : localAdaptedCv.sections;
          return rawSections.map((sec: any) => {
            let cleanTitle = sec.titre;
            if (selectedCV.langue !== 'ar' && cleanTitle && /[\u0600-\u06FF]/.test(cleanTitle)) {
              if (sec.type === 'profil') cleanTitle = 'Profil Professionnel';
              else if (sec.type === 'experience') cleanTitle = 'Expériences Professionnelles';
              else if (sec.type === 'formation') cleanTitle = 'Formation & Diplômes';
              else if (sec.type === 'competences') cleanTitle = 'Compétences Clés';
              else if (sec.type === 'langues') cleanTitle = 'Langues';
              else if (sec.type === 'interets') cleanTitle = "Centres d'intérêt";
              else cleanTitle = 'Section';
            }
            return { ...sec, titre: cleanTitle };
          });
        })(),
        updatedAt: new Date().toISOString()
      };

      // 3. Sauvegarder immédiatement dans le brouillon actif et persistance locale
      saveActiveCVDraft(newModifiedCV);

      // 4. Mettre à jour l'état de l'application (activeCV et liste cvs)
      if (typeof onApplyPersonalizedCV === 'function') {
        await onApplyPersonalizedCV(newModifiedCV);
      } else if (typeof onCVPersonalized === 'function') {
        onCVPersonalized(newModifiedCV);
      }

      setCreatedCV(newModifiedCV);
      setTailoringResult(aiResult || {
        cvModifie: newModifiedCV,
        modificationsApportees: [
          `Profil professionnel orienté vers le poste de ${customProfileTitle}`,
          `Compétences réordonnées par ordre de priorité sans aucune compétence inventée`,
          `Expériences reformulées avec des verbes d'action ciblés pour l'offre`,
          `Palette de couleurs de l'entreprise (${brandColorName}) appliquée au CV`
        ],
        tauxCorrespondanceEstime: 94
      });

      // 5. Enregistrer la Lettre de motivation si générée
      if (aiResult?.lettreMotivation) {
        const profilData = (selectedCV.sections.find(s => s.type === 'profil')?.contenu as ProfilContenu) || ({} as ProfilContenu);
        const lm = aiResult.lettreMotivation;
        const newLetter: SavedLetter = {
          id: `letter-targeted-${Date.now()}`,
          utilisateurId: selectedCV.utilisateurId || 'user-default',
          cvId: newModifiedCV.id,
          titre: `Lettre - ${customProfileTitle} (${extractedOffer.entreprise || 'Entreprise'})`,
          poste: customProfileTitle,
          entreprise: extractedOffer.entreprise || 'Entreprise Cible',
          destinataire: extractedOffer.entreprise ? `Direction des Ressources Humaines - ${extractedOffer.entreprise}` : 'Direction des Ressources Humaines',
          villeDate: extractedOffer.lieu ? `${extractedOffer.lieu}, le ${new Date().toLocaleDateString('fr-FR')}` : `Paris, le ${new Date().toLocaleDateString('fr-FR')}`,
          expediteur: {
            nomComplet: profilData.nomComplet || 'Candidat',
            titreProfessionnel: customProfileTitle,
            email: profilData.email || '',
            telephone: profilData.telephone || '',
            adresse: profilData.adresse || '',
            ville: profilData.adresse || ''
          },
          objet: lm.objet || `Candidature au poste de ${customProfileTitle}`,
          formulePolitesseEntree: lm.formulePolitesseEntree || 'Madame, Monsieur,',
          paragrapheAccroche: lm.paragrapheAccroche || '',
          paragrapheValeurAjoutee: lm.paragrapheValeurAjoutee || '',
          paragrapheAdequationEntreprise: lm.paragrapheAdequationEntreprise || '',
          paragrapheConclusion: lm.paragrapheConclusion || '',
          formulePolitesseSortie: lm.formulePolitesseSortie || 'Veuillez agréer, Madame, Monsieur, l\'expression de mes salutations distinguées.',
          texteComplet: lm.texteComplet || `${lm.formulePolitesseEntree}\n\n${lm.paragrapheAccroche}\n\n${lm.paragrapheValeurAjoutee}\n\n${lm.paragrapheAdequationEntreprise}\n\n${lm.paragrapheConclusion}\n\n${lm.formulePolitesseSortie}`,
          langue: langue,
          couleurAccent: targetBrandColor,
          police: selectedCV.police || 'Inter',
          dateCreation: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        if (typeof onSavePersonalizedLetter === 'function') {
          await onSavePersonalizedLetter(newLetter);
        } else if (typeof onLetterGenerated === 'function') {
          onLetterGenerated(newLetter);
        }
        setCreatedLetter(newLetter);
      }

      setStep(3);
      showToast(
        updateMode === 'update_current'
          ? 'Votre CV a été mis à jour avec succès avec le profil, les compétences, les expériences et les couleurs cibles !'
          : 'Nouvelle version ciblée de votre CV créée et sauvegardée avec succès !'
      );
    } catch (err: any) {
      console.error('Error generating tailored assets:', err);
      showToast(err.message || 'Une erreur est survenue lors de l\'application au CV.');
    } finally {
      setIsTailoring(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-black text-white dark:bg-white dark:text-black px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-2 text-xs font-bold animate-in fade-in slide-in-from-bottom-2 border border-neutral-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Main Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-black">
              <Target className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black uppercase text-black dark:text-white tracking-tight">
              Cibler une Offre d'Emploi
            </h1>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            Adaptez votre profil, réordonnez vos compétences sans rien inventer, reformulez vos expériences et appliquez les couleurs de l'entreprise.
          </p>
        </div>

        {/* Wizard Steps */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-neutral-100 dark:bg-neutral-900 p-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 text-[11px] font-black">
          <span className={`px-2.5 py-1 rounded-lg transition-all ${
            step === 1 ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs' : 'text-neutral-500'
          }`}>
            1. Offre
          </span>
          <span className="text-neutral-400">/</span>
          <span className={`px-2.5 py-1 rounded-lg transition-all ${
            step === 2 ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs' : 'text-neutral-500'
          }`}>
            2. Personnalisation
          </span>
          <span className="text-neutral-400">/</span>
          <span className={`px-2.5 py-1 rounded-lg transition-all ${
            step === 3 ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs' : 'text-neutral-500'
          }`}>
            3. CV & Lettre
          </span>
        </div>
      </div>

      {/* STEP 1: SELECT CV & INPUT JOB OFFER */}
      {step === 1 && (
        <div className="space-y-6">
          {/* Select Base CV */}
          <div className="bg-white dark:bg-neutral-950 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase text-black dark:text-white tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4" />
                <span>1. Choisissez le CV à adapter</span>
              </label>
              <span className="text-[11px] font-bold text-neutral-500">
                {cvs.length} CV{cvs.length > 1 ? 's' : ''} disponible{cvs.length > 1 ? 's' : ''}
              </span>
            </div>

            {cvs.length === 0 ? (
              <p className="text-xs text-neutral-500 italic">Aucun CV trouvé. Créez d'abord un CV depuis l'accueil.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {cvs.map(c => {
                  const isSelected = c.id === selectedCVId;
                  const profileName = c.sections?.find(s => s.type === 'profil')?.contenu?.nomComplet || c.titre;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedCVId(c.id)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected 
                          ? 'border-black dark:border-white bg-neutral-100 dark:bg-neutral-900 shadow-xs ring-1 ring-black dark:ring-white'
                          : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 bg-neutral-50 dark:bg-neutral-900/50'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-black dark:text-white truncate max-w-[170px]">
                            {c.titre || 'Sans titre'}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-black dark:text-white shrink-0" />}
                        </div>
                        <p className="text-[11px] text-neutral-500 truncate">{profileName}</p>
                      </div>
                      <span className="text-[10px] text-neutral-400 font-mono mt-2 block">
                        Modèle : {c.templateId || 'Standard'}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Job Offer Input: Text or Image */}
          <div className="bg-white dark:bg-neutral-950 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-black uppercase text-black dark:text-white tracking-wider flex items-center gap-1.5">
                <Target className="w-4 h-4" />
                <span>2. Renseignez l'annonce ou l'offre d'emploi</span>
              </label>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Collez le texte ou importez une capture d'écran de l'offre (LinkedIn, Indeed, site carrières, etc.).
              </p>
            </div>

            {/* Input Mode Switch */}
            <div className="flex items-center gap-2 p-1 bg-neutral-100 dark:bg-neutral-900 rounded-xl w-fit border border-neutral-200 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => setInputMode('text')}
                className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer ${
                  inputMode === 'text' ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs' : 'text-neutral-500'
                }`}
              >
                Texte brut
              </button>
              <button
                type="button"
                onClick={() => setInputMode('image')}
                className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer ${
                  inputMode === 'image' ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs' : 'text-neutral-500'
                }`}
              >
                Capture / Image
              </button>
            </div>

            {/* Mode A: Paste Text */}
            {inputMode === 'text' && (
              <div className="space-y-1.5">
                <textarea
                  rows={9}
                  value={offreTexte}
                  onChange={(e) => setOffreTexte(e.target.value)}
                  placeholder="Ex : Nous recrutons un Responsable Commercial B2B Grands Comptes pour accélérer notre développement. Missions : Prospection, négociation de contrats complexes, management d'une équipe de 4 personnes... Profil recherché : Expérience confirmée en vente B2B, maîtrise de Salesforce et anglais courant..."
                  className="w-full p-3.5 text-xs bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-black dark:text-white rounded-xl focus:border-black dark:focus:border-white outline-hidden leading-relaxed resize-y font-mono"
                />
              </div>
            )}

            {/* Mode B: Upload Image / Screenshot */}
            {inputMode === 'image' && (
              <div className="space-y-3">
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
                  <div className="space-y-2">
                    <div className="relative rounded-xl overflow-hidden border border-neutral-300 dark:border-neutral-700 max-h-72 bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center">
                      <img src={imagePreview} alt="Aperçu annonce" className="object-contain max-h-72 w-full" />
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs font-bold text-black dark:text-white underline cursor-pointer"
                    >
                      Changer d'image
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-white rounded-xl p-8 text-center cursor-pointer space-y-2 transition-colors bg-neutral-50 dark:bg-neutral-900"
                  >
                    <div className="w-10 h-10 rounded-lg bg-neutral-200 dark:bg-neutral-800 text-black dark:text-white flex items-center justify-center mx-auto">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="font-black text-xs text-black dark:text-white">
                        Cliquez ou glissez une capture d'écran de l'offre
                      </p>
                      <p className="text-[10px] text-neutral-400">PNG, JPG, WEBP — extraction directe du texte et des couleurs de l'entreprise</p>
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
              className="w-full py-3 bg-black hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 border border-black dark:border-white"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyse & Détection des compétences et couleurs...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyser l'Offre & Préparer les Suggestions</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: INTERACTIVE SUGGESTIONS, QUESTIONS & VALIDATION */}
      {step === 2 && extractedOffer && (
        <div className="space-y-5">
          
          {/* Summary of Detected Offer */}
          <div className="bg-white dark:bg-neutral-950 p-4 sm:p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-xs font-black uppercase text-black dark:text-white tracking-wider">
                  Offre Détectée
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-bold text-neutral-500 hover:text-black dark:hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Changer d'offre</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-0.5">
                <span className="text-[10px] uppercase text-neutral-400 font-bold">Poste cible</span>
                <p className="font-black text-black dark:text-white truncate">{extractedOffer.titrePoste || 'Poste Cible'}</p>
              </div>
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-0.5">
                <span className="text-[10px] uppercase text-neutral-400 font-bold">Entreprise</span>
                <p className="font-black text-black dark:text-white truncate">{extractedOffer.entreprise || 'Entreprise Cible'}</p>
              </div>
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-0.5">
                <span className="text-[10px] uppercase text-neutral-400 font-bold">Lieu</span>
                <p className="font-black text-black dark:text-white truncate">{extractedOffer.lieu || 'Non spécifié'}</p>
              </div>
            </div>
          </div>

          {/* MODE D'APPLICATION DU CV */}
          <div className="bg-white dark:bg-neutral-950 p-4 sm:p-5 rounded-2xl border-2 border-black dark:border-white shadow-xs space-y-3">
            <label className="text-xs font-black uppercase text-black dark:text-white tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              <span>Comment souhaitez-vous appliquer les modifications au CV ?</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setUpdateMode('update_current')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  updateMode === 'update_current'
                    ? 'border-black dark:border-white bg-neutral-100 dark:bg-neutral-900 ring-1 ring-black dark:ring-white'
                    : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-xs text-black dark:text-white">
                    Mettre à jour mon CV actuel (Recommandé)
                  </span>
                  {updateMode === 'update_current' && <Check className="w-4 h-4 text-black dark:text-white" />}
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  Modifie directement votre CV <strong>"{selectedCV?.titre}"</strong> avec le profil ciblé, les compétences ordonnées et les couleurs de l'offre.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setUpdateMode('create_copy')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  updateMode === 'create_copy'
                    ? 'border-black dark:border-white bg-neutral-100 dark:bg-neutral-900 ring-1 ring-black dark:ring-white'
                    : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-xs text-black dark:text-white">
                    Créer une copie ciblée indépendante
                  </span>
                  {updateMode === 'create_copy' && <Check className="w-4 h-4 text-black dark:text-white" />}
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  Conserve votre CV original intact et crée un nouveau CV dédié à cette candidature spécifique.
                </p>
              </button>
            </div>
          </div>

          {/* SECTION 1: PROFIL PROFESSIONNEL (Titre & Résumé Ciblés) */}
          <div className="bg-white dark:bg-neutral-950 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h3 className="text-xs font-black uppercase tracking-wider text-black dark:text-white">
                  1. Profil Professionnel : Titre & Accroche Ciblés
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                Aligné sur l'annonce
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {/* Titre Professionnel */}
              <div className="space-y-1">
                <label className="font-bold text-neutral-700 dark:text-neutral-300 block">
                  Titre professionnel suggéré pour le CV :
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customProfileTitle}
                    onChange={(e) => setCustomProfileTitle(e.target.value)}
                    className="flex-1 px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl font-bold text-black dark:text-white focus:border-black dark:focus:border-white outline-hidden"
                    placeholder="Ex: Responsable Commercial B2B Grands Comptes"
                  />
                  <button
                    type="button"
                    onClick={() => setCustomProfileTitle(extractedOffer.titrePoste || 'Poste Cible')}
                    title="Réinitialiser au titre détecté"
                    className="px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-bold flex items-center gap-1 cursor-pointer hover:bg-neutral-200"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Résumé Professionnel */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-neutral-700 dark:text-neutral-300 block">
                    Accroche / Résumé professionnel orienté :
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsEditingResume(!isEditingResume)}
                    className="text-[11px] font-bold text-black dark:text-white underline cursor-pointer"
                  >
                    {isEditingResume ? 'Masquer la modification' : 'Modifier le texte'}
                  </button>
                </div>

                <div className="p-3 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-2">
                  {isEditingResume ? (
                    <textarea
                      rows={4}
                      value={customProfileResume}
                      onChange={(e) => setCustomProfileResume(e.target.value)}
                      className="w-full p-2.5 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-black dark:text-white rounded-lg focus:border-black dark:focus:border-white outline-hidden leading-relaxed"
                    />
                  ) : (
                    <p className="text-neutral-800 dark:text-neutral-200 leading-relaxed font-sans">
                      {customProfileResume || 'Aucun résumé défini.'}
                    </p>
                  )}
                  <p className="text-[10px] text-neutral-500">
                    Ce pitch met en valeur vos atouts pour {extractedOffer.entreprise || 'l\'entreprise visée'} dès le haut du CV.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: COMPÉTENCES PRIORISÉES & QUESTIONS (ZÉRO INVENTION) */}
          <div className="bg-white dark:bg-neutral-950 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800 gap-2">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-black dark:text-white">
                    2. Compétences Demandées & Questions (Zéro Invention)
                  </h3>
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  Les compétences requises par l'offre sont affichées en premier lieu. Nous ne vous inventerons aucune compétence : confirmez uniquement vos compétences réelles.
                </p>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
                  {selectedSkills.length} compétence{selectedSkills.length > 1 ? 's' : ''} retenue{selectedSkills.length > 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {(() => {
              const allOfferSkills = extractedOffer.competencesPriorisees || [];
              const missingOfferSkills = allOfferSkills.filter(s => !s.dejaPresente);
              const presentOfferSkills = allOfferSkills.filter(s => s.dejaPresente);
              
              // Compétences CV qui ne sont pas dans l'offre
              const cvSkills = (selectedCV?.sections?.find(s => s.type === 'competences')?.contenu || []) as any[];
              const otherCvSkills = cvSkills.filter((cs: any) => 
                !allOfferSkills.some(os => os.nom.toLowerCase() === (cs.nom || '').toLowerCase())
              );

              return (
                <div className="space-y-5">
                  {/* SOUS-PARTIE A : Compétences demandées par l'offre NON PRÉSENTES sur le CV */}
                  {missingOfferSkills.length > 0 && (
                    <div className="space-y-2.5 p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                          <h4 className="text-xs font-black uppercase tracking-wider text-amber-900 dark:text-amber-200">
                            Compétences demandées par l'offre absentes de votre CV actuel
                          </h4>
                        </div>
                        <span className="text-[10px] text-amber-700 dark:text-amber-300 font-medium">
                          Questionnez-vous pour ne rien inventer
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-2">
                        {missingOfferSkills.map((sk, sIdx) => {
                          const isSelected = selectedSkills.some(s => s.toLowerCase() === sk.nom.toLowerCase());
                          return (
                            <div
                              key={`missing-skill-${sk.nom}-${sIdx}`}
                              className={`p-3 rounded-xl border transition-all ${
                                isSelected 
                                  ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-400' 
                                  : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800'
                              }`}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-black text-xs text-black dark:text-white">
                                      {sk.nom}
                                    </span>
                                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200">
                                      Exigence annonce
                                    </span>
                                    {isSelected && (
                                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 flex items-center gap-0.5">
                                        <Check className="w-2.5 h-2.5" /> Validée
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                                    {sk.justification || 'Compétence technique requise pour le poste.'}
                                  </p>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (!isSelected) {
                                        setSelectedSkills(prev => [...prev, sk.nom]);
                                      }
                                    }}
                                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                                      isSelected
                                        ? 'bg-emerald-600 border-emerald-600 text-white'
                                        : 'bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200'
                                    }`}
                                  >
                                    ✓ Oui, je maîtrise
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (isSelected) {
                                        setSelectedSkills(prev => prev.filter(s => s.toLowerCase() !== sk.nom.toLowerCase()));
                                      }
                                    }}
                                    className={`px-2 py-1 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                                      !isSelected
                                        ? 'bg-neutral-200 dark:bg-neutral-800 border-neutral-400 dark:border-neutral-600 text-neutral-800 dark:text-neutral-200'
                                        : 'border-transparent text-neutral-400 hover:text-neutral-700'
                                    }`}
                                  >
                                    ✕ Non (ne pas inclure)
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* SOUS-PARTIE B : Compétences demandées par l'offre DÉJÀ PRÉSENTES sur le CV */}
                  {presentOfferSkills.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-black uppercase text-neutral-500 tracking-wider">
                        <span>Compétences de l'offre déjà présentes sur votre CV (Prioritaires) :</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">Placées en tête de liste</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {presentOfferSkills.map((compObj, cIdx) => {
                          const isChecked = selectedSkills.some(s => s.toLowerCase() === compObj.nom.toLowerCase());
                          return (
                            <button
                              key={`present-comp-${compObj.nom}-${cIdx}`}
                              type="button"
                              onClick={() => {
                                if (isChecked) {
                                  setSelectedSkills(prev => prev.filter(s => s.toLowerCase() !== compObj.nom.toLowerCase()));
                                } else {
                                  setSelectedSkills(prev => [...prev, compObj.nom]);
                                }
                              }}
                              className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                                isChecked 
                                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200'
                                  : 'bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 opacity-60'
                              }`}
                            >
                              <div className="space-y-0.5 truncate">
                                <div className="flex items-center gap-1.5 truncate">
                                  <span className="font-bold text-xs truncate">{compObj.nom}</span>
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                                    ✓ Déjà sur votre CV
                                  </span>
                                </div>
                                <p className="text-[10px] text-neutral-400 truncate">
                                  {compObj.justification || 'Exigence clé valorisée'}
                                </p>
                              </div>

                              <div className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 border ${
                                isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-neutral-400 dark:border-neutral-600'
                              }`}>
                                {isChecked && <Check className="w-3 h-3" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* SOUS-PARTIE C : Autres compétences de votre CV */}
                  {otherCvSkills.length > 0 && (
                    <div className="space-y-2 pt-1 border-t border-neutral-100 dark:border-neutral-800">
                      <div className="flex items-center justify-between text-[11px] font-bold uppercase text-neutral-400 tracking-wider">
                        <span>Autres compétences de votre CV :</span>
                        <span className="text-[10px] lowercase text-neutral-400">conservées en complément</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {otherCvSkills.map((cs: any, cIdx: number) => {
                          const skillName = cs.nom || `Skill ${cIdx}`;
                          return (
                            <span 
                              key={`other-cv-skill-${cIdx}`}
                              className="px-2 py-1 rounded-lg text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700"
                            >
                              {skillName}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Ajouter une compétence réelle supplémentaire */}
                  <div className="pt-1 flex items-center gap-2">
                    <input
                      type="text"
                      value={newSkillInput}
                      onChange={(e) => setNewSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newSkillInput.trim()) {
                          e.preventDefault();
                          if (!selectedSkills.includes(newSkillInput.trim())) {
                            setSelectedSkills([...selectedSkills, newSkillInput.trim()]);
                            setExtraSkills([...extraSkills, newSkillInput.trim()]);
                          }
                          setNewSkillInput('');
                        }
                      }}
                      placeholder="+ Ajouter un outil ou compétence réelle maîtrisée..."
                      className="flex-1 px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-black dark:text-white rounded-lg focus:border-black dark:focus:border-white outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newSkillInput.trim()) {
                          if (!selectedSkills.includes(newSkillInput.trim())) {
                            setSelectedSkills([...selectedSkills, newSkillInput.trim()]);
                            setExtraSkills([...extraSkills, newSkillInput.trim()]);
                          }
                          setNewSkillInput('');
                        }
                      }}
                      className="px-3 py-2 text-xs font-bold bg-black text-white dark:bg-white dark:text-black rounded-lg cursor-pointer"
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* SECTION 3: EXPÉRIENCES (REFORMULATIONS ORIENTÉES SANS INVENTER) */}
          <div className="bg-white dark:bg-neutral-950 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-black dark:text-white">
                    3. Expériences : Reformulations Orientées pour l'Offre
                  </h3>
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  Vos postes, dates et entreprises restent rigoureusement intacts. Choisissez l'axe de reformulation qui valorise le mieux vos réalisations pour ce poste.
                </p>
              </div>
            </div>

            {/* Suggestions interactives de reformulation pour chaque expérience du candidat */}
            <div className="space-y-3 pt-1">
              {(() => {
                const experiencesList = extractedOffer.suggestionsExperiences || [];
                if (experiencesList.length === 0) {
                  return (
                    <p className="text-xs text-neutral-400 italic">
                      Aucune expérience détectée sur votre CV source.
                    </p>
                  );
                }

                return experiencesList.map((expItem: any, idx: number) => {
                  const id = expItem.experienceId || expItem.poste;
                  const isAccepted = acceptedReformulations[id] ?? true;
                  const currentVariant = selectedExpVariants[id] || 'resultats';
                  const isEditingThis = editingExpId === id;
                  const currentReformulation = experienceReformulations[id] || expItem.descriptionSuggeree;

                  return (
                    <div
                      key={`exp-card-${id}-${idx}`}
                      className={`p-4 rounded-xl border transition-all space-y-3 ${
                        isAccepted
                          ? 'border-neutral-300 dark:border-neutral-700 bg-neutral-50/70 dark:bg-neutral-900/60'
                          : 'border-neutral-200 dark:border-neutral-800 opacity-60'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-neutral-200 dark:border-neutral-800">
                        <div>
                          <p className="text-xs font-black text-black dark:text-white">
                            {expItem.poste} — <span className="font-semibold text-neutral-600 dark:text-neutral-300">{expItem.entreprise}</span>
                          </p>
                          {expItem.periode && (
                            <p className="text-[10px] text-neutral-400">{expItem.periode}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <button
                            type="button"
                            onClick={() => {
                              setAcceptedReformulations(prev => ({ ...prev, [id]: !isAccepted }));
                            }}
                            className={`text-[11px] font-bold px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                              isAccepted 
                                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
                                : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                            }`}
                          >
                            {isAccepted ? '✓ Suggestion activée' : 'Garder l\'original'}
                          </button>

                          <button
                            type="button"
                            onClick={() => setEditingExpId(isEditingThis ? null : id)}
                            className="text-[11px] font-bold text-black dark:text-white underline cursor-pointer"
                          >
                            {isEditingThis ? 'Valider le texte' : 'Modifier'}
                          </button>
                        </div>
                      </div>

                      {/* Sélecteur de variantes de reformulation */}
                      {isAccepted && !isEditingThis && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedExpVariants(prev => ({ ...prev, [id]: 'resultats' }));
                              setExperienceReformulations(prev => ({ ...prev, [id]: expItem.descriptionSuggeree }));
                            }}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                              currentVariant === 'resultats'
                                ? 'bg-black text-white dark:bg-white dark:text-black shadow-2xs'
                                : 'bg-neutral-200/70 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-300'
                            }`}
                          >
                            🎯 Résultats & Livrables
                          </button>

                          {expItem.varianteTechnique && (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedExpVariants(prev => ({ ...prev, [id]: 'technique' }));
                                setExperienceReformulations(prev => ({ ...prev, [id]: expItem.varianteTechnique }));
                              }}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                                currentVariant === 'technique'
                                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-2xs'
                                  : 'bg-neutral-200/70 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-300'
                              }`}
                            >
                              ⚙️ Rigueur Technique
                            </button>
                          )}

                          {expItem.varianteImpact && (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedExpVariants(prev => ({ ...prev, [id]: 'impact' }));
                                setExperienceReformulations(prev => ({ ...prev, [id]: expItem.varianteImpact }));
                              }}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                                currentVariant === 'impact'
                                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-2xs'
                                  : 'bg-neutral-200/70 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-300'
                              }`}
                            >
                              🚀 Impact & Optimisation
                            </button>
                          )}

                          {expItem.descriptionOriginale && (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedExpVariants(prev => ({ ...prev, [id]: 'original' }));
                                setExperienceReformulations(prev => ({ ...prev, [id]: expItem.descriptionOriginale }));
                              }}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                                currentVariant === 'original'
                                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-2xs'
                                  : 'bg-neutral-200/70 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-300'
                              }`}
                            >
                              📝 Texte Original
                            </button>
                          )}
                        </div>
                      )}

                      {/* Formulation display / editor */}
                      <div className="space-y-1 text-xs">
                        {isEditingThis ? (
                          <textarea
                            rows={4}
                            value={currentReformulation}
                            onChange={(e) => setExperienceReformulations({
                              ...experienceReformulations,
                              [id]: e.target.value
                            })}
                            className="w-full p-2.5 bg-white dark:bg-neutral-950 border border-black dark:border-white text-black dark:text-white rounded-lg focus:outline-hidden font-mono text-[11px] leading-relaxed"
                          />
                        ) : (
                          <div className="p-2.5 bg-white dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 whitespace-pre-line leading-relaxed text-neutral-800 dark:text-neutral-200">
                            {isAccepted ? currentReformulation : (expItem.descriptionOriginale || currentReformulation)}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>

          {/* SECTION 4: PALETTE BICOLORE (PRIMAIRE + SECONDAIRE) & MODÈLES DE CV ADAPTÉS */}
          <div className="bg-white dark:bg-neutral-950 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center space-x-2">
                <Palette className="w-4 h-4 text-black dark:text-white" />
                <h3 className="text-xs font-black uppercase text-black dark:text-white tracking-wider">
                  4. Palette Bicolore de l'Annonce (Primaire + Secondaire)
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Duo de couleurs identitaires
              </span>
            </div>

            {/* Duo de couleurs avec bouton de swap / inversion */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Couleur Primaire */}
              <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-black dark:text-white">
                    Couleur Primaire (Titres & En-tête)
                  </span>
                  <span className="text-xs font-mono font-bold text-neutral-500">
                    {targetBrandColor}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl shadow-xs border-2 border-white dark:border-neutral-800 shrink-0"
                    style={{ backgroundColor: targetBrandColor }}
                  />
                  <div className="flex-1">
                    <input
                      type="color"
                      value={targetBrandColor}
                      onChange={(e) => setTargetBrandColor(e.target.value)}
                      className="w-full h-8 rounded-lg cursor-pointer border border-neutral-300 dark:border-neutral-700 bg-transparent p-0"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-wrap pt-1">
                  {['#1E40AF', '#0284C7', '#059669', '#DC2626', '#EA580C', '#7C3AED', '#0F172A'].map(hex => (
                    <button
                      key={`prim-${hex}`}
                      type="button"
                      onClick={() => setTargetBrandColor(hex)}
                      className="w-5 h-5 rounded-md border border-white/40 cursor-pointer transition-transform hover:scale-110"
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                </div>
              </div>

              {/* Couleur Secondaire */}
              <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-black dark:text-white">
                    Couleur Secondaire (Badges, Jauges & Sous-titres)
                  </span>
                  <span className="text-xs font-mono font-bold text-neutral-500">
                    {targetBrandSecondaryColor}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl shadow-xs border-2 border-white dark:border-neutral-800 shrink-0"
                    style={{ backgroundColor: targetBrandSecondaryColor }}
                  />
                  <div className="flex-1">
                    <input
                      type="color"
                      value={targetBrandSecondaryColor}
                      onChange={(e) => setTargetBrandSecondaryColor(e.target.value)}
                      className="w-full h-8 rounded-lg cursor-pointer border border-neutral-300 dark:border-neutral-700 bg-transparent p-0"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-wrap pt-1">
                  {['#60A5FA', '#38BDF8', '#34D399', '#F87171', '#FB923C', '#A78BFA', '#94A3B8'].map(hex => (
                    <button
                      key={`sec-${hex}`}
                      type="button"
                      onClick={() => setTargetBrandSecondaryColor(hex)}
                      className="w-5 h-5 rounded-md border border-white/40 cursor-pointer transition-transform hover:scale-110"
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Bouton de Swap pour intervertir Primaire & Secondaire */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleSwapColors}
                className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-black dark:text-white text-xs font-black flex items-center gap-2 transition-all cursor-pointer border border-neutral-300 dark:border-neutral-700"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span>Intervertir les deux couleurs (Swap)</span>
              </button>
            </div>

            {/* Mode d'Harmonisation Bicolore */}
            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-black uppercase text-neutral-500 tracking-wider block">
                Mode d'application des deux couleurs :
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  {
                    id: 'duo',
                    title: 'Duo Bicolore (Recommandé)',
                    desc: 'Titres en couleur primaire, sous-titres, badges, jauges et liserés en secondaire'
                  },
                  {
                    id: 'primary_dominant',
                    title: 'Primaire Dominante',
                    desc: 'Priorité à la première couleur avec teintes neutres pour le reste'
                  },
                  {
                    id: 'secondary_dominant',
                    title: 'Secondaire Dominante',
                    desc: 'Inverse les rôles pour faire ressortir la couleur d\'accentuation'
                  }
                ].map(mode => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setColorHarmonizationMode(mode.id as any)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      colorHarmonizationMode === mode.id
                        ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-2xs'
                        : 'bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400'
                    }`}
                  >
                    <p className="text-xs font-black">{mode.title}</p>
                    <p className="text-[10px] opacity-80 mt-1">{mode.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Modèles de CV Recommandés pour Duos Bicolores */}
            <div className="space-y-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase text-neutral-500 tracking-wider">
                  Modèles de CV Recommandés pour les Palettes Bicolores :
                </span>
                <span className="text-[10px] text-neutral-400">
                  Styles d'en-tête dynamiques
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'two-tone-split', name: '2 Couleurs Split', badge: 'Bicolore net' },
                  { id: 'baxter-diagonal', name: 'Baxter Diagonale', badge: 'Bicolore star' },
                  { id: 'two-tone-stripe', name: 'Bandeau Accent', badge: '2 Couleurs' },
                  { id: 'wave-bottom', name: 'Vague Fluide', badge: 'Vague inférieure' },
                  { id: 'wave-double', name: 'Double Vague', badge: 'Vague bicolore' },
                  { id: 'ocean-wave', name: 'Océan Vague', badge: 'Vague aquatique' },
                  { id: 'clean', name: 'Clean Editorial', badge: 'Normal & Simple' },
                  { id: 'simple-minimal', name: 'Simple Aéré', badge: 'Normal minimal' }
                ].map(tmpl => {
                  const isSelected = selectedTemplateStyle === tmpl.id;
                  return (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => setSelectedTemplateStyle(tmpl.id)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'border-black dark:border-white bg-neutral-100 dark:bg-neutral-900 ring-2 ring-black dark:ring-white'
                          : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
                      }`}
                    >
                      <div className="h-6 rounded-md mb-2 flex overflow-hidden border border-neutral-300 dark:border-neutral-700">
                        <div className="w-1/2 h-full" style={{ backgroundColor: targetBrandColor }} />
                        <div className="w-1/2 h-full" style={{ backgroundColor: targetBrandSecondaryColor }} />
                      </div>
                      <p className="text-xs font-bold text-black dark:text-white truncate">{tmpl.name}</p>
                      <span className="text-[9px] text-neutral-500 block truncate">{tmpl.badge}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-neutral-200 dark:border-neutral-800">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2.5 text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-xl transition-all cursor-pointer"
            >
              Retour à l'offre
            </button>

            <button
              type="button"
              onClick={handleGenerateTailoredAssets}
              disabled={isTailoring}
              className="w-full sm:w-auto px-7 py-3 bg-black hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 border border-black dark:border-white shadow-md"
            >
              {isTailoring ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Application au CV & Sauvegarde en cours...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Valider les Suggestions & Mettre à jour le CV</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: RESULTS & SAVED ASSETS */}
      {step === 3 && createdCV && (
        <div className="space-y-5 animate-in fade-in duration-150">
          
          {/* Success Banner */}
          <div className="p-5 sm:p-6 rounded-2xl bg-black text-white dark:bg-white dark:text-black shadow-md space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 dark:bg-black/20 px-2 py-0.5 rounded">
                  {updateMode === 'update_current' ? 'CV Actualisé avec Succès' : 'Candidature Ciblée Créée'}
                </span>
                <h2 className="text-base sm:text-lg font-black uppercase">
                  {updateMode === 'update_current' 
                    ? 'Votre CV a été mis à jour pour cette offre !' 
                    : 'Votre nouveau CV ciblé et sa lettre sont prêts !'}
                </h2>
                <p className="text-xs text-neutral-300 dark:text-neutral-700">
                  Le profil pro, les compétences réordonnées sans invention, les expériences orientées et les couleurs de l'annonce sont enregistrés.
                </p>
              </div>

              {tailoringResult?.tauxCorrespondanceEstime && (
                <div className="p-3 rounded-xl bg-neutral-900 dark:bg-neutral-100 border border-neutral-700 dark:border-neutral-300 text-center shrink-0">
                  <span className="text-[9px] font-black uppercase text-neutral-400 dark:text-neutral-600 block">Score Match ATS</span>
                  <p className="text-2xl font-black text-white dark:text-black">{tailoringResult.tauxCorrespondanceEstime}%</p>
                </div>
              )}
            </div>

            {/* Summary Highlights */}
            {tailoringResult?.modificationsApportees && (
              <div className="pt-2 border-t border-white/20 dark:border-black/20 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {tailoringResult.modificationsApportees.map((mod, idx) => (
                  <div key={`mod-${idx}`} className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-400 dark:text-emerald-600" />
                    <span>{mod}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cards for the 2 Generated Assets: Tailored CV + Tailored Letter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* 1. Tailored CV Card */}
            <div className="bg-white dark:bg-neutral-950 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-black dark:text-white bg-neutral-100 dark:bg-neutral-900 px-2 py-0.5 rounded border border-neutral-300 dark:border-neutral-700">
                    CV Mis à jour & Enregistré
                  </span>
                  <span 
                    className="w-4 h-4 rounded-full border border-white dark:border-neutral-800 shadow-2xs"
                    style={{ backgroundColor: targetBrandColor }}
                    title={`Couleur appliquée : ${targetBrandColor}`}
                  />
                </div>
                <h3 className="text-sm font-black text-black dark:text-white line-clamp-1">
                  {createdCV.titre}
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  Ciblé pour : <strong>{createdCV.jobTargetTitle}</strong> chez <strong>{createdCV.jobTargetCompany || 'Entreprise'}</strong>.
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (typeof onOpenCVEditor === 'function') {
                      onOpenCVEditor(createdCV);
                    } else if (typeof onCVPersonalized === 'function') {
                      onCVPersonalized(createdCV);
                    } else if (typeof onGoToDashboard === 'function') {
                      onGoToDashboard();
                    }
                  }}
                  className="flex-1 py-2.5 bg-black hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-black font-black text-xs uppercase rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer border border-black dark:border-white shadow-sm"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Ouvrir dans l'Éditeur</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (typeof onGoToDashboard === 'function') {
                      onGoToDashboard();
                    }
                  }}
                  className="px-4 py-2.5 bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-black dark:text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center cursor-pointer border border-neutral-300 dark:border-neutral-700"
                >
                  <span>Mes CVs</span>
                </button>
              </div>
            </div>

            {/* 2. Tailored Cover Letter Card */}
            {createdLetter ? (
              <div className="bg-white dark:bg-neutral-950 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-black dark:text-white bg-neutral-100 dark:bg-neutral-900 px-2 py-0.5 rounded border border-neutral-300 dark:border-neutral-700">
                      Lettre Dédiée Enregistrée
                    </span>
                    <span 
                      className="w-4 h-4 rounded-full border border-white dark:border-neutral-800 shadow-2xs"
                      style={{ backgroundColor: targetBrandColor }}
                      title={`Couleur entreprise appliquée : ${targetBrandColor}`}
                    />
                  </div>
                  <h3 className="text-sm font-black text-black dark:text-white line-clamp-1">
                    {createdLetter.titre}
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    Lettre de motivation percutante prête à être éditée, prévisualisée ou exportée.
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewLetterData(createdLetter);
                      setShowLetterPreviewModal(true);
                    }}
                    className="flex-1 py-2.5 bg-neutral-900 hover:bg-black dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-black font-black text-xs uppercase rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs border border-neutral-800 dark:border-neutral-200"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Prévisualiser</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (typeof onOpenLetterEditor === 'function') {
                        onOpenLetterEditor(createdLetter);
                      } else if (typeof onGoToLetters === 'function') {
                        onGoToLetters();
                      } else if (typeof onGoToDashboard === 'function') {
                        onGoToDashboard();
                      }
                    }}
                    className="px-3.5 py-2.5 bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-black dark:text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-1 cursor-pointer border border-neutral-300 dark:border-neutral-700"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Éditer</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-neutral-50 dark:bg-neutral-900/40 p-5 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700 flex flex-col justify-center items-center text-center space-y-2">
                <Mail className="w-6 h-6 text-neutral-400" />
                <p className="text-xs font-bold text-neutral-600 dark:text-neutral-400">
                  Lettre de motivation
                </p>
                <p className="text-[11px] text-neutral-500">
                  Générez une lettre de motivation dédiée depuis l'onglet Lettres.
                </p>
              </div>
            )}
          </div>

          {/* Quick Return to Target Another Offer */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setStep(1);
                setOffreTexte('');
                setImagePreview(null);
                setImageBase64(null);
                setTailoringResult(null);
              }}
              className="text-xs font-bold text-black dark:text-white underline cursor-pointer"
            >
              + Cibler une autre offre d'emploi
            </button>
          </div>
        </div>
      )}

      {/* Real A4 Cover Letter Preview Modal */}
      <LetterPreviewModal
        letter={previewLetterData}
        isOpen={showLetterPreviewModal}
        onClose={() => setShowLetterPreviewModal(false)}
        onEdit={(letter) => {
          if (typeof onOpenLetterEditor === 'function') {
            onOpenLetterEditor(letter);
          }
        }}
      />
    </div>
  );
};
