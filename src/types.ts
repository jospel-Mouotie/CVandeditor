export type Language = 'fr' | 'en' | 'ar';

export type StatutPaiement = 'NON_PAYE' | 'EN_ATTENTE' | 'EN_ATTENTE_VALIDATION' | 'PAYE';
export type StatutPayment = 'EN_ATTENTE' | 'VALIDE' | 'REJETE';

export interface User {
  id: string;
  nom: string;
  email: string;
  role?: 'USER' | 'ADMIN';
  langue: Language;
  createdAt: string;
}

export interface Section {
  id: string;
  type: 'profil' | 'experience' | 'formation' | 'competences' | 'langues' | 'projets' | 'certifications' | 'interets' | 'references' | 'benevolat' | 'publications' | 'distinctions' | 'qualites' | 'personnalisee';
  titre: string;
  ordre: number;
  visible: boolean;
  colonne?: 'gauche' | 'droite' | 'principale';
  pageBreakBefore?: boolean; // Page break indicator
  isExpanded?: boolean; // accordion state
  contenu: any; // Dynamic content based on section type
  // Optional individual section style overrides
  styleSection?: {
    couleurFond?: string;
    couleurTexte?: string;
    couleurTitre?: string;
    alignementTitre?: 'left' | 'center' | 'right';
    tailleTitre?: number;
    casseTitre?: 'uppercase' | 'capitalize' | 'normal';
    styleEntete?: 'underline' | 'pill' | 'banner' | 'left-border' | 'minimal' | 'boxed' | 'stars' | 'double-line' | 'arch-block' | 'badge-header' | 'badge-line';
    styleCompetences?: 'grid' | 'list' | 'badges' | 'progress' | 'stars' | 'tags' | 'circular-progress' | 'badges-multicolor' | 'tech-cards';
    alignementDates?: 'left' | 'top' | 'inline';
    rayonBordure?: number;
    epaisseurBordure?: number;
    ombre?: 'none' | 'sm' | 'md' | 'lg';
    backgroundType?: 'solid' | 'gradient' | 'pattern' | 'image';
    backgroundOpacity?: number;
    backgroundColorStart?: string;
    backgroundColorEnd?: string;
    backgroundPattern?: string;
    backgroundImage?: string;
  };
}

export interface CVTheme {
  primaryColor: string; // couleurPrincipale / couleurAccent
  secondaryColor?: string;
  backgroundColor?: string;
  sidebarBackgroundColor?: string;
  textColor?: string;
  sidebarTextColor?: string;
  headingColor?: string;
  sidebarHeadingColor?: string;
  headerStyle?: 'banner' | 'clean' | 'card' | 'arch' | 'modern-split' | 'minimal' | 'luxury-gold' | 'ocean-wave' | 'diagonal-split' | 'organic-arch' | 'sidebar-top' | 'tech-arches';
  sectionHeaderStyle?: 'underline' | 'pill' | 'banner' | 'left-border' | 'minimal' | 'boxed' | 'stars' | 'double-line' | 'arch-block' | 'badge-header' | 'badge-line';
  separatorStyle?: 'solid' | 'dashed' | 'dotted' | 'thick' | 'none';
  skillsDisplayMode?: 'grid' | 'list' | 'badges' | 'progress' | 'stars' | 'tags' | 'circular-progress' | 'badges-multicolor' | 'tech-cards';
  experienceDatesAlignment?: 'left' | 'top' | 'inline';
  borderRadiusVal?: number;
  borderWidthVal?: number;
  shadowVal?: 'none' | 'sm' | 'md' | 'lg';
  pageMarginVal?: number;
  columnGapVal?: number;
  photoFrameStyle?: 'ronde' | 'carree' | 'arrondie' | 'hexagone' | 'arche' | 'galet';
  photoBorderColor?: string;
  photoBorderWidth?: number;
  cadrePhotoRing?: 'none' | 'double-ring' | 'gold-ring' | 'accent-ring';
  formeSidebarDecor?: 'straight' | 'arch-top' | 'wave-cut' | 'diagonal-cut' | 'card-float';
  timelineStyle?: 'none' | 'line-dots' | 'accent-pills' | 'left-bar';
  afficherBadgesIcones?: boolean;
  decorBanniereCouleur2?: string;
  decorativeShapes?: 'none' | 'circle-photo' | 'curved-sidebar-cut' | 'diagonal-split';
  photoPosition?: 'in-header' | 'in-sidebar';
}

