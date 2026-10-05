import { SubscriptionTier, FeatureKey, PlanConfig } from '../types';
import {
  isTemplatePaidByAdmin,
  isFontPaidByAdmin,
  isHeaderStylePaidByAdmin,
  isPatternPaidByAdmin,
  isSubOptionPaidByAdmin,
  isStudioMenuPaidByAdmin,
  isStudioTabPaidByAdmin,
  isPaymentActive,
  getAdminPaidMatrixConfig
} from './adminPaidMatrix';
import { CV_TEMPLATES } from '../data/templates';
import { TEMPLATE_PRESETS } from '../data/templatePresets';

/**
 * =========================================================================
 * ARCHITECTURE DU SYSTÈME D'ABONNEMENT ET GATING DE FONCTIONNALITÉS
 * =========================================================================
 * Ce module prépare l'ensemble des règles de restriction par forfait :
 * 1. Freemium : Modèles de base + export PDF standard + édition classique.
 * 2. Classique : Tous les modèles + ensemble des onglets du Creator Studio (couleurs, typo, background, mise en page).
 * 3. Premium : Personnalisation avancée par IA des CV (ciblage d'offres) + Générateur de Lettres de motivation + Optimiseur LinkedIn.
 *
 * NOTE : `ENFORCE_PAYMENT_GATES` est configuré sur `false` par défaut afin
 * de ne rien bloquer prématurément. Dès que le processeur de paiement (Orange/MTN/Stripe)
 * est activé, il suffit de passer ce flag à `true`.
 */

export const ENFORCE_PAYMENT_GATES = true;

