import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate, Link, Navigate } from 'react-router-dom';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  BookOpen,
  HelpCircle,
  Briefcase,
  Play,
  Pause,
  Wrench,
  Compass,
  FileCheck,
  Award,
  ChevronDown,
  Eye,
  X,
  ShieldCheck
} from 'lucide-react';
import { Language, CV, SubscriptionTier } from '../types';
import { getJobLandingPageBySlug, JOB_LANDING_PAGES, SECTEUR_LABELS, JobLandingPage } from '../data/jobLandingPages';
import { CV_TEMPLATES } from '../data/templates';
import { generateJobSampleCV } from '../utils/jobContext';
import { CVPreview } from '../components/CVPreview';
import { trackJobPageView, trackJobCtaClick } from '../utils/jobAnalytics';

interface JobLandingViewProps {
  langue: Language;
  userTier?: SubscriptionTier;
  onCreateCVWithJob: (jobSlug: string, templateId?: string) => void;
  onOpenUpgradeModal?: () => void;
}

export const JobLandingView: React.FC<JobLandingViewProps> = ({
  langue,
  userTier = 'freemium',
  onCreateCVWithJob,
  onOpenUpgradeModal
}) => {
  const { jobSlug } = useParams<{ jobSlug: string }>();
  const navigate = useNavigate();

  // Normalize slug: can come from param like "cv-comptable" or "comptable"
  const normalizedSlug = useMemo(() => {
    if (!jobSlug) return 'cv-comptable';
    const s = jobSlug.toLowerCase();
    return s.startsWith('cv-') ? s : `cv-${s}`;
  }, [jobSlug]);

  const job = useMemo(() => {
    return getJobLandingPageBySlug(normalizedSlug) || JOB_LANDING_PAGES[0];
  }, [normalizedSlug]);

  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // 5-model Carousel with Autoplay
  const [activeTemplateIndex, setActiveTemplateIndex] = useState(0);
  const [isAutoplayActive, setIsAutoplayActive] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const recommendedTemplateIds = useMemo(() => {
    if (job.templatesRecommandes && job.templatesRecommandes.length > 0) {
      return job.templatesRecommandes.slice(0, 5);
    }
    return [job.templateRecommandeId || 'modele-1', 'modele-3', 'modele-7', 'modele-12', 'modele-19'];
  }, [job]);

  useEffect(() => {
    setActiveTemplateIndex(0);
  }, [job.slug]);

  // Autoplay loop: auto scroll every 4.5 seconds when not hovered and active
  useEffect(() => {
    if (!isAutoplayActive || isHovered) {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
      return;
    }

    autoplayTimerRef.current = setInterval(() => {
      setActiveTemplateIndex((prev) => (prev + 1) % recommendedTemplateIds.length);
    }, 4500);

    return () => {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
    };
  }, [isAutoplayActive, isHovered, recommendedTemplateIds.length]);

  const activeTemplateId = recommendedTemplateIds[activeTemplateIndex % recommendedTemplateIds.length] || job.templateRecommandeId || 'modele-1';

  const activeTemplateObj = useMemo(() => {
    return CV_TEMPLATES.find(t => t.id === activeTemplateId) || CV_TEMPLATES[0];
  }, [activeTemplateId]);

  // Generate real sample CV for preview
  const sampleCV = useMemo<CV>(() => {
    return generateJobSampleCV(job, langue, activeTemplateId);
  }, [job, langue, activeTemplateId]);

  // Scaled responsive preview for complete A4 display without any cropping
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState<number>(0.55);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);

  useEffect(() => {
    if (!previewContainerRef.current) return;
    const updateScale = () => {
      if (previewContainerRef.current) {
        const width = previewContainerRef.current.clientWidth;
        if (width > 0) {
          setPreviewScale(width / 794);
        }
      }
    };
    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(previewContainerRef.current);
    return () => observer.disconnect();
  }, [activeTemplateIndex]);

  // Related jobs for internal linking
  const relatedJobs = useMemo(() => {
    const list: JobLandingPage[] = [];
    if (job.metiersConnexes && job.metiersConnexes.length > 0) {
      for (const slug of job.metiersConnexes) {
        const found = getJobLandingPageBySlug(slug);
        if (found && found.slug !== job.slug) list.push(found);
      }
    }
    if (list.length < 4) {
      const sameSector = JOB_LANDING_PAGES.filter(p => p.secteur === job.secteur && p.slug !== job.slug && !list.some(x => x.slug === p.slug));
      list.push(...sameSector.slice(0, 4 - list.length));
    }
    return list;
  }, [job]);

  // SEO: Update document title, meta tags, canonical & JSON-LD
  useEffect(() => {
    const titleText = `CV ${job.metier} : Modèle gratuit, compétences & conseils 2026 | MonCVGratuit`;
    document.title = titleText;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    const descContent = `Créez votre CV de ${job.metier} en 5 min avec le modèle recommandé pour votre secteur. Compétences indispensables : ${job.competencesCles.slice(0, 4).join(', ')}. Conseils d'experts recruteurs.`;
    metaDesc.setAttribute('content', descContent);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    const canonicalHref = `${window.location.origin}/${job.slug}`;
    canonical.setAttribute('href', canonicalHref);

    // Structured data JSON-LD (BreadcrumbList & FAQPage)
    const scriptId = 'job-landing-jsonld';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    const breadcrumbData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Accueil', item: window.location.origin },
        { '@type': 'ListItem', position: 2, name: 'Modèles de CV par Métier', item: `${window.location.origin}/cv-metiers` },
        { '@type': 'ListItem', position: 3, name: `CV ${job.metier}`, item: canonicalHref }
      ]
    };

    const faqs = job.faqs || [];
    const faqData = faqs.length > 0 ? {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(f => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.reponse
        }
      }))
    } : null;

    script.textContent = JSON.stringify(faqData ? [breadcrumbData, faqData] : [breadcrumbData]);

    return () => {
      const el = document.getElementById(scriptId);
      if (el) el.remove();
    };
  }, [job]);

  // Analytics tracking
  useEffect(() => {
    trackJobPageView(job.slug, job.metier, { secteur: job.secteur });
  }, [job.slug, job.metier, job.secteur]);

  const handleStartCV = (templateId?: string) => {
    const targetId = templateId || activeTemplateId;
    trackJobCtaClick(job.slug, job.metier, targetId);
    onCreateCVWithJob(job.slug, targetId);
  };

  const secteurInfo = SECTEUR_LABELS[job.secteur] || SECTEUR_LABELS.autre;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 text-slate-900 dark:text-slate-100 selection:bg-blue-600 selection:text-white pb-28">
      {/* 1. Breadcrumb Bar */}
      <div className="border-b border-slate-200/80 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/80 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
          <nav aria-label="Fil d'Ariane" className="flex items-center gap-1.5 flex-wrap">
            <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Accueil
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link to="/cv-metiers" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Modèles de CV par Métier
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-900 dark:text-white">
              CV {job.metier}
            </span>
          </nav>

          <div className="hidden sm:flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-slate-300 font-medium text-xs">
              <span>{secteurInfo.icon}</span>
              <span>{secteurInfo.fr}</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. GRAND HERO VISUEL : L'IMAGE OCCUPE UNE PLUS GRANDE PARTIE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-10">
        <div className="relative w-full min-h-[380px] sm:min-h-[440px] md:min-h-[480px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-neutral-800 flex flex-col justify-end">
          {/* Image de fond en haute définition occupant tout l'espace */}
          <img
            src={job.imageUrl || 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=80'}
            alt={`Profession ${job.metier}`}
            className="absolute inset-0 w-full h-full object-cover object-center scale-100 hover:scale-102 transition-transform duration-1000 ease-out"
            referrerPolicy="no-referrer"
            loading="eager"
          />

          {/* Dégradé doux et aéré pour assurer la lisibilité tout en libérant l'image */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-slate-950/20" />

          {/* Contenu textuel noble et épuré ancré sur l'image */}
          <div className="relative z-10 p-6 sm:p-10 md:p-14 max-w-3xl text-white">
            <div className="flex flex-wrap items-center gap-2.5 mb-4">
              <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-600/90 text-white backdrop-blur-md shadow-sm">
                {secteurInfo.icon} {secteurInfo.fr}
              </span>
              <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-md flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Format Certifié RH 2026
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight drop-shadow-md">
              CV {job.metier}
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-slate-200 mt-3 leading-relaxed font-normal drop-shadow-sm max-w-2xl">
              {job.descriptionHero || job.accroche}
            </p>

            {/* CTAs principaux dans le Hero */}
            <div className="pt-6 flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={() => handleStartCV(activeTemplateId)}
                className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-bold text-sm sm:text-base rounded-xl shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Créer mon CV ({activeTemplateObj.name})</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#carrousel-modeles"
                className="px-5 py-3.5 bg-white/20 hover:bg-white/30 active:scale-[0.98] text-white font-semibold text-xs sm:text-sm rounded-xl backdrop-blur-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Voir les 5 modèles en action</span>
                <ChevronDown className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION CARROUSEL INTERACTIF AUTO-DÉFILANT */}
      <section id="carrousel-modeles" className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Modèles Recommandés par les Recruteurs</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Choisissez votre style pour {job.metier}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Visualisez le rendu réel et complet A4 de votre CV. Sélectionnez votre modèle pour commencer directement.
            </p>
          </div>

          {/* Autoplay status & control */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsAutoplayActive(prev => !prev)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-200/80 dark:bg-neutral-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-300 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
              title={isAutoplayActive ? 'Mettre en pause le carrousel' : 'Reprendre le défilement automatique'}
            >
              {isAutoplayActive ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Défilement auto actif</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Relancer le défilement</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveTemplateIndex(prev => (prev === 0 ? recommendedTemplateIds.length - 1 : prev - 1))}
                className="w-8 h-8 rounded-full bg-white dark:bg-neutral-800 hover:bg-slate-100 dark:hover:bg-neutral-700 text-slate-700 dark:text-slate-200 flex items-center justify-center transition-all shadow-xs cursor-pointer border border-slate-200 dark:border-neutral-700"
                title="Modèle précédent"
                aria-label="Modèle précédent"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setActiveTemplateIndex(prev => (prev === recommendedTemplateIds.length - 1 ? 0 : prev + 1))}
                className="w-8 h-8 rounded-full bg-white dark:bg-neutral-800 hover:bg-slate-100 dark:hover:bg-neutral-700 text-slate-700 dark:text-slate-200 flex items-center justify-center transition-all shadow-xs cursor-pointer border border-slate-200 dark:border-neutral-700"
                title="Modèle suivant"
                aria-label="Modèle suivant"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Container with Pause on Hover */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-3xl p-4 sm:p-8 shadow-sm relative transition-all"
        >
          {/* 5 Chips Selector with Progress Feedback */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6">
            {recommendedTemplateIds.map((tId, idx) => {
              const tObj = CV_TEMPLATES.find(t => t.id === tId) || CV_TEMPLATES[0];
              const isCurrent = idx === activeTemplateIndex;
              return (
                <button
                  key={tId}
                  type="button"
                  onClick={() => setActiveTemplateIndex(idx)}
                  className={`relative py-2.5 px-3 text-left rounded-xl transition-all cursor-pointer border ${
                    isCurrent
                      ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-500 dark:border-blue-500 text-blue-950 dark:text-blue-200 shadow-sm'
                      : 'bg-slate-50 dark:bg-neutral-800/60 border-slate-200 dark:border-neutral-700/60 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="uppercase tracking-wider opacity-70">Modèle #{idx + 1}</span>
                    {isCurrent && <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />}
                  </div>
                  <div className="font-extrabold text-xs sm:text-sm truncate mt-0.5">
                    {tObj.name}
                  </div>
                  <div className="text-[10px] opacity-60 truncate">
                    {tObj.layoutFamily === 'single-column' ? '1 Colonne' : '2 Colonnes'}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Rendu immersif du CV dans le carrousel */}
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Aperçu du CV centré et agrandi - Affichage A4 complet */}
            <div className="w-full lg:w-3/5 flex flex-col items-center justify-center bg-slate-100 dark:bg-neutral-950/80 rounded-2xl p-4 sm:p-6 border border-slate-200/80 dark:border-neutral-800">
              <div 
                ref={previewContainerRef}
                className="relative w-full max-w-[460px] overflow-hidden bg-white rounded-xl shadow-2xl border border-slate-300 dark:border-neutral-700 select-none group"
                style={{ height: `${Math.round(previewScale * 1122)}px` }}
              >
                <div 
                  className="w-[794px] h-[1122px] origin-top pointer-events-none select-none overflow-hidden bg-white shrink-0"
                  style={{ transform: `scale(${previewScale})` }}
                >
                  <CVPreview cv={sampleCV} interactivePreview={false} />
                </div>

                {/* Overlay hover pour bouton Agrandir */}
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-auto">
                  <button
                    type="button"
                    onClick={() => setIsZoomModalOpen(true)}
                    className="px-4 py-2.5 bg-white text-slate-900 font-bold text-xs rounded-xl shadow-xl hover:bg-slate-50 transition-transform hover:scale-105 flex items-center gap-2 cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-blue-600" />
                    <span>Agrandir / Voir en plein écran</span>
                  </button>
                </div>
              </div>

              {/* Indicateur de visibilité complète */}
              <div className="mt-3 flex items-center justify-between w-full max-w-[460px] text-xs text-slate-500 dark:text-slate-400 px-1">
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Aperçu complet A4 (en-tête, corps & footer)</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsZoomModalOpen(true)}
                  className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Agrandir</span>
                </button>
              </div>
            </div>

            {/* Fiche d'informations du modèle actif */}
            <div className="w-full lg:w-2/5 flex flex-col justify-between space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">
                  <span>Modèle {activeTemplateIndex + 1} sur 5</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  {activeTemplateObj.name}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  {typeof activeTemplateObj.description === 'string'
                    ? activeTemplateObj.description
                    : (activeTemplateObj.description?.[langue] || activeTemplateObj.description?.fr || '')}
                </p>

                <div className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Format : {activeTemplateObj.layoutFamily === 'single-column' ? '1 colonne épurée' : '2 colonnes avec barre latérale'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Conforme aux normes ATS pour les recruteurs en {secteurInfo.fr}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Pré-rempli avec les compétences de {job.metier}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-neutral-800 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => handleStartCV(activeTemplateId)}
                  className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-sm sm:text-base rounded-xl shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Créer mon CV avec {activeTemplateObj.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <span className="text-[11px] text-center text-slate-500 dark:text-slate-400">
                  100% gratuit • Export PDF HD sans filigrane
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECTION ÉPURÉE : L'ESSENTIEL POUR LES RECRUTEURS (DÉCLUTTERED / LIBÉRÉE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Carte Compétences & Outils */}
          <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">
                <Award className="w-4 h-4" />
                <span>Compétences Clés</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                Compétences indispensables pour {job.metier}
              </h3>

              <div className="space-y-2.5">
                {job.competencesCles.map((comp, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-neutral-800/60 border border-slate-200/80 dark:border-neutral-700/60 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2.5"
                  >
                    <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                    <span>{comp}</span>
                  </div>
                ))}
              </div>

              {job.outilsTypiques && job.outilsTypiques.length > 0 && (
                <div className="mt-6">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
                    Logiciels & Outils typiques
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {job.outilsTypiques.map((outil, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold"
                      >
                        {outil}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Amorce de profil */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-neutral-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
                Exemple d'accroche suggérée
              </span>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed">
                « {job.amorceProfil} »
              </p>
            </div>
          </div>

          {/* Carte Conseils & Salaires */}
          <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-2">
                <BookOpen className="w-4 h-4" />
                <span>Conseils Recruteurs</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                Ce qui fait la différence en entretien
              </h3>

              <div className="space-y-3">
                {(job.pointsFortsRecruteurs || []).map((pt, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span className="leading-relaxed">{pt}</span>
                  </div>
                ))}
              </div>

              {/* Salaires indicatifs 2026 */}
              {job.salairesIndicatifs && (
                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-neutral-800">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-3">
                    Salaires indicatifs (France 2026)
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-neutral-800/60 border border-slate-200 dark:border-neutral-700 text-center">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase block">Débutant</span>
                      <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white mt-0.5 block">{job.salairesIndicatifs.debutant}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-center">
                      <span className="text-[10px] font-semibold text-blue-600 uppercase block">Confirmé</span>
                      <span className="text-xs sm:text-sm font-extrabold text-blue-900 dark:text-blue-100 mt-0.5 block">{job.salairesIndicatifs.confirme}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900 text-center">
                      <span className="text-[10px] font-semibold text-purple-600 uppercase block">Senior</span>
                      <span className="text-xs sm:text-sm font-extrabold text-purple-900 dark:text-purple-100 mt-0.5 block">{job.salairesIndicatifs.senior}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mots-clés ATS */}
            {job.motsClesAts && job.motsClesAts.length > 0 && (
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-neutral-800 flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-bold text-slate-500 mr-1">ATS :</span>
                {job.motsClesAts.slice(0, 6).map((kw, kIdx) => (
                  <span
                    key={kIdx}
                    className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-neutral-800 text-[11px] font-medium text-slate-700 dark:text-slate-300"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. SECTION FAQ ÉPURÉE */}
      {job.faqs && job.faqs.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 text-center">
              Questions fréquentes sur le CV de {job.metier}
            </h3>
            <div className="space-y-2.5">
              {job.faqs.map((item, idx) => {
                const isOpen = expandedFaq === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedFaq(isOpen ? null : idx)}
                      className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-neutral-800/40 transition-colors cursor-pointer"
                    >
                      <span>{item.question}</span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-neutral-800 pt-3">
                        {item.reponse}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 6. MÉTIERS CONNEXES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="border-t border-slate-200 dark:border-neutral-800 pt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-blue-600" />
              <span>Autres modèles dans le secteur {secteurInfo.fr}</span>
            </h3>
            <Link
              to="/cv-metiers"
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>Tous les métiers</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {relatedJobs.map((relJob) => (
              <Link
                key={relJob.slug}
                to={`/${relJob.slug}`}
                className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all group flex flex-col justify-between"
              >
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    CV {relJob.metier}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                    {relJob.accroche}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-neutral-800 flex items-center justify-between text-xs font-medium text-blue-600 dark:text-blue-400">
                  <span>Voir le modèle</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 7. BOTTOM STICKY CTA BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-t border-slate-200 dark:border-neutral-800 shadow-xl py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden sm:block">
            <span className="text-xs font-bold text-slate-900 dark:text-white block">
              Prêt à postuler en tant que {job.metier} ?
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Modèle optimisé, compétences clés pré-remplies, téléchargement PDF instantané.
            </span>
          </div>

          <button
            type="button"
            onClick={() => handleStartCV(activeTemplateId)}
            className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Créer mon CV ({activeTemplateObj.name})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modal Agrandir / Plein Écran Haute Définition */}
      {isZoomModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl max-w-4xl w-full max-h-[96vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200 dark:border-neutral-800">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-neutral-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Aperçu Haute Définition • {activeTemplateObj.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  CV {job.metier} • Format A4 réel (210 x 297 mm)
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsZoomModalOpen(false);
                    handleStartCV(activeTemplateId);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span>Créer mon CV</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsZoomModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-neutral-800 hover:bg-slate-200 dark:hover:bg-neutral-700 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                  title="Fermer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto flex justify-center bg-slate-100 dark:bg-neutral-950">
              <div className="w-[794px] min-h-[1122px] bg-white shadow-2xl rounded-sm overflow-hidden shrink-0">
                <CVPreview cv={sampleCV} interactivePreview={false} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const JobLandingRouteWrapper: React.FC<JobLandingViewProps> = (props) => {
  const { jobSlug } = useParams<{ jobSlug: string }>();
  if (!jobSlug) return <Navigate to="/cv-metiers" replace />;

  const normalized = jobSlug.toLowerCase().startsWith('cv-') ? jobSlug.toLowerCase() : `cv-${jobSlug.toLowerCase()}`;
  const found = getJobLandingPageBySlug(normalized);
  if (!found) {
    return <Navigate to="/" replace />;
  }
  return <JobLandingView {...props} />;
};
