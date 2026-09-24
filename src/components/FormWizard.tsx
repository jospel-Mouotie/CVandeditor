import React, { useState, useRef, useMemo } from 'react';
import {
  CV,
  Section,
  Language,
  ExperienceItem,
  FormationItem,
  CompetenceItem,
  SubCompetenceItem,
  LangueItem,
  ProfilContenu,
  ProjetItem,
  CertificationItem,
  InteretItem,
  ReferenceItem
} from '../types';
import { getTranslation } from '../i18n/translations';
import { processUploadedImage } from '../utils/imageUpload';
import { toggleColumnLayout, toggleSidebarPosition } from '../state/cvActions';
import { FONT_OPTIONS, ACCENT_COLORS } from '../data/templates';
import { AISuggestionButton } from './AISuggestionButton';
import { BulletTextInput } from './BulletTextInput';
import { SubCompetenceManager } from './SubCompetenceManager';
import { ClearableInput, ClearableTextarea } from './ClearableInput';
import { SkillLevelRenderer } from './SkillLevelRenderer';
import { getJobSkillsSuggestions } from '../utils/jobContext';
import { JOB_LANDING_PAGES } from '../data/jobLandingPages';
import {
  User,
  Briefcase,
  GraduationCap,
  Award,
  Globe,
  Plus,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Columns,
  CheckCircle2,
  Camera,
  Layers,
  Sparkles,
  Palette,
  Type,
  ExternalLink,
  BookmarkCheck,
  Heart,
  PhoneCall,
  Check,
  Loader2,
  ArrowUp,
  ArrowDown,
  Wand2
} from 'lucide-react';

interface FormWizardProps {
  cv: CV;
  onChangeCV: (updatedCV: CV) => void;
  langue: Language;
  userTier?: 'freemium' | 'classique' | 'premium';
  onOpenUpgradeModal?: (tier?: 'classique' | 'premium') => void;
  onFinishWizard?: () => void;
}

