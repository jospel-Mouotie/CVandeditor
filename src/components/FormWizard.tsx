import React, { useState, useRef } from 'react';
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
  PersonnaliseeContenu,
  ProjetItem,
  CertificationItem,
  InteretItem,
  ReferenceItem
} from '../types';
import { getTranslation, getLocalizedSectionTitle } from '../i18n/translations';
import { processUploadedImage } from '../utils/imageUpload';
import { toggleColumnLayout, toggleSidebarPosition } from '../state/cvActions';
import { FONT_OPTIONS, ACCENT_COLORS } from '../data/templates';
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
  GripVertical,
  Sliders,
  Palette,
  Type,
  Layout,
  ExternalLink,
  BookmarkCheck,
  Heart,
  PhoneCall,
  Star,
  Check,
  Loader2,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

interface FormWizardProps {
  cv: CV;
  onChangeCV: (updatedCV: CV) => void;
  langue: Language;
  onFinishWizard?: () => void;
}

export const FormWizard: React.FC<FormWizardProps> = ({
  cv,
  onChangeCV,
  langue,
  onFinishWizard
}) => {
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(langue, key);

  const STEPS = [
    {
      id: 'profil',
      title: langue === 'en' ? '1. Profile' : langue === 'ar' ? '1. الملف الشخصي' : '1. Profil',
      icon: User,
      description: langue === 'en' ? 'Personal information, coordinates & photo' : langue === 'ar' ? 'المعلومات الشخصية ومعلومات الاتصال والصورة' : 'Informations personnelles, coordonnées et photo'
    },
    {
      id: 'experience',
      title: langue === 'en' ? '2. Experience' : langue === 'ar' ? '2. Expériences' : '2. Expériences',
      icon: Briefcase,
      description: langue === 'en' ? 'Work history and professional impact' : langue === 'ar' ? 'السجل المهني والإنجازات' : 'Parcours professionnel et réalisations'
    },
    {
      id: 'formation',
      title: langue === 'en' ? '3. Education' : langue === 'ar' ? '3. Formations' : '3. Formations',
      icon: GraduationCap,
      description: langue === 'en' ? 'Degrees, studies and institutions' : langue === 'ar' ? 'الشهادات والدراسات' : 'Diplômes, universités et études'
    },
    {
      id: 'competences',
      title: langue === 'en' ? '4. Skills' : langue === 'ar' ? '4. Compétences' : '4. Compétences',
      icon: Award,
      description: langue === 'en' ? 'Core skills, levels & display styles' : langue === 'ar' ? 'المهارات والمستويات' : 'Savoir-faire, niveaux & styles d\'affichage'
    },
    {
      id: 'langues',
      title: langue === 'en' ? '5. Languages' : langue === 'ar' ? '5. Langues' : '5. Langues',
      icon: Globe,
      description: langue === 'en' ? 'Languages spoken and proficiency' : langue === 'ar' ? 'اللغات ومستويات الإتقان' : 'Langues maîtrisées et niveaux'
    },
    {
      id: 'projets',
      title: langue === 'en' ? '6. Projects' : langue === 'ar' ? '6. المشاريع' : '6. Projets',
      icon: ExternalLink,
      description: langue === 'en' ? 'Key projects, portfolio & tech stack' : langue === 'ar' ? 'المشاريع والإنجازات' : 'Projets majeurs, portfolio et réalisations'
    },
    {
      id: 'certifs_interets',
      title: langue === 'en' ? '7. Extras' : langue === 'ar' ? '7. إضافات' : '7. Certifs & Hobbies',
      icon: BookmarkCheck,
      description: langue === 'en' ? 'Certifications, interests & references' : langue === 'ar' ? 'الشهادات والاهتمامات' : 'Certifications, loisirs et références'
    },
    {
      id: 'design',
      title: langue === 'en' ? '8. Design' : langue === 'ar' ? '8. التصميم' : '8. Design & Styles',
      icon: Palette,
      description: langue === 'en' ? '1/2 Columns, colors, fonts & photo shape' : langue === 'ar' ? 'الأعمدة، الألوان والخطوط' : 'Colonnes 1/2, couleurs, polices et formes'
    },
    {
      id: 'sections',
      title: langue === 'en' ? '9. Order' : langue === 'ar' ? '9. الترتيب' : '9. Ordre & Sections',
      icon: Layers,
      description: langue === 'en' ? 'Reorder sections and column assignment' : langue === 'ar' ? 'إعادة الترتيب والأقسام' : 'Organiser l\'ordre et la visibilité des sections'
    }
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [maxUnlockedStepIndex, setMaxUnlockedStepIndex] = useState(0);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoUploadError, setPhotoUploadError] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const currentStep = STEPS[currentStepIndex];
  const progressPercent = Math.round(((currentStepIndex + 1) / STEPS.length) * 100);

  const handleNextStep = () => {
    if (currentStepIndex < STEPS.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setMaxUnlockedStepIndex((prev) => Math.max(prev, nextIdx));
      setCurrentStepIndex(nextIdx);
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
      console.error('Photo processing error:', err);
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
    let updatedSections = hasProfil
      ? cv.sections.map((s) => s.type === 'profil' ? { ...s, contenu: updatedContenu } : s)
      : [{ id: 'sec-profil-gen', type: 'profil' as const, titre: 'Profil & Coordonnées', ordre: 1, visible: true, contenu: updatedContenu }, ...cv.sections];

    onChangeCV({ ...cv, sections: updatedSections });
  };

  // Section Content Helpers
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

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = cv.sections.findIndex((s) => s.id === active.id);
    const newIndex = cv.sections.findIndex((s) => s.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newSections = [...cv.sections];
      const [moved] = newSections.splice(oldIndex, 1);
      newSections.splice(newIndex, 0, moved);
      const reordered = newSections.map((sec, idx) => ({ ...sec, ordre: idx + 1 }));
      onChangeCV({ ...cv, sections: reordered });
    }
  };

  return (
    <div className="w-full flex flex-col h-full bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 overflow-hidden">
      {/* HEADER WIZARD PROGRESS BAR */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 shrink-0 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                {langue === 'en' ? 'Step-by-Step CV Assistant' : langue === 'ar' ? 'مساعد تعبئة السيرة الذاتية' : 'Assistant Remplissage Guidé'}
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {`Étape ${currentStepIndex + 1} sur ${STEPS.length} — ${currentStep.title}`}
              </p>
            </div>
          </div>
          <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-800">
            {progressPercent}%
          </span>
        </div>

        {/* Linear Progress Bar */}
        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 transition-all duration-300 rounded-full"
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
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold shrink-0 transition-all flex items-center space-x-1.5 cursor-pointer ${
                  isCurrent
                    ? 'bg-blue-600 text-white shadow-xs'
                    : isDone
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Icon className="w-3.5 h-3.5" />
                )}
                <span>{step.title.split('. ')[1]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP CONTENT BODY */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        
        {/* STEP 1: PROFIL & COORDONNÉES */}
        {currentStepIndex === 0 && (
          <div className="space-y-5 animate-fadeIn">
            <div className="bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{getTranslation(langue, 'profileWord')} & {getTranslation(langue, 'profilePhotoWord')}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t('fullName')} *
                  </label>
                  <input
                    type="text"
                    value={profilContenu.nomComplet || ''}
                    onChange={(e) => updateProfil({ nomComplet: e.target.value })}
                    placeholder="ex: Jean DUPONT"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t('jobTitle')} *
                  </label>
                  <input
                    type="text"
                    value={profilContenu.titreProfessionnel || ''}
                    onChange={(e) => updateProfil({ titreProfessionnel: e.target.value })}
                    placeholder="ex: Développeur Full-Stack Senior"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t('email')}
                  </label>
                  <input
                    type="email"
                    value={profilContenu.email || ''}
                    onChange={(e) => updateProfil({ email: e.target.value })}
                    placeholder="contact@email.com"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t('phone')}
                  </label>
                  <input
                    type="tel"
                    value={profilContenu.telephone || ''}
                    onChange={(e) => updateProfil({ telephone: e.target.value })}
                    placeholder="+237 658 60 61 03"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t('address')}
                  </label>
                  <input
                    type="text"
                    value={profilContenu.adresse || ''}
                    onChange={(e) => updateProfil({ adresse: e.target.value })}
                    placeholder="Douala, Cameroun"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    LinkedIn / Portfolio
                  </label>
                  <input
                    type="text"
                    value={profilContenu.linkedin || ''}
                    onChange={(e) => updateProfil({ linkedin: e.target.value })}
                    placeholder="linkedin.com/in/jeandupont"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t('summary')}
                  </label>
                  <textarea
                    rows={3}
                    value={profilContenu.resume || ''}
                    onChange={(e) => updateProfil({ resume: e.target.value })}
                    placeholder="Présentez vos atouts majeurs, votre spécialité et vos objectifs professionnels en 3 ou 4 phrases concises..."
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Photo Import & Controls */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-blue-500" />
                    <span>Photo de Profil</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => onChangeCV({ ...cv, afficherPhoto: cv.afficherPhoto === false })}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      cv.afficherPhoto !== false
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {cv.afficherPhoto !== false ? 'Photo Affichée' : 'Photo Masquée'}
                  </button>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-4">
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
                        className="w-16 h-16 object-cover rounded-xl border-2 border-blue-600 shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => onChangeCV({ ...cv, photoUrl: '' })}
                        className="absolute -top-1 -right-1 bg-red-600 text-white p-1 rounded-full shadow-md hover:bg-red-700 cursor-pointer"
                        title="Supprimer la photo"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-slate-200 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-400 shrink-0">
                      <Camera className="w-6 h-6" />
                    </div>
                  )}

                  <div className="flex-1 space-y-1.5">
                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      disabled={isUploadingPhoto}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
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
        )}

        {/* STEP 2: EXPÉRIENCES */}
        {currentStepIndex === 1 && (
          <div className="space-y-4 animate-fadeIn">
            {(() => {
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
                  description: '• Réalisation des missions clés du poste et encadrement opérationnel.\n• Optimisation de la performance et collaboration d\'équipe.'
                };
                updateExp([...expList, newExp]);
              };

              return (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      <span>Expériences Professionnelles ({expList.length})</span>
                    </h3>
                    <button
                      type="button"
                      onClick={addExp}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Ajouter une Expérience</span>
                    </button>
                  </div>

                  {expList.length === 0 ? (
                    <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 space-y-3">
                      <Briefcase className="w-8 h-8 text-slate-400 mx-auto" />
                      <p className="text-xs text-slate-500 font-bold">Aucune expérience renseignée pour le moment.</p>
                      <button
                        type="button"
                        onClick={addExp}
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer"
                      >
                        Ajouter ma première expérience
                      </button>
                    </div>
                  ) : (
                    expList.map((exp, idx) => (
                      <div
                        key={exp.id || idx}
                        className="bg-white dark:bg-slate-800/90 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3"
                      >
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                          <span className="text-xs font-black text-slate-900 dark:text-white">
                            #{idx + 1} — {exp.poste || 'Poste'}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateExp(expList.filter((_, i) => i !== idx))}
                            className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg cursor-pointer"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-0.5">Poste / Intitulé</label>
                            <input
                              type="text"
                              value={exp.poste}
                              onChange={(e) => {
                                const list = [...expList];
                                list[idx] = { ...list[idx], poste: e.target.value };
                                updateExp(list);
                              }}
                              className="w-full px-3 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-0.5">Entreprise & Ville</label>
                            <input
                              type="text"
                              value={exp.entreprise}
                              onChange={(e) => {
                                const list = [...expList];
                                list[idx] = { ...list[idx], entreprise: e.target.value };
                                updateExp(list);
                              }}
                              className="w-full px-3 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-0.5">Date Début</label>
                            <input
                              type="text"
                              value={exp.dateDebut}
                              onChange={(e) => {
                                const list = [...expList];
                                list[idx] = { ...list[idx], dateDebut: e.target.value };
                                updateExp(list);
                              }}
                              placeholder="ex: 2021"
                              className="w-full px-3 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-0.5">Date Fin (ou Présent)</label>
                            <input
                              type="text"
                              value={exp.dateFin}
                              onChange={(e) => {
                                const list = [...expList];
                                list[idx] = { ...list[idx], dateFin: e.target.value };
                                updateExp(list);
                              }}
                              placeholder="ex: Présent"
                              className="w-full px-3 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-0.5">Description & Accomplissements</label>
                            <textarea
                              rows={3}
                              value={exp.description}
                              onChange={(e) => {
                                const list = [...expList];
                                list[idx] = { ...list[idx], description: e.target.value };
                                updateExp(list);
                              }}
                              className="w-full px-3 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* STEP 3: FORMATIONS */}
        {currentStepIndex === 2 && (
          <div className="space-y-4 animate-fadeIn">
            {(() => {
              const eduSec = cv.sections.find((s) => s.type === 'formation');
              const eduList: FormationItem[] = Array.isArray(eduSec?.contenu) ? eduSec.contenu : [];

              const updateEdu = (newList: FormationItem[]) => {
                updateSectionContent('formation', 'Formations & Diplômes', newList);
              };

              const addEdu = () => {
                const newEdu: FormationItem = {
                  id: `edu-${Date.now()}`,
                  diplome: 'Master / Licence en Ingénierie',
                  etablissement: 'Université / École Supérieure',
                  ville: 'Ville',
                  dateDebut: '2018',
                  dateFin: '2021',
                  description: 'Spécialité Technologies Modernes. Mention Très Bien.'
                };
                updateEdu([...eduList, newEdu]);
              };

              return (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      <span>Formations & Diplômes ({eduList.length})</span>
                    </h3>
                    <button
                      type="button"
                      onClick={addEdu}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Ajouter une Formation</span>
                    </button>
                  </div>

                  {eduList.map((edu, idx) => (
                    <div
                      key={edu.id || idx}
                      className="bg-white dark:bg-slate-800/90 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                        <span className="text-xs font-black text-slate-900 dark:text-white">
                          #{idx + 1} — {edu.diplome || 'Diplôme'}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateEdu(eduList.filter((_, i) => i !== idx))}
                          className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg cursor-pointer"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-0.5">Diplôme / Filière</label>
                          <input
                            type="text"
                            value={edu.diplome}
                            onChange={(e) => {
                              const list = [...eduList];
                              list[idx] = { ...list[idx], diplome: e.target.value };
                              updateEdu(list);
                            }}
                            className="w-full px-3 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-0.5">Établissement / École</label>
                          <input
                            type="text"
                            value={edu.etablissement}
                            onChange={(e) => {
                              const list = [...eduList];
                              list[idx] = { ...list[idx], etablissement: e.target.value };
                              updateEdu(list);
                            }}
                            className="w-full px-3 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-0.5">Date Début - Fin</label>
                          <input
                            type="text"
                            value={edu.dateDebut ? `${edu.dateDebut} - ${edu.dateFin || ''}` : edu.dateFin || ''}
                            onChange={(e) => {
                              const list = [...eduList];
                              list[idx] = { ...list[idx], dateDebut: e.target.value };
                              updateEdu(list);
                            }}
                            placeholder="2018 - 2021"
                            className="w-full px-3 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-0.5">Mention / Détails</label>
                          <input
                            type="text"
                            value={edu.description || ''}
                            onChange={(e) => {
                              const list = [...eduList];
                              list[idx] = { ...list[idx], description: e.target.value };
                              updateEdu(list);
                            }}
                            placeholder="Mention Très Bien, Major de promo..."
                            className="w-full px-3 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        )}

        {/* STEP 4: COMPÉTENCES & STYLES D'AFFICHAGE */}
        {currentStepIndex === 3 && (
          <div className="space-y-4 animate-fadeIn">
            {(() => {
              const skSec = cv.sections.find((s) => s.type === 'competences');
              const skList: CompetenceItem[] = Array.isArray(skSec?.contenu) ? skSec.contenu : [];

              const updateSk = (newList: CompetenceItem[]) => {
                updateSectionContent('competences', 'Compétences', newList);
              };

              const addSkill = () => {
                const newSkill: CompetenceItem = {
                  id: `sk-${Date.now()}`,
                  nom: 'Nouvelle Compétence',
                  niveau: 5
                };
                updateSk([...skList, newSkill]);
              };

              return (
                <div className="space-y-4">
                  {/* Style selector for skills */}
                  <div className="bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Style de Rendu des Compétences :
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'badges', label: 'Badges Pilules' },
                        { id: 'progress', label: 'Jauges / Barres' },
                        { id: 'stars', label: 'Étoiles (1-5)' },
                        { id: 'grid', label: 'Grille Moderne' },
                        { id: 'tags', label: 'Tags Colorés' },
                        { id: 'list', label: 'Liste à Puces' }
                      ].map((style) => (
                        <button
                          key={style.id}
                          type="button"
                          onClick={() => onChangeCV({ ...cv, styleCompetences: style.id as any })}
                          className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                            (cv.styleCompetences || 'badges') === style.id
                              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                              : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {style.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      <span>Liste des Compétences ({skList.length})</span>
                    </h3>
                    <button
                      type="button"
                      onClick={addSkill}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Ajouter une Compétence</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {skList.map((sk, idx) => (
                      <div
                        key={sk.id || idx}
                        className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-wrap items-center gap-3"
                      >
                        <div className="flex-1 min-w-[160px]">
                          <input
                            type="text"
                            value={sk.nom}
                            onChange={(e) => {
                              const list = [...skList];
                              list[idx] = { ...list[idx], nom: e.target.value };
                              updateSk(list);
                            }}
                            className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-slate-500">Niveau (1-10) :</span>
                          <input
                            type="range"
                            min="1"
                            max="10"
                            value={sk.niveau ?? 5}
                            onChange={(e) => {
                              const list = [...skList];
                              list[idx] = { ...list[idx], niveau: parseInt(e.target.value) };
                              updateSk(list);
                            }}
                            className="w-20 accent-blue-600 cursor-pointer"
                          />
                          <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 w-5 text-right">
                            {sk.niveau ?? 5}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => updateSk(skList.filter((_, i) => i !== idx))}
                          className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg cursor-pointer ml-auto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* STEP 5: LANGUES */}
        {currentStepIndex === 4 && (
          <div className="space-y-4 animate-fadeIn">
            {(() => {
              const langSec = cv.sections.find((s) => s.type === 'langues');
              const langList: LangueItem[] = Array.isArray(langSec?.contenu) ? langSec.contenu : [];

              const updateLang = (newList: LangueItem[]) => {
                updateSectionContent('langues', 'Langues', newList);
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
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      <span>Langues Maîtrisées ({langList.length})</span>
                    </h3>
                    <button
                      type="button"
                      onClick={addLang}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Ajouter une Langue</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {langList.map((l, idx) => (
                      <div
                        key={l.id || idx}
                        className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-wrap items-center gap-3"
                      >
                        <div className="flex-1 min-w-[140px]">
                          <input
                            type="text"
                            value={l.langue}
                            onChange={(e) => {
                              const list = [...langList];
                              list[idx] = { ...list[idx], langue: e.target.value };
                              updateLang(list);
                            }}
                            placeholder="ex: Anglais"
                            className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold"
                          />
                        </div>

                        <div className="flex-1 min-w-[160px]">
                          <select
                            value={l.niveau}
                            onChange={(e) => {
                              const list = [...langList];
                              list[idx] = { ...list[idx], niveau: e.target.value };
                              updateLang(list);
                            }}
                            className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium"
                          >
                            <option value="Langue maternelle">Langue maternelle</option>
                            <option value="Bilingue / Courant (C2)">Bilingue / Courant (C2)</option>
                            <option value="Avancé / Professionnel (C1)">Avancé / Professionnel (C1)</option>
                            <option value="Intermédiaire supérieur (B2)">Intermédiaire supérieur (B2)</option>
                            <option value="Intermédiaire (B1)">Intermédiaire (B1)</option>
                            <option value="Notions de base (A2)">Notions de base (A2)</option>
                          </select>
                        </div>

                        <button
                          type="button"
                          onClick={() => updateLang(langList.filter((_, i) => i !== idx))}
                          className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg cursor-pointer ml-auto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* STEP 6: PROJETS & RÉALISATIONS */}
        {currentStepIndex === 5 && (
          <div className="space-y-4 animate-fadeIn">
            {(() => {
              const projSec = cv.sections.find((s) => s.type === 'projets');
              const projList: ProjetItem[] = Array.isArray(projSec?.contenu) ? projSec.contenu : [];

              const updateProj = (newList: ProjetItem[]) => {
                updateSectionContent('projets', 'Projets & Réalisations', newList);
              };

              const addProj = () => {
                const newP: ProjetItem = {
                  id: `proj-${Date.now()}`,
                  titre: 'Application E-Commerce & Paiement Mobile',
                  sousTitre: 'Client Fintech',
                  technologies: 'React, Node.js, Tailwind, Stripe',
                  lien: 'github.com/projet-demo',
                  dateDebut: '2023',
                  description: 'Conception intégrale de la plateforme de vente en ligne avec tableau de bord et intégration API.'
                };
                updateProj([...projList, newP]);
              };

              return (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      <span>Projets & Portfolio ({projList.length})</span>
                    </h3>
                    <button
                      type="button"
                      onClick={addProj}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Ajouter un Projet</span>
                    </button>
                  </div>

                  {projList.length === 0 ? (
                    <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 space-y-3">
                      <ExternalLink className="w-8 h-8 text-slate-400 mx-auto" />
                      <p className="text-xs text-slate-500 font-bold">Aucun projet personnel ou professionnel ajouté.</p>
                      <button
                        type="button"
                        onClick={addProj}
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer"
                      >
                        Ajouter un projet clé
                      </button>
                    </div>
                  ) : (
                    projList.map((p, idx) => (
                      <div
                        key={p.id || idx}
                        className="bg-white dark:bg-slate-800/90 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3"
                      >
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                          <span className="text-xs font-black text-slate-900 dark:text-white">
                            #{idx + 1} — {p.titre || 'Projet'}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateProj(projList.filter((_, i) => i !== idx))}
                            className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-0.5">Titre du Projet</label>
                            <input
                              type="text"
                              value={p.titre}
                              onChange={(e) => {
                                const list = [...projList];
                                list[idx] = { ...list[idx], titre: e.target.value };
                                updateProj(list);
                              }}
                              className="w-full px-3 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-0.5">Technologies / Outils</label>
                            <input
                              type="text"
                              value={p.technologies || ''}
                              onChange={(e) => {
                                const list = [...projList];
                                list[idx] = { ...list[idx], technologies: e.target.value };
                                updateProj(list);
                              }}
                              placeholder="React, TypeScript, Python..."
                              className="w-full px-3 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-0.5">Lien Web / Démo</label>
                            <input
                              type="text"
                              value={p.lien || ''}
                              onChange={(e) => {
                                const list = [...projList];
                                list[idx] = { ...list[idx], lien: e.target.value };
                                updateProj(list);
                              }}
                              placeholder="https://mon-projet.com"
                              className="w-full px-3 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-0.5">Rôle / Contexte</label>
                            <input
                              type="text"
                              value={p.sousTitre || ''}
                              onChange={(e) => {
                                const list = [...projList];
                                list[idx] = { ...list[idx], sousTitre: e.target.value };
                                updateProj(list);
                              }}
                              placeholder="Lead Developer / Projet Open Source"
                              className="w-full px-3 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-0.5">Description du projet</label>
                            <textarea
                              rows={2}
                              value={p.description}
                              onChange={(e) => {
                                const list = [...projList];
                                list[idx] = { ...list[idx], description: e.target.value };
                                updateProj(list);
                              }}
                              className="w-full px-3 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* STEP 7: CERTIFICATIONS, LOISIRS & RÉFÉRENCES */}
        {currentStepIndex === 6 && (
          <div className="space-y-5 animate-fadeIn">
            {/* Certifications */}
            <div className="bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
              {(() => {
                const certSec = cv.sections.find((s) => s.type === 'certifications');
                const certList: CertificationItem[] = Array.isArray(certSec?.contenu) ? certSec.contenu : [];

                const updateCert = (newList: CertificationItem[]) => {
                  updateSectionContent('certifications', 'Certifications & Formations', newList);
                };

                const addCert = () => {
                  const newC: CertificationItem = {
                    id: `cert-${Date.now()}`,
                    nom: 'AWS Certified Solutions Architect',
                    organisme: 'Amazon Web Services',
                    annee: '2023'
                  };
                  updateCert([...certList, newC]);
                };

                return (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <BookmarkCheck className="w-4 h-4 text-blue-500" />
                        <span>Certifications Professionnelles</span>
                      </h4>
                      <button
                        type="button"
                        onClick={addCert}
                        className="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Ajouter</span>
                      </button>
                    </div>

                    {certList.map((c, idx) => (
                      <div key={c.id || idx} className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                        <input
                          type="text"
                          value={c.nom}
                          onChange={(e) => {
                            const list = [...certList];
                            list[idx] = { ...list[idx], nom: e.target.value };
                            updateCert(list);
                          }}
                          placeholder="Nom de la certification"
                          className="px-2.5 py-1 text-xs bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 font-semibold"
                        />
                        <input
                          type="text"
                          value={c.organisme}
                          onChange={(e) => {
                            const list = [...certList];
                            list[idx] = { ...list[idx], organisme: e.target.value };
                            updateCert(list);
                          }}
                          placeholder="Organisme délivreur"
                          className="px-2.5 py-1 text-xs bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700"
                        />
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={c.annee || ''}
                            onChange={(e) => {
                              const list = [...certList];
                              list[idx] = { ...list[idx], annee: e.target.value };
                              updateCert(list);
                            }}
                            placeholder="Année (2023)"
                            className="w-full px-2.5 py-1 text-xs bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700"
                          />
                          <button
                            type="button"
                            onClick={() => updateCert(certList.filter((_, i) => i !== idx))}
                            className="p-1 text-red-500 hover:bg-red-50 rounded cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            {/* Centres d'intérêt */}
            <div className="bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
              {(() => {
                const intSec = cv.sections.find((s) => s.type === 'interets');
                const intList: InteretItem[] = Array.isArray(intSec?.contenu) ? intSec.contenu : [];

                const updateInt = (newList: InteretItem[]) => {
                  updateSectionContent('interets', 'Centres d\'intérêt', newList);
                };

                const addInt = () => {
                  const newI: InteretItem = {
                    id: `int-${Date.now()}`,
                    nom: 'Nouvelle passion',
                    icone: ''
                  };
                  updateInt([...intList, newI]);
                };

                return (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <Heart className="w-4 h-4 text-rose-500" />
                        <span>Centres d'intérêt & Loisirs</span>
                      </h4>
                      <button
                        type="button"
                        onClick={addInt}
                        className="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Ajouter</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {intList.map((it, idx) => (
                        <div key={it.id || idx} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                          <input
                            type="text"
                            value={it.icone || '🎯'}
                            onChange={(e) => {
                              const list = [...intList];
                              list[idx] = { ...list[idx], icone: e.target.value };
                              updateInt(list);
                            }}
                            className="w-10 px-1 py-1 text-center text-xs bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700"
                          />
                          <input
                            type="text"
                            value={it.nom}
                            onChange={(e) => {
                              const list = [...intList];
                              list[idx] = { ...list[idx], nom: e.target.value };
                              updateInt(list);
                            }}
                            placeholder="ex: Natation, IA, Échecs..."
                            className="flex-1 px-2.5 py-1 text-xs bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 font-semibold"
                          />
                          <button
                            type="button"
                            onClick={() => updateInt(intList.filter((_, i) => i !== idx))}
                            className="p-1 text-red-500 hover:bg-red-50 rounded cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Références */}
            <div className="bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
              {(() => {
                const refSec = cv.sections.find((s) => s.type === 'references');
                const refList: ReferenceItem[] = Array.isArray(refSec?.contenu) ? refSec.contenu : [];

                const updateRef = (newList: ReferenceItem[]) => {
                  updateSectionContent('references', 'Références Professionnelles', newList);
                };

                const addRef = () => {
                  const newR: ReferenceItem = {
                    id: `ref-${Date.now()}`,
                    nomComplet: 'Marc Dubois',
                    poste: 'Directeur Technique',
                    entreprise: 'Tech Vision',
                    email: 'marc.dubois@entreprise.com',
                    telephone: '+237 600 00 00 00'
                  };
                  updateRef([...refList, newR]);
                };

                return (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <PhoneCall className="w-4 h-4 text-emerald-500" />
                        <span>Références Professionnelles</span>
                      </h4>
                      <button
                        type="button"
                        onClick={addRef}
                        className="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Ajouter</span>
                      </button>
                    </div>

                    {refList.map((r, idx) => (
                      <div key={r.id || idx} className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                        <input
                          type="text"
                          value={r.nomComplet}
                          onChange={(e) => {
                            const list = [...refList];
                            list[idx] = { ...list[idx], nomComplet: e.target.value };
                            updateRef(list);
                          }}
                          placeholder="Nom complet"
                          className="px-2.5 py-1 text-xs bg-white dark:bg-slate-800 rounded border font-bold"
                        />
                        <input
                          type="text"
                          value={r.poste}
                          onChange={(e) => {
                            const list = [...refList];
                            list[idx] = { ...list[idx], poste: e.target.value };
                            updateRef(list);
                          }}
                          placeholder="Poste & Entreprise"
                          className="px-2.5 py-1 text-xs bg-white dark:bg-slate-800 rounded border"
                        />
                        <input
                          type="email"
                          value={r.email || ''}
                          onChange={(e) => {
                            const list = [...refList];
                            list[idx] = { ...list[idx], email: e.target.value };
                            updateRef(list);
                          }}
                          placeholder="Email professionnel"
                          className="px-2.5 py-1 text-xs bg-white dark:bg-slate-800 rounded border"
                        />
                        <div className="flex items-center gap-2">
                          <input
                            type="tel"
                            value={r.telephone || ''}
                            onChange={(e) => {
                              const list = [...refList];
                              list[idx] = { ...list[idx], telephone: e.target.value };
                              updateRef(list);
                            }}
                            placeholder="Téléphone"
                            className="w-full px-2.5 py-1 text-xs bg-white dark:bg-slate-800 rounded border"
                          />
                          <button
                            type="button"
                            onClick={() => updateRef(refList.filter((_, i) => i !== idx))}
                            className="p-1 text-red-500 hover:bg-red-50 rounded cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* STEP 8: DESIGN, COULEURS, COLONNES & POLICES */}
        {currentStepIndex === 7 && (
          <div className="space-y-5 animate-fadeIn">
            {/* 1. Disposition en Colonnes */}
            <div className="bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
              <label className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Columns className="w-4 h-4 text-blue-600" />
                <span>Disposition du CV (1 Colonne ou 2 Colonnes)</span>
              </label>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onChangeCV(toggleColumnLayout(cv, 1))}
                  className={`py-2.5 px-3 rounded-xl text-xs font-extrabold border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    (cv.nombreColonnes || 2) === 1
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <Layout className="w-4 h-4" />
                  <span>1 Colonne Simple</span>
                </button>
                <button
                  type="button"
                  onClick={() => onChangeCV(toggleColumnLayout(cv, 2))}
                  className={`py-2.5 px-3 rounded-xl text-xs font-extrabold border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    (cv.nombreColonnes || 2) === 2
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <Columns className="w-4 h-4" />
                  <span>2 Colonnes</span>
                </button>
              </div>

              {(cv.nombreColonnes || 2) === 2 && (
                <div className="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => onChangeCV(toggleSidebarPosition(cv, 'gauche'))}
                      className={`py-1.5 px-2.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        (cv.positionSidebar || 'gauche') === 'gauche'
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-slate-50 dark:bg-slate-900 text-slate-600 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      Sidebar à Gauche
                    </button>
                    <button
                      type="button"
                      onClick={() => onChangeCV(toggleSidebarPosition(cv, 'droite'))}
                      className={`py-1.5 px-2.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        (cv.positionSidebar || 'gauche') === 'droite'
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-slate-50 dark:bg-slate-900 text-slate-600 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      Sidebar à Droite
                    </button>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                      <span>Largeur de la colonne latérale :</span>
                      <span className="text-blue-600 font-mono">{cv.largeurColonneGauche || 34}%</span>
                    </div>
                    <input
                      type="range"
                      min="22"
                      max="48"
                      value={cv.largeurColonneGauche || 34}
                      onChange={(e) => onChangeCV({ ...cv, largeurColonneGauche: parseInt(e.target.value) })}
                      className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 2. Palette de Couleurs */}
            <div className="bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
              <label className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Palette className="w-4 h-4 text-purple-600" />
                <span>Couleur Principale / Accent</span>
              </label>

              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {ACCENT_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => onChangeCV({ ...cv, couleurAccent: c.hex })}
                    className={`h-9 rounded-xl border-2 transition-transform hover:scale-105 flex items-center justify-center cursor-pointer ${
                      cv.couleurAccent === c.hex ? 'ring-2 ring-blue-500 scale-105' : ''
                    }`}
                    style={{ backgroundColor: c.hex, borderColor: cv.couleurAccent === c.hex ? '#FFFFFF' : 'transparent' }}
                    title={c.name}
                  >
                    {cv.couleurAccent === c.hex && <Check className="w-4 h-4 text-white drop-shadow" />}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Couleur libre :</span>
                <input
                  type="color"
                  value={cv.couleurAccent || '#2563EB'}
                  onChange={(e) => onChangeCV({ ...cv, couleurAccent: e.target.value })}
                  className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300"
                />
                <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">{cv.couleurAccent}</span>
              </div>
            </div>

            {/* 3. Polices de Caractères */}
            <div className="bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
              <label className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Type className="w-4 h-4 text-emerald-600" />
                <span>Police Typographique</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {FONT_OPTIONS.slice(0, 9).map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => onChangeCV({ ...cv, police: f.id })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer text-left ${
                      (cv.police || 'Inter') === f.id
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                    style={{ fontFamily: f.family }}
                  >
                    {f.id}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Forme & Configuration Complète de la Photo */}
            <div className="bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
              <label className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Camera className="w-4 h-4 text-indigo-600" />
                <span>{langue === 'en' ? 'Profile Photo Customization' : 'Personnalisation Complète de la Photo'}</span>
              </label>

              {/* Photo Size Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                  <span>{langue === 'en' ? 'Photo Size :' : 'Taille de la photo :'}</span>
                  <span className="text-blue-600 font-mono font-black">{cv.photoTaillePx || 80} px</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="160"
                  step="2"
                  value={cv.photoTaillePx || 80}
                  onChange={(e) => onChangeCV({ ...cv, photoTaillePx: parseInt(e.target.value) })}
                  className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
                />
              </div>

              {/* Photo Position */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block">
                  {langue === 'en' ? 'Photo Placement :' : 'Emplacement de la photo :'}
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onChangeCV({ ...cv, photoPosition: 'in-header' })}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      (cv.photoPosition || 'in-header') === 'in-header'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-50 dark:bg-slate-900 text-slate-600 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Dans l'En-tête (Top)
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangeCV({ ...cv, photoPosition: 'in-sidebar' })}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      cv.photoPosition === 'in-sidebar'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-50 dark:bg-slate-900 text-slate-600 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Dans la Sidebar
                  </button>
                </div>
              </div>

              {/* Photo Shapes */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block">
                  {langue === 'en' ? 'Photo Shape :' : 'Forme de la photo :'}
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                  {[
                    { id: 'ronde', label: 'Ronde' },
                    { id: 'carree', label: 'Carrée' },
                    { id: 'arrondie', label: 'Arrondie' },
                    { id: 'arche', label: 'Arche' },
                    { id: 'hexagone', label: 'Hexagone' },
                    { id: 'galet', label: 'Galet' }
                  ].map((shape) => (
                    <button
                      key={shape.id}
                      type="button"
                      onClick={() => onChangeCV({ ...cv, photoForme: shape.id as any })}
                      className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                        (cv.photoForme || 'ronde') === shape.id
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {shape.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Border Thickness & Color */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-100 dark:border-slate-800">
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-slate-600 dark:text-slate-400">
                    <span>Épaisseur de bordure :</span>
                    <span className="text-blue-600 font-mono">{cv.photoBordureEpaisseur ?? 2} px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={cv.photoBordureEpaisseur ?? 2}
                    onChange={(e) => onChangeCV({ ...cv, photoBordureEpaisseur: parseInt(e.target.value) })}
                    className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block">Couleur de bordure :</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={cv.photoBordureCouleur || '#FFFFFF'}
                      onChange={(e) => onChangeCV({ ...cv, photoBordureCouleur: e.target.value })}
                      className="w-7 h-7 rounded-lg cursor-pointer border border-slate-300"
                    />
                    <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                      {cv.photoBordureCouleur || '#FFFFFF'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Style des Titres de Section */}
            <div className="bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
              <label className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-600" />
                <span>Style des Titres de Section</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'underline', label: 'Ligne soulignée' },
                  { id: 'pill', label: 'Pilule / Badge' },
                  { id: 'left-border', label: 'Bordure gauche' },
                  { id: 'double-line', label: 'Double ligne' },
                  { id: 'boxed', label: 'Encadré' },
                  { id: 'minimal', label: 'Minimaliste épuré' }
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => onChangeCV({ ...cv, styleEnTeteSection: st.id as any })}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                      (cv.styleEnTeteSection || 'underline') === st.id
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 9: ORDRE & POSITION DES SECTIONS */}
        {currentStepIndex === 8 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>Ordre & Position des Sections</span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Organisez l'ordre de chaque section et basculez sa colonne (Latérale ou Principale).
              </p>

              {(() => {
                const moveSection = (idx: number, direction: 'up' | 'down') => {
                  const newIdx = direction === 'up' ? idx - 1 : idx + 1;
                  if (newIdx < 0 || newIdx >= cv.sections.length) return;
                  const newSections = [...cv.sections];
                  const [moved] = newSections.splice(idx, 1);
                  newSections.splice(newIdx, 0, moved);
                  onChangeCV({ ...cv, sections: newSections });
                };

                const togglePosition = (secId: string) => {
                  const updated = cv.sections.map((s) => {
                    if (s.id === secId) {
                      const newCol = s.colonne === 'gauche' ? 'droite' : 'gauche';
                      return { ...s, colonne: newCol as any };
                    }
                    return s;
                  });
                  onChangeCV({ ...cv, sections: updated });
                };

                return (
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={cv.sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                      <div className="space-y-2 pt-2">
                        {cv.sections.map((sec, idx) => {
                          const isSidebar = sec.colonne === 'gauche';
                          return (
                            <div
                              key={sec.id}
                              className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-2xs"
                            >
                              <div className="flex items-center space-x-2 flex-1 min-w-0">
                                <GripVertical className="w-4 h-4 text-slate-400 cursor-grab shrink-0" />
                                
                                <div className="flex flex-col gap-0.5 shrink-0">
                                  <button
                                    type="button"
                                    disabled={idx === 0}
                                    onClick={() => moveSection(idx, 'up')}
                                    className="p-1 rounded bg-white dark:bg-slate-800 hover:bg-blue-50 text-slate-600 dark:text-slate-300 disabled:opacity-30 cursor-pointer"
                                  >
                                    <ArrowUp className="w-3 h-3" />
                                  </button>
                                  <button
                                    type="button"
                                    disabled={idx === cv.sections.length - 1}
                                    onClick={() => moveSection(idx, 'down')}
                                    className="p-1 rounded bg-white dark:bg-slate-800 hover:bg-blue-50 text-slate-600 dark:text-slate-300 disabled:opacity-30 cursor-pointer"
                                  >
                                    <ArrowDown className="w-3 h-3" />
                                  </button>
                                </div>

                                <div className="min-w-0 flex-1">
                                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">
                                    {getLocalizedSectionTitle(sec.type, sec.titre, langue)}
                                  </span>
                                  <span className="text-[10px] font-semibold text-slate-400">
                                    {isSidebar ? 'Colonne Latérale / Sidebar' : 'Colonne Principale'}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center space-x-2 shrink-0">
                                {(cv.nombreColonnes || 2) === 2 && (
                                  <button
                                    type="button"
                                    onClick={() => togglePosition(sec.id)}
                                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border cursor-pointer ${
                                      isSidebar
                                        ? 'bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                                        : 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                                    }`}
                                  >
                                    {isSidebar ? 'Sidebar' : 'Principale'}
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = cv.sections.map((s) =>
                                      s.id === sec.id ? { ...s, visible: !s.visible } : s
                                    );
                                    onChangeCV({ ...cv, sections: updated });
                                  }}
                                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border cursor-pointer ${
                                    sec.visible !== false
                                      ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border-emerald-200 dark:border-emerald-800'
                                      : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                                  }`}
                                >
                                  {sec.visible !== false ? 'Visible' : 'Masquée'}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </SortableContext>
                  </DndContext>
                );
              })()}
            </div>
          </div>
        )}
      </div>

      {/* FOOTER WIZARD CONTROLS */}
      <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 shrink-0 flex items-center justify-between">
        <button
          type="button"
          disabled={currentStepIndex === 0}
          onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center space-x-1 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{getTranslation(langue, 'prevButton')}</span>
        </button>

        {currentStepIndex < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={handleNextStep}
            className="px-5 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20 transition-all flex items-center space-x-1.5 cursor-pointer active:scale-98"
          >
            <span>{getTranslation(langue, 'nextButton')}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onFinishWizard}
            className="px-5 py-2.5 rounded-xl text-xs font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20 transition-all flex items-center space-x-1.5 cursor-pointer active:scale-98"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Terminer & Voir le Rendu HD</span>
          </button>
        )}
      </div>
    </div>
  );
};