export interface CV {
  id: string;
  utilisateurId: string;
  titre: string;
  templateId: string;
  langue: Language;
  couleurAccent: string;
  couleurAccentSecondaire?: string;
  // Theme & Layout Overrides for Mode Créateur Libre
  couleurFond?: string;
  couleurFondProfil?: string;
  couleurTexteProfil?: string;
  backgroundType?: 'solid' | 'gradient' | 'pattern' | 'image';
  backgroundOpacity?: number; // 0 to 1
  backgroundColorStart?: string;
  backgroundColorEnd?: string;
  backgroundPattern?: string; // e.g. 'dots' | 'stripes' | 'grid' | 'mesh' | 'waves'
  backgroundImage?: string;

  couleurFondSidebar?: string;
  sidebarBackgroundType?: 'solid' | 'gradient' | 'pattern' | 'image';
  sidebarBackgroundOpacity?: number;
  sidebarBackgroundColorStart?: string;
  sidebarBackgroundColorEnd?: string;
  sidebarBackgroundPattern?: string;
  sidebarBackgroundImage?: string;
  couleurTexte?: string;
  couleurTexteSidebar?: string;
  couleurTitreSection?: string;
  couleurTitreSectionSidebar?: string;
  styleEnTete?: 'banner' | 'clean' | 'card' | 'arch' | 'modern-split' | 'minimal' | 'luxury-gold' | 'ocean-wave' | 'diagonal-split' | 'organic-arch' | 'sidebar-top' | 'tech-arches';
  styleEnTeteSection?: 'underline' | 'pill' | 'banner' | 'left-border' | 'minimal' | 'boxed' | 'stars' | 'double-line' | 'arch-block' | 'badge-header' | 'badge-line';
  styleCompetences?: 'grid' | 'list' | 'badges' | 'progress' | 'stars' | 'tags' | 'circular-progress' | 'badges-multicolor' | 'tech-cards';
  stylePucesListes?: 'disc' | 'square' | 'arrow' | 'check' | 'star' | 'dash' | 'numbered' | 'none';
  alignementDatesExperience?: 'left' | 'top' | 'inline';
  nombreColonnes?: 1 | 2;
  positionSidebar?: 'gauche' | 'droite';
  rayonBordure?: number;
  epaisseurBordure?: number;
  ombreCarte?: 'none' | 'sm' | 'md' | 'lg';
  margeGlobalePage?: number;
  ecartColonnes?: number;
  photoBordureCouleur?: string;
  photoBordureEpaisseur?: number;
  cadrePhotoRing?: 'none' | 'double-ring' | 'gold-ring' | 'accent-ring';
  formeSidebarDecor?: 'straight' | 'arch-top' | 'wave-cut' | 'diagonal-cut' | 'card-float';
  timelineStyle?: 'none' | 'line-dots' | 'accent-pills' | 'left-bar';
  afficherBadgesIcones?: boolean;
  decorBanniereCouleur2?: string;

  // Style Badges Coordonnées & Objets
  styleBadgesCoordonnees?: 'none' | 'pill' | 'rounded' | 'outline' | 'glass' | 'soft-tint' | 'solid-accent';
  couleurFondBadgeCoordonnees?: string;
  opaciteBadgeCoordonnees?: number; // 0.1 to 1
  couleurBordureBadgeCoordonnees?: string;
  tailleBordureBadgeCoordonnees?: number; // 0 to 8 px
  rayonBordureBadgeCoordonnees?: number; // 0 to 30 px
  couleurTexteBadgeCoordonnees?: string;

  // Mode Page Cible & Compactage Automatique
  pageCibleMode?: 'auto' | '1_page' | '2_pages' | 'compact';
  espacementSectionsPx?: number; // 0 to 30 px
  espacementItemsPx?: number; // 0 to 20 px

  // Titres de Sections Personnalisés
  tailleTitreSectionValeur?: number; // 8 to 26 pt
  casseTitreSection?: 'uppercase' | 'capitalize' | 'normal';
  alignementTitreSection?: 'left' | 'center' | 'right';
  grasTitreSection?: 'bold' | 'black' | 'medium' | 'normal';