// Modèles sélectionnés inclus gratuitement dans le forfait Freemium
export const FREE_TEMPLATE_IDS: string[] = [
  'modele-1',  // Éléonore — Découpe Diagonale
  'modele-2',  // Michel — Ruban Vert
  'modele-3',  // Sacha — Vague Organique
  'modele-4',  // Laura — Minimal Émeraude
  'modele-5',  // Alexandre — Ruban Bicolore
  'modele-6',  // Léa — Arche Studio
  'modele-7',  // Marc — Badges Chocolat
  'modele-8',  // Amélie — Corporate Marine
  'modele-9',  // Thomas — Violet Moderne
  'modele-10', // Claire — Bandeau Latéral & Pastilles
  'modele-11', // Hugo — Bleu Nuit & Blanc
  'modele-12', // Julie — Carte Flottante
  'modele-13', // Lucas — Tech & Coches
  'modele-14', // Alexandre — Bandeau Doré
  'modele-15', // Aurélie — Triangle Bicolore
  'modele-16', // Laura — Vert Forêt & Barres
  'modele-17', // Amélie — Bordeaux & Lignes
  'modele-18', // Noel — Arch Noir & Timeline
  'modele-19', // Joseph — Vague Sarcelle
  'modele-21', // Exécutif Neutre
  'modele-30', // Minimal Saphir
  'modele-31', // Arc Contour Découverte
  'modele-35', // Studio Minimaliste
  'modele-40', // Cartouche Saphir
  'modele-45', // Ligne Épurée
  'modele-51', // Yann Landy Marine & Corail
  'modele-52', // Horizon Bicolore Sky & Slate
  'modele-53', // Nordic Wave Sauge & Menthe
  'modele-54', // Prestige Minimal ATS
  'modele-55', // Baxter Diagonal Indigo & Ambre
  'modele-56', // Océane Aqua Wave
  'modele-57', // Éditorial Exécutif Or & Ardoise
  'modele-58', // Double Vague Lilas & Violet
  'modele-59', // Bandeau Accent Ruby & Framboise
  'modele-60', // Épure Métropolitaine Clean
  'modele-61', // Vague Sommet Solaire Orange
  'modele-archisimple-1', // Noir Épuré ArchiSimple
  'modele-archisimple-2', // Corporate Slate ArchiSimple
  'modele-archisimple-3', // Ligné Studio ArchiSimple
  'modele-archisimple-4', // Académique Garamond ArchiSimple
  'modele-archisimple-5', // Compact Tech ATS ArchiSimple
  // 20 Nouveaux Modèles à Une Colonne (Single Column)
  'sc-minimal-slate',
  'sc-executive-gold',
  'sc-modern-emerald',
  'sc-academic-serif',
  'sc-creative-coral',
  'sc-tech-monospace',
  'sc-luxury-noir',
  'sc-nordic-pure',
  'sc-banner-indigo',
  'sc-ocean-wave',
  'sc-bento-cards',
  'sc-arch-header',
  'sc-editorial-merriweather',
  'sc-compact-ats',
  'sc-metro-pill',
  'sc-burgundy-line',
  'sc-cyan-minimal',
  'sc-gold-double-ring',
  'sc-sylvie-loiseau',
  'sc-baxter-diagonal',
  'ribbon-classic',
  'ribbon-green',
  'ribbon-blue',
  'ribbon-emerald',
  'ribbon-burgundy',
  'ribbon-purple',
  'ribbon-orange',
  'ribbon-teal',
  'ribbon-black',
  'ribbon-minimal',
  'ribbon-modern',
  'student-geometric-1',
  'student-geometric-2',
  'student-geometric-3',
  'student-geometric-4',
  'student-geometric-5',
  'student-geometric-6',
  'student-geometric-7',
  'student-geometric-8',
  'student-geometric-9',
  'student-geometric-10',
  'wave-dual-ocean',
  'wave-coral-sunset',
  'wave-emerald-mint',
  'wave-purple-lavender',
  'wave-midnight-gold',
  'wave-rose-ruby',
  'split-header-indigo-teal',
  'split-header-charcoal-bronze',
  'split-header-navy-coral',
  'split-header-slate-emerald',
  'split-header-burgundy-gold',
  'split-header-violet-cyan',
  'card-floating-minimal',
  'card-dark-executive',
  'card-bento-grid',
  'card-arch-top',
  'card-glassmorphism',
  'card-nordic-clean',
  'timeline-accent-dots',
  'timeline-left-bar',
  'timeline-bicolore',
  'timeline-minimal-slate',
  'timeline-executive-gold',
  'timeline-tech-cyan',
  'photo-hexagon-modern',
  'photo-galet-pebble',
  'photo-double-ring-gold',
  'photo-sidebar-center',
  'photo-badge-inline',
  'photo-diagonal-banner',
  'custom-header-banner',
  'custom-header-modern-split',
  'custom-header-arch',
  'custom-header-sidebar-top',
  'custom-header-baxter',
  'custom-header-minimal',
  'custom-title-double-line',
  'custom-title-badge-header',
  'custom-title-badge-line',
  'custom-title-icon-inline',
  'custom-skills-circular',
  'custom-skills-tech-cards',
  'custom-skills-icon-grid',
  'custom-skills-stars-dots',
  'custom-timeline-line-dots',
  'custom-timeline-thick-bar',
  'custom-timeline-bicolore',
  'custom-photo-hexagone',
  'custom-photo-gold-ring',
  'custom-photo-double-ring'
];

