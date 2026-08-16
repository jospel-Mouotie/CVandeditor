import { CVTemplate } from '../types';

export const CV_TEMPLATES: CVTemplate[] = [
  {
    id: 'modele-1',
    name: 'Modèle 1 — Vert Canard (Intérimaire Pro)',
    category: 'moderne',
    description: {
      fr: 'En-tête bleu/vert canard avec titre majuscule, photo sur fond bleu glacé à gauche et mise en page claire.',
      en: 'Teal/cyan top header banner, left ice-blue sidebar with top-left portrait and structured sections.'
    },
    layoutType: 'interimaire-teal',
    layoutFamily: 'two-column-left',
    supportsSecondaryAccent: true,
    defaultAccent: '#006666',
    defaultSecondaryAccent: '#E6F0F2',
    defaultFont: 'Inter',
    badgeText: 'Modèle Photo 1',
    themeConfig: {
      primaryColor: '#006666',
      secondaryColor: '#E6F0F2',
      sidebarBackgroundColor: '#E6F0F2',
      backgroundColor: '#FFFFFF',
      headerStyle: 'banner',
      sectionHeaderStyle: 'underline',
      skillsDisplayMode: 'grid',
      experienceDatesAlignment: 'left'
    }
  },
  {
    id: 'modele-2',
    name: 'Modèle 2 — Prune & Arche (Aïssatou Mdalé)',
    category: 'creatif',
    description: {
      fr: 'Design violet/prune élégant, photo dans une arche arrondie sur fond clair, parfait pour créatifs et artistes.',
      en: 'Deep plum purple background with light arch photo frame and delicate dashed typography.'
    },
    layoutType: 'aissatou-plum',
    layoutFamily: 'two-column-right',
    supportsSecondaryAccent: true,
    defaultAccent: '#381A3C',
    defaultSecondaryAccent: '#EADDF0',
    defaultFont: 'Playfair Display',
    badgeText: 'Modèle Photo 2',
    themeConfig: {
      primaryColor: '#381A3C',
      secondaryColor: '#EADDF0',
      sidebarBackgroundColor: '#381A3C',
      sidebarTextColor: '#FFFFFF',
      backgroundColor: '#FFFFFF',
      headerStyle: 'arch',
      sectionHeaderStyle: 'pill',
      skillsDisplayMode: 'badges',
      experienceDatesAlignment: 'inline'
    }
  },
  {
    id: 'modele-3',
    name: 'Modèle 3 — Cyan & Charbon (Brian Baxter)',
    category: 'executif',
    description: {
      fr: 'Médaillon photo cyan en haut à gauche sur colonne sombre, ligne de temps cyan et jauges de compétences.',
      en: 'Cyan medallion portrait on dark charcoal column with vertical timeline and level meters.'
    },
    layoutType: 'baxter-cyan',
    layoutFamily: 'two-column-left',
    supportsSecondaryAccent: true,
    defaultAccent: '#00B4D8',
    defaultSecondaryAccent: '#22252A',
    defaultFont: 'Outfit',
    badgeText: 'Modèle Photo 3',
    themeConfig: {
      primaryColor: '#00B4D8',
      secondaryColor: '#22252A',
      sidebarBackgroundColor: '#22252A',
      sidebarTextColor: '#FFFFFF',
      backgroundColor: '#FFFFFF',
      headerStyle: 'modern-split',
      sectionHeaderStyle: 'left-border',
      skillsDisplayMode: 'progress',
      experienceDatesAlignment: 'left'
    }
  },
  {
    id: 'modele-4',
    name: 'Modèle 4 — Écusson Violet Central (Infirmière)',
    category: 'classique',
    description: {
      fr: 'Cadre épuré avec écusson violet centré pour les coordonnées, barres de section violettes et style soigné.',
      en: 'Central purple header shield badge with structured purple section dividers.'
    },
    layoutType: 'infirmiere-purple',
    layoutFamily: 'single-column',
    supportsSecondaryAccent: false,
    defaultAccent: '#522166',
    defaultFont: 'Inter',
    badgeText: 'Modèle Photo 4',
    themeConfig: {
      primaryColor: '#522166',
      secondaryColor: '#F3E8FF',
      backgroundColor: '#FFFFFF',
      headerStyle: 'clean',
      sectionHeaderStyle: 'boxed',
      skillsDisplayMode: 'grid',
      experienceDatesAlignment: 'top'
    }
  },
  {
    id: 'modele-5',
    name: 'Modèle 5 — Vagues Océan (Joseph Carlier)',
    category: 'creatif',
    description: {
      fr: 'Motifs de vagues organiques bleu vert en haut et en bas, fond eau doux et lignes pointillées de formation.',
      en: 'Organic ocean wave contours at top and bottom on soft ice-green background.'
    },
    layoutType: 'ocean-wave-carlier',
    layoutFamily: 'single-column',
    supportsSecondaryAccent: false,
    defaultAccent: '#3B8B88',
    defaultFont: 'Lato',
    badgeText: 'Modèle Photo 5',
    themeConfig: {
      primaryColor: '#3B8B88',
      secondaryColor: '#E6F4F1',
      backgroundColor: '#F0FDF4',
      headerStyle: 'clean',
      sectionHeaderStyle: 'double-line',
      skillsDisplayMode: 'progress',
      experienceDatesAlignment: 'inline'
    }
  },
  {
    id: 'modele-6',
    name: 'Modèle 6 — Bleu Roi Intérimaire (Assistant Admin)',
    category: 'moderne',
    description: {
      fr: 'Bandeau bleu roi supérieur avec photo rectangulaire et extrait de profil, jauges de compétences bleues.',
      en: 'Royal blue header banner with portrait, summary block, and progress bar skills column.'
    },
    layoutType: 'interimaire-royal-blue',
    layoutFamily: 'single-column',
    supportsSecondaryAccent: false,
    defaultAccent: '#1D3557',
    defaultFont: 'Inter',
    badgeText: 'Modèle Photo 6',
    themeConfig: {
      primaryColor: '#1D3557',
      secondaryColor: '#F0F4F8',
      backgroundColor: '#FFFFFF',
      headerStyle: 'banner',
      sectionHeaderStyle: 'banner',
      skillsDisplayMode: 'progress',
      experienceDatesAlignment: 'left'
    }
  },
  {
    id: 'modele-7',
    name: 'Modèle 7 — Célia Naudin (Beige Arch & Étoiles)',
    category: 'creatif',
    description: {
      fr: 'Colonne gauche beige sable avec arche photo, typographie soignée et pilules de compétences.',
      en: 'Warm sand arch column on left, serif headlines with star icons and skill tag buttons.'
    },
    layoutType: 'celia-beige-arch',
    layoutFamily: 'two-column-left',
    supportsSecondaryAccent: true,
    defaultAccent: '#D8C3A5',
    defaultSecondaryAccent: '#E8DED1',
    defaultFont: 'Playfair Display',
    badgeText: 'Modèle Photo 7',
    themeConfig: {
      primaryColor: '#D8C3A5',
      secondaryColor: '#E8DED1',
      sidebarBackgroundColor: '#E8DED1',
      backgroundColor: '#FFFFFF',
      headerStyle: 'arch',
      sectionHeaderStyle: 'stars',
      skillsDisplayMode: 'badges',
      experienceDatesAlignment: 'inline'
    }
  },
  {
    id: 'modele-8',
    name: 'Modèle 8 — Hexagone Top Manager (Michael Johnson)',
    category: 'executif',
    description: {
      fr: 'Cadre photo hexagonal au centre-haut de la colonne bleu nuit, lignes verticales d\'accent orange.',
      en: 'Hexagonal portrait frame centered atop dark navy sidebar with bright orange timeline accents.'
    },
    layoutType: 'michael-hexagon-navy',
    layoutFamily: 'two-column-left',
    supportsSecondaryAccent: true,
    defaultAccent: '#1B2A4A',
    defaultSecondaryAccent: '#F4A261',
    defaultFont: 'Outfit',
    badgeText: 'Modèle Photo 8',
    themeConfig: {
      primaryColor: '#1B2A4A',
      secondaryColor: '#F4A261',
      sidebarBackgroundColor: '#1B2A4A',
      sidebarTextColor: '#FFFFFF',
      backgroundColor: '#FFFFFF',
      headerStyle: 'modern-split',
      sectionHeaderStyle: 'left-border',
      skillsDisplayMode: 'grid',
      experienceDatesAlignment: 'left'
    }
  },
  {
    id: 'modele-9',
    name: 'Modèle 9 — Ardoise & Cartes (Exécutif Pro)',
    category: 'executif',
    description: {
      fr: 'En-tête gris ardoise noble, séparateur doré, cartes d\'expériences structurées en double colonne.',
      en: 'Noble slate header with gold accent stripe and clean structured cards.'
    },
    layoutType: 'slate-executive',
    layoutFamily: 'single-column',
    supportsSecondaryAccent: false,
    defaultAccent: '#2D3748',
    defaultFont: 'Roboto',
    badgeText: 'Modèle Photo 9',
    themeConfig: {
      primaryColor: '#2D3748',
      secondaryColor: '#EDF2F7',
      backgroundColor: '#FFFFFF',
      headerStyle: 'banner',
      sectionHeaderStyle: 'underline',
      skillsDisplayMode: 'grid',
      experienceDatesAlignment: 'left'
    }
  },
  {
    id: 'modele-10',
    name: 'Modèle 10 — Studio Minimaliste Noir (Noel Taylor)',
    category: 'minimaliste',
    description: {
      fr: 'Design éditorial ultra moderne noir et blanc, ligne verticale d\'accentuation et typographie d\'auteur.',
      en: 'Ultra modern black and white editorial layout with accent line and modern sans-serif fonts.'
    },
    layoutType: 'minimal-studio-black',
    layoutFamily: 'single-column',
    supportsSecondaryAccent: false,
    defaultAccent: '#1A202C',
    defaultFont: 'Poppins',
    badgeText: 'Modèle Photo 10',
    themeConfig: {
      primaryColor: '#1A202C',
      secondaryColor: '#F7FAFC',
      backgroundColor: '#FFFFFF',
      headerStyle: 'clean',
      sectionHeaderStyle: 'minimal',
      skillsDisplayMode: 'badges',
      experienceDatesAlignment: 'inline'
    }
  },
  {
    id: 'modele-11',
    name: 'Modèle 11 — Bordeaux Royal & Cadre Doré (Luxe Exécutif)',
    category: 'executif',
    description: {
      fr: 'En-tête rouge bordeaux majestueux avec liseré doré et typographie classique raffinée.',
      en: 'Royal burgundy header with gold trim and refined classic typography.'
    },
    layoutType: 'bordeaux-gold-luxury',
    layoutFamily: 'single-column',
    supportsSecondaryAccent: false,
    defaultAccent: '#800020',
    defaultFont: 'Georgia',
    badgeText: 'Modèle Photo 11',
    themeConfig: {
      primaryColor: '#800020',
      secondaryColor: '#FDF2F2',
      backgroundColor: '#FFFFFF',
      headerStyle: 'banner',
      sectionHeaderStyle: 'double-line',
      skillsDisplayMode: 'grid',
      experienceDatesAlignment: 'left'
    }
  },
  {
    id: 'modele-12',
    name: 'Modèle 12 — Vert Émeraude & Cartes (Tech & Consulting)',
    category: 'moderne',
    description: {
      fr: 'Fond vert émeraude profond avec cartes arrondies pour les expériences et barres de progression.',
      en: 'Deep emerald green canvas with rounded cards and skill level bars.'
    },
    layoutType: 'emerald-rounded-tech',
    layoutFamily: 'single-column',
    supportsSecondaryAccent: false,
    defaultAccent: '#064E3B',
    defaultFont: 'Arial',
    badgeText: 'Modèle Photo 12',
    themeConfig: {
      primaryColor: '#064E3B',
      secondaryColor: '#ECFDF5',
      backgroundColor: '#FFFFFF',
      headerStyle: 'clean',
      sectionHeaderStyle: 'pill',
      skillsDisplayMode: 'progress',
      experienceDatesAlignment: 'left'
    }
  },
  {
    id: 'modele-13',
    name: 'Modèle 13 — Terracotta & Géométrie (Marketing & Design)',
    category: 'creatif',
    description: {
      fr: 'Nuances terracotta chaleureuses, bande diagonale moderne et badges de compétences épurés.',
      en: 'Warm terracotta tones with modern diagonal header and skill badges.'
    },
    layoutType: 'terracotta-creative',
    layoutFamily: 'single-column',
    supportsSecondaryAccent: false,
    defaultAccent: '#C2410C',
    defaultFont: 'Montserrat',
    badgeText: 'Modèle Photo 13',
    themeConfig: {
      primaryColor: '#C2410C',
      secondaryColor: '#FFEDD5',
      backgroundColor: '#FFFFFF',
      headerStyle: 'banner',
      sectionHeaderStyle: 'pill',
      skillsDisplayMode: 'badges',
      experienceDatesAlignment: 'inline'
    }
  },
  {
    id: 'modele-14',
    name: 'Modèle 14 — Bleu Marine & Lignes Dorées (Finance & Avocat)',
    category: 'classique',
    description: {
      fr: 'Double colonne équilibrée bleu marine et or, parfaite pour juristes, comptables et cadres.',
      en: 'Balanced navy and gold double column, tailored for lawyers, accountants and managers.'
    },
    layoutType: 'navy-gold-executive',
    layoutFamily: 'two-column-left',
    supportsSecondaryAccent: true,
    defaultAccent: '#0F172A',
    defaultSecondaryAccent: '#D4AF37',
    defaultFont: 'Times New Roman',
    badgeText: 'Modèle Photo 14',
    themeConfig: {
      primaryColor: '#0F172A',
      secondaryColor: '#FEF3C7',
      sidebarBackgroundColor: '#0F172A',
      sidebarTextColor: '#FFFFFF',
      backgroundColor: '#FFFFFF',
      headerStyle: 'banner',
      sectionHeaderStyle: 'double-line',
      skillsDisplayMode: 'grid',
      experienceDatesAlignment: 'left'
    }
  },
  {
    id: 'modele-15',
    name: 'Modèle 15 — Vert Olive Nature (Ingénierie & Développement)',
    category: 'minimaliste',
    description: {
      fr: 'Colonne gauche vert olive pastel apaisant, mise en page aérée et frise chronologique épurée.',
      en: 'Soothing pastel olive sidebar, airy layout and minimal timeline.'
    },
    layoutType: 'olive-nature-engineering',
    layoutFamily: 'two-column-left',
    supportsSecondaryAccent: true,
    defaultAccent: '#3F6212',
    defaultSecondaryAccent: '#ECF3E8',
    defaultFont: 'Calibri',
    badgeText: 'Modèle Photo 15',
    themeConfig: {
      primaryColor: '#3F6212',
      secondaryColor: '#ECF3E8',
      sidebarBackgroundColor: '#ECF3E8',
      backgroundColor: '#FFFFFF',
      headerStyle: 'clean',
      sectionHeaderStyle: 'left-border',
      skillsDisplayMode: 'progress',
      experienceDatesAlignment: 'left'
    }
  },
  {
    id: 'modele-16',
    name: 'Modèle 16 — Vert Canard Executive (Charles Sartré)',
    category: 'executif',
    description: {
      fr: 'Colonne gauche vert canard élégante avec jauges de compétences et certification, colonne principale épurée.',
      en: 'Teal left column with progress bars and certifications, clean right main column.'
    },
    layoutType: 'sartre-teal-executive',
    layoutFamily: 'two-column-left',
    supportsSecondaryAccent: true,
    defaultAccent: '#237A62',
    defaultSecondaryAccent: '#114B3B',
    defaultFont: 'Arial',
    badgeText: 'Nouveau Modèle 16',
    themeConfig: {
      primaryColor: '#237A62',
      secondaryColor: '#E6F4F1',
      sidebarBackgroundColor: '#237A62',
      sidebarTextColor: '#FFFFFF',
      backgroundColor: '#FFFFFF',
      headerStyle: 'banner',
      sectionHeaderStyle: 'underline',
      skillsDisplayMode: 'progress',
      experienceDatesAlignment: 'left'
    }
  },
  {
    id: 'modele-17',
    name: 'Modèle 17 — Dark Navy Arch (Thomas Durant)',
    category: 'executif',
    description: {
      fr: 'En-tête arche bleu nuit avec photo en médaillon supérieur, colonne sombre et section profil soignée.',
      en: 'Dark navy rounded arch header with top circular photo and clean structured profile.'
    },
    layoutType: 'durant-navy-arch',
    layoutFamily: 'two-column-left',
    supportsSecondaryAccent: true,
    defaultAccent: '#0A192F',
    defaultSecondaryAccent: '#1E293B',
    defaultFont: 'Montserrat',
    badgeText: 'Nouveau Modèle 17',
    themeConfig: {
      primaryColor: '#0A192F',
      secondaryColor: '#1E293B',
      sidebarBackgroundColor: '#0A192F',
      sidebarTextColor: '#FFFFFF',
      backgroundColor: '#FFFFFF',
      headerStyle: 'arch',
      sectionHeaderStyle: 'left-border',
      skillsDisplayMode: 'grid',
      experienceDatesAlignment: 'left'
    }
  },
  {
    id: 'modele-18',
    name: 'Modèle 18 — Ardoise & Bannières Dorées',
    category: 'classique',
    description: {
      fr: 'Colonne gauche bleu ardoise avec photo ronde, titres de section surlignés en bannières dorées.',
      en: 'Slate left column with circular portrait, right section headers highlighted with soft gold banners.'
    },
    layoutType: 'slate-gold-banners',
    layoutFamily: 'two-column-left',
    supportsSecondaryAccent: true,
    defaultAccent: '#3A4750',
    defaultSecondaryAccent: '#D4AF37',
    defaultFont: 'Inter',
    badgeText: 'Nouveau Modèle 18',
    themeConfig: {
      primaryColor: '#3A4750',
      secondaryColor: '#FEF3C7',
      sidebarBackgroundColor: '#3A4750',
      sidebarTextColor: '#FFFFFF',
      backgroundColor: '#FFFFFF',
      headerStyle: 'banner',
      sectionHeaderStyle: 'banner',
      skillsDisplayMode: 'grid',
      experienceDatesAlignment: 'left'
    }
  },
  {
    id: 'modele-19',
    name: 'Modèle 19 — Banderole Bleu Roi (Intérimaire Pro)',
    category: 'moderne',
    description: {
      fr: 'En-tête banderole bleu roi majestueux avec photo carrée et résumé, colonne droite bleu glacé avec jauges.',
      en: 'Royal blue top banner with summary and left photo, right ice-blue column with skill meters.'
    },
    layoutType: 'royal-blue-banner-grid',
    layoutFamily: 'two-column-right',
    supportsSecondaryAccent: true,
    defaultAccent: '#1E3A8A',
    defaultSecondaryAccent: '#EFF6FF',
    defaultFont: 'Roboto',
    badgeText: 'Nouveau Modèle 19',
    themeConfig: {
      primaryColor: '#1E3A8A',
      secondaryColor: '#EFF6FF',
      sidebarBackgroundColor: '#EFF6FF',
      backgroundColor: '#FFFFFF',
      headerStyle: 'banner',
      sectionHeaderStyle: 'underline',
      skillsDisplayMode: 'progress',
      experienceDatesAlignment: 'left'
    }
  },
  {
    id: 'modele-20',
    name: 'Modèle 20 — Courbes Vertes (Michel Martin)',
    category: 'creatif',
    description: {
      fr: 'Frise de vagues courbes vertes sur le bord gauche, titres vert lime et compétences par domaines.',
      en: 'Green wave curves along the left edge, lime green titles and categorized domain skills.'
    },
    layoutType: 'michel-green-curves',
    layoutFamily: 'single-column',
    supportsSecondaryAccent: false,
    defaultAccent: '#65A30D',
    defaultFont: 'Trebuchet MS',
    badgeText: 'Nouveau Modèle 20',
    themeConfig: {
      primaryColor: '#65A30D',
      secondaryColor: '#ECFDF5',
      backgroundColor: '#FFFFFF',
      headerStyle: 'clean',
      sectionHeaderStyle: 'left-border',
      skillsDisplayMode: 'badges',
      experienceDatesAlignment: 'inline'
    }
  },
  {
    id: 'modele-21',
    name: 'Modèle 21 — Thomas Durant (Contrôleur de Gestion Dense)',
    category: 'executif',
    description: {
      fr: 'CV très dense 2 colonnes avec colonne latérale marine sombre, grand bandeau d\'en-tête et photo superposée à une forme circulaire.',
      en: 'Very dense 2-column executive layout with dark navy sidebar, upper banner header, and photo overlay shape.'
    },
    layoutType: 'thomas-durant-dense',
    layoutFamily: 'two-column-left',
    supportsSecondaryAccent: true,
    defaultAccent: '#0A2540',
    defaultSecondaryAccent: '#003366',
    defaultFont: 'Inter',
    badgeText: 'Nouveau — Dense 1 Page',
    themeConfig: {
      primaryColor: '#0A2540',
      secondaryColor: '#F0F4F8',
      sidebarBackgroundColor: '#0A2540',
      sidebarTextColor: '#FFFFFF',
      backgroundColor: '#FFFFFF',
      headerStyle: 'banner',
      sectionHeaderStyle: 'underline',
      skillsDisplayMode: 'progress',
      photoFrameStyle: 'ronde',
      decorativeShapes: 'circle-photo',
      experienceDatesAlignment: 'left'
    }
  },
  {
    id: 'modele-22',
    name: 'Modèle 22 — Aurélie Legrand (Header Diagonal & Badges)',
    category: 'creatif',
    description: {
      fr: 'En-tête divisé en diagonale avec photo centrée, jauges horizontales et qualités en badges colorés.',
      en: 'Diagonal split top header with overlaid photo, horizontal progress gauges, and multi-colored quality badges.'
    },
    layoutType: 'aurelie-diagonal-badges',
    layoutFamily: 'two-column-left',
    supportsSecondaryAccent: true,
    defaultAccent: '#1E293B',
    defaultSecondaryAccent: '#2563EB',
    defaultFont: 'Montserrat',
    badgeText: 'Nouveau Modèle 22',
    themeConfig: {
      primaryColor: '#1E293B',
      secondaryColor: '#2563EB',
      sidebarBackgroundColor: '#1E293B',
      sidebarTextColor: '#FFFFFF',
      backgroundColor: '#FFFFFF',
      headerStyle: 'diagonal-split',
      sectionHeaderStyle: 'pill',
      skillsDisplayMode: 'badges-multicolor',
      photoFrameStyle: 'ronde',
      experienceDatesAlignment: 'left'
    }
  },
  {
    id: 'modele-23',
    name: 'Modèle 23 — Aïssatou Mdalé (Photo Galet Sidebar)',
    category: 'creatif',
    description: {
      fr: 'Colonne latérale douce avec grande photo galet en haut, coordonnées épurées et parcours clair.',
      en: 'Soft beige sidebar with a large galet portrait frame at the top and clear typography.'
    },
    layoutType: 'aissatou-galet-sidebar',
    layoutFamily: 'two-column-left',
    supportsSecondaryAccent: true,
    defaultAccent: '#381A3C',
    defaultSecondaryAccent: '#F5EFE6',
    defaultFont: 'Playfair Display',
    badgeText: 'Nouveau Modèle 23',
    themeConfig: {
      primaryColor: '#381A3C',
      secondaryColor: '#F5EFE6',
      sidebarBackgroundColor: '#F5EFE6',
      sidebarTextColor: '#1E1B18',
      backgroundColor: '#FFFFFF',
      headerStyle: 'sidebar-top',
      sectionHeaderStyle: 'minimal',
      skillsDisplayMode: 'tags',
      photoFrameStyle: 'galet',
      photoPosition: 'in-sidebar',
      experienceDatesAlignment: 'inline'
    }
  },
  {
    id: 'modele-24',
    name: 'Modèle 24 — Nicolas Dumont (Anneaux Circulaires)',
    category: 'moderne',
    description: {
      fr: 'Colonne latérale sombre avec jauges en anneaux circulaires, en-tête pleine largeur et listes puces.',
      en: 'Dark sidebar featuring circular percentage rings for skills and languages with full-width header.'
    },
    layoutType: 'nicolas-circular-rings',
    layoutFamily: 'two-column-left',
    supportsSecondaryAccent: true,
    defaultAccent: '#06B6D4',
    defaultSecondaryAccent: '#111827',
    defaultFont: 'Outfit',
    badgeText: 'Nouveau Modèle 24',
    themeConfig: {
      primaryColor: '#06B6D4',
      secondaryColor: '#111827',
      sidebarBackgroundColor: '#111827',
      sidebarTextColor: '#FFFFFF',
      backgroundColor: '#FFFFFF',
      headerStyle: 'clean',
      sectionHeaderStyle: 'left-border',
      skillsDisplayMode: 'circular-progress',
      photoFrameStyle: 'ronde',
      experienceDatesAlignment: 'left'
    }
  },
  {
    id: 'modele-25',
    name: 'Modèle 25 — Noel Taylor (Blocs Arche Empilés)',
    category: 'creatif',
    description: {
      fr: 'Colonne latérale avec sections sous forme de blocs arche empilés, photo chevauchant le haut.',
      en: 'Sidebar with stacked arch-shaped section blocks and clean main content presentation.'
    },
    layoutType: 'noel-arch-stacked',
    layoutFamily: 'two-column-left',
    supportsSecondaryAccent: true,
    defaultAccent: '#18181B',
    defaultSecondaryAccent: '#F4F4F5',
    defaultFont: 'Poppins',
    badgeText: 'Nouveau Modèle 25',
    themeConfig: {
      primaryColor: '#18181B',
      secondaryColor: '#F4F4F5',
      sidebarBackgroundColor: '#FAFAFA',
      sidebarTextColor: '#18181B',
      backgroundColor: '#FFFFFF',
      headerStyle: 'arch',
      sectionHeaderStyle: 'arch-block',
      skillsDisplayMode: 'progress',
      photoFrameStyle: 'ronde',
      experienceDatesAlignment: 'left'
    }
  },
  {
    id: 'modele-26',
    name: 'Modèle 26 — Tech Startup (Indigo Minimal)',
    category: 'moderne',
    description: {
      fr: 'Design indigo vif, typographie moderne et épurée avec jauges de compétences horizontales.',
      en: 'Vibrant indigo tech style with sleek modern typography and horizontal skill gauges.'
    },
    layoutType: 'tech-indigo',
    layoutFamily: 'two-column-left',
    supportsSecondaryAccent: true,
    defaultAccent: '#4F46E5',
    defaultSecondaryAccent: '#EEF2FF',
    defaultFont: 'Inter',
    badgeText: 'Modèle 26',
    themeConfig: {
      primaryColor: '#4F46E5',
      secondaryColor: '#EEF2FF',
      sidebarBackgroundColor: '#EEF2FF',
      sidebarTextColor: '#1E1B4B',
      backgroundColor: '#FFFFFF',
      headerStyle: 'banner',
      sectionHeaderStyle: 'pill',
      skillsDisplayMode: 'progress',
      photoFrameStyle: 'arrondie',
      experienceDatesAlignment: 'left'
    }
  },
  {
    id: 'modele-27',
    name: 'Modèle 27 — Luxe Bordeaux (Serif Prestige)',
    category: 'executif',
    description: {
      fr: 'En-tête bordeaux noble avec typographie sérif haut de gamme, séparateurs dorés et mise en page raffinée.',
      en: 'Noble burgundy header with serif typography, gold accents, and refined layout.'
    },
    layoutType: 'luxe-bordeaux',
    layoutFamily: 'single-column',
    supportsSecondaryAccent: true,
    defaultAccent: '#800020',
    defaultSecondaryAccent: '#FDF2F8',
    defaultFont: 'Playfair Display',
    badgeText: 'Modèle 27',
    themeConfig: {
      primaryColor: '#800020',
      secondaryColor: '#FDF2F8',
      backgroundColor: '#FFFFFF',
      headerStyle: 'banner',
      sectionHeaderStyle: 'underline',
      skillsDisplayMode: 'badges',
      photoFrameStyle: 'ronde',
      experienceDatesAlignment: 'inline'
    }
  },
  {
    id: 'modele-28',
    name: 'Modèle 28 — Émeraude Bio (Vert Nature)',
    category: 'creatif',
    description: {
      fr: 'Thème vert émeraude apaisant avec pilules de compétences douces et ligne chronologique élégante.',
      en: 'Soothing emerald green theme with soft pill badges and elegant timeline dividers.'
    },
    layoutType: 'emerald-nature',
    layoutFamily: 'two-column-left',
    supportsSecondaryAccent: true,
    defaultAccent: '#059669',
    defaultSecondaryAccent: '#ECFDF5',
    defaultFont: 'Poppins',
    badgeText: 'Modèle 28',
    themeConfig: {
      primaryColor: '#059669',
      secondaryColor: '#ECFDF5',
      sidebarBackgroundColor: '#ECFDF5',
      sidebarTextColor: '#064E3B',
      backgroundColor: '#FFFFFF',
      headerStyle: 'clean',
      sectionHeaderStyle: 'left-border',
      skillsDisplayMode: 'badges',
      photoFrameStyle: 'arrondie',
      experienceDatesAlignment: 'left'
    }
  },
  {
    id: 'modele-29',
    name: 'Modèle 29 — Terracotta Studio (Design Ocre)',
    category: 'creatif',
    description: {
      fr: 'Couleurs chaudes ocre terracotta avec bloc en-tête moderne et cartes d\'expériences structurées.',
      en: 'Warm terracotta ochre palette with modern header block and structured experience cards.'
    },
    layoutType: 'terracotta-studio',
    layoutFamily: 'two-column-right',
    supportsSecondaryAccent: true,
    defaultAccent: '#C2410C',
    defaultSecondaryAccent: '#FFF7ED',
    defaultFont: 'Outfit',
    badgeText: 'Modèle 29',
    themeConfig: {
      primaryColor: '#C2410C',
      secondaryColor: '#FFF7ED',
      sidebarBackgroundColor: '#FFF7ED',
      sidebarTextColor: '#7C2D12',
      backgroundColor: '#FFFFFF',
      headerStyle: 'modern-split',
      sectionHeaderStyle: 'pill',
      skillsDisplayMode: 'grid',
      photoFrameStyle: 'galet',
      experienceDatesAlignment: 'left'
    }
  },
  {
    id: 'modele-30',
    name: 'Modèle 30 — Noir Siphon & Or (Exec Pro)',
    category: 'executif',
    description: {
      fr: 'Design noir profond et finitions dorées pour cadres supérieurs, dirigeants et consultants de haut niveau.',
      en: 'Deep black and gold accents for C-level executives, directors, and senior consultants.'
    },
    layoutType: 'black-gold-exec',
    layoutFamily: 'two-column-left',
    supportsSecondaryAccent: true,
    defaultAccent: '#0F172A',
    defaultSecondaryAccent: '#F8FAFC',
    defaultFont: 'Montserrat',
    badgeText: 'Modèle 30',
    themeConfig: {
      primaryColor: '#0F172A',
      secondaryColor: '#F8FAFC',
      sidebarBackgroundColor: '#0F172A',
      sidebarTextColor: '#F8FAFC',
      backgroundColor: '#FFFFFF',
      headerStyle: 'banner',
      sectionHeaderStyle: 'left-border',
      skillsDisplayMode: 'progress',
      photoFrameStyle: 'arche',
      experienceDatesAlignment: 'left'
    }
  },
  {
    id: 'modele-31',
    name: 'Modèle 31 — Vague Nordique (Bleu Glacier)',
    category: 'moderne',
    description: {
      fr: 'Courbure douce en vague nordique (wave-cut), palette bleu glacier et blanc pur avec badges aérés.',
      en: 'Gentle nordic wave cut curvature with ice blue and pure white palette, airy badges.'
    },
    layoutType: 'nordic-frost-wave',
    layoutFamily: 'two-column-left',
    supportsSecondaryAccent: true,
    defaultAccent: '#0284C7',
    defaultSecondaryAccent: '#F0F9FF',
    defaultFont: 'Inter',
    badgeText: 'Modèle 31',
    themeConfig: {
      primaryColor: '#0284C7',
      secondaryColor: '#F0F9FF',
      sidebarBackgroundColor: '#F0F9FF',
      sidebarTextColor: '#0369A1',
      backgroundColor: '#FFFFFF',
      headerStyle: 'modern-split',
      sectionHeaderStyle: 'pill',
      skillsDisplayMode: 'badges',
      photoFrameStyle: 'arrondie',
      experienceDatesAlignment: 'left'
    }
  },
  {
    id: 'modele-32',
    name: 'Modèle 32 — Obsidienne & Ambre Tech',
    category: 'technique',
    description: {
      fr: 'Ambiance tech haut de gamme, fond gris obsidienne, touches ambre électrique et jauges de niveau précises.',
      en: 'Premium dark tech mood, obsidian charcoal column, electric amber accents and level gauges.'
    },
    layoutType: 'tech-obsidian-amber',
    layoutFamily: 'two-column-left',
    supportsSecondaryAccent: true,
    defaultAccent: '#F59E0B',
    defaultSecondaryAccent: '#1E293B',
    defaultFont: 'Outfit',
    badgeText: 'Modèle 32',
    themeConfig: {
      primaryColor: '#F59E0B',
      secondaryColor: '#1E293B',
      sidebarBackgroundColor: '#1E293B',
      sidebarTextColor: '#F8FAFC',
      backgroundColor: '#FFFFFF',
      headerStyle: 'banner',
      sectionHeaderStyle: 'left-border',
      skillsDisplayMode: 'progress',
      photoFrameStyle: 'hexagone',
      experienceDatesAlignment: 'left'
    }
  },
  {
    id: 'modele-33',
    name: 'Modèle 33 — Arche Rose Gold Prestige',
    category: 'creatif',
    description: {
      fr: 'Arche sculptée majestueuse sur le haut de la colonne, finitions rose gold poudré et typographie chic Playfair.',
      en: 'Majestic sculpted top arch, powder rose gold accents, and chic Playfair typography.'
    },
    layoutType: 'arch-rosegold',
    layoutFamily: 'two-column-right',
    supportsSecondaryAccent: true,
    defaultAccent: '#BE185D',
    defaultSecondaryAccent: '#FDF2F8',
    defaultFont: 'Playfair Display',
    badgeText: 'Modèle 33',
    themeConfig: {
      primaryColor: '#BE185D',
      secondaryColor: '#FDF2F8',
      sidebarBackgroundColor: '#FDF2F8',
      sidebarTextColor: '#831843',
      backgroundColor: '#FFFFFF',
      headerStyle: 'arch',
      sectionHeaderStyle: 'pill',
      skillsDisplayMode: 'badges',
      photoFrameStyle: 'arche',
      experienceDatesAlignment: 'inline'
    }
  },
  {
    id: 'modele-34',
    name: 'Modèle 34 — Grille Suisse Internationale',
    category: 'classique',
    description: {
      fr: 'Grille suisse internationale ultra-épurée, typographie Helvetica à fort contraste et doubles lignes fines.',
      en: 'Ultra-clean Swiss international grid, high contrast typography, and double hairline section dividers.'
    },
    layoutType: 'swiss-grid-modern',
    layoutFamily: 'single-column',
    supportsSecondaryAccent: true,
    defaultAccent: '#111827',
    defaultSecondaryAccent: '#F3F4F6',
    defaultFont: 'Helvetica',
    badgeText: 'Modèle 34',
    themeConfig: {
      primaryColor: '#111827',
      secondaryColor: '#F3F4F6',
      backgroundColor: '#FFFFFF',
      headerStyle: 'clean',
      sectionHeaderStyle: 'double-line',
      skillsDisplayMode: 'tags',
      photoFrameStyle: 'carree',
      experienceDatesAlignment: 'left'
    }
  },
  {
    id: 'modele-35',
    name: 'Modèle 35 — Découpe Diagonale & Saphir',
    category: 'executif',
    description: {
      fr: 'Découpe diagonale asymétrique dynamique en tête de page, bleu saphir profond et badge profil pro.',
      en: 'Dynamic asymmetrical diagonal cut header with deep sapphire blue and modern badge headers.'
    },
    layoutType: 'diagonal-sapphire',
    layoutFamily: 'two-column-left',
    supportsSecondaryAccent: true,
    defaultAccent: '#1D4ED8',
    defaultSecondaryAccent: '#EFF6FF',
    defaultFont: 'Montserrat',
    badgeText: 'Modèle 35',
    themeConfig: {
      primaryColor: '#1D4ED8',
      secondaryColor: '#EFF6FF',
      sidebarBackgroundColor: '#EFF6FF',
      sidebarTextColor: '#1E3A8A',
      backgroundColor: '#FFFFFF',
      headerStyle: 'diagonal-split',
      sectionHeaderStyle: 'pill',
      skillsDisplayMode: 'grid',
      photoFrameStyle: 'galet',
      experienceDatesAlignment: 'left'
    }
  },
  {
    id: 'modele-36',
    name: 'Modèle 36 — Carte Flottante & Violet Studio',
    category: 'creatif',
    description: {
      fr: 'Colonne latérale flottante façon carte moderne avec ombre portée douce, style capsule UI design.',
      en: 'Floating card-style sidebar container with soft ambient shadow, modern UI capsule aesthetic.'
    },
    layoutType: 'floating-card-studio',
    layoutFamily: 'two-column-left',
    supportsSecondaryAccent: true,
    defaultAccent: '#7C3AED',
    defaultSecondaryAccent: '#FAF5FF',
    defaultFont: 'Poppins',
    badgeText: 'Modèle 36',
    themeConfig: {
      primaryColor: '#7C3AED',
      secondaryColor: '#FAF5FF',
      sidebarBackgroundColor: '#FAF5FF',
      sidebarTextColor: '#581C87',
      backgroundColor: '#FFFFFF',
      headerStyle: 'clean',
      sectionHeaderStyle: 'boxed',
      skillsDisplayMode: 'badges',
      photoFrameStyle: 'ronde',
      experienceDatesAlignment: 'left'
    }
  },
  {
    id: 'modele-37',
    name: 'Modèle 37 — Vert Olive Méditerranéen & Lin',
    category: 'moderne',
    description: {
      fr: 'Teintes naturelles vert olive et lin chaud, lignes horizontales fines et style organique épuré.',
      en: 'Natural olive green and warm linen tones, delicate section lines, and organic clean styling.'
    },
    layoutType: 'mediterranean-olive',
    layoutFamily: 'two-column-left',
    supportsSecondaryAccent: true,
    defaultAccent: '#4D7C0F',
    defaultSecondaryAccent: '#F7FEE7',
    defaultFont: 'Lato',
    badgeText: 'Modèle 37',
    themeConfig: {
      primaryColor: '#4D7C0F',
      secondaryColor: '#F7FEE7',
      sidebarBackgroundColor: '#F7FEE7',
      sidebarTextColor: '#365314',
      backgroundColor: '#FFFFFF',
      headerStyle: 'clean',
      sectionHeaderStyle: 'underline',
      skillsDisplayMode: 'stars',
      photoFrameStyle: 'ronde',
      experienceDatesAlignment: 'left'
    }
  },
  {
    id: 'modele-38',
    name: 'Modèle 38 — Cyber Dark Indigo & Néon',
    category: 'technique',
    description: {
      fr: 'Thème sombre cybernétique indigo et violet néon avec cadre photo hexagone et timeline lumineuse.',
      en: 'Cyber dark indigo and neon purple theme with hexagonal photo badge and luminous timeline.'
    },
    layoutType: 'cyber-dark-indigo',
    layoutFamily: 'two-column-left',
    supportsSecondaryAccent: true,
    defaultAccent: '#6366F1',
    defaultSecondaryAccent: '#0F172A',
    defaultFont: 'Outfit',
    badgeText: 'Modèle 38',
    themeConfig: {
      primaryColor: '#6366F1',
      secondaryColor: '#0F172A',
      sidebarBackgroundColor: '#0F172A',
      sidebarTextColor: '#F8FAFC',
      backgroundColor: '#FFFFFF',
      headerStyle: 'banner',
      sectionHeaderStyle: 'left-border',
      skillsDisplayMode: 'progress',
      photoFrameStyle: 'hexagone',
      experienceDatesAlignment: 'left'
    }
  },
  {
    id: 'modele-39',
    name: 'Modèle 39 — Éditorial Vogue Paris (Crimson)',
    category: 'creatif',
    description: {
      fr: 'Mise en page haute couture inspirée de la presse éditoriale, grand titre sérif et bordures fines.',
      en: 'Haute couture editorial style inspired by luxury magazines, elegant serif header, refined lines.'
    },
    layoutType: 'parisian-editorial',
    layoutFamily: 'single-column',
    supportsSecondaryAccent: true,
    defaultAccent: '#991B1B',
    defaultSecondaryAccent: '#FEF2F2',
    defaultFont: 'Playfair Display',
    badgeText: 'Modèle 39',
    themeConfig: {
      primaryColor: '#991B1B',
      secondaryColor: '#FEF2F2',
      backgroundColor: '#FFFFFF',
      headerStyle: 'clean',
      sectionHeaderStyle: 'minimal',
      skillsDisplayMode: 'list',
      photoFrameStyle: 'arche',
      experienceDatesAlignment: 'inline'
    }
  },
  {
    id: 'modele-40',
    name: 'Modèle 40 — Couronne Émeraude Royale & Or',
    category: 'executif',
    description: {
      fr: 'Vert émeraude royal avec arche supérieure, conçu pour dirigeants, avocats d\'affaires et consultants.',
      en: 'Royal emerald green with top arch column, built for C-Level executives, partners, and advisors.'
    },
    layoutType: 'emerald-crown-gold',
    layoutFamily: 'two-column-left',
    supportsSecondaryAccent: true,
    defaultAccent: '#065F46',
    defaultSecondaryAccent: '#ECFDF5',
    defaultFont: 'Georgia',
    badgeText: 'Modèle 40',
    themeConfig: {
      primaryColor: '#065F46',
      secondaryColor: '#ECFDF5',
      sidebarBackgroundColor: '#ECFDF5',
      sidebarTextColor: '#064E3B',
      backgroundColor: '#FFFFFF',
      headerStyle: 'banner',
      sectionHeaderStyle: 'pill',
      skillsDisplayMode: 'badges',
      photoFrameStyle: 'arche',
      experienceDatesAlignment: 'left'
    }
  },
  {
    id: 'modele-41',
    name: 'Modèle 41 — Zen Minimal Slate Wabi-Sabi',
    category: 'classique',
    description: {
      fr: 'Esthétique épurée wabi-sabi, équilibre des espaces blancs et typographie ardoise discrète.',
      en: 'Clean wabi-sabi aesthetics, well balanced whitespace, and understated slate typography.'
    },
    layoutType: 'zen-minimal-slate',
    layoutFamily: 'two-column-right',
    supportsSecondaryAccent: true,
    defaultAccent: '#475569',
    defaultSecondaryAccent: '#F8FAFC',
    defaultFont: 'Inter',
    badgeText: 'Modèle 41',
    themeConfig: {
      primaryColor: '#475569',
      secondaryColor: '#F8FAFC',
      sidebarBackgroundColor: '#F8FAFC',
      sidebarTextColor: '#1E293B',
      backgroundColor: '#FFFFFF',
      headerStyle: 'clean',
      sectionHeaderStyle: 'underline',
      skillsDisplayMode: 'tags',
      photoFrameStyle: 'ronde',
      experienceDatesAlignment: 'left'
    }
  },
  {
    id: 'modele-42',
    name: 'Modèle 42 — Sunset Corail & Vague Créative',
    category: 'creatif',
    description: {
      fr: 'Dégradé chaleureux corail-orangé couché de soleil, pilules arrondies et galet photo organique.',
      en: 'Warm sunset coral-orange gradient, rounded pills, and organic pebble photo badge.'
    },
    layoutType: 'sunset-gradient-creative',
    layoutFamily: 'two-column-left',
    supportsSecondaryAccent: true,
    defaultAccent: '#EA580C',
    defaultSecondaryAccent: '#FFF7ED',
    defaultFont: 'Poppins',
    badgeText: 'Modèle 42',
    themeConfig: {
      primaryColor: '#EA580C',
      secondaryColor: '#FFF7ED',
      sidebarBackgroundColor: '#FFF7ED',
      sidebarTextColor: '#9A3412',
      backgroundColor: '#FFFFFF',
      headerStyle: 'modern-split',
      sectionHeaderStyle: 'pill',
      skillsDisplayMode: 'badges',
      photoFrameStyle: 'galet',
      experienceDatesAlignment: 'left'
    }
  },
  {
    id: 'modele-43',
    name: 'Modèle 43 — Biotech Turquoise & Matrice Data',
    category: 'technique',
    description: {
      fr: 'Vert d\'eau et turquoise pour ingénieurs santé, biotech, data scientists et chercheurs.',
      en: 'Teal and vibrant turquoise matrix for health engineers, biotech researchers, and data scientists.'
    },
    layoutType: 'biotech-teal-matrix',
    layoutFamily: 'two-column-left',
    supportsSecondaryAccent: true,
    defaultAccent: '#0D9488',
    defaultSecondaryAccent: '#CCFBF1',
    defaultFont: 'Roboto',
    badgeText: 'Modèle 43',
    themeConfig: {
      primaryColor: '#0D9488',
      secondaryColor: '#CCFBF1',
      sidebarBackgroundColor: '#CCFBF1',
      sidebarTextColor: '#115E59',
      backgroundColor: '#FFFFFF',
      headerStyle: 'banner',
      sectionHeaderStyle: 'boxed',
      skillsDisplayMode: 'progress',
      photoFrameStyle: 'arrondie',
      experienceDatesAlignment: 'left'
    }
  },
  {
    id: 'modele-44',
    name: 'Modèle 44 — Chambers & Droit Britannique',
    category: 'classique',
    description: {
      fr: 'Bleu marine institutionnel avec lettrage sérif distingué et structure académique rigoureuse.',
      en: 'Institutional navy blue with distinguished serif lettering and rigorous academic layout.'
    },
    layoutType: 'london-law-chambers',
    layoutFamily: 'single-column',
    supportsSecondaryAccent: true,
    defaultAccent: '#1E3A8A',
    defaultSecondaryAccent: '#DBEAFE',
    defaultFont: 'Garamond',
    badgeText: 'Modèle 44',
    themeConfig: {
      primaryColor: '#1E3A8A',
      secondaryColor: '#DBEAFE',
      backgroundColor: '#FFFFFF',
      headerStyle: 'banner',
      sectionHeaderStyle: 'double-line',
      skillsDisplayMode: 'stars',
      photoFrameStyle: 'carree',
      experienceDatesAlignment: 'left'
    }
  },
  {
    id: 'modele-45',
    name: 'Modèle 45 — Monochrome Bold Contrast',
    category: 'moderne',
    description: {
      fr: 'Noir et blanc pur ultra-contrasté, grands titres gras et blocs modulaires pour designers.',
      en: 'Ultra-contrasted pure black and white, bold typography and modular blocks for creatives.'
    },
    layoutType: 'monochrome-bold-swiss',
    layoutFamily: 'two-column-left',
    supportsSecondaryAccent: true,
    defaultAccent: '#000000',
    defaultSecondaryAccent: '#F4F4F5',
    defaultFont: 'Helvetica',
    badgeText: 'Modèle 45',
    themeConfig: {
      primaryColor: '#000000',
      secondaryColor: '#F4F4F5',
      sidebarBackgroundColor: '#F4F4F5',
      sidebarTextColor: '#18181B',
      backgroundColor: '#FFFFFF',
      headerStyle: 'clean',
      sectionHeaderStyle: 'left-border',
      skillsDisplayMode: 'grid',
      photoFrameStyle: 'carree',
      experienceDatesAlignment: 'left'
    }
  },
  {
    id: 'modele-46',
    name: 'Modèle 46 — Azur Alpin & Découpe Horizon',
    category: 'moderne',
    description: {
      fr: 'Bleu ciel alpin et découpe diagonale géométrique, apportant fraîcheur et clarté immédiate.',
      en: 'Alpine azure sky blue with diagonal geometric cut, bringing instant freshness and clarity.'
    },
    layoutType: 'alpine-azure-horizon',
    layoutFamily: 'two-column-right',
    supportsSecondaryAccent: true,
    defaultAccent: '#0284C7',
    defaultSecondaryAccent: '#E0F2FE',
    defaultFont: 'Outfit',
    badgeText: 'Modèle 46',
    themeConfig: {
      primaryColor: '#0284C7',
      secondaryColor: '#E0F2FE',
      sidebarBackgroundColor: '#E0F2FE',
      sidebarTextColor: '#075985',
      backgroundColor: '#FFFFFF',
      headerStyle: 'diagonal-split',
      sectionHeaderStyle: 'pill',
      skillsDisplayMode: 'badges',
      photoFrameStyle: 'ronde',
      experienceDatesAlignment: 'left'
    }
  },
  {
    id: 'modele-47',
    name: 'Modèle 47 — Monogramme Pourpre Impérial',
    category: 'executif',
    description: {
      fr: 'Violet pourpre impérial avec arche supérieure et mise en page hiérarchique haut standing.',
      en: 'Imperial purple with sculpted top arch and prestigious executive hierarchy.'
    },
    layoutType: 'royal-violet-monogram',
    layoutFamily: 'two-column-left',
    supportsSecondaryAccent: true,
    defaultAccent: '#581C87',
    defaultSecondaryAccent: '#F3E8FF',
    defaultFont: 'Playfair Display',
    badgeText: 'Modèle 47',
    themeConfig: {
      primaryColor: '#581C87',
      secondaryColor: '#F3E8FF',
      sidebarBackgroundColor: '#F3E8FF',
      sidebarTextColor: '#3B0764',
      backgroundColor: '#FFFFFF',
      headerStyle: 'banner',
      sectionHeaderStyle: 'underline',
      skillsDisplayMode: 'stars',
      photoFrameStyle: 'arche',
      experienceDatesAlignment: 'left'
    }
  },
  {
    id: 'modele-48',
    name: 'Modèle 48 — Argile Chaude & Ocre Terrestre',
    category: 'creatif',
    description: {
      fr: 'Nuances naturelles terre de Sienne et argile douce, galet photo organique pour métiers d\'art.',
      en: 'Warm sienna earth and soft clay shades with organic pebble frame for artists and creators.'
    },
    layoutType: 'earthy-ochre-clay',
    layoutFamily: 'two-column-left',
    supportsSecondaryAccent: true,
    defaultAccent: '#B45309',
    defaultSecondaryAccent: '#FEF3C7',
    defaultFont: 'Lato',
    badgeText: 'Modèle 48',
    themeConfig: {
      primaryColor: '#B45309',
      secondaryColor: '#FEF3C7',
      sidebarBackgroundColor: '#FEF3C7',
      sidebarTextColor: '#78350F',
      backgroundColor: '#FFFFFF',
      headerStyle: 'clean',
      sectionHeaderStyle: 'pill',
      skillsDisplayMode: 'tags',
      photoFrameStyle: 'galet',
      experienceDatesAlignment: 'left'
    }
  },
  {
    id: 'modele-49',
    name: 'Modèle 49 — Dark Crimson Cyber & Jauges',
    category: 'technique',
    description: {
      fr: 'Fond sombre charbon avec accents rouge rubis électrique, jauges et typographie moderne.',
      en: 'Dark charcoal theme with vibrant electric ruby crimson gauges and modern tech vibe.'
    },
    layoutType: 'cyberpunk-dark-crimson',
    layoutFamily: 'two-column-left',
    supportsSecondaryAccent: true,
    defaultAccent: '#E11D48',
    defaultSecondaryAccent: '#18181B',
    defaultFont: 'Outfit',
    badgeText: 'Modèle 49',
    themeConfig: {
      primaryColor: '#E11D48',
      secondaryColor: '#18181B',
      sidebarBackgroundColor: '#18181B',
      sidebarTextColor: '#FAFAFA',
      backgroundColor: '#FFFFFF',
      headerStyle: 'banner',
      sectionHeaderStyle: 'left-border',
      skillsDisplayMode: 'progress',
      photoFrameStyle: 'hexagone',
      experienceDatesAlignment: 'left'
    }
  },
  {
    id: 'modele-50',
    name: 'Modèle 50 — Platine & Diamant (C-Level Diamond)',
    category: 'executif',
    description: {
      fr: 'Gris platine luxueux et noir anthracite avec finitions haut de gamme pour Board et Direction Générale.',
      en: 'Luxurious platinum slate and anthracite black finishes for C-Level executives and board members.'
    },
    layoutType: 'executive-platinum-diamond',
    layoutFamily: 'two-column-right',
    supportsSecondaryAccent: true,
    defaultAccent: '#334155',
    defaultSecondaryAccent: '#F1F5F9',
    defaultFont: 'Montserrat',
    badgeText: 'Modèle 50',
    themeConfig: {
      primaryColor: '#334155',
      secondaryColor: '#F1F5F9',
      sidebarBackgroundColor: '#F1F5F9',
      sidebarTextColor: '#0F172A',
      backgroundColor: '#FFFFFF',
      headerStyle: 'banner',
      sectionHeaderStyle: 'boxed',
      skillsDisplayMode: 'grid',
      photoFrameStyle: 'arche',
      experienceDatesAlignment: 'left'
    }
  },
  {
    id: 'modele-51',
    name: 'Modèle 51 — Ingénieur IT Yann Landy (Bleu Tech & Arches)',
    category: 'technique',
    description: {
      fr: 'Design exact Ingénieur IT avec arches géométriques en haut à gauche, en-tête à deux tons, cartes de compétences 3 colonnes et bandeau de contact en pied de page.',
      en: 'Exact IT Engineer layout with top-left concentric blue arcs, two-tone name, 3-column skill cards, and dark navy bottom contact footer.'
    },
    layoutType: 'yann-landy-tech',
    layoutFamily: 'single-column',
    supportsSecondaryAccent: true,
    defaultAccent: '#0F2744',
    defaultSecondaryAccent: '#0284C7',
    defaultFont: 'Inter',
    badgeText: 'Modèle Yann Landy',
    themeConfig: {
      primaryColor: '#0F2744',
      secondaryColor: '#0284C7',
      backgroundColor: '#FFFFFF',
      headerStyle: 'tech-arches',
      sectionHeaderStyle: 'badge-line',
      skillsDisplayMode: 'tech-cards',
      experienceDatesAlignment: 'left'
    }
  },
  {
    id: 'modele-52',
    name: 'Modèle 52 — Ingénieur IT Yann Landy (Carbone & Or Métallique)',
    category: 'executif',
    description: {
      fr: 'Nuance haut de gamme Noir Carbone et Or Impérial avec arches dorées, cartes de compétences 3 colonnes et bandeau noir en pied de page.',
      en: 'Executive Carbon Black and Imperial Gold nuance with gold arcs, 3-column skill cards, and footer.'
    },
    layoutType: 'yann-landy-tech',
    layoutFamily: 'single-column',
    supportsSecondaryAccent: true,
    defaultAccent: '#18181B',
    defaultSecondaryAccent: '#D97706',
    defaultFont: 'Outfit',
    badgeText: 'Nuance Or & Carbone',
    themeConfig: {
      primaryColor: '#18181B',
      secondaryColor: '#D97706',
      backgroundColor: '#FFFFFF',
      headerStyle: 'tech-arches',
      sectionHeaderStyle: 'badge-line',
      skillsDisplayMode: 'tech-cards',
      experienceDatesAlignment: 'left'
    }
  },
  {
    id: 'modele-53',
    name: 'Modèle 53 — Ingénieur IT Yann Landy (Émeraude & Menthe)',
    category: 'technique',
    description: {
      fr: 'Nuance Vert Forêt et Menthe fraîche idéale pour ingénieurs Cloud, Fintech, GreenTech et DevOps.',
      en: 'Emerald Green and Mint Teal nuance for Cloud, Fintech, GreenTech and DevOps engineers.'
    },
    layoutType: 'yann-landy-tech',
    layoutFamily: 'single-column',
    supportsSecondaryAccent: true,
    defaultAccent: '#064E3B',
    defaultSecondaryAccent: '#0D9488',
    defaultFont: 'Inter',
    badgeText: 'Nuance Émeraude',
    themeConfig: {
      primaryColor: '#064E3B',
      secondaryColor: '#0D9488',
      backgroundColor: '#FFFFFF',
      headerStyle: 'tech-arches',
      sectionHeaderStyle: 'badge-line',
      skillsDisplayMode: 'tech-cards',
      experienceDatesAlignment: 'left'
    }
  },
  {
    id: 'modele-54',
    name: 'Modèle 54 — Ingénieur IT Yann Landy (Indigo Cyber & Cobalt)',
    category: 'technique',
    description: {
      fr: 'Nuance Indigo profond et Bleu Cobalt électrique pour ingénieurs Cybersécurité, Intelligence Artificielle et Systèmes.',
      en: 'Deep Indigo and Cobalt Blue nuance for Cybersecurity, AI and Systems engineers.'
    },
    layoutType: 'yann-landy-tech',
    layoutFamily: 'single-column',
    supportsSecondaryAccent: true,
    defaultAccent: '#1E1B4B',
    defaultSecondaryAccent: '#6366F1',
    defaultFont: 'Inter',
    badgeText: 'Nuance Cyber Indigo',
    themeConfig: {
      primaryColor: '#1E1B4B',
      secondaryColor: '#6366F1',
      backgroundColor: '#FFFFFF',
      headerStyle: 'tech-arches',
      sectionHeaderStyle: 'badge-line',
      skillsDisplayMode: 'tech-cards',
      experienceDatesAlignment: 'left'
    }
  },
  {
    id: 'modele-55',
    name: 'Modèle 55 — Ingénieur IT Yann Landy (Bordeaux & Ambre Direction)',
    category: 'moderne',
    description: {
      fr: 'Nuance Bordeaux Royal et Ambre Corail pour Directeurs de Projets, Lead Tech et Consultants en Stratégie IT.',
      en: 'Royal Wine Red and Coral Amber nuance for Project Directors, Lead Tech and IT Strategy Consultants.'
    },
    layoutType: 'yann-landy-tech',
    layoutFamily: 'single-column',
    supportsSecondaryAccent: true,
    defaultAccent: '#881337',
    defaultSecondaryAccent: '#E11D48',
    defaultFont: 'Montserrat',
    badgeText: 'Nuance Bordeaux',
    themeConfig: {
      primaryColor: '#881337',
      secondaryColor: '#E11D48',
      backgroundColor: '#FFFFFF',
      headerStyle: 'tech-arches',
      sectionHeaderStyle: 'badge-line',
      skillsDisplayMode: 'tech-cards',
      experienceDatesAlignment: 'left'
    }
  }
];