  police: string;
  policeTitre?: string;
  taillePolice?: string;
  taillePoliceValeur?: number; // 4 to 30 px
  hauteurLigne?: 'tight' | 'normal' | 'relaxed' | 'loose';
  hauteurLigneValeur?: number; // 0.5 to 2.0
  ecartementTexte?: 'tight' | 'normal' | 'wide' | 'widest';
  margeSection?: 'compact' | 'normal' | 'spacious';
  largeurColonneGauche?: number; // 20% to 50%
  margeColonneGauche?: number; // 4px to 40px
  margeColonneDroite?: number; // 4px to 40px
  photoUrl?: string;
  afficherPhoto?: boolean;
  photoForme?: 'ronde' | 'carree' | 'arrondie' | 'hexagone' | 'arche' | 'galet';
  photoTaille?: number; // Size in px e.g. 40-250
  photoPosition?: 'in-header' | 'in-sidebar' | 'free';
  photoAlignement?: 'gauche' | 'centre' | 'droite';
  photoRayon?: number; // Custom border-radius in px (0 to 100)
  photoX?: number; // Position X relative in % (0 to 100)
  photoY?: number; // Position Y relative in % (0 to 100)
  hauteurEnTetePx?: number; // Hauteur de l'en-tête/profil en px (ex: 40 à 300)
  grandTitreMode?: 'nom' | 'poste' | 'custom';
  grandTitreTexte?: string;
  photoZoom?: number;
  photoCropX?: number;
  photoCropY?: number;
  sections: Section[];
  statutPaiement: StatutPaiement;
  // Preservation & Custom adaptation metadata
  isModified?: boolean; // Flag if this CV was tailored/customized for a specific job offer
  parentCvId?: string; // ID of the original source CV
  jobTargetTitle?: string; // Name of targeted position
  jobTargetCompany?: string; // Name of targeted company
  jobMatchRate?: number; // Match rate percentage (e.g. 92)
  adaptedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SavedLetter {
  id: string;
  utilisateurId: string;
  cvId?: string; // Associated source CV ID
  titre: string; // Title given to this letter (e.g. "Lettre Développeur - TotalEnergies")
  destinataire: string; // e.g. "Direction des Ressources Humaines"
  entreprise: string; // e.g. "Société Générale"
  poste: string; // e.g. "Chef de Projet Digital"
  villeDate?: string; // e.g. "Douala, le 15 Août 2026"
  dateCreation: string;
  updatedAt: string;
  langue: Language;
  police?: string;
  taillePolice?: number;
  couleurAccent?: string;
  expediteur: {
    nomComplet: string;
    titreProfessionnel?: string;
    email: string;
    telephone: string;
    adresse: string;
    ville?: string;
  };
  objet: string;
  formulePolitesseEntree: string;
  paragrapheAccroche: string;
  paragrapheValeurAjoutee: string;
  paragrapheAdequationEntreprise: string;
  paragrapheConclusion: string;
  formulePolitesseSortie: string;
  texteComplet: string;
  signature?: string;
}

export interface CustomPreset {
  id: string;
  name: string;
  description?: string;
  updatedAt: string;
  cvData: Partial<CV>;
}

export interface Payment {
  id: string;
  utilisateurId: string;
  cvId: string;
  montant: number; // 100 FCFA
  numeroReception: string; // '658606103' | '653998494'
  numeroExpediteur: string;
  referenceTransaction: string;
  statut: StatutPayment;
  noteAdmin?: string;
  valideLe?: string;
  createdAt: string;
  userEmail?: string;
  userName?: string;
  cvTitle?: string;
}

export * from './types/document';

export type TemplateCategory = 'moderne' | 'classique' | 'creatif' | 'minimaliste' | 'executif' | 'technique';

export interface CVTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  description: {
    fr: string;
    en: string;
  };
  layoutType: string;
  layoutFamily?: 'single-column' | 'two-column-left' | 'two-column-right';
  supportsSecondaryAccent?: boolean;
  defaultAccent: string;
  defaultSecondaryAccent?: string;
  defaultFont: string;
  badgeText?: string;
  previewImage?: string;
  preview?: string;
  // Unified Theme Definition Preset
  themeConfig?: CVTheme;
}

// Section data interfaces
export interface ProfilContenu {
  nomComplet: string;
  titreProfessionnel: string;
  email: string;
  telephone: string;
  adresse: string;
  siteWeb?: string;
  linkedin?: string;
  github?: string;
  dateNaissance?: string;
  permis?: string;
  resume: string;
}

export interface ExperienceItem {
  id: string;
  poste: string;
  entreprise: string;
  ville: string;
  dateDebut: string;
  dateFin: string;
  actuel: boolean;
  description: string;
}