// Configuration complète des forfaits
export const PLANS_CONFIG: Record<SubscriptionTier, PlanConfig> = {
  freemium: {
    id: 'freemium',
    name: 'Freemium',
    badge: 'Gratuit',
    tagline: {
      fr: 'Idéal pour démarrer et créer un premier CV rapidement.',
      en: 'Ideal for getting started and creating a clean first resume.'
    },
    pricing: {
      xaf: 0,
      eur: 0,
      usd: 0,
      billingType: 'free'
    },
    features: [
      'FREE_TEMPLATES',
      'STUDIO_BASIC_EDITION',
      'EXPORT_PDF_STANDARD'
    ],
    highlights: {
      fr: [
        'Sélection de modèles professionnels gratuits',
        'Éditeur de texte et gestion des sections',
        'Exportation PDF standard',
        'Sauvegarde de votre premier CV'
      ],
      en: [
        'Curated selection of free professional templates',
        'Full text editor and section manager',
        'Standard PDF export',
        'Save your primary resume draft'
      ]
    },
    limits: {
      maxCVs: 1,
      allowedTemplateCount: FREE_TEMPLATE_IDS.length,
      allowStudioCustomization: false,
      allowCoverLetter: false,
      allowJobTargeting: false,
      allowLinkedInOptimizer: false,
      pdfExportQuality: 'standard'
    }
  },
  decouverte: {
    id: 'decouverte',
    name: 'Pack Découverte',
    badge: '7 Jours',
    tagline: {
      fr: 'Accès illimité à tous les modèles et au Creator Studio pendant 7 jours.',
      en: 'Unlimited access to all templates and Creator Studio for 7 days.'
    },
    pricing: {
      xaf: 1000,
      eur: 1.50,
      usd: 1.70,
      billingType: 'monthly'
    },
    features: [
      'FREE_TEMPLATES',
      'ALL_TEMPLATES',
      'STUDIO_BASIC_EDITION',
      'STUDIO_FULL_CUSTOMIZATION',
      'CUSTOM_SECTIONS',
      'EXPORT_PDF_STANDARD',
      'EXPORT_PDF_HD',
      'UNLIMITED_CV_SAVES'
    ],
    highlights: {
      fr: [
        'Accès illimité aux 59+ modèles professionnels HD',
        'Creator Studio complet : colonnes, bordures & polices',
        'Export PDF Ultra HD 300 DPI sans restriction',
        'Rubriques et mises en page personnalisées',
        'Valable 7 jours (1 semaine)'
      ],
      en: [
        'Full access to all 59+ HD professional templates',
        'Complete Creator Studio design tools',
        'Ultra HD 300 DPI PDF exports without watermarks',
        'Unlimited custom sections & layouts',
        'Valid for 7 days (1 week)'
      ]
    },
    limits: {
      maxCVs: 5,
      allowedTemplateCount: 'all',
      allowStudioCustomization: true,
      allowCoverLetter: false,
      allowJobTargeting: false,
      allowLinkedInOptimizer: false,
      pdfExportQuality: 'hd_300dpi'
    }
  },
  classique: {
    id: 'classique',
    name: 'Classique',
    badge: 'Populaire',
    tagline: {
      fr: 'Accès illimité à tous les modèles et au Creator Studio complet.',
      en: 'Unlimited access to all templates and full Creator Studio customization.'
    },
    pricing: {
      xaf: 2500,
      eur: 3.80,
      usd: 4.20,
      billingType: 'monthly'
    },
    features: [
      'FREE_TEMPLATES',
      'ALL_TEMPLATES',
      'STUDIO_BASIC_EDITION',
      'STUDIO_FULL_CUSTOMIZATION',
      'CUSTOM_SECTIONS',
      'EXPORT_PDF_STANDARD',
      'EXPORT_PDF_HD',
      'UNLIMITED_CV_SAVES'
    ],
    highlights: {
      fr: [
        'Catalogue complet de plus de 59 modèles',
        'Studio de création avancé (palettes, typographie, arrière-plans)',
        'Mise en page modulaire 1 ou 2 colonnes & espacements sur-mesure',
        'Exportation PDF Haute Définition (300 DPI) multi-pages sans coupure',
        'Création de sections personnalisées illimitées'
      ],
      en: [
        'Full catalog of 59+ unique resume templates',
        'Advanced Creator Studio (palettes, fonts, gradient backgrounds)',
        'Flexible 1 or 2 column layout with custom spacing',
        'Multi-page High-Definition (300 DPI) PDF exports without page cuts',
        'Create unlimited custom sections'
      ]
    },
    limits: {
      maxCVs: 10,
      allowedTemplateCount: 'all',
      allowStudioCustomization: true,
      allowCoverLetter: false,
      allowJobTargeting: false,
      allowLinkedInOptimizer: false,
      pdfExportQuality: 'hd_300dpi'
    }
  },
  premium: {
    id: 'premium',
    name: 'Premium VIP',
    badge: 'Recommandé Pro',
    tagline: {
      fr: 'Le pack complet : Personnalisation avancée des CV, Lettres de motivation & LinkedIn.',
      en: 'The complete suite: Job Offer Targeting, Cover Letter & LinkedIn Optimizer.'
    },
    pricing: {
      xaf: 5000,
      eur: 7.60,
      usd: 8.50,
      billingType: 'monthly'
    },
    features: [
      'FREE_TEMPLATES',
      'ALL_TEMPLATES',
      'STUDIO_BASIC_EDITION',
      'STUDIO_FULL_CUSTOMIZATION',
      'CUSTOM_SECTIONS',
      'CV_AI_JOB_TARGETING',
      'COVER_LETTER_AI',
      'LINKEDIN_OPTIMIZER',
      'DECORATIVE_LAYERS_CUSTOM',
      'EXPORT_PDF_STANDARD',
      'EXPORT_PDF_HD',
      'EXPORT_MULTI_FORMAT',
      'UNLIMITED_CV_SAVES',
      'PRIORITY_SUPPORT'
    ],
    highlights: {
      fr: [
        'Tout ce qui est inclus dans le forfait Classique',
        'Générateur et éditeur de Lettres de Motivation professionnelles',
        'Ciblage automatique de CV adapté à vos offres d’emploi cibles',
        'Optimiseur de profil LinkedIn haute visibilité',
        'Calques décoratifs géométriques et styles personnalisés avancés',
        'Exports multi-formats (PDF HD, JSON, TXT, DOCX)'
      ],
      en: [
        'Everything included in the Classique plan',
        'AI Cover Letter generator & professional editor',
        'Automatic resume adaptation tailored to specific job descriptions',
        'LinkedIn Profile Optimizer for high recruiter visibility',
        'Advanced geometric decorative layers and custom themes',
        'Multi-format exports (HD PDF, JSON, TXT, DOCX)'
      ]
    },
    limits: {
      maxCVs: 50,
      allowedTemplateCount: 'all',
      allowStudioCustomization: true,
      allowCoverLetter: true,
      allowJobTargeting: true,
      allowLinkedInOptimizer: true,
      pdfExportQuality: 'hd_300dpi'
    }
  }
};