export const FormWizard: React.FC<FormWizardProps> = ({
  cv,
  onChangeCV,
  langue,
  userTier = 'freemium',
  onOpenUpgradeModal,
  onFinishWizard
}) => {
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(langue, key);

  const STEPS = [
    {
      id: 'profil',
      title: langue === 'en' ? 'Profile' : langue === 'ar' ? 'الملف الشخصي' : 'Profil',
      icon: User,
      description: langue === 'en' ? 'Personal information, coordinates & photo' : langue === 'ar' ? 'المعلومات الشخصية ومعلومات الاتصال والصورة' : 'Informations personnelles, coordonnées et photo'
    },
    {
      id: 'experience',
      title: langue === 'en' ? 'Experience' : langue === 'ar' ? 'الخبرات' : 'Expériences',
      icon: Briefcase,
      description: langue === 'en' ? 'Work history and professional impact' : langue === 'ar' ? 'السجل المهني والإنجازات' : 'Parcours professionnel et réalisations'
    },
    {
      id: 'formation',
      title: langue === 'en' ? 'Education' : langue === 'ar' ? 'التعليم' : 'Formations',
      icon: GraduationCap,
      description: langue === 'en' ? 'Degrees, studies and institutions' : langue === 'ar' ? 'الشهادات والدراسات' : 'Diplômes, universités et études'
    },
    {
      id: 'competences',
      title: langue === 'en' ? 'Skills' : langue === 'ar' ? 'المهارات' : 'Compétences',
      icon: Award,
      description: langue === 'en' ? 'Core skills, levels & tools' : langue === 'ar' ? 'المهارات والمستويات' : 'Savoir-faire, niveaux et outils'
    },
    {
      id: 'langues',
      title: langue === 'en' ? 'Languages' : langue === 'ar' ? 'اللغات' : 'Langues',
      icon: Globe,
      description: langue === 'en' ? 'Languages spoken and proficiency' : langue === 'ar' ? 'اللغات ومستويات الإتقان' : 'Langues maîtrisées et niveaux'
    },
    {
      id: 'projets',
      title: langue === 'en' ? 'Projects' : langue === 'ar' ? 'المشاريع' : 'Projets',
      icon: ExternalLink,
      description: langue === 'en' ? 'Key projects & achievements' : langue === 'ar' ? 'المشاريع والإنجازات' : 'Projets majeurs, portfolio et réalisations'
    },
    {
      id: 'certifs_interets',
      title: langue === 'en' ? 'Extras' : langue === 'ar' ? 'إضافات' : 'Extras',
      icon: BookmarkCheck,
      description: langue === 'en' ? 'Certifications, interests & references' : langue === 'ar' ? 'الشهادات والاهتمامات' : 'Certifications, loisirs et références'
    },
    {
      id: 'design',
      title: langue === 'en' ? 'Design' : langue === 'ar' ? 'التصميم' : 'Design',
      icon: Palette,
      description: langue === 'en' ? 'Columns, colors, fonts & layout' : langue === 'ar' ? 'الأعمدة، الألوان والخطوط' : 'Colonnes, couleurs, polices et mise en page'
    },
    {
      id: 'sections',
      title: langue === 'en' ? 'Order' : langue === 'ar' ? 'الترتيب' : 'Ordre',
      icon: Layers,
      description: langue === 'en' ? 'Reorder sections and column assignment' : langue === 'ar' ? 'إعادة الترتيب والأقسام' : 'Organiser l\'ordre et la visibilité des sections'
    }
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoUploadError, setPhotoUploadError] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const currentStep = STEPS[currentStepIndex];
  const progressPercent = Math.round(((currentStepIndex + 1) / STEPS.length) * 100);

  const handleNextStep = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    setPhotoUploadError(null);

    try {
      const dataUrl = await processUploadedImage(file, { maxWidth: 600, maxHeight: 600, quality: 0.88 });
      onChangeCV({ ...cv, photoUrl: dataUrl, afficherPhoto: true });
    } catch (err: any) {
      setPhotoUploadError(err.message || 'Error uploading photo');
    } finally {
      setIsUploadingPhoto(false);
      if (photoInputRef.current) {
        photoInputRef.current.value = '';
      }
    }
  };

  // Profile Section Helpers
  const profilSec = cv.sections.find((s) => s.type === 'profil') || {
    id: 'profil-1',
    type: 'profil' as const,
    titre: 'Profil',
    ordre: 1,
    visible: true,
    contenu: {}
  };
  const profilContenu = (profilSec.contenu || {}) as ProfilContenu;

  const updateProfil = (patch: Partial<ProfilContenu>) => {
    const updatedContenu = { ...profilContenu, ...patch };
    const hasProfil = cv.sections.some((s) => s.type === 'profil');
    const updatedSections = hasProfil
      ? cv.sections.map((s) => s.type === 'profil' ? { ...s, contenu: updatedContenu } : s)
      : [{ id: 'sec-profil-gen', type: 'profil' as const, titre: 'Profil & Coordonnées', ordre: 1, visible: true, contenu: updatedContenu }, ...cv.sections];

    onChangeCV({ ...cv, sections: updatedSections });
  };

  const getRichCvContext = (additional?: string) => {
    const parts: string[] = [];
    if (profilContenu.titreProfessionnel) {
      parts.push(`Métier/Titre du candidat: "${profilContenu.titreProfessionnel}"`);
    }
    if (profilContenu.nomComplet) {
      parts.push(`Candidat: "${profilContenu.nomComplet}"`);
    }
    if (profilContenu.resume) {
      parts.push(`Profil: "${profilContenu.resume.slice(0, 250)}"`);
    }
    const expSec = cv.sections.find((s) => s.type === 'experience');
    const expList = Array.isArray(expSec?.contenu) ? (expSec.contenu as ExperienceItem[]) : [];
    if (expList.length > 0) {
      const exps = expList.map(e => `${e.poste || ''} chez ${e.entreprise || ''}`).filter(x => x.trim().length > 3).join(', ');
      if (exps) parts.push(`Parcours: ${exps}`);
    }
    const skSec = cv.sections.find((s) => s.type === 'competences');
    const skList = Array.isArray(skSec?.contenu) ? (skSec.contenu as CompetenceItem[]) : [];
    if (skList.length > 0) {
      const skills = skList.map(s => s.nom).filter(Boolean).slice(0, 10).join(', ');
      if (skills) parts.push(`Compétences: ${skills}`);
    }
    if (additional) {
      parts.push(`Champ spécifique: ${additional}`);
    }
    return parts.join(' | ');
  };

  const updateSectionContent = (sectionType: Section['type'], defaultTitle: string, newContenu: any) => {
    const hasSec = cv.sections.some((s) => s.type === sectionType);
    if (!hasSec) {
      const newSec: Section = {
        id: `sec-${sectionType}-${Date.now()}`,
        type: sectionType,
        titre: defaultTitle,
        ordre: cv.sections.length + 1,
        visible: true,
        colonne: (cv.nombreColonnes || 2) === 2 ? (['competences', 'langues', 'interets', 'references'].includes(sectionType) ? 'gauche' : 'droite') : 'principale',
        contenu: newContenu
      };
      onChangeCV({ ...cv, sections: [...cv.sections, newSec] });
    } else {
      const updatedSections = cv.sections.map((s) =>
        s.type === sectionType ? { ...s, contenu: newContenu } : s
      );
      onChangeCV({ ...cv, sections: updatedSections });
    }
  };

  const renderStepContent = () => {
    switch (currentStepIndex) {
      case 0: return renderProfilStep();
      case 1: return renderExperienceStep();
      case 2: return renderFormationStep();
      case 3: return renderCompetencesStep();
      case 4: return renderLanguesStep();
      case 5: return renderProjetsStep();
      case 6: return renderExtrasStep();
      case 7: return renderDesignStep();
      case 8: return renderSectionsStep();
      default: return null;
    }
  };

  // STEP 1: PROFIL & COORDONNÉES
  const renderProfilStep = () => {
    return (
      <div className="space-y-5 animate-fadeIn">
        <div className="bg-white dark:bg-black p-4 sm:p-5 rounded-xl border border-black/10 dark:border-white/10 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-black dark:text-white flex items-center gap-2">
              <User className="w-4 h-4 text-black dark:text-white" />
              <span>{t('profileWord')} & {t('profilePhotoWord')}</span>
            </h3>
            <span className="text-[10px] text-neutral-500 font-medium">Informations principales</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">
                {t('fullName')} *
              </label>
              <ClearableInput
                value={profilContenu.nomComplet || ''}
                onChange={(e) => updateProfil({ nomComplet: e.target.value })}
                onClear={() => updateProfil({ nomComplet: '' })}
                placeholder="Jean DUPONT"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-black dark:text-white font-medium focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10 outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                  {t('jobTitle')} *
                </label>
                <AISuggestionButton
                  fieldName="titreProfessionnel"
                  currentValue={profilContenu.titreProfessionnel || ''}
                  context={profilContenu.nomComplet || ''}
                  fullCvContext={getRichCvContext('Intitulé de poste / Titre professionnel')}
                  userTier={userTier}
                  onOpenUpgradeModal={onOpenUpgradeModal}
                  langue={langue}
                  onApplySuggestion={(suggestion) => updateProfil({ titreProfessionnel: suggestion })}
                  compact
                />
              </div>
              <ClearableInput
                value={profilContenu.titreProfessionnel || ''}
                onChange={(e) => updateProfil({ titreProfessionnel: e.target.value })}
                onClear={() => updateProfil({ titreProfessionnel: '' })}
                placeholder="Développeur Full-Stack Senior"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-black dark:text-white font-semibold focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">
                {t('email')}
              </label>
              <ClearableInput
                type="email"
                value={profilContenu.email || ''}
                onChange={(e) => updateProfil({ email: e.target.value })}
                onClear={() => updateProfil({ email: '' })}
                placeholder="contact@email.com"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-black dark:text-white font-medium focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">
                {t('phone')}
              </label>
              <ClearableInput
                type="tel"
                value={profilContenu.telephone || ''}
                onChange={(e) => updateProfil({ telephone: e.target.value })}
                onClear={() => updateProfil({ telephone: '' })}
                placeholder="+237 658 60 61 03"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-black dark:text-white font-medium focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">
                {t('address')}
              </label>
              <ClearableInput
                value={profilContenu.adresse || ''}
                onChange={(e) => updateProfil({ adresse: e.target.value })}
                onClear={() => updateProfil({ adresse: '' })}
                placeholder="Douala, Cameroun"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-black dark:text-white font-medium focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">
                LinkedIn / Portfolio
              </label>
              <ClearableInput
                value={profilContenu.linkedin || ''}
                onChange={(e) => updateProfil({ linkedin: e.target.value })}
                onClear={() => updateProfil({ linkedin: '' })}
                placeholder="linkedin.com/in/jeandupont"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-black dark:text-white font-medium focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10 outline-none"
              />
            </div>

            {/* Resume / Summary with AI suggestion & Bullet formatting */}
            <div className="sm:col-span-2 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-neutral-800 dark:text-neutral-200">
                  {t('summary')}
                </label>
                <AISuggestionButton
                  fieldName="resume"
                  currentValue={profilContenu.resume || ''}
                  context={profilContenu.titreProfessionnel || ''}
                  fullCvContext={getRichCvContext('Résumé / Présentation du candidat')}
                  userTier={userTier}
                  onOpenUpgradeModal={onOpenUpgradeModal}
                  langue={langue}
                  onApplySuggestion={(s) => updateProfil({ resume: s })}
                  compact
                />
              </div>

              <BulletTextInput
                value={profilContenu.resume || ''}
                onChange={(newVal) => updateProfil({ resume: newVal })}
                placeholder="Présentez vos atouts majeurs, votre expertise et vos objectifs en 3 à 4 phrases..."
                rows={4}
                langue={langue}
              />
            </div>
          </div>

          {/* Photo Import */}
          <div className="pt-3 border-t border-black/10 dark:border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-black dark:text-white flex items-center gap-1.5">
                <Camera className="w-4 h-4" />
                <span>Photo de Profil</span>
              </label>

              <button
                type="button"
                onClick={() => onChangeCV({ ...cv, afficherPhoto: cv.afficherPhoto === false })}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                  cv.afficherPhoto !== false
                    ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-xs'
                    : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-black/10 dark:border-white/10'
                }`}
              >
                {cv.afficherPhoto !== false ? 'Photo Affichée' : 'Photo Masquée'}
              </button>
            </div>

            <div className="bg-neutral-50 dark:bg-neutral-900 p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 flex items-center gap-4">
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />

              {cv.photoUrl ? (
                <div className="relative group shrink-0">
                  <img
                    src={cv.photoUrl}
                    alt="Photo"
                    className="w-16 h-16 object-cover rounded-lg border border-black/20 dark:border-white/20 shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={() => onChangeCV({ ...cv, photoUrl: '' })}
                    className="absolute -top-1 -right-1 bg-black text-white dark:bg-white dark:text-black p-1 rounded-full shadow hover:opacity-80 cursor-pointer"
                    title="Supprimer la photo"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="w-16 h-16 rounded-lg bg-neutral-200 dark:bg-neutral-800 border-2 border-dashed border-neutral-300 dark:border-neutral-700 flex items-center justify-center text-neutral-400 shrink-0">
                  <Camera className="w-6 h-6" />
                </div>
              )}

              <div className="flex-1 space-y-1.5">
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  disabled={isUploadingPhoto}
                  className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black hover:opacity-90 rounded-lg text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  {isUploadingPhoto ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
                  <span>{cv.photoUrl ? 'Changer la photo' : 'Importer une photo'}</span>
                </button>
                {photoUploadError && (
                  <p className="text-[10px] text-red-500 font-bold">{photoUploadError}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // STEP 2: EXPÉRIENCES
  const renderExperienceStep = () => {
    const expSec = cv.sections.find((s) => s.type === 'experience');
    const expList: ExperienceItem[] = Array.isArray(expSec?.contenu) ? expSec.contenu : [];

    const updateExp = (newList: ExperienceItem[]) => {
      updateSectionContent('experience', 'Expériences Professionnelles', newList);
    };

    const addExp = () => {
      const newExp: ExperienceItem = {
        id: `exp-${Date.now()}`,
        poste: 'Nouveau Poste',
        entreprise: 'Entreprise',
        ville: 'Ville',
        dateDebut: '2022',
        dateFin: 'Présent',
        actuel: true,
        description: '• Réalisation des missions clés du poste.\n• Optimisation des processus et travail en équipe.'
      };
      updateExp([...expList, newExp]);
    };

    return (
      <div className="space-y-4 animate-fadeIn">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-black dark:text-white flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            <span>Expériences Professionnelles ({expList.length})</span>
          </h3>
          <button
            type="button"
            onClick={addExp}
            className="px-3 py-1.5 bg-black text-white dark:bg-white dark:text-black hover:opacity-90 rounded-lg text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ajouter une Expérience</span>
          </button>
        </div>

        {expList.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-black rounded-xl border border-dashed border-black/20 dark:border-white/20 space-y-3">
            <Briefcase className="w-8 h-8 text-neutral-400 mx-auto" />
            <p className="text-xs text-neutral-500 font-bold">Aucune expérience renseignée pour le moment.</p>
            <button
              type="button"
              onClick={addExp}
              className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-lg text-xs font-bold shadow-xs cursor-pointer"
            >
              Ajouter ma première expérience
            </button>
          </div>
        ) : (
          expList.map((exp, idx) => (
            <div
              key={exp.id || `wiz-exp-${idx}`}
              className="bg-white dark:bg-black p-4 sm:p-5 rounded-xl border border-black/10 dark:border-white/10 shadow-xs space-y-3.5"
            >
              <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-2.5">
                <span className="text-xs font-bold text-black dark:text-white">
                  #{idx + 1} — {exp.poste || 'Poste'}
                </span>
                <button
                  type="button"
                  onClick={() => updateExp(expList.filter((_, i) => i !== idx))}
                  className="p-1 text-neutral-400 hover:text-red-500 rounded-lg cursor-pointer transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200">Poste / Intitulé</label>
                    <AISuggestionButton
                      fieldName="poste"
                      currentValue={exp.poste}
                      context={exp.entreprise}
                      fullCvContext={getRichCvContext(`Intitulé de poste chez ${exp.entreprise || 'Entreprise'}`)}
                      userTier={userTier}
                      onOpenUpgradeModal={onOpenUpgradeModal}
                      langue={langue}
                      onApplySuggestion={(s) => {
                        const list = [...expList];
                        list[idx] = { ...list[idx], poste: s };
                        updateExp(list);
                      }}
                      compact
                    />
                  </div>
                  <ClearableInput
                    value={exp.poste}
                    onChange={(e) => {
                      const list = [...expList];
                      list[idx] = { ...list[idx], poste: e.target.value };
                      updateExp(list);
                    }}
                    onClear={() => {
                      const list = [...expList];
                      list[idx] = { ...list[idx], poste: '' };
                      updateExp(list);
                    }}
                    placeholder="Ex: Chef de Projet Digital"
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-black dark:text-white font-semibold outline-none focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1">Entreprise / Organisation</label>
                  <ClearableInput
                    value={exp.entreprise}
                    onChange={(e) => {
                      const list = [...expList];
                      list[idx] = { ...list[idx], entreprise: e.target.value };
                      updateExp(list);
                    }}
                    onClear={() => {
                      const list = [...expList];
                      list[idx] = { ...list[idx], entreprise: '' };
                      updateExp(list);
                    }}
                    placeholder="Ex: Orange, TotalEnergies..."
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-black dark:text-white font-semibold outline-none focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1">Date Début</label>
                  <ClearableInput
                    value={exp.dateDebut}
                    onChange={(e) => {
                      const list = [...expList];
                      list[idx] = { ...list[idx], dateDebut: e.target.value };
                      updateExp(list);
                    }}
                    onClear={() => {
                      const list = [...expList];
                      list[idx] = { ...list[idx], dateDebut: '' };
                      updateExp(list);
                    }}
                    placeholder="2021"
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-black dark:text-white font-medium outline-none focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1">Date Fin (ou Présent)</label>
                  <ClearableInput
                    value={exp.dateFin}
                    onChange={(e) => {
                      const list = [...expList];
                      list[idx] = { ...list[idx], dateFin: e.target.value };
                      updateExp(list);
                    }}
                    onClear={() => {
                      const list = [...expList];
                      list[idx] = { ...list[idx], dateFin: '' };
                      updateExp(list);
                    }}
                    placeholder="Présent"
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-black dark:text-white font-medium outline-none focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                      Description & Accomplissements (Puces & Formatage)
                    </label>
                    <AISuggestionButton
                      fieldName="description"
                      currentValue={exp.description}
                      context={`${exp.poste} chez ${exp.entreprise}`}
                      fullCvContext={getRichCvContext(`Description du poste: ${exp.poste || ''} chez ${exp.entreprise || ''}`)}
                      userTier={userTier}
                      onOpenUpgradeModal={onOpenUpgradeModal}
                      langue={langue}
                      onApplySuggestion={(s) => {
                        const list = [...expList];
                        list[idx] = { ...list[idx], description: s };
                        updateExp(list);
                      }}
                      compact
                    />
                  </div>

                  <BulletTextInput
                    value={exp.description}
                    onChange={(newVal) => {
                      const list = [...expList];
                      list[idx] = { ...list[idx], description: newVal };
                      updateExp(list);
                    }}
                    rows={3}
                    langue={langue}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

  // STEP 3: FORMATIONS
  const renderFormationStep = () => {
    const eduSec = cv.sections.find((s) => s.type === 'formation');
    const eduList: FormationItem[] = Array.isArray(eduSec?.contenu) ? eduSec.contenu : [];

    const updateEdu = (newList: FormationItem[]) => {
      updateSectionContent('formation', 'Formations & Diplômes', newList);
    };

    const addEdu = () => {
      const newEdu: FormationItem = {
        id: `edu-${Date.now()}`,
        diplome: 'Diplôme / Master',
        etablissement: 'Université / École',
        ville: 'Ville',
        dateDebut: '2018',
        dateFin: '2021',
        description: 'Mention Très Bien — Spécialisation et cours avancés.'
      };
      updateEdu([...eduList, newEdu]);
    };

    return (
      <div className="space-y-4 animate-fadeIn">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-black dark:text-white flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            <span>Formations & Diplômes ({eduList.length})</span>
          </h3>
          <button
            type="button"
            onClick={addEdu}
            className="px-3 py-1.5 bg-black text-white dark:bg-white dark:text-black hover:opacity-90 rounded-lg text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ajouter une Formation</span>
          </button>
        </div>

        {eduList.map((edu, idx) => (
          <div
            key={edu.id || `wiz-edu-${idx}`}
            className="bg-white dark:bg-black p-4 sm:p-5 rounded-xl border border-black/10 dark:border-white/10 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-2">
              <span className="text-xs font-bold text-black dark:text-white">
                #{idx + 1} — {edu.diplome || 'Diplôme'}
              </span>
              <button
                type="button"
                onClick={() => updateEdu(eduList.filter((_, i) => i !== idx))}
                className="p-1 text-neutral-400 hover:text-red-500 rounded-lg cursor-pointer transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1">Diplôme / Titre</label>
                <ClearableInput
                  value={edu.diplome}
                  onChange={(e) => {
                    const list = [...eduList];
                    list[idx] = { ...list[idx], diplome: e.target.value };
                    updateEdu(list);
                  }}
                  onClear={() => {
                    const list = [...eduList];
                    list[idx] = { ...list[idx], diplome: '' };
                    updateEdu(list);
                  }}
                  placeholder="Ex: Master en Informatique"
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-black dark:text-white font-semibold outline-none focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1">Établissement & Ville</label>
                <ClearableInput
                  value={edu.etablissement}
                  onChange={(e) => {
                    const list = [...eduList];
                    list[idx] = { ...list[idx], etablissement: e.target.value };
                    updateEdu(list);
                  }}
                  onClear={() => {
                    const list = [...eduList];
                    list[idx] = { ...list[idx], etablissement: '' };
                    updateEdu(list);
                  }}
                  placeholder="Ex: Université de Yaoundé I"
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-black dark:text-white font-semibold outline-none focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1">Année Début</label>
                <ClearableInput
                  value={edu.dateDebut}
                  onChange={(e) => {
                    const list = [...eduList];
                    list[idx] = { ...list[idx], dateDebut: e.target.value };
                    updateEdu(list);
                  }}
                  onClear={() => {
                    const list = [...eduList];
                    list[idx] = { ...list[idx], dateDebut: '' };
                    updateEdu(list);
                  }}
                  placeholder="2018"
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-black dark:text-white font-medium outline-none focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1">Année Fin</label>
                <ClearableInput
                  value={edu.dateFin}
                  onChange={(e) => {
                    const list = [...eduList];
                    list[idx] = { ...list[idx], dateFin: e.target.value };
                    updateEdu(list);
                  }}
                  onClear={() => {
                    const list = [...eduList];
                    list[idx] = { ...list[idx], dateFin: '' };
                    updateEdu(list);
                  }}
                  placeholder="2021"
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-black dark:text-white font-medium outline-none focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200">Mention / Détails de la formation</label>
                  <AISuggestionButton
                    fieldName="description"
                    currentValue={edu.description || ''}
                    context={`${edu.diplome} à ${edu.etablissement}`}
                    fullCvContext={getRichCvContext(`Mention / Détails du diplôme: ${edu.diplome || ''} à ${edu.etablissement || ''}`)}
                    userTier={userTier}
                    onOpenUpgradeModal={onOpenUpgradeModal}
                    langue={langue}
                    onApplySuggestion={(s) => {
                      const list = [...eduList];
                      list[idx] = { ...list[idx], description: s };
                      updateEdu(list);
                    }}
                    compact
                  />
                </div>
                <BulletTextInput
                  value={edu.description || ''}
                  onChange={(newVal) => {
                    const list = [...eduList];
                    list[idx] = { ...list[idx], description: newVal };
                    updateEdu(list);
                  }}
                  rows={2}
                  langue={langue}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // STEP 4: COMPÉTENCES
  const renderCompetencesStep = () => {
    const skSec = cv.sections.find((s) => s.type === 'competences');
    const skList: CompetenceItem[] = Array.isArray(skSec?.contenu) ? skSec.contenu : [];

    const updateSk = (newList: CompetenceItem[]) => {
      updateSectionContent('competences', 'Compétences & Outils', newList);
    };

    const addSkill = () => {
      const newSkill: CompetenceItem = {
        id: `sk-${Date.now()}`,
        nom: 'Compétence',
        niveau: 8,
        listSousCompetences: [
          { id: `sub-${Date.now()}-1`, nom: 'Outil 1' },
          { id: `sub-${Date.now()}-2`, nom: 'Outil 2' }
        ]
      };
      updateSk([...skList, newSkill]);
    };

    // Calculate job-specific suggestions if available
    let jobSuggestions: { metier?: string; competences: string[]; outils: string[] } | null = null;
    if (cv.jobContextSlug) {
      jobSuggestions = getJobSkillsSuggestions(cv.jobContextSlug);
    } else {
      const target = (profilContenu.titreProfessionnel || cv.titre || '').toLowerCase();
      const matched = JOB_LANDING_PAGES.find(
        (p) => target.includes(p.metier.toLowerCase()) || p.motsClesRecherches.some((k) => target.includes(k.toLowerCase()))
      );
      if (matched) {
        jobSuggestions = getJobSkillsSuggestions(matched.slug);
      }
    }

    return (
      <div className="space-y-4 animate-fadeIn">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-black dark:text-white flex items-center gap-2">
            <Award className="w-4 h-4" />
            <span>Compétences Clés & Outils ({skList.length})</span>
          </h3>

          <div className="flex items-center gap-2">
            <AISuggestionButton
              fieldName="competences"
              currentValue={skList.map(s => s.nom).join(', ')}
              context={profilContenu.titreProfessionnel || ''}
              fullCvContext={getRichCvContext('Suggestions de nouvelles compétences clés du secteur d\'activité')}
              userTier={userTier}
              onOpenUpgradeModal={onOpenUpgradeModal}
              langue={langue}
              onApplySuggestion={(sugg) => {
                const names = sugg.split(',').map(s => s.trim()).filter(Boolean);
                const newItems: CompetenceItem[] = names.map((n, i) => ({
                  id: `sk-ai-${Date.now()}-${i}`,
                  nom: n,
                  niveau: 8,
                  listSousCompetences: []
                }));
                updateSk([...skList, ...newItems]);
              }}
            />

            <button
              type="button"
              onClick={addSkill}
              className="px-3 py-1.5 bg-black text-white dark:bg-white dark:text-black hover:opacity-90 rounded-lg text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ajouter</span>
            </button>
          </div>
        </div>

        {/* Suggestions métier cliquables en 1 clic */}
        {jobSuggestions && jobSuggestions.competences.length > 0 && (
          <div className="p-3.5 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-950 dark:text-blue-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Compétences recommandées pour {jobSuggestions.metier || 'votre métier'} :</span>
              </span>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">1 clic pour ajouter</span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {jobSuggestions.competences.map((comp, idx) => {
                const isAdded = skList.some((s) => s.nom.toLowerCase() === comp.toLowerCase());
                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isAdded}
                    onClick={() => {
                      if (!isAdded) {
                        const newSkill: CompetenceItem = {
                          id: `sk-job-${Date.now()}-${idx}`,
                          nom: comp,
                          niveau: 8,
                          listSousCompetences: []
                        };
                        updateSk([...skList, newSkill]);
                      }
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                      isAdded
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 opacity-70 cursor-default'
                        : 'bg-white dark:bg-neutral-800 text-blue-700 dark:text-blue-300 hover:bg-blue-600 hover:text-white border border-blue-200 dark:border-blue-800 cursor-pointer shadow-xs'
                    }`}
                  >
                    {isAdded ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Plus className="w-3 h-3" />}
                    <span>{comp}</span>
                  </button>
                );
              })}
            </div>

            {jobSuggestions.outils && jobSuggestions.outils.length > 0 && (
              <div className="pt-2 border-t border-blue-200/50 dark:border-blue-900/40">
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Outils & environnements associés :
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {jobSuggestions.outils.map((tool, tIdx) => {
                    const isAdded = skList.some(
                      (s) => s.nom.toLowerCase() === tool.toLowerCase() ||
                             (s.listSousCompetences && s.listSousCompetences.some(sub => sub.nom.toLowerCase() === tool.toLowerCase()))
                    );
                    return (
                      <button
                        key={tIdx}
                        type="button"
                        disabled={isAdded}
                        onClick={() => {
                          if (!isAdded) {
                            const newSkill: CompetenceItem = {
                              id: `sk-tool-${Date.now()}-${tIdx}`,
                              nom: tool,
                              niveau: 8,
                              listSousCompetences: []
                            };
                            updateSk([...skList, newSkill]);
                          }
                        }}
                        className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all flex items-center gap-1 ${
                          isAdded
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 opacity-60 cursor-default'
                            : 'bg-white dark:bg-neutral-800 text-slate-700 dark:text-slate-300 hover:bg-slate-900 hover:text-white dark:hover:bg-slate-100 dark:hover:text-black border border-slate-200 dark:border-neutral-700 cursor-pointer'
                        }`}
                      >
                        {isAdded ? '✓' : '+'} {tool}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Disposition & Présentation des compétences */}
        <div className="p-3 bg-neutral-50 dark:bg-neutral-900/60 rounded-xl border border-black/10 dark:border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-black dark:text-white flex items-center gap-1.5">
              <span>Disposition graphique des compétences sur le CV</span>
              <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-1.5 py-0.5 rounded">15 options</span>
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5">
            {[
              { id: 'tech-cards', label: 'Cartes Tech (Mod. 51-55)', icon: '🚀', highlight: true },
              { id: 'icon-card-grid', label: 'Cartes Icônes (Mod. 56-60)', icon: '🗂️' },
              { id: 'cards-modern', label: 'Cartes Modernes', icon: '🎴' },
              { id: 'grid', label: 'Grille 2 Colonnes', icon: '⊞' },
              { id: 'grid-3', label: 'Grille 3 Col. (Compact)', icon: '▦' },
              { id: 'minimal-cards', label: 'Cartes Épurées', icon: '◻️' },
              { id: 'pill-bars', label: 'Pilules avec Jauge', icon: '💊' },
              { id: 'badges', label: 'Badges Flottants', icon: '🏷️' },
              { id: 'badges-multicolor', label: 'Badges Bicolores', icon: '🎨' },
              { id: 'progress', label: 'Barres de Progression', icon: '📊' },
              { id: 'stars', label: 'Étoiles d\'Évaluation', icon: '⭐' },
              { id: 'circular-progress', label: 'Jauges Circulaires', icon: '🍩' },
              { id: 'tags', label: 'Tags / Hashtags', icon: '#️⃣' },
              { id: 'striped-table', label: 'Lignes Zébrées', icon: '📑' },
              { id: 'list', label: 'Liste à Puces', icon: '📋' },
            ].map((layout) => {
              const isActive = (cv.styleCompetences || 'grid') === layout.id;
              return (
                <button
                  key={layout.id}
                  type="button"
                  onClick={() => onChangeCV({ ...cv, styleCompetences: layout.id as any })}
                  className={`px-2 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-xs'
                      : layout.highlight
                      ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800'
                      : 'bg-white dark:bg-black/40 text-neutral-700 dark:text-neutral-300 border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30'
                  }`}
                >
                  <span className="shrink-0">{layout.icon}</span>
                  <span className="truncate">{layout.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Style d'affichage des notes et niveaux */}
        <div className="p-3 bg-neutral-50 dark:bg-neutral-900/60 rounded-xl border border-black/10 dark:border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-black dark:text-white flex items-center gap-1.5">
              <span>Format d'affichage des notes & niveaux sur le CV</span>
              <span className="text-[10px] font-normal opacity-70">(8 options disponibles)</span>
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {[
              { id: 'progress', label: 'Barres %', icon: '📊' },
              { id: 'stars', label: 'Étoiles ★', icon: '⭐' },
              { id: 'numeric', label: 'Note (8/10)', icon: '🔢' },
              { id: 'percentage', label: 'Pourcentage %', icon: '💯' },
              { id: 'dots', label: 'Pastilles ●', icon: '⚪' },
              { id: 'segmented', label: 'Segmentée', icon: '📶' },
              { id: 'badge-text', label: 'Badges texte', icon: '🏷️' },
              { id: 'none', label: 'Sans note', icon: '🚫' },
            ].map((st) => {
              const isActive = (cv.styleNiveauCompetence || 'progress') === st.id;
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => onChangeCV({ ...cv, styleNiveauCompetence: st.id as any })}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-xs'
                      : 'bg-white dark:bg-black/40 text-neutral-700 dark:text-neutral-300 border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30'
                  }`}
                >
                  <span>{st.icon}</span>
                  <span className="truncate">{st.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {skList.map((sk, idx) => (
          <div
            key={sk.id || `wiz-sk-${idx}`}
            className="bg-white dark:bg-black p-4 rounded-xl border border-black/10 dark:border-white/10 shadow-xs space-y-3"
          >
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-[200px]">
                <ClearableInput
                  value={sk.nom}
                  onChange={(e) => {
                    const list = [...skList];
                    list[idx] = { ...list[idx], nom: e.target.value };
                    updateSk(list);
                  }}
                  onClear={() => {
                    const list = [...skList];
                    list[idx] = { ...list[idx], nom: '' };
                    updateSk(list);
                  }}
                  placeholder="Ex: Développement Web Full-Stack"
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-black dark:text-white font-bold outline-none focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10"
                />
              </div>

              <div className="flex items-center gap-2 bg-neutral-50 dark:bg-neutral-900 px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 shrink-0">
                <span className="text-xs font-bold text-neutral-500">Niveau:</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={sk.niveau ?? 8}
                  onChange={(e) => {
                    const list = [...skList];
                    list[idx] = { ...list[idx], niveau: parseInt(e.target.value) };
                    updateSk(list);
                  }}
                  className="w-20 accent-black dark:accent-white cursor-pointer"
                />
                <div className="min-w-[75px] flex items-center justify-end">
                  <SkillLevelRenderer
                    niveau={sk.niveau ?? 8}
                    styleNiveau={cv.styleNiveauCompetence || 'progress'}
                    couleur={cv.couleurJaugeNiveau || cv.themeCouleurPrincipale}
                    showLabel={false}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => updateSk(skList.filter((_, i) => i !== idx))}
                className="p-2 text-neutral-400 hover:text-red-500 rounded-lg cursor-pointer transition-colors shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="border-t border-black/10 dark:border-white/10 pt-2.5">
              <SubCompetenceManager
                items={sk.listSousCompetences || []}
                onChange={(newSubs) => {
                  const list = [...skList];
                  list[idx] = { ...list[idx], listSousCompetences: newSubs };
                  updateSk(list);
                }}
                langue={langue}
                label="Outils & Sous-compétences associés (Cliquer pour ajouter / noter)"
                placeholder="Ex: React, Node.js, Docker, Tailwind..."
                allowRating={true}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  // STEP 5: LANGUES
  const renderLanguesStep = () => {
    const langSec = cv.sections.find((s) => s.type === 'langues');
    const langList: LangueItem[] = Array.isArray(langSec?.contenu) ? langSec.contenu : [];

    const updateLang = (newList: LangueItem[]) => {
      updateSectionContent('langues', 'Langues Parlées', newList);
    };

    const addLang = () => {
      const newL: LangueItem = {
        id: `lang-${Date.now()}`,
        langue: 'Français',
        niveau: 'Langue maternelle'
      };
      updateLang([...langList, newL]);
    };

    return (
      <div className="space-y-4 animate-fadeIn">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-black dark:text-white flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <span>Langues Parlées ({langList.length})</span>
          </h3>
          <button
            type="button"
            onClick={addLang}
            className="px-3 py-1.5 bg-black text-white dark:bg-white dark:text-black hover:opacity-90 rounded-lg text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ajouter une Langue</span>
          </button>
        </div>

        {langList.map((l, idx) => (
          <div
            key={l.id || `wiz-lang-${idx}`}
            className="bg-white dark:bg-black p-3.5 rounded-xl border border-black/10 dark:border-white/10 shadow-xs flex flex-wrap sm:flex-nowrap items-center gap-3"
          >
            <div className="flex-1 min-w-[160px]">
              <ClearableInput
                value={l.langue}
                onChange={(e) => {
                  const list = [...langList];
                  list[idx] = { ...list[idx], langue: e.target.value };
                  updateLang(list);
                }}
                onClear={() => {
                  const list = [...langList];
                  list[idx] = { ...list[idx], langue: '' };
                  updateLang(list);
                }}
                placeholder="Ex: Anglais, Espagnol..."
                className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-black dark:text-white font-bold outline-none focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10"
              />
            </div>

            <select
              value={l.niveau}
              onChange={(e) => {
                const list = [...langList];
                list[idx] = { ...list[idx], niveau: e.target.value };
                updateLang(list);
              }}
              className="flex-1 min-w-[160px] px-3.5 py-2.5 rounded-xl text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-black dark:text-white font-medium outline-none focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10"
            >
              <option value="Langue maternelle">Langue maternelle</option>
              <option value="Bilingue / Courant (C2)">Bilingue / Courant (C2)</option>
              <option value="Avancé / Professionnel (C1)">Avancé / Professionnel (C1)</option>
              <option value="Intermédiaire supérieur (B2)">Intermédiaire supérieur (B2)</option>
              <option value="Intermédiaire (B1)">Intermédiaire (B1)</option>
              <option value="Notions de base (A2)">Notions de base (A2)</option>
            </select>

            <button
              type="button"
              onClick={() => updateLang(langList.filter((_, i) => i !== idx))}
              className="p-2 text-neutral-400 hover:text-red-500 rounded-lg cursor-pointer transition-colors shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    );
  };

  // STEP 6: PROJETS
  const renderProjetsStep = () => {
    const projSec = cv.sections.find((s) => s.type === 'projets');
    const projList: ProjetItem[] = Array.isArray(projSec?.contenu) ? projSec.contenu : [];

    const updateProj = (newList: ProjetItem[]) => {
      updateSectionContent('projets', 'Projets & Réalisations', newList);
    };

    const addProj = () => {
      const newP: ProjetItem = {
        id: `proj-${Date.now()}`,
        titre: 'Nouveau Projet',
        nom: 'Nouveau Projet',
        role: 'Chef de projet / Lead Dev',
        lien: 'https://monprojet.com',
        technologies: 'React, Node.js',
        description: 'Conception et déploiement de la plateforme web.'
      };
      updateProj([...projList, newP]);
    };

    return (
      <div className="space-y-4 animate-fadeIn">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-black dark:text-white flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            <span>Projets & Portfolio ({projList.length})</span>
          </h3>
          <button
            type="button"
            onClick={addProj}
            className="px-3 py-1.5 bg-black text-white dark:bg-white dark:text-black hover:opacity-90 rounded-lg text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ajouter un Projet</span>
          </button>
        </div>

        {projList.map((p, idx) => (
          <div
            key={p.id || `wiz-proj-${idx}`}
            className="bg-white dark:bg-black p-4 sm:p-5 rounded-xl border border-black/10 dark:border-white/10 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-2">
              <span className="text-xs font-bold text-black dark:text-white">
                #{idx + 1} — {p.nom || p.titre || 'Projet'}
              </span>
              <button
                type="button"
                onClick={() => updateProj(projList.filter((_, i) => i !== idx))}
                className="p-1 text-neutral-400 hover:text-red-500 rounded-lg cursor-pointer transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1">Nom du Projet</label>
                <ClearableInput
                  value={p.nom || p.titre || ''}
                  onChange={(e) => {
                    const list = [...projList];
                    list[idx] = { ...list[idx], nom: e.target.value, titre: e.target.value };
                    updateProj(list);
                  }}
                  onClear={() => {
                    const list = [...projList];
                    list[idx] = { ...list[idx], nom: '', titre: '' };
                    updateProj(list);
                  }}
                  placeholder="Ex: Application E-Commerce"
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-black dark:text-white font-bold outline-none focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1">Lien / URL du projet</label>
                <ClearableInput
                  value={p.lien || ''}
                  onChange={(e) => {
                    const list = [...projList];
                    list[idx] = { ...list[idx], lien: e.target.value };
                    updateProj(list);
                  }}
                  onClear={() => {
                    const list = [...projList];
                    list[idx] = { ...list[idx], lien: '' };
                    updateProj(list);
                  }}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-black dark:text-white outline-none focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200">Description du Projet</label>
                  <AISuggestionButton
                    fieldName="description"
                    currentValue={p.description}
                    context={p.nom}
                    fullCvContext={getRichCvContext(`Description du projet: ${p.nom || ''}`)}
                    userTier={userTier}
                    onOpenUpgradeModal={onOpenUpgradeModal}
                    langue={langue}
                    onApplySuggestion={(s) => {
                      const list = [...projList];
                      list[idx] = { ...list[idx], description: s };
                      updateProj(list);
                    }}
                    compact
                  />
                </div>
                <BulletTextInput
                  value={p.description}
                  onChange={(newVal) => {
                    const list = [...projList];
                    list[idx] = { ...list[idx], description: newVal };
                    updateProj(list);
                  }}
                  rows={2}
                  langue={langue}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // STEP 7: EXTRAS (CERTIFICATIONS, LOISIRS, RÉFÉRENCES)
  const renderExtrasStep = () => {
    return (
      <div className="space-y-5 animate-fadeIn">
        {/* Certifications */}
        <div className="bg-white dark:bg-black p-4 sm:p-5 rounded-xl border border-black/10 dark:border-white/10 shadow-xs space-y-3">
          {(() => {
            const certSec = cv.sections.find((s) => s.type === 'certifications');
            const certList: CertificationItem[] = Array.isArray(certSec?.contenu) ? certSec.contenu : [];

            const updateCert = (newList: CertificationItem[]) => {
              updateSectionContent('certifications', 'Certifications & Accréditations', newList);
            };

            const addCert = () => {
              const newC: CertificationItem = {
                id: `cert-${Date.now()}`,
                nom: 'Certification Professionnelle',
                organisme: 'Organisme Certificateur',
                annee: '2023'
              };
              updateCert([...certList, newC]);
            };

            return (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-black dark:text-white flex items-center gap-1.5">
                    <BookmarkCheck className="w-4 h-4" />
                    <span>Certifications & Formations Continues</span>
                  </h4>
                  <button
                    type="button"
                    onClick={addCert}
                    className="px-2.5 py-1 bg-black text-white dark:bg-white dark:text-black rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer hover:opacity-80 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Ajouter</span>
                  </button>
                </div>

                {certList.map((c, idx) => (
                  <div key={c.id || `wiz-cert-${idx}`} className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                    <ClearableInput
                      value={c.nom}
                      onChange={(e) => {
                        const list = [...certList];
                        list[idx] = { ...list[idx], nom: e.target.value };
                        updateCert(list);
                      }}
                      onClear={() => {
                        const list = [...certList];
                        list[idx] = { ...list[idx], nom: '' };
                        updateCert(list);
                      }}
                      placeholder="Nom de la certif"
                      className="w-full px-3 py-2 text-sm bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 text-black dark:text-white font-bold outline-none focus:border-black dark:focus:border-white"
                    />
                    <ClearableInput
                      value={c.organisme}
                      onChange={(e) => {
                        const list = [...certList];
                        list[idx] = { ...list[idx], organisme: e.target.value };
                        updateCert(list);
                      }}
                      onClear={() => {
                        const list = [...certList];
                        list[idx] = { ...list[idx], organisme: '' };
                        updateCert(list);
                      }}
                      placeholder="Organisme"
                      className="w-full px-3 py-2 text-sm bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 text-black dark:text-white outline-none focus:border-black dark:focus:border-white"
                    />
                    <div className="flex items-center gap-2">
                      <ClearableInput
                        value={c.annee}
                        onChange={(e) => {
                          const list = [...certList];
                          list[idx] = { ...list[idx], annee: e.target.value };
                          updateCert(list);
                        }}
                        onClear={() => {
                          const list = [...certList];
                          list[idx] = { ...list[idx], annee: '' };
                          updateCert(list);
                        }}
                        placeholder="Année"
                        className="w-full px-3 py-2 text-sm bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 text-black dark:text-white outline-none focus:border-black dark:focus:border-white"
                      />
                      <button
                        type="button"
                        onClick={() => updateCert(certList.filter((_, index) => index !== idx))}
                        className="p-1.5 text-neutral-400 hover:text-red-500 rounded-lg cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>

        {/* Hobbies / Centres d'intérêt */}
        <div className="bg-white dark:bg-black p-4 sm:p-5 rounded-xl border border-black/10 dark:border-white/10 shadow-xs space-y-3">
          {(() => {
            const intSec = cv.sections.find((s) => s.type === 'interets');
            const intList: InteretItem[] = Array.isArray(intSec?.contenu) ? intSec.contenu : [];

            const updateInt = (newList: InteretItem[]) => {
              updateSectionContent('interets', 'Centres d\'Intérêt', newList);
            };

            const addInt = () => {
              const newI: InteretItem = { id: `int-${Date.now()}`, nom: 'Nouvelle activité' };
              updateInt([...intList, newI]);
            };

            return (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-black dark:text-white flex items-center gap-1.5">
                    <Heart className="w-4 h-4" />
                    <span>Centres d'Intérêt & Loisirs</span>
                  </h4>
                  <button
                    type="button"
                    onClick={addInt}
                    className="px-2.5 py-1 bg-black text-white dark:bg-white dark:text-black rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer hover:opacity-80 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Ajouter</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {intList.map((i, idx) => (
                    <div key={i.id || `wiz-int-${idx}`} className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                      <ClearableInput
                        value={i.nom}
                        onChange={(e) => {
                          const list = [...intList];
                          list[idx] = { ...list[idx], nom: e.target.value };
                          updateInt(list);
                        }}
                        onClear={() => {
                          const list = [...intList];
                          list[idx] = { ...list[idx], nom: '' };
                          updateInt(list);
                        }}
                        placeholder="Sports, Photographie..."
                        className="w-full px-3 py-2 text-sm bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 text-black dark:text-white font-medium outline-none focus:border-black dark:focus:border-white"
                      />
                      <button
                        type="button"
                        onClick={() => updateInt(intList.filter((_, index) => index !== idx))}
                        className="p-1.5 text-neutral-400 hover:text-red-500 rounded-lg cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Références */}
        <div className="bg-white dark:bg-black p-4 sm:p-5 rounded-xl border border-black/10 dark:border-white/10 shadow-xs space-y-3">
          {(() => {
            const refSec = cv.sections.find((s) => s.type === 'references');
            const refList: ReferenceItem[] = Array.isArray(refSec?.contenu) ? refSec.contenu : [];

            const updateRef = (newList: ReferenceItem[]) => {
              updateSectionContent('references', 'Références Professionnelles', newList);
            };

            const addRef = () => {
              const newR: ReferenceItem = {
                id: `ref-${Date.now()}`,
                nomComplet: 'Jean Dupont',
                poste: 'Directeur Général',
                entreprise: 'Entreprise S.A.',
                email: 'jean.dupont@email.com',
                telephone: '+237 600000000'
              };
              updateRef([...refList, newR]);
            };

            return (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-black dark:text-white flex items-center gap-1.5">
                    <PhoneCall className="w-4 h-4" />
                    <span>Références Professionnelles</span>
                  </h4>
                  <button
                    type="button"
                    onClick={addRef}
                    className="px-2.5 py-1 bg-black text-white dark:bg-white dark:text-black rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer hover:opacity-80 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Ajouter</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {refList.map((r, idx) => (
                    <div key={r.id || `wiz-ref-${idx}`} className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                      <ClearableInput
                        value={r.nomComplet || ''}
                        onChange={(e) => {
                          const list = [...refList];
                          list[idx] = { ...list[idx], nomComplet: e.target.value };
                          updateRef(list);
                        }}
                        onClear={() => {
                          const list = [...refList];
                          list[idx] = { ...list[idx], nomComplet: '' };
                          updateRef(list);
                        }}
                        placeholder="Nom du référant"
                        className="w-full px-3 py-2 text-sm bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 text-black dark:text-white font-semibold outline-none focus:border-black dark:focus:border-white"
                      />
                      <ClearableInput
                        value={r.poste || ''}
                        onChange={(e) => {
                          const list = [...refList];
                          list[idx] = { ...list[idx], poste: e.target.value };
                          updateRef(list);
                        }}
                        onClear={() => {
                          const list = [...refList];
                          list[idx] = { ...list[idx], poste: '' };
                          updateRef(list);
                        }}
                        placeholder="Poste / Titre"
                        className="w-full px-3 py-2 text-sm bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 text-black dark:text-white outline-none focus:border-black dark:focus:border-white"
                      />
                      <ClearableInput
                        value={r.entreprise || ''}
                        onChange={(e) => {
                          const list = [...refList];
                          list[idx] = { ...list[idx], entreprise: e.target.value };
                          updateRef(list);
                        }}
                        onClear={() => {
                          const list = [...refList];
                          list[idx] = { ...list[idx], entreprise: '' };
                          updateRef(list);
                        }}
                        placeholder="Entreprise / Organisation"
                        className="w-full px-3 py-2 text-sm bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 text-black dark:text-white outline-none focus:border-black dark:focus:border-white"
                      />
                      <div className="flex items-center gap-2">
                        <ClearableInput
                          value={r.email || r.telephone || ''}
                          onChange={(e) => {
                            const list = [...refList];
                            list[idx] = { ...list[idx], email: e.target.value, telephone: e.target.value };
                            updateRef(list);
                          }}
                          onClear={() => {
                            const list = [...refList];
                            list[idx] = { ...list[idx], email: '', telephone: '' };
                            updateRef(list);
                          }}
                          placeholder="Téléphone / Email"
                          className="w-full px-3 py-2 text-sm bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 text-black dark:text-white outline-none focus:border-black dark:focus:border-white"
                        />
                        <button
                          type="button"
                          onClick={() => updateRef(refList.filter((_, index) => index !== idx))}
                          className="p-1.5 text-neutral-400 hover:text-red-500 rounded-lg cursor-pointer shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    );
  };

  // STEP 8: DESIGN & STYLES
  const renderDesignStep = () => {
    return (
      <div className="space-y-5 animate-fadeIn">
        {/* Layout Columns */}
        <div className="bg-white dark:bg-black p-4 rounded-xl border border-black/10 dark:border-white/10 shadow-xs space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-black dark:text-white flex items-center gap-2">
            <Columns className="w-4 h-4" />
            <span>Format & Structure du CV</span>
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onChangeCV(toggleColumnLayout(cv, 1))}
              className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                (cv.nombreColonnes || 2) === 1
                  ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black font-bold shadow-xs'
                  : 'border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900 text-black dark:text-white'
              }`}
            >
              <div className="text-xs font-bold mb-1">1 Colonne</div>
              <div className="text-[10px] opacity-70">Présentation classique continue.</div>
            </button>
            <button
              type="button"
              onClick={() => onChangeCV(toggleColumnLayout(cv, 2))}
              className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                (cv.nombreColonnes || 2) === 2
                  ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black font-bold shadow-xs'
                  : 'border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900 text-black dark:text-white'
              }`}
            >
              <div className="text-xs font-bold mb-1">2 Colonnes</div>
              <div className="text-[10px] opacity-70">Barre latérale + contenu principal.</div>
            </button>
          </div>

          {(cv.nombreColonnes || 2) === 2 && (
            <div className="pt-2">
              <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">Position de la barre latérale</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => onChangeCV(toggleSidebarPosition(cv, 'gauche'))}
                  className={`p-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    (cv.positionSidebar || 'gauche') === 'gauche'
                      ? 'border-black dark:border-white bg-black text-white dark:bg-white dark:text-black'
                      : 'border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900 text-black dark:text-white'
                  }`}
                >
                  À gauche
                </button>
                <button
                  type="button"
                  onClick={() => onChangeCV(toggleSidebarPosition(cv, 'droite'))}
                  className={`p-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    (cv.positionSidebar || 'gauche') === 'droite'
                      ? 'border-black dark:border-white bg-black text-white dark:bg-white dark:text-black'
                      : 'border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900 text-black dark:text-white'
                  }`}
                >
                  À droite
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Accent Colors */}
        <div className="bg-white dark:bg-black p-4 rounded-xl border border-black/10 dark:border-white/10 shadow-xs space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-black dark:text-white flex items-center gap-2">
            <Palette className="w-4 h-4" />
            <span>Couleur principale d'accentuation</span>
          </h3>
          <div className="flex flex-wrap gap-2.5">
            {ACCENT_COLORS.map((color) => (
              <button
                key={color.hex}
                type="button"
                onClick={() => onChangeCV({ ...cv, couleurAccent: color.hex })}
                className={`w-8 h-8 rounded-full border-2 transition-all cursor-pointer flex items-center justify-center ${
                  cv.couleurAccent === color.hex ? 'border-black dark:border-white scale-110 shadow-md' : 'border-transparent hover:scale-105'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              >
                {cv.couleurAccent === color.hex && <Check className="w-4 h-4 text-white drop-shadow-xs" />}
              </button>
            ))}
          </div>
        </div>

        {/* Font Family */}
        <div className="bg-white dark:bg-black p-4 rounded-xl border border-black/10 dark:border-white/10 shadow-xs space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-black dark:text-white flex items-center gap-2">
            <Type className="w-4 h-4" />
            <span>Typographie & Style de police</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {FONT_OPTIONS.map((font) => (
              <button
                key={font.id}
                type="button"
                onClick={() => onChangeCV({ ...cv, police: font.id })}
                className={`p-2.5 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                  (cv.police || 'Inter') === font.id
                    ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black font-bold shadow-xs'
                    : 'border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900 text-black dark:text-white'
                }`}
              >
                <div className="font-semibold" style={{ fontFamily: font.family }}>{font.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Photo Shape */}
        <div className="bg-white dark:bg-black p-4 rounded-xl border border-black/10 dark:border-white/10 shadow-xs space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-black dark:text-white flex items-center gap-2">
            <Camera className="w-4 h-4" />
            <span>Format de la photo de profil</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'ronde', label: 'Ronde' },
              { id: 'carree', label: 'Carrée' },
              { id: 'arrondie', label: 'Coins arrondis' },
              { id: 'aucune', label: 'Masquer la photo' }
            ].map((shape) => (
              <button
                key={shape.id}
                type="button"
                onClick={() => {
                  if (shape.id === 'aucune') {
                    onChangeCV({ ...cv, afficherPhoto: false });
                  } else {
                    onChangeCV({ ...cv, shapePhoto: shape.id as any, afficherPhoto: true });
                  }
                }}
                className={`p-2 rounded-lg border text-xs font-bold text-center transition-all cursor-pointer ${
                  (!cv.afficherPhoto && shape.id === 'aucune') || (cv.afficherPhoto && (cv.shapePhoto || 'ronde') === shape.id)
                    ? 'border-black dark:border-white bg-black text-white dark:bg-white dark:text-black shadow-xs'
                    : 'border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900 text-black dark:text-white'
                }`}
              >
                {shape.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // STEP 9: ORDRE ET VISIBILITÉ DES SECTIONS
  const renderSectionsStep = () => {
    return (
      <div className="space-y-5 animate-fadeIn">
        <div className="bg-white dark:bg-black p-4 rounded-xl border border-black/10 dark:border-white/10 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-black dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>Ordre & Emplacement des Sections</span>
              </h3>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                Réorganisez l'ordre des sections et contrôlez leur visibilité.
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            {cv.sections.map((section, idx) => (
              <div
                key={section.id}
                className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
              >
                <div className="flex items-center space-x-2.5">
                  <span className="text-xs font-bold text-black dark:text-white">
                    {section.titre || section.type}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => {
                      if (idx === 0) return;
                      const secs = [...cv.sections];
                      const temp = secs[idx - 1];
                      secs[idx - 1] = secs[idx];
                      secs[idx] = temp;
                      onChangeCV({ ...cv, sections: secs.map((s, i) => ({ ...s, ordre: i + 1 })) });
                    }}
                    className="p-1.5 rounded-lg border border-black/10 dark:border-white/10 text-black dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    disabled={idx === cv.sections.length - 1}
                    onClick={() => {
                      if (idx === cv.sections.length - 1) return;
                      const secs = [...cv.sections];
                      const temp = secs[idx + 1];
                      secs[idx + 1] = secs[idx];
                      secs[idx] = temp;
                      onChangeCV({ ...cv, sections: secs.map((s, i) => ({ ...s, ordre: i + 1 })) });
                    }}
                    className="p-1.5 rounded-lg border border-black/10 dark:border-white/10 text-black dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const secs = cv.sections.map((s) =>
                        s.id === section.id ? { ...s, visible: !s.visible } : s
                      );
                      onChangeCV({ ...cv, sections: secs });
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-colors border ${
                      section.visible
                        ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white'
                        : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 border-black/10 dark:border-white/10'
                    }`}
                  >
                    {section.visible ? 'Visible' : 'Masquée'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col h-full bg-white dark:bg-black border-r border-black/10 dark:border-white/10 text-black dark:text-white overflow-hidden">
      {/* HEADER WIZARD PROGRESS BAR */}
      <div className="bg-white dark:bg-black border-b border-black/10 dark:border-white/10 p-4 shrink-0 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded bg-black text-white dark:bg-white dark:text-black shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-black dark:text-white flex items-center gap-2">
                <span>{langue === 'en' ? 'Step-by-Step CV Assistant' : langue === 'ar' ? 'مساعد تعبئة السيرة الذاتية' : 'Assistant Remplissage Guidé'}</span>
                <span className="text-[10px] bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white px-2 py-0.5 rounded font-bold flex items-center gap-1 border border-black/10 dark:border-white/10">
                  <Wand2 className="w-3 h-3" />
                  <span>IA Active</span>
                </span>
              </h2>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                {`Étape ${currentStepIndex + 1} sur ${STEPS.length} — ${currentStep.title}`}
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-black dark:text-white bg-neutral-100 dark:bg-neutral-900 px-2.5 py-1 rounded border border-black/10 dark:border-white/10">
            {progressPercent}%
          </span>
        </div>

        {/* Linear Progress Bar */}
        <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-900 rounded overflow-hidden">
          <div
            className="h-full bg-black dark:bg-white transition-all duration-300 rounded"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Step Navigation Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isDone = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setCurrentStepIndex(idx)}
                className={`px-3 py-1.5 rounded text-[11px] font-bold shrink-0 transition-all flex items-center space-x-1.5 cursor-pointer border ${
                  isCurrent
                    ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-xs'
                    : isDone
                    ? 'bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white border-black/20 dark:border-white/20'
                    : 'bg-white dark:bg-black text-neutral-500 border-black/10 dark:border-white/10 hover:border-black dark:hover:border-white'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <Icon className="w-3.5 h-3.5" />
                )}
                <span>{step.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP CONTENT BODY */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {renderStepContent()}
      </div>

      {/* WIZARD FOOTER NAVIGATION */}
      <div className="p-4 bg-white dark:bg-black border-t border-black/10 dark:border-white/10 flex items-center justify-between shrink-0">
        <button
          type="button"
          disabled={currentStepIndex === 0}
          onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
          className="px-4 py-2 rounded border border-black/20 dark:border-white/20 text-black dark:text-white text-xs font-bold hover:bg-neutral-100 dark:hover:bg-neutral-900 disabled:opacity-40 disabled:pointer-events-none flex items-center cursor-pointer transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          <span>Précédent</span>
        </button>

        {currentStepIndex < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={handleNextStep}
            className="px-5 py-2 rounded bg-black text-white dark:bg-white dark:text-black hover:opacity-90 text-xs font-bold shadow-xs flex items-center cursor-pointer transition-colors"
          >
            <span>Suivant</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onFinishWizard}
            className="px-5 py-2 rounded bg-black text-white dark:bg-white dark:text-black hover:opacity-90 text-xs font-bold shadow-xs flex items-center cursor-pointer transition-colors"
          >
            <Check className="w-4 h-4 mr-1" />
            <span>Terminer & Générer</span>
          </button>
        )}
      </div>
    </div>
  );
};