export const ACCENT_COLORS = [
  { hex: '#006666', name: 'Vert Canard' },
  { hex: '#381A3C', name: 'Prune Élégant' },
  { hex: '#00B4D8', name: 'Cyan Éclatant' },
  { hex: '#522166', name: 'Violet Écusson' },
  { hex: '#3B8B88', name: 'Teal Océan' },
  { hex: '#1D3557', name: 'Bleu Roi Marine' },
  { hex: '#D8C3A5', name: 'Sable Warm Beige' },
  { hex: '#1B2A4A', name: 'Bleu Nuit Hexagone' },
  { hex: '#2D3748', name: 'Gris Ardoise' },
  { hex: '#1A202C', name: 'Noir Studio' },
  { hex: '#800020', name: 'Bordeaux Royal' },
  { hex: '#064E3B', name: 'Vert Émeraude' },
  { hex: '#C2410C', name: 'Terracotta' },
  { hex: '#0F172A', name: 'Bleu Marine Or' },
  { hex: '#3F6212', name: 'Vert Olive' }
];

export const FONT_OPTIONS = [
  { id: 'Arial', name: 'Arial — Bonjour !', family: 'Arial, Helvetica, sans-serif' },
  { id: 'Calibri', name: 'Calibri — Bonjour !', family: 'Calibri, sans-serif' },
  { id: 'Times New Roman', name: 'Times New Roman — Bonjour !', family: '"Times New Roman", Times, serif' },
  { id: 'Georgia', name: 'Georgia — Bonjour !', family: 'Georgia, serif' },
  { id: 'Garamond', name: 'Garamond — Bonjour !', family: 'Garamond, serif' },
  { id: 'Helvetica', name: 'Helvetica — Bonjour !', family: 'Helvetica, Arial, sans-serif' },
  { id: 'Trebuchet MS', name: 'Trebuchet MS — Bonjour !', family: '"Trebuchet MS", sans-serif' },
  { id: 'Verdana', name: 'Verdana — Bonjour !', family: 'Verdana, sans-serif' },
  { id: 'Inter', name: 'Inter — Bonjour !', family: 'Inter, sans-serif' },
  { id: 'Montserrat', name: 'Montserrat — Bonjour !', family: 'Montserrat, sans-serif' },
  { id: 'Poppins', name: 'Poppins — Bonjour !', family: 'Poppins, sans-serif' },
  { id: 'Playfair Display', name: 'Playfair Display — Bonjour !', family: '"Playfair Display", serif' },
  { id: 'Outfit', name: 'Outfit — Bonjour !', family: 'Outfit, sans-serif' },
  { id: 'Roboto', name: 'Roboto — Bonjour !', family: 'Roboto, sans-serif' },
  { id: 'Lato', name: 'Lato — Bonjour !', family: 'Lato, sans-serif' }
];

export const FONT_SIZES = [
  { id: '9pt', name: '9 pt (Très compact)' },
  { id: '10pt', name: '10 pt (Standard CV)' },
  { id: '11pt', name: '11 pt (Équilibré Word)' },
  { id: '12pt', name: '12 pt (Grand / Lisible)' },
  { id: '13pt', name: '13 pt (Inconfort visuel réduit)' },
  { id: '14pt', name: '14 pt (Large)' },
  { id: '16pt', name: '16 pt (Très grand)' }
];