// Hiérarchie numérique des forfaits
export const TIER_WEIGHTS: Record<SubscriptionTier, number> = {
  freemium: 0,
  decouverte: 1,
  classique: 1,
  premium: 2
};

/**
 * Compare deux forfaits (retourne true si userTier >= requiredTier)
 */
export function hasRequiredTier(userTier: SubscriptionTier | string = 'freemium', requiredTier: SubscriptionTier): boolean {
  if (!isPaymentActive()) return true;
  const normalizedTier = (userTier || '').toString().toLowerCase();
  if (normalizedTier === 'admin' || normalizedTier === 'premium') return true;
  const userWeight = TIER_WEIGHTS[normalizedTier as SubscriptionTier] ?? 0;
  const reqWeight = TIER_WEIGHTS[requiredTier] ?? 0;
  return userWeight >= reqWeight;
}

/**
 * Détermine le forfait minimal requis pour une fonctionnalité donnée
 */
export function getRequiredTierForFeature(feature: FeatureKey): SubscriptionTier {
  if (!isPaymentActive()) return 'freemium';
  switch (feature) {
    case 'CV_AI_JOB_TARGETING':
    case 'COVER_LETTER_AI':
    case 'LINKEDIN_OPTIMIZER':
    case 'DECORATIVE_LAYERS_CUSTOM':
    case 'EXPORT_MULTI_FORMAT':
    case 'PRIORITY_SUPPORT':
      return 'premium';

    case 'ALL_TEMPLATES':
    case 'STUDIO_FULL_CUSTOMIZATION':
    case 'CUSTOM_SECTIONS':
    case 'EXPORT_PDF_HD':
    case 'UNLIMITED_CV_SAVES':
      return 'classique';

    case 'FREE_TEMPLATES':
    case 'STUDIO_BASIC_EDITION':
    case 'EXPORT_PDF_STANDARD':
    default:
      return 'freemium';
  }
}