export interface FormationItem {
  id: string;
  diplome: string;
  etablissement: string;
  ville: string;
  dateDebut: string;
  dateFin: string;
  actuel?: boolean;
  description?: string;
}

export interface SubCompetenceItem {
  id: string;
  nom: string;
  note?: number; // 1 to 10 score
}

export interface CompetenceItem {
  id: string;
  nom: string;
  niveau?: number; // 0 to 10
  sousTitre?: string; // e.g. "Développeur Backend"
  categorie?: string;
  description?: string;
  sousCompetences?: string; // Legacy string or raw text
  listSousCompetences?: SubCompetenceItem[]; // Structured array of sub-competences
  styleSousCompetences?: 'badges' | 'puces' | 'tirets' | 'gras' | 'italique' | 'texte_libre' | 'barres';
}

export interface CompetenceGroupe {
  id: string;
  sousTitre?: string;
  competences: CompetenceItem[];
}

export interface LangueItem {
  id: string;
  langue: string;
  niveau: string; // e.g. "Courant (C1)", "Maternelle", "Intermédiaire (B2)"
}

export interface PersonnaliseeContenu {
  typeLayout: 'liste' | 'texte_libre' | 'grille';
  texteLibre?: string;
  items?: Array<{
    id: string;
    titre: string;
    sousTitre?: string;
    date?: string;
    description?: string;
  }>;
}

export interface ProjetItem {
  id: string;
  titre: string;
  sousTitre?: string;
  dateDebut?: string;
  dateFin?: string;
  lien?: string;
  technologies?: string;
  description: string;
}

export interface CertificationItem {
  id: string;
  nom: string;
  organisme: string;
  annee?: string;
  dateObtention?: string;
  idCertification?: string;
  lien?: string;
}

export interface InteretItem {
  id: string;
  nom: string;
  icone?: string;
  details?: string;
}

export interface ReferenceItem {
  id: string;
  nomComplet: string;
  poste: string;
  entreprise: string;
  email?: string;
  telephone?: string;
  relation?: string;
}

export interface BenevolatItem {
  id: string;
  role: string;
  organisation: string;
  ville?: string;
  dateDebut?: string;
  dateFin?: string;
  actuel?: boolean;
  description?: string;
}

export interface PublicationItem {
  id: string;
  titre: string;
  editeurOuRevue?: string;
  datePublication?: string;
  auteurs?: string;
  lien?: string;
  description?: string;
}

export interface DistinctionItem {
  id: string;
  titre: string;
  organisme?: string;
  annee?: string;
  description?: string;
}

export interface QualiteItem {
  id: string;
  nom: string;
  description?: string;
}

// AI Career Tools Types
export interface LettreMotivationResult {
  destinataire?: string;
  entreprise?: string;
  poste?: string;
  objet: string;
  formulePolitesseEntree: string;
  paragrapheAccroche: string;
  paragrapheValeurAjoutee: string;
  paragrapheAdequationEntreprise: string;
  paragrapheConclusion: string;
  formulePolitesseSortie: string;
  texteComplet: string;
}

export interface LinkedInProfileResult {
  titreProfessionnel: string; // Headline percutante
  resumeAPropos: string; // Bio / About
  motsClesStrategiques: string[];
  experiencesOptimisees: Array<{
    poste: string;
    entreprise: string;
    pointsCles: string[];
  }>;
  conseilsVisibilite: string[];
}

export interface JobOfferExtraction {
  titrePoste: string;
  entreprise?: string;
  lieu?: string;
  competencesClesRequises?: string[];
  competencesRequises?: string[];
  pointsFortsDetectes?: string[];
  questionsPrecision?: Array<{
    id: string;
    question: string;
    description: string;
    contexte: string;
  }>;
  questionsPersonnalisees?: Array<{
    id: string;
    question: string;
    description: string;
    contexte: string;
  }>;
}

export type OffreEmploiAnalyse = JobOfferExtraction;

export interface PersonnalisationResult {
  cvModifie?: CV;
  cvPersonnalise?: CV;
  lettreMotivation?: LettreMotivationResult;
  modificationsApportees: string[];
  tauxCorrespondanceEstime: number;
}

export type OffreAdaptationResult = PersonnalisationResult;

export interface LinkedInOptimizationResult {
  titreProfil: string; // Headline
  resumeBio: string; // Bio / About section
  motsClesRecommandes: string[];
  experiencesLinkedIn: Array<{
    titrePoste: string;
    pointsCles: string[];
  }>;
  conseilsVisibilite: string[];
}