/**
 * Vérifie si une fonctionnalité est autorisée pour l'utilisateur
 */
export function isFeatureAllowed(
  userTier: SubscriptionTier | string = 'freemium',
  feature: FeatureKey,
  enforce: boolean = ENFORCE_PAYMENT_GATES
): boolean {
  if (!enforce || !isPaymentActive()) return true;
  const normalizedTier = (userTier || '').toString().toLowerCase();
  if (normalizedTier === 'admin' || normalizedTier === 'premium') return true;
  const requiredTier = getRequiredTierForFeature(feature);
  return hasRequiredTier(normalizedTier, requiredTier);
}

/**
 * Détermine si un modèle de CV est payant (Pro).
 * - Un modèle est payant s'il est configuré payant par l'admin.
 * - S'il n'est pas dans la liste des modèles gratuits.
 */
export function isTemplatePaid(templateId: string): boolean {
  if (!isPaymentActive()) return false;

  const config = getAdminPaidMatrixConfig();
  // If the admin has defined paidTemplates, this is the single source of truth:
  if (config && Array.isArray(config.paidTemplates)) {
    return config.paidTemplates.includes(templateId);
  }

  // Fallback to default FREE_TEMPLATE_IDS list:
  return !FREE_TEMPLATE_IDS.includes(templateId);
}

/**
 * Détermine le forfait minimal requis pour un modèle de CV
 */
export function getRequiredTierForTemplate(templateId: string): SubscriptionTier {
  if (!isPaymentActive()) return 'freemium';
  if (isTemplatePaid(templateId)) {
    return 'classique';
  }
  return 'freemium';
}

/**
 * Vérifie si un modèle de CV est débloqué pour l'utilisateur
 */
export function isTemplateAllowed(
  userTier: SubscriptionTier | string = 'freemium',
  templateId: string,
  enforce: boolean = ENFORCE_PAYMENT_GATES
): boolean {
  if (!enforce || !isPaymentActive()) return true;
  const normalizedTier = (userTier || '').toString().toLowerCase();
  if (normalizedTier === 'admin' || normalizedTier === 'premium') return true;
  const requiredTier = getRequiredTierForTemplate(templateId);
  return hasRequiredTier(normalizedTier, requiredTier);
}

/**
 * Onglets du Creator Studio et leurs restrictions
 */
export const STUDIO_TABS_CONFIG = {
  // Onglets basiques disponibles en Freemium
  freemiumTabs: ['contenu', 'sections', 'apercu'],
  // Onglets avancés nécessitant le forfait Classique
  classiqueTabs: [
    'couleurs',
    'mise-en-page',
    'typographie',
    'arriere-plan',
    'espacements',
    'style-sections',
    'bordures',
    'calques'
  ]
};

/**
 * Détermine le forfait minimal requis pour un onglet du Creator Studio
 */
export function getRequiredTierForStudioTab(tabId: string): SubscriptionTier {
  if (!isPaymentActive()) return 'freemium';
  if (isStudioTabPaidByAdmin(tabId)) {
    return 'classique';
  }
  if (STUDIO_TABS_CONFIG.freemiumTabs.includes(tabId)) {
    return 'freemium';
  }
  return 'classique';
}

/**
 * Vérifie si un onglet du Creator Studio est accessible
 */
export function isStudioTabAllowed(
  userTier: SubscriptionTier = 'freemium',
  tabId: string,
  enforce: boolean = ENFORCE_PAYMENT_GATES
): boolean {
  if (!enforce || !isPaymentActive()) return true;
  const requiredTier = getRequiredTierForStudioTab(tabId);
  return hasRequiredTier(userTier, requiredTier);
}
