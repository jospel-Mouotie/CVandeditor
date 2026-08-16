import { Section, Language, CV } from '../types';
import { CV_TEMPLATES } from './templates';

export interface CVTemplatePreset {
  titre: string;
  couleurAccent: string;
  couleurAccentSecondaire?: string;
  couleurFond?: string;
  couleurFondSidebar?: string;
  couleurTexte?: string;
  couleurTexteSidebar?: string;
  couleurTitreSection?: string;
  couleurTitreSectionSidebar?: string;
  nombreColonnes?: 1 | 2;
  largeurColonneGauche?: number;
  positionSidebar?: 'gauche' | 'droite';
  formeSidebarDecor?: 'straight' | 'arch-top' | 'wave-cut' | 'diagonal-cut' | 'card-float';
  timelineStyle?: 'none' | 'line-dots' | 'accent-pills' | 'left-bar';
  cadrePhotoRing?: 'none' | 'double-ring' | 'gold-ring' | 'accent-ring';
  styleEnTete?: 'banner' | 'clean' | 'card' | 'arch' | 'modern-split' | 'minimal' | 'luxury-gold' | 'ocean-wave' | 'diagonal-split' | 'organic-arch' | 'sidebar-top' | 'tech-arches';
  styleEnTeteSection?: 'underline' | 'pill' | 'banner' | 'left-border' | 'minimal' | 'boxed' | 'stars' | 'double-line' | 'arch-block' | 'badge-header' | 'badge-line';
  styleCompetences?: 'grid' | 'list' | 'badges' | 'progress' | 'stars' | 'tags' | 'circular-progress' | 'badges-multicolor' | 'tech-cards';
  alignementDatesExperience?: 'left' | 'top' | 'inline';
  photoForme?: 'ronde' | 'carree' | 'arrondie' | 'hexagone' | 'arche' | 'galet';
  photoPosition?: 'in-header' | 'in-sidebar';
  police: string;
  photoUrl?: string;
  sections: Section[];
}

export const TEMPLATE_PRESETS: Record<string, CVTemplatePreset> = {
  // ==================== MODEL 1: INTÉRIMAIRE PRO / VERT CANARD (Photo 1) ====================
  'modele-1': {
    titre: 'CV Intérimaire Pro — Vert Canard',
    couleurAccent: '#006666',
    police: 'Inter',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    sections: [
      {
        id: 'sec-p-m1',
        type: 'profil',
        titre: 'MON PROFIL & CONTACT',
        ordre: 1,
        visible: true,
        contenu: {
          nomComplet: 'PRÉNOM NOM',
          titreProfessionnel: 'POSTE OCCUPÉ/RECHERCHÉ',
          email: 'prenom.nom@gmail.com',
          telephone: '+33 6 66 66 66 66',
          adresse: 'Ville, Pays',
          linkedin: 'url.linkedin',
          resume: 'Écrivez une description de votre profil et de vos principales compétences afin que le recruteur en sache plus sur vous. Valorisez vos points forts et votre motivation.'
        }
      },
      {
        id: 'sec-exp-m1',
        type: 'experience',
        titre: 'EXPÉRIENCES PROFESSIONNELLES',
        ordre: 2,
        visible: true,
        contenu: [
          {
            id: 'exp-1',
            poste: 'Poste occupé',
            entreprise: 'NOM DE L\'ENTREPRISE',
            ville: 'Ville, Pays',
            dateDebut: '00/0000',
            dateFin: '00/0000',
            actuel: false,
            description: '• Gestion quotidienne des activités et réalisation des objectifs clés de l\'entreprise.\n• Coordination de projets en équipe et optimisation des procédures de travail.\n• Analyse des performances et rédaction de comptes-rendus réguliers.'
          },
          {
            id: 'exp-2',
            poste: 'Poste occupé',
            entreprise: 'NOM DE L\'ENTREPRISE',
            ville: 'Ville, Pays',
            dateDebut: '00/0000',
            dateFin: '00/0000',
            actuel: false,
            description: '• Accueil et orientation de la clientèle avec professionnalisme et rigueur.\n• Traitement rapide des demandes et résolution des incidents opérationnels.'
          }
        ]
      },
      {
        id: 'sec-edu-m1',
        type: 'formation',
        titre: 'FORMATION',
        ordre: 3,
        visible: true,
        contenu: [
          {
            id: 'edu-1',
            diplome: 'DIPLÔME OU ÉTUDES',
            etablissement: 'Université ou école',
            ville: 'Ville, Pays',
            dateDebut: '00/0000',
            dateFin: '00/0000'
          },
          {
            id: 'edu-2',
            diplome: 'DIPLÔME OU ÉTUDES',
            etablissement: 'Université ou école',
            ville: 'Ville, Pays',
            dateDebut: '00/0000',
            dateFin: '00/0000'
          }
        ]
      },
      {
        id: 'sec-sk-m1',
        type: 'competences',
        titre: 'LOGICIELS',
        ordre: 4,
        visible: true,
        contenu: [
          { id: 's-1', nom: 'Excel', niveau: 5 },
          { id: 's-2', nom: 'PowerPoint', niveau: 4 },
          { id: 's-3', nom: 'Word', niveau: 5 },
          { id: 's-4', nom: 'Photoshop', niveau: 3 }
        ]
      },
      {
        id: 'sec-lang-m1',
        type: 'langues',
        titre: 'LANGUES',
        ordre: 5,
        visible: true,
        contenu: [
          { id: 'l-1', langue: 'Français', niveau: 'Langue maternelle' },
          { id: 'l-2', langue: 'Anglais', niveau: 'Niveau avancé' },
          { id: 'l-3', langue: 'Allemand', niveau: 'Niveau avancé' }
        ]
      }
    ]
  },

  // ==================== MODEL 2: AÏSSATOU MDALÉ / PHOTOGRAPHE (Photo 2) ====================
  'modele-2': {
    titre: 'CV Aïssatou Mdalé — Photographe',
    couleurAccent: '#381A3C',
    police: 'Playfair Display',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    sections: [
      {
        id: 'sec-p-m2',
        type: 'profil',
        titre: 'PROFIL & CONTACT',
        ordre: 1,
        visible: true,
        contenu: {
          nomComplet: 'Aïssatou Mdalé',
          titreProfessionnel: 'Photographe',
          email: 'aissatou@mdale.site.com',
          telephone: '02 61 91 89 76',
          adresse: '94 rue Lauriston, 75016 Paris',
          siteWeb: 'www.photographe.site.com',
          resume: 'Photographe passionnée spécialisée dans le portrait, la photographie événementielle et de voyage avec 8 ans d\'expérience.'
        }
      },
      {
        id: 'sec-exp-m2',
        type: 'experience',
        titre: 'Parcours professionnel',
        ordre: 2,
        visible: true,
        contenu: [
          {
            id: 'exp-1',
            poste: 'Photographe indépendante',
            entreprise: 'Paris',
            dateDebut: '2030',
            dateFin: '2035',
            actuel: false,
            description: '• Création de portraits pour particuliers et entreprises.\n• Photographie de mariages et événements spéciaux.\n• Réalisation de séances photos en studio et en extérieur.'
          },
          {
            id: 'exp-2',
            poste: 'Photographe de voyage',
            entreprise: 'Agence Passeport | Rennes',
            dateDebut: '2025',
            dateFin: '2030',
            actuel: false,
            description: '• Photographie de paysages et sites locaux.\n• Création de contenus visuels promotionnels.'
          },
          {
            id: 'exp-3',
            poste: 'Photographe de presse',
            entreprise: 'Journal local | Armentières',
            dateDebut: '2023',
            dateFin: '2025',
            actuel: false,
            description: '• Couverture photographique et sujets d\'actualité.\n• Livraison rapide d\'images pour les services de presse.'
          }
        ]
      },
      {
        id: 'sec-edu-m2',
        type: 'formation',
        titre: 'Formations',
        ordre: 3,
        visible: true,
        contenu: [
          {
            id: 'edu-1',
            diplome: 'Diplôme de photographie',
            etablissement: 'École du Visuel | Paris',
            dateDebut: '2023',
            dateFin: '2023'
          },
          {
            id: 'edu-2',
            diplome: 'Cours avancés de photographie',
            etablissement: 'Lycée Central | Paris',
            dateDebut: '2021',
            dateFin: '2021'
          }
        ]
      },
      {
        id: 'sec-sk-m2',
        type: 'competences',
        titre: 'Compétences',
        ordre: 4,
        visible: true,
        contenu: [
          { id: 's-1', nom: 'Techniques d\'éclairage', niveau: 5 },
          { id: 's-2', nom: 'Post-production et montage', niveau: 5 },
          { id: 's-3', nom: 'Respect des délais', niveau: 4 },
          { id: 's-4', nom: 'Conception artistique', niveau: 5 },
          { id: 's-5', nom: 'Maîtrise avancée du matériel', niveau: 5 }
        ]
      },
      {
        id: 'sec-hob-m2',
        type: 'personnalisee',
        titre: 'Centres d\'intérêt',
        ordre: 5,
        visible: true,
        contenu: {
          typeLayout: 'liste',
          texteLibre: 'Cinéma\nVoyage\nNature\nSport'
        }
      }
    ]
  },

  // ==================== MODEL 3: BRIAN R. BAXTER (Photo 3) ====================
  'modele-3': {
    titre: 'CV Brian R. Baxter — Web Designer',
    couleurAccent: '#00B4D8',
    police: 'Outfit',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    sections: [
      {
        id: 'sec-p-m3',
        type: 'profil',
        titre: 'ABOUT ME & CONTACT',
        ordre: 1,
        visible: true,
        contenu: {
          nomComplet: 'BRIAN R. BAXTER',
          titreProfessionnel: 'GRAPHIC & WEB DESIGNER',
          email: 'yourinfo@email.com',
          telephone: '+1-718-310-5580',
          adresse: '760 Prudence Street Lincoln Park, MI 48146',
          siteWeb: 'www.yourwebsite.com',
          resume: 'Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type.'
        }
      },
      {
        id: 'sec-exp-m3',
        type: 'experience',
        titre: 'JOB EXPERIENCE',
        ordre: 2,
        visible: true,
        contenu: [
          {
            id: 'exp-1',
            poste: 'SENIOR WEB DESIGNER',
            entreprise: 'Creative Agency / Chicago',
            dateDebut: '2020',
            dateFin: 'Present',
            actuel: true,
            description: 'Lorem ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type.'
          },
          {
            id: 'exp-2',
            poste: 'GRAPHIC DESIGNER',
            entreprise: 'Creative Market / Chicago',
            dateDebut: '2015',
            dateFin: '2020',
            actuel: false,
            description: 'Lorem ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type.'
          },
          {
            id: 'exp-3',
            poste: 'MARKETING MANAGER',
            entreprise: 'Manufacturing Agency / NJ',
            dateDebut: '2013',
            dateFin: '2015',
            actuel: false,
            description: 'Lorem ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type.'
          }
        ]
      },
      {
        id: 'sec-edu-m3',
        type: 'formation',
        titre: 'EDUCATION',
        ordre: 3,
        visible: true,
        contenu: [
          {
            id: 'edu-1',
            diplome: 'MASTER DEGREE GRADUATE',
            etablissement: 'STANFORD UNIVERSITY',
            dateDebut: '2011',
            dateFin: '2013'
          },
          {
            id: 'edu-2',
            diplome: 'BACHELOR DEGREE GRADUATE',
            etablissement: 'UNIVERSITY OF CHICAGO',
            dateDebut: '2007',
            dateFin: '2010'
          }
        ]
      },
      {
        id: 'sec-sk-m3',
        type: 'competences',
        titre: 'SKILLS',
        ordre: 4,
        visible: true,
        contenu: [
          { id: 's-1', nom: 'Adobe Photoshop', niveau: 5 },
          { id: 's-2', nom: 'Adobe Illustrator', niveau: 4 },
          { id: 's-3', nom: 'Microsoft Word', niveau: 4 },
          { id: 's-4', nom: 'Microsoft Powerpoint', niveau: 5 },
          { id: 's-5', nom: 'HTML-5 / CSS-3', niveau: 4 }
        ]
      },
      {
        id: 'sec-ref-m3',
        type: 'personnalisee',
        titre: 'REFERENCES',
        ordre: 5,
        visible: true,
        contenu: {
          typeLayout: 'liste',
          texteLibre: 'DARWIN B. MAGANA\n2813 Shebe Lane Mancos, CO\nTel: +1-970-533-3393 | Email: yourinfo@email.com\n\nROBERT J. BELVIN\n2119 Fairfax Drive Newark, NJ\nTel: +1-908-987-5103 | Email: yourinfo@email.com'
        }
      }
    ]
  },

  // ==================== MODEL 4: INFIRMIÈRE (Photo 4) ====================
  'modele-4': {
    titre: 'CV Infirmière — Écusson Violet',
    couleurAccent: '#522166',
    police: 'Inter',
    photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
    sections: [
      {
        id: 'sec-p-m4',
        type: 'profil',
        titre: 'PRÉNOM NOM',
        ordre: 1,
        visible: true,
        contenu: {
          nomComplet: 'PRÉNOM NOM',
          titreProfessionnel: 'INFIRMIÈRE',
          email: 'COURRIEL@EXEMPLEDECV.INFO',
          telephone: 'TÉLÉPHONE',
          adresse: 'VILLE, PROVINCE, CODE POSTAL',
          resume: 'Infirmière diplômée d\'État rigoureuse avec une solide expérience en soins de santé généraux et accompagnement médical des patients.'
        }
      },
      {
        id: 'sec-edu-m4',
        type: 'formation',
        titre: 'FORMATION',
        ordre: 2,
        visible: true,
        contenu: [
          {
            id: 'edu-1',
            diplome: 'Examen de l\'ordre des infirmiers et infirmières du Québec',
            etablissement: 'Ordre Professionnel',
            dateDebut: '2012',
            dateFin: '2012'
          },
          {
            id: 'edu-2',
            diplome: 'DEC Techniques Soins infirmiers',
            etablissement: 'Collège Jean-Lesage',
            dateDebut: '2009',
            dateFin: '2012'
          },
          {
            id: 'edu-3',
            diplome: 'DES Diplôme études secondaires',
            etablissement: 'École Secondaire',
            dateDebut: '2009',
            dateFin: '2009'
          }
        ]
      },
      {
        id: 'sec-exp-m4',
        type: 'experience',
        titre: 'EXPÉRIENCES PROFESSIONNELLES',
        ordre: 3,
        visible: true,
        contenu: [
          {
            id: 'exp-1',
            poste: 'Remplacement congé maternité',
            entreprise: 'Hôpital Marie-de-l\'Incarnation',
            dateDebut: '2012',
            dateFin: '2013',
            actuel: false,
            description: 'Fonctions :\n• Déterminer des plans de santé et assurer leur réalisation pour le traitement des patients.'
          },
          {
            id: 'exp-2',
            poste: 'Sauveteur Croix-Rouge - Emploi d\'été',
            entreprise: 'Ville de Rigaud',
            dateDebut: '2008',
            dateFin: '2012',
            actuel: false,
            description: 'Fonctions :\n• Donner des cours de natation à des enfants de 6 mois à 12 ans.\n• Prévenir des noyades en assurant la surveillance de la piscine lors des périodes d\'ouverture.'
          }
        ]
      },
      {
        id: 'sec-supp-m4',
        type: 'personnalisee',
        titre: 'INFORMATIONS SUPPLÉMENTAIRES',
        ordre: 4,
        visible: true,
        contenu: {
          typeLayout: 'liste',
          texteLibre: '• Bilingue (anglais-français)\n• Connaissances informatiques étendues (Suite Office - Internet - Courriel)\n• Permis de conduire\n• Membre du club de patin artistique\n\nRÉFÉRENCES SUR DEMANDE'
        }
      }
    ]
  },

  // ==================== MODEL 5: JOSEPH CARLIER (Photo 5) ====================
  'modele-5': {
    titre: 'CV Joseph Carlier — Réceptionniste',
    couleurAccent: '#3B8B88',
    police: 'Lato',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    sections: [
      {
        id: 'sec-p-m5',
        type: 'profil',
        titre: 'PRÉSENTATION & CONTACTS',
        ordre: 1,
        visible: true,
        contenu: {
          nomComplet: 'Joseph Carlier',
          titreProfessionnel: 'Réceptionniste',
          email: 'joseph@carlier.site.com',
          telephone: '06.39.98.45.32',
          adresse: 'Brest, France',
          resume: 'Le renard brun rapide a sauté par-dessus le chien paresseux dans une mare scintillante d\'eau de pluie qui s\'était accumulée depuis le dernier gel. De douces grappes de feuilles tombent sans plan sur le sol.'
        }
      },
      {
        id: 'sec-exp-m5',
        type: 'experience',
        titre: 'Expériences',
        ordre: 2,
        visible: true,
        contenu: [
          {
            id: 'exp-1',
            poste: 'Réceptionniste',
            entreprise: 'Hôtel des Cigales',
            dateDebut: '2025',
            dateFin: '2028',
            actuel: false
          },
          {
            id: 'exp-2',
            poste: 'Agent d\'accueil',
            entreprise: 'Thalasso L\'Otarie',
            dateDebut: '2022',
            dateFin: '2025',
            actuel: false
          },
          {
            id: 'exp-3',
            poste: 'Hôte et réception',
            entreprise: 'La Brise Resort',
            dateDebut: '2021',
            dateFin: '2022',
            actuel: false
          }
        ]
      },
      {
        id: 'sec-edu-m5',
        type: 'formation',
        titre: 'Éducation',
        ordre: 3,
        visible: true,
        contenu: [
          {
            id: 'edu-1',
            diplome: 'Baccalauréat Hôtellerie',
            etablissement: 'Brest, France',
            dateDebut: '2019',
            dateFin: '2019'
          },
          {
            id: 'edu-2',
            diplome: 'BTS Hôtellerie et restauration',
            etablissement: 'Meucon, France',
            dateDebut: '2021',
            dateFin: '2021'
          },
          {
            id: 'edu-3',
            diplome: 'Formation en gestion hôtelière',
            etablissement: 'Paris, France',
            dateDebut: '2022',
            dateFin: '2022'
          }
        ]
      },
      {
        id: 'sec-sk-m5',
        type: 'competences',
        titre: 'Compétences',
        ordre: 4,
        visible: true,
        contenu: [
          { id: 's-1', nom: 'Accueil et réception', niveau: 5 },
          { id: 's-2', nom: 'Management', niveau: 4 },
          { id: 's-3', nom: 'Communication', niveau: 5 },
          { id: 's-4', nom: 'Adaptabilité', niveau: 5 },
          { id: 's-5', nom: 'Gestion administrative', niveau: 4 },
          { id: 's-6', nom: 'Respect des normes d\'hygiène', niveau: 5 }
        ]
      },
      {
        id: 'sec-lang-m5',
        type: 'langues',
        titre: 'Langues',
        ordre: 5,
        visible: true,
        contenu: [
          { id: 'l-1', langue: 'Anglais', niveau: 'niveau C2' },
          { id: 'l-2', langue: 'Espagnol', niveau: 'niveau B1' },
          { id: 'l-3', langue: 'Français', niveau: 'native' }
        ]
      }
    ]
  },

  // ==================== MODEL 6: INTÉRIMAIRE BLEU ROI (Photo 2) ====================
  'modele-6': {
    titre: 'CV Intérimaire Bleu Roi — Assistant Admin',
    couleurAccent: '#1D3557',
    police: 'Inter',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    sections: [
      {
        id: 'sec-p-m6',
        type: 'profil',
        titre: 'PROFIL & CONTACT',
        ordre: 1,
        visible: true,
        contenu: {
          nomComplet: 'PRÉNOM NOM',
          titreProfessionnel: 'INTÉRIMAIRE',
          email: 'prenom.nom@gmail.com',
          telephone: '+33 6 66 66 66 66',
          adresse: 'Ville, Pays',
          linkedin: 'linkedin.com/in/prenom-nom',
          resume: 'Je suis un professionnel polyvalent et organisé avec une solide expérience en tant qu\'assistant administratif. J\'ai démontré ma capacité à gérer efficacement les tâches administratives, à communiquer avec les clients et à résoudre les problèmes de manière proactive.'
        }
      },
      {
        id: 'sec-exp-m6',
        type: 'experience',
        titre: 'EXPÉRIENCES PROFESSIONNELLES',
        ordre: 2,
        visible: true,
        contenu: [
          {
            id: 'exp-1',
            poste: 'Assistant Administratif',
            entreprise: 'Entreprise ABC',
            ville: 'Ville, Pays',
            dateDebut: '20XX',
            dateFin: '20XX',
            actuel: false,
            description: '• Gestion de l\'agenda du directeur général, organisation de réunions et programmation des déplacements.\n• Préparation de rapports et de présentations en utilisant Microsoft Office.\n• Traitement des appels téléphoniques et de la correspondance.'
          },
          {
            id: 'exp-2',
            poste: 'Assistant Administratif',
            entreprise: 'Entreprise XYZ',
            ville: 'Ville, Pays',
            dateDebut: '20XX',
            dateFin: '20XX',
            actuel: false,
            description: '• Saisie de données et mise à jour de bases de données clients.\n• Collaboration avec l\'équipe pour assurer le bon fonctionnement des opérations administratives.'
          }
        ]
      },
      {
        id: 'sec-edu-m6',
        type: 'formation',
        titre: 'FORMATION',
        ordre: 3,
        visible: true,
        contenu: [
          {
            id: 'edu-1',
            diplome: 'Bachelor en Gestion Administrative',
            etablissement: 'Établissement Supérieur',
            ville: 'Ville, Pays',
            dateDebut: '20XX',
            dateFin: '20XX',
            description: 'Cours pertinents: Gestion de projet, Communication d\'entreprise.'
          },
          {
            id: 'edu-2',
            diplome: 'Baccalauréat Économique',
            etablissement: 'Lycée Central',
            ville: 'Ville, Pays',
            dateDebut: '20XX',
            dateFin: '20XX'
          }
        ]
      },
      {
        id: 'sec-sk-m6',
        type: 'competences',
        titre: 'COMPÉTENCES',
        ordre: 4,
        visible: true,
        contenu: [
          { id: 's-1', nom: 'Microsoft Office', niveau: 5 },
          { id: 's-2', nom: 'Trello & Notion', niveau: 4 },
          { id: 's-3', nom: 'Organisation', niveau: 5 },
          { id: 's-4', nom: 'Gestion du temps', niveau: 4 }
        ]
      },
      {
        id: 'sec-lang-m6',
        type: 'langues',
        titre: 'LANGUES',
        ordre: 5,
        visible: true,
        contenu: [
          { id: 'l-1', langue: 'Français', niveau: 'Maternelle' },
          { id: 'l-2', langue: 'Anglais', niveau: 'Avancé' },
          { id: 'l-3', langue: 'Espagnol', niveau: 'Intermédiaire' }
        ]
      },
      {
        id: 'sec-hob-m6',
        type: 'personnalisee',
        titre: 'CENTRES D\'INTÉRÊT',
        ordre: 6,
        visible: true,
        contenu: {
          typeLayout: 'liste',
          texteLibre: '• Randonnée en montagne\n• Cuisine française\n• Musique classique'
        }
      }
    ]
  },

  // ==================== MODEL 7: CÉLIA NAUDIN (Photo 3) ====================
  'modele-7': {
    titre: 'CV Célia Naudin — Beige Arch & Étoiles',
    couleurAccent: '#D8C3A5',
    police: 'Playfair Display',
    photoUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80',
    sections: [
      {
        id: 'sec-p-m7',
        type: 'profil',
        titre: 'PROFIL & CONTACT',
        ordre: 1,
        visible: true,
        contenu: {
          nomComplet: 'Célia Naudin',
          titreProfessionnel: 'Chargée de communication',
          email: 'hello@reallygreatsite.com',
          telephone: '123-456-7890',
          adresse: '123 Anywhere St., Any City',
          resume: 'Chargée de communication créative et passionnée par le développement de stratégies de marque engageantes, la création de contenu et le community management.'
        }
      },
      {
        id: 'sec-exp-m7',
        type: 'experience',
        titre: 'Expériences',
        ordre: 2,
        visible: true,
        contenu: [
          {
            id: 'exp-1',
            poste: 'Chargée de communication',
            entreprise: 'Groupe Frame',
            dateDebut: '2021',
            dateFin: '2026',
            actuel: false,
            description: '• Gestion de la stratégie de communication globale.\n• Développement et animation des réseaux sociaux.\n• Production de contenus éditoriaux et organisation d\'événements.'
          },
          {
            id: 'exp-2',
            poste: 'Assistante communication en alternance',
            entreprise: 'Bancollect',
            dateDebut: '2019',
            dateFin: '2020',
            actuel: false,
            description: '• Création et publication de contenus visuels et rédactionnels.\n• Participation à des projets de marketing digital et veille sectorielle.'
          }
        ]
      },
      {
        id: 'sec-edu-m7',
        type: 'formation',
        titre: 'Formations',
        ordre: 3,
        visible: true,
        contenu: [
          {
            id: 'edu-1',
            diplome: 'Master Communication en alternance',
            etablissement: 'École Amédé Autran',
            dateDebut: '2017',
            dateFin: '2020'
          },
          {
            id: 'edu-2',
            diplome: 'Licence Marketing Digital',
            etablissement: 'Université de Lyon',
            dateDebut: '2014',
            dateFin: '2017'
          }
        ]
      },
      {
        id: 'sec-sk-m7',
        type: 'competences',
        titre: 'Compétences',
        ordre: 4,
        visible: true,
        contenu: [
          { id: 's-1', nom: 'Réseaux sociaux', niveau: 5 },
          { id: 's-2', nom: 'Graphisme', niveau: 4 },
          { id: 's-3', nom: 'Référencement SEO', niveau: 4 },
          { id: 's-4', nom: 'Montage Vidéo', niveau: 4 }
        ]
      },
      {
        id: 'sec-lang-m7',
        type: 'langues',
        titre: 'Langues',
        ordre: 5,
        visible: true,
        contenu: [
          { id: 'l-1', langue: 'Français', niveau: 'Langue maternelle' },
          { id: 'l-2', langue: 'Anglais', niveau: 'Courant' },
          { id: 'l-3', langue: 'Espagnol', niveau: 'Intermédiaire' }
        ]
      },
      {
        id: 'sec-hob-m7',
        type: 'personnalisee',
        titre: 'Loisirs',
        ordre: 6,
        visible: true,
        contenu: {
          typeLayout: 'liste',
          texteLibre: '• Mode\n• Photographie\n• Voyage'
        }
      }
    ]
  },

  // ==================== MODEL 8: MICHAEL JOHNSON (Photo 4) ====================
  'modele-8': {
    titre: 'CV Michael Johnson — Top Manager Hexagone',
    couleurAccent: '#1B2A4A',
    police: 'Outfit',
    photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    sections: [
      {
        id: 'sec-p-m8',
        type: 'profil',
        titre: 'ABOUT ME & CONTACT',
        ordre: 1,
        visible: true,
        contenu: {
          nomComplet: 'MICHAEL JOHNSON',
          titreProfessionnel: 'Top Manager',
          email: 'michael.johnson@email.com',
          telephone: '(555) 010-0900',
          adresse: '123 Anywhere Street, City',
          resume: 'When you are writing plain text resumes, it\'s important to follow a few formatting guidelines and to fill your resume with targeted keywords. You will find more details about text resume format below.'
        }
      },
      {
        id: 'sec-exp-m8',
        type: 'experience',
        titre: 'EXPERIENCE',
        ordre: 2,
        visible: true,
        contenu: [
          {
            id: 'exp-1',
            poste: 'Administrative Assistant',
            entreprise: 'ABC Company, City, State',
            dateDebut: '2016',
            dateFin: '2020',
            actuel: false,
            description: '• Use a combination of terms and nouns to describe tasks.\n• Don\'t forget to include a variety of targeted keywords.'
          },
          {
            id: 'exp-2',
            poste: 'Administrative Assistant',
            entreprise: 'ABC Company, City, State',
            dateDebut: '2009',
            dateFin: '2016',
            actuel: false,
            description: '• Managed daily operations and administrative staff.'
          },
          {
            id: 'exp-3',
            poste: 'Administrative Assistant',
            entreprise: 'ABC Company, City, State',
            dateDebut: '2004',
            dateFin: '2009',
            actuel: false,
            description: '• Handled client relationships and executive calendar.'
          }
        ]
      },
      {
        id: 'sec-edu-m8',
        type: 'formation',
        titre: 'EDUCATION',
        ordre: 3,
        visible: true,
        contenu: [
          {
            id: 'edu-1',
            diplome: 'Administrative Assistant Certificate',
            etablissement: 'Any College, City, State',
            dateDebut: '2002',
            dateFin: '2004'
          },
          {
            id: 'edu-2',
            diplome: 'Master of Business Administration',
            etablissement: 'State University',
            dateDebut: '2000',
            dateFin: '2002'
          }
        ]
      },
      {
        id: 'sec-sk-m8',
        type: 'competences',
        titre: 'PERSONAL SKILLS',
        ordre: 4,
        visible: true,
        contenu: [
          { id: 's-1', nom: 'Master of Business Administration', niveau: 5 },
          { id: 's-2', nom: 'Communication Strategy', niveau: 5 },
          { id: 's-3', nom: 'Team Leadership', niveau: 4 }
        ]
      }
    ]
  },

  // ==================== MODEL 9: BABACAR NDIAYE / SLATE EXECUTIVE ====================
  'modele-9': {
    titre: 'CV Babacar Ndiaye — Exécutif Ardoise',
    couleurAccent: '#2D3748',
    police: 'Roboto',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    sections: [
      {
        id: 'sec-p-m9',
        type: 'profil',
        titre: 'PROFIL & COORDONNÉES',
        ordre: 1,
        visible: true,
        contenu: {
          nomComplet: 'Babacar Ndiaye',
          titreProfessionnel: 'Directeur d\'Exploitation',
          email: 'babacar.ndiaye@entreprise.sn',
          telephone: '+221 77 654 32 10',
          adresse: 'Dakar, Sénégal',
          linkedin: 'linkedin.com/in/babacar-ndiaye',
          resume: 'Cadre dirigeant fort de 12 ans d\'expérience dans le pilotage des opérations logistiques et la transformation digitale des processus d\'entreprise.'
        }
      },
      {
        id: 'sec-exp-m9',
        type: 'experience',
        titre: 'PARCOURS PROFESSIONNEL',
        ordre: 2,
        visible: true,
        contenu: [
          {
            id: 'exp-1',
            poste: 'Directeur des Opérations',
            entreprise: 'Sénégal Logistics Group',
            dateDebut: '2021',
            dateFin: 'Présent',
            actuel: true,
            description: '• Supervision d\'une équipe de 45 collaborateurs et gestion d\'un budget annuel de 500M FCFA.\n• Optimisation de la chaîne d\'approvisionnement réduisant les délais de livraison de 25%.'
          },
          {
            id: 'exp-2',
            poste: 'Responsable Logistique',
            entreprise: 'Sipres SA, Dakar',
            dateDebut: '2016',
            dateFin: '2021',
            actuel: false,
            description: '• Implémentation du logiciel ERP SAP pour le suivi des stocks en temps réel.'
          }
        ]
      },
      {
        id: 'sec-edu-m9',
        type: 'formation',
        titre: 'FORMATION ACADÉMIQUE',
        ordre: 3,
        visible: true,
        contenu: [
          {
            id: 'edu-1',
            diplome: 'Master en Supply Chain Management',
            etablissement: 'BEM Dakar',
            dateDebut: '2014',
            dateFin: '2016'
          },
          {
            id: 'edu-2',
            diplome: 'Licence en Gestion des Entreprises',
            etablissement: 'Université Cheikh Anta Diop',
            dateDebut: '2011',
            dateFin: '2014'
          }
        ]
      },
      {
        id: 'sec-sk-m9',
        type: 'competences',
        titre: 'COMPÉTENCES CLÉS',
        ordre: 4,
        visible: true,
        contenu: [
          { id: 's-1', nom: 'Gestion de budget & P&L', niveau: 5 },
          { id: 's-2', nom: 'SAP & ERP Logistique', niveau: 5 },
          { id: 's-3', nom: 'Management d\'équipe', niveau: 5 },
          { id: 's-4', nom: 'Négociation fournisseurs', niveau: 4 }
        ]
      }
    ]
  },

  // ==================== MODEL 10: NOEL TAYLOR / STUDIO MINIMALISTE ====================
  'modele-10': {
    titre: 'CV Noel Taylor — Studio Minimaliste Noir',
    couleurAccent: '#1A202C',
    police: 'Poppins',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    sections: [
      {
        id: 'sec-p-m10',
        type: 'profil',
        titre: 'PROFIL',
        ordre: 1,
        visible: true,
        contenu: {
          nomComplet: 'Noel Taylor',
          titreProfessionnel: 'Directeur Artistique & UX Lead',
          email: 'noel@taylorstudio.design',
          telephone: '+33 7 89 01 23 45',
          adresse: 'Bordeaux, France',
          siteWeb: 'www.taylorstudio.design',
          resume: 'Designer passionné par la création d\'expériences numériques minimalistes, épurées et axées sur l\'utilisateur final.'
        }
      },
      {
        id: 'sec-exp-m10',
        type: 'experience',
        titre: 'Expériences',
        ordre: 2,
        visible: true,
        contenu: [
          {
            id: 'exp-1',
            poste: 'Lead UX/UI Designer',
            entreprise: 'Studio Minimal, Paris',
            dateDebut: '2022',
            dateFin: 'Présent',
            actuel: true,
            description: '• Conception de systèmes de design complets pour applications mobiles et web.\n• Animation d\'ateliers de co-conception avec les clients grands comptes.'
          },
          {
            id: 'exp-2',
            poste: 'Senior Graphic Designer',
            entreprise: 'Agence Pixel, Bordeaux',
            dateDebut: '2018',
            dateFin: '2022',
            actuel: false,
            description: '• Direction artistique de campagnes de communication digitale.'
          }
        ]
      },
      {
        id: 'sec-edu-m10',
        type: 'formation',
        titre: 'Formations',
        ordre: 3,
        visible: true,
        contenu: [
          {
            id: 'edu-1',
            diplome: 'Master Design Interactif & Direction Artistique',
            etablissement: 'ECV Digital',
            dateDebut: '2016',
            dateFin: '2018'
          }
        ]
      },
      {
        id: 'sec-sk-m10',
        type: 'competences',
        titre: 'Compétences',
        ordre: 4,
        visible: true,
        contenu: [
          { id: 's-1', nom: 'Figma & Design Systems', niveau: 5 },
          { id: 's-2', nom: 'Prototypage & Micro-interactions', niveau: 5 },
          { id: 's-3', nom: 'Direction Artistique', niveau: 5 }
        ]
      }
    ]
  },

  // ==================== MODEL 11: BORDEAUX ROYAL & CADRE DORÉ ====================
  'modele-11': {
    titre: 'CV Bordeaux Royal & Liseré Doré',
    couleurAccent: '#800020',
    police: 'Georgia',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    sections: [
      {
        id: 'sec-p-m11',
        type: 'profil',
        titre: 'PROFIL & COORDONNÉES',
        ordre: 1,
        visible: true,
        contenu: {
          nomComplet: 'Alexandre De La Tour',
          titreProfessionnel: 'Directeur Général & Stratège',
          email: 'alexandre.delatour@cabinet.fr',
          telephone: '+33 1 42 68 55 00',
          adresse: '8 Place Vendôme, 75001 Paris',
          linkedin: 'linkedin.com/in/alexandre-delatour',
          resume: 'Executive expérimenté cumulant plus de 15 années de direction d\'entreprises et de conseil en stratégie de croissance internationale. Expert en gouvernance et fusions-acquisitions.'
        }
      },
      {
        id: 'sec-exp-m11',
        type: 'experience',
        titre: 'EXPÉRIENCES DE DIRECTION',
        ordre: 2,
        visible: true,
        contenu: [
          {
            id: 'exp-1',
            poste: 'Directeur Général Groupe',
            entreprise: 'Cabinet De La Tour & Associés',
            dateDebut: '2019',
            dateFin: 'Présent',
            actuel: true,
            description: '• Pilotage de la stratégie globale et gestion d\'un chiffre d\'affaires de 45 millions d\'euros.\n• Expansion sur 4 nouveaux marchés européens avec une croissance annuelle de 18%.'
          },
          {
            id: 'exp-2',
            poste: 'Vice-Président Stratégie',
            entreprise: 'Banque d\'Investissement Royale',
            dateDebut: '2012',
            dateFin: '2019',
            actuel: false,
            description: '• Direction des équipes de fusions-acquisitions et structuration de levées de fonds majeures.'
          }
        ]
      },
      {
        id: 'sec-edu-m11',
        type: 'formation',
        titre: 'HAUTES ÉTUDES',
        ordre: 3,
        visible: true,
        contenu: [
          {
            id: 'edu-1',
            diplome: 'Executive MBA',
            etablissement: 'INSEAD Fontainebleau',
            dateDebut: '2010',
            dateFin: '2011'
          },
          {
            id: 'edu-2',
            diplome: 'Master Finance & Stratégie',
            etablissement: 'Sciences Po Paris',
            dateDebut: '2005',
            dateFin: '2009'
          }
        ]
      },
      {
        id: 'sec-sk-m11',
        type: 'competences',
        titre: 'COMPÉTENCES DE GOUVERNANCE',
        ordre: 4,
        visible: true,
        contenu: [
          { id: 's-1', nom: 'Gouvernance & Conseil d\'Administration', niveau: 5 },
          { id: 's-2', nom: 'Fusions & Acquisitions (M&A)', niveau: 5 },
          { id: 's-3', nom: 'Gestion de crise & Leadership', niveau: 5 }
        ]
      }
    ]
  },

  // ==================== MODEL 12: VERT ÉMERAUDE TECH & CONSULTING ====================
  'modele-12': {
    titre: 'CV Vert Émeraude — Tech & Consulting',
    couleurAccent: '#064E3B',
    police: 'Arial',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    sections: [
      {
        id: 'sec-p-m12',
        type: 'profil',
        titre: 'PROFIL & CONTACT',
        ordre: 1,
        visible: true,
        contenu: {
          nomComplet: 'Karelle Mbida',
          titreProfessionnel: 'Consultante Senior Data & IA',
          email: 'karelle.mbida@data-consulting.cm',
          telephone: '+237 677 88 99 00',
          adresse: 'Yaoundé, Cameroun',
          linkedin: 'linkedin.com/in/karelle-mbida',
          resume: 'Experte en science des données et intelligence artificielle appliquée. Passionnée par la transformation des données brutes en leviers de décision stratégique.'
        }
      },
      {
        id: 'sec-exp-m12',
        type: 'experience',
        titre: 'EXPÉRIENCES TECH',
        ordre: 2,
        visible: true,
        contenu: [
          {
            id: 'exp-1',
            poste: 'Consultante Data Science Senior',
            entreprise: 'Africa Analytics Lab',
            dateDebut: '2022',
            dateFin: 'Présent',
            actuel: true,
            description: '• Déploiement de modèles prédictifs pour le secteur bancaire et télécoms.\n• Optimisation d\'algorithmes d\'apprentissage automatique pour la détection de fraudes.'
          },
          {
            id: 'exp-2',
            poste: 'Ingénieure Data & BI',
            entreprise: 'MTN Cameroun',
            dateDebut: '2018',
            dateFin: '2022',
            actuel: false,
            description: '• Conception de pipelines ETL sécurisés et de dashboards décisionnels sur Power BI.'
          }
        ]
      },
      {
        id: 'sec-edu-m12',
        type: 'formation',
        titre: 'DIPLÔMES INGÉNIEUR',
        ordre: 3,
        visible: true,
        contenu: [
          {
            id: 'edu-1',
            diplome: 'Diplôme d\'Ingénieur en Big Data & IA',
            etablissement: 'École Nationale Supérieure Polytechnique',
            dateDebut: '2013',
            dateFin: '2018'
          }
        ]
      },
      {
        id: 'sec-sk-m12',
        type: 'competences',
        titre: 'LOGICIELS & OUTILS',
        ordre: 4,
        visible: true,
        contenu: [
          { id: 's-1', nom: 'Python (Pandas, Scikit-learn, PyTorch)', niveau: 5 },
          { id: 's-2', nom: 'SQL / PostgreSQL / Snowflake', niveau: 5 },
          { id: 's-3', nom: 'Power BI & Tableau', niveau: 4 }
        ]
      }
    ]
  },

  // ==================== MODEL 13: TERRACOTTA GÉOMÉTRIE ====================
  'modele-13': {
    titre: 'CV Terracotta — Marketing & Design',
    couleurAccent: '#C2410C',
    police: 'Montserrat',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    sections: [
      {
        id: 'sec-p-m13',
        type: 'profil',
        titre: 'PROFIL & CONTACT',
        ordre: 1,
        visible: true,
        contenu: {
          nomComplet: 'Nadia Diallo',
          titreProfessionnel: 'Brand Manager & Brand Designer',
          email: 'nadia.diallo@brandstudio.com',
          telephone: '+221 78 123 45 67',
          adresse: 'Dakar, Sénégal',
          resume: 'Créative inspirée spécialisée dans le branding holistique, l\'identité de marque et les stratégies d\'engagement visuel.'
        }
      },
      {
        id: 'sec-exp-m13',
        type: 'experience',
        titre: 'EXPÉRIENCES BRANDING',
        ordre: 2,
        visible: true,
        contenu: [
          {
            id: 'exp-1',
            poste: 'Brand Manager Senior',
            entreprise: 'Teranga Creative Agency',
            dateDebut: '2021',
            dateFin: 'Présent',
            actuel: true,
            description: '• Refonte complète de l\'image de marque de 12 grandes entreprises ouest-africaines.\n• Supervision de campagnes 360° sur réseaux sociaux et affichage urbain.'
          }
        ]
      },
      {
        id: 'sec-edu-m13',
        type: 'formation',
        titre: 'FORMATIONS ARTISTIQUES',
        ordre: 3,
        visible: true,
        contenu: [
          {
            id: 'edu-1',
            diplome: 'Master Direction Artistique',
            etablissement: 'Institut Supérieur des Arts de Dakar',
            dateDebut: '2016',
            dateFin: '2020'
          }
        ]
      },
      {
        id: 'sec-sk-m13',
        type: 'competences',
        titre: 'EXPERTISES',
        ordre: 4,
        visible: true,
        contenu: [
          { id: 's-1', nom: 'Identité Visuelle & Branding', niveau: 5 },
          { id: 's-2', nom: 'Adobe Creative Suite', niveau: 5 },
          { id: 's-3', nom: 'Content Strategy', niveau: 4 }
        ]
      }
    ]
  },

  // ==================== MODEL 14: BLEU MARINE & LIGNES DORÉES ====================
  'modele-14': {
    titre: 'CV Bleu Marine & Or — Avocat & Finance',
    couleurAccent: '#0F172A',
    police: 'Times New Roman',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    sections: [
      {
        id: 'sec-p-m14',
        type: 'profil',
        titre: 'COORDONNÉES ET PRÉSENTATION',
        ordre: 1,
        visible: true,
        contenu: {
          nomComplet: 'Maître Charles Koffi',
          titreProfessionnel: 'Avocat d\'Affaires / Juriste Senior',
          email: 'charles.koffi@cabinet-koffi.ci',
          telephone: '+225 07 08 09 10 11',
          adresse: 'Abidjan, Côte d\'Ivoire',
          resume: 'Avocat au Barreau spécialisé en droit des affaires de l\'OHADA, droit fiscal d\'entreprise et contentieux commercial complexe.'
        }
      },
      {
        id: 'sec-exp-m14',
        type: 'experience',
        titre: 'EXPÉRIENCE EN CABINET ET ENTREPRISE',
        ordre: 2,
        visible: true,
        contenu: [
          {
            id: 'exp-1',
            poste: 'Avocat Associé - Droit des Affaires',
            entreprise: 'Cabinet Koffi & Associés',
            dateDebut: '2017',
            dateFin: 'Présent',
            actuel: true,
            description: '• Conseil juridique auprès de groupes industriels majeurs en Afrique de l\'Ouest.\n• Rédaction de contrats d\'affaires internationaux et négociation d\'accords commerciaux.'
          }
        ]
      },
      {
        id: 'sec-edu-m14',
        type: 'formation',
        titre: 'TITRES UNIVERSI TAIRES',
        ordre: 3,
        visible: true,
        contenu: [
          {
            id: 'edu-1',
            diplome: 'CAPA & Master 2 Droit des Affaires OHADA',
            etablissement: 'Université Felix Houphouët-Boigny',
            dateDebut: '2010',
            dateFin: '2016'
          }
        ]
      },
      {
        id: 'sec-sk-m14',
        type: 'competences',
        titre: 'DOMAINES D\'EXPERTISE JURIDIQUE',
        ordre: 4,
        visible: true,
        contenu: [
          { id: 's-1', nom: 'Droit commercial & des sociétés OHADA', niveau: 5 },
          { id: 's-2', nom: 'Contentieux & Arbitrage international', niveau: 5 },
          { id: 's-3', nom: 'Audit fiscal d\'entreprise', niveau: 4 }
        ]
      }
    ]
  },

  // ==================== MODEL 15: VERT OLIVE NATURE ====================
  'modele-15': {
    titre: 'CV Vert Olive Nature — Ingénierie & Dev',
    couleurAccent: '#3F6212',
    police: 'Calibri',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    sections: [
      {
        id: 'sec-p-m15',
        type: 'profil',
        titre: 'PROFIL & CONTACT',
        ordre: 1,
        visible: true,
        contenu: {
          nomComplet: 'Serge Tchakounté',
          titreProfessionnel: 'Ingénieur DevOps & Cloud Architect',
          email: 'serge.tchakounte@cloudnet.io',
          telephone: '+237 699 00 11 22',
          adresse: 'Douala, Cameroun',
          resume: 'Ingénieur système et Cloud chevronné, spécialisé dans la mise en place d\'infrastructures résilientes, la conteneurisation Docker/Kubernetes et l\'automatisation CI/CD.'
        }
      },
      {
        id: 'sec-exp-m15',
        type: 'experience',
        titre: 'PARCOURS DÉVELOPPEMENT & CLOUD',
        ordre: 2,
        visible: true,
        contenu: [
          {
            id: 'exp-1',
            poste: 'Lead DevOps & Cloud Engineer',
            entreprise: 'Fintech Cameroun SA',
            dateDebut: '2020',
            dateFin: 'Présent',
            actuel: true,
            description: '• Architecture de microservices hautement disponibles sur AWS et Google Cloud Platform.\n• Automatisation des déploiements avec Terraform et Ansible réduisant les pannes de 40%.'
          }
        ]
      },
      {
        id: 'sec-edu-m15',
        type: 'formation',
        titre: 'FORMATION ACADÉMIQUE',
        ordre: 3,
        visible: true,
        contenu: [
          {
            id: 'edu-1',
            diplome: 'Master en Réseaux, Télécoms & Cloud',
            etablissement: 'IAI Cameroun',
            dateDebut: '2015',
            dateFin: '2020'
          }
        ]
      },
      {
        id: 'sec-sk-m15',
        type: 'competences',
        titre: 'COMPÉTENCES TECHNIQUES',
        ordre: 4,
        visible: true,
        contenu: [
          { id: 's-1', nom: 'Docker, Kubernetes, Helm', niveau: 5 },
          { id: 's-2', nom: 'AWS, GCP, Cloud Security', niveau: 5 },
          { id: 's-3', nom: 'Terraform, CI/CD GitHub Actions', niveau: 5 }
        ]
      }
    ]
  },

  // ==================== MODEL 16: CHARLES SARTRÉ (VERT CANARD) ====================
  'modele-16': {
    titre: 'CV Charles Sartré — Commercial Senior',
    couleurAccent: '#237A62',
    police: 'Arial',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    sections: [
      {
        id: 'sec-p-m16',
        type: 'profil',
        titre: 'Informations Personnelles',
        ordre: 1,
        visible: true,
        contenu: {
          nomComplet: 'Charles Sartré',
          titreProfessionnel: 'Responsable commercial senior',
          email: 'charles.sartre@gmail.com',
          telephone: '+33 7 54 84 21 21',
          adresse: '75 000 Paris',
          linkedin: 'linkedin.com/in/charlessartrezety',
          resume: 'Responsable commercial B2B avec dix ans d\'expérience dans la gestion de comptes clients et d\'équipes commerciales dans les domaines de la haute technologie. Apte à gérer de vastes équipes de commerciaux tout en appliquant mon savoir-faire en stratégie de marché et d\'acquisition.'
        }
      },
      {
        id: 'sec-exp-m16',
        type: 'experience',
        titre: 'Expérience Professionnelle',
        ordre: 2,
        visible: true,
        contenu: [
          {
            id: 'exp-1',
            poste: 'Responsable commercial B2B',
            entreprise: 'Cellnex Telecom, Paris',
            dateDebut: '01/2012',
            dateFin: '05/2020',
            actuel: false,
            description: '• Développer le portefeuille commercial (B2B) et fidéliser la clientèle.\n• Gérer les grands comptes essentiels.\n• Superviser une équipe de 20 commerciaux sédentaires et nomades.\n• Préparer et négocier les appels d\'offres.\n\nRésultats majeurs :\n• Augmentation du chiffre d\'affaires annuel de 25% en moyenne sur les 5 dernières années.'
          },
          {
            id: 'exp-2',
            poste: 'Commercial B2B',
            entreprise: 'Dell EMC France, Paris',
            dateDebut: '06/2009',
            dateFin: '12/2011',
            actuel: false,
            description: '• Effectuer la prospection dans la France entière.\n• Générer de nouveaux leads par démarchage.\n• Convenir et négocier les contrats.'
          }
        ]
      },
      {
        id: 'sec-edu-m16',
        type: 'formation',
        titre: 'Formation',
        ordre: 3,
        visible: true,
        contenu: [
          {
            id: 'edu-1',
            diplome: 'Licence professionnelle commerce',
            etablissement: 'Akor Alternance, Paris',
            dateDebut: '09/2008',
            dateFin: '06/2009'
          },
          {
            id: 'edu-2',
            diplome: 'BTS NRC (Négociation Relation Client)',
            etablissement: 'Akor Alternance, Paris',
            dateDebut: '09/2006',
            dateFin: '06/2008'
          }
        ]
      },
      {
        id: 'sec-sk-m16',
        type: 'competences',
        titre: 'Compétences',
        ordre: 4,
        visible: true,
        contenu: [
          { id: 's-1', nom: 'Gestion d\'équipe commerciale', niveau: 5, categorie: 'Management' },
          { id: 's-2', nom: 'Stratégie commerciale & marché', niveau: 5, categorie: 'Vente B2B' },
          { id: 's-3', nom: 'Négociation & Force de proposition', niveau: 5, categorie: 'Vente B2B' },
          { id: 's-4', nom: 'Microsoft CRM & Salesforce', niveau: 4, categorie: 'Informatique' }
        ]
      }
    ]
  },

  // ==================== MODEL 17: THOMAS DURANT (NAVY ARCH) ====================
  'modele-17': {
    titre: 'CV Thomas Durant — Contrôleur de Gestion',
    couleurAccent: '#0A192F',
    couleurFondSidebar: '#0A192F',
    couleurTexteSidebar: '#FFFFFF',
    nombreColonnes: 2,
    largeurColonneGauche: 34,
    formeSidebarDecor: 'arch-top',
    timelineStyle: 'line-dots',
    cadrePhotoRing: 'double-ring',
    styleEnTete: 'arch',
    photoForme: 'arche',
    photoPosition: 'in-header',
    police: 'Montserrat',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    sections: [
      {
        id: 'sec-p-m17',
        type: 'profil',
        titre: 'CONTACT & PROFIL',
        colonne: 'gauche',
        ordre: 1,
        visible: true,
        contenu: {
          nomComplet: 'Thomas DURANT',
          titreProfessionnel: 'CONTRÔLEUR DE GESTION',
          email: 'thomas.durant@mail.com',
          telephone: '+33 6 66 66 66 66',
          adresse: 'Paris, France',
          linkedin: 'linkedin.com/in/mon-profil',
          resume: 'Expert en pilotage de la performance avec 8 ans d\'expérience. Spécialiste de l\'optimisation des coûts et des processus budgétaires, j\'agis en véritable Business Partner pour transformer la donnée financière en leviers de croissance.'
        }
      },
      {
        id: 'sec-sk-m17',
        type: 'competences',
        titre: 'COMPÉTENCES & LOGICIELS',
        colonne: 'gauche',
        ordre: 2,
        visible: true,
        contenu: [
          { id: 's-1', nom: 'Pilotage Financier & Investissements', niveau: 5, categorie: 'Finance' },
          { id: 's-2', nom: 'SAP S/4HANA & Power BI', niveau: 5, categorie: 'Logiciels' },
          { id: 's-3', nom: 'Excel Avancé & Tableau Software', niveau: 5, categorie: 'Logiciels' }
        ]
      },
      {
        id: 'sec-exp-m17',
        type: 'experience',
        titre: 'EXPÉRIENCES PROFESSIONNELLES',
        colonne: 'droite',
        ordre: 3,
        visible: true,
        contenu: [
          {
            id: 'exp-1',
            poste: 'CONTRÔLEUR DE GESTION SENIOR',
            entreprise: 'Groupe Saint-Gobain (Siège - La Défense)',
            dateDebut: '01/201X',
            dateFin: 'En cours',
            actuel: true,
            description: '• Périmètre : Supervision de la BU "Solutions Haute Performance" (CA de 210M€).\n• Réalisation phare : Pilotage de la convergence des indicateurs financiers suite à l\'acquisition d\'une filiale européenne.\n• Reporting : Élaboration des tableaux de bord mensuels pour le Comité de Direction sous SAP S/4HANA.'
          },
          {
            id: 'exp-2',
            poste: 'CONTRÔLEUR DE GESTION JUNIOR',
            entreprise: 'Groupe Carrefour (Siège France)',
            dateDebut: '09/201X',
            dateFin: '12/201X',
            actuel: false,
            description: '• Gestion opérationnelle : Analyse de la rentabilité de 45 hypermarchés Île-de-France.\n• Budget : Co-animation des navettes budgétaires avec les directeurs de magasins.'
          }
        ]
      },
      {
        id: 'sec-edu-m17',
        type: 'formation',
        titre: 'FORMATION',
        colonne: 'droite',
        ordre: 4,
        visible: true,
        contenu: [
          {
            id: 'edu-1',
            diplome: 'MASTER 2 - CONTRÔLE DE GESTION',
            etablissement: 'Université Paris-Dauphine',
            dateDebut: '201X',
            dateFin: '201X'
          }
        ]
      }
    ]
  },

  // ==================== MODEL 18: SLATE & GOLD BANNERS ====================
  'modele-18': {
    titre: 'CV Ardoise & Bannières Dorées',
    couleurAccent: '#3A4750',
    police: 'Inter',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    sections: [
      {
        id: 'sec-p-m18',
        type: 'profil',
        titre: 'PROFIL & CONTACT',
        ordre: 1,
        visible: true,
        contenu: {
          nomComplet: 'Prénom Nom',
          titreProfessionnel: 'Poste Occupé ou Recherché',
          email: 'nom.prenom@gmail.com',
          telephone: '06 06 06 06 06',
          adresse: 'Ville, Pays',
          resume: 'Professionnel rigoureux et méthodique disposant d\'une expérience significative dans la gestion stratégique, l\'organisation d\'équipes pluridisciplinaires et la conduite de projets d\'envergure.'
        }
      },
      {
        id: 'sec-exp-m18',
        type: 'experience',
        titre: 'EXPÉRIENCE PROFESSIONNELLE',
        ordre: 2,
        visible: true,
        contenu: [
          {
            id: 'exp-1',
            poste: 'Poste occupé',
            entreprise: 'Nom de l\'Entreprise | Ville',
            dateDebut: '20XX',
            dateFin: '20XX',
            actuel: false,
            description: '• Gestion opérationnelle quotidienne des activités et encadrement des équipes.\n• Suivi des objectifs et mise en place d\'outils d\'amélioration continue de la qualité.'
          },
          {
            id: 'exp-2',
            poste: 'Poste occupé',
            entreprise: 'Nom de l\'Entreprise | Ville',
            dateDebut: '20XX',
            dateFin: '20XX',
            actuel: false,
            description: '• Coordination des projets clients et élaboration des rapports d\'activité stratégiques.'
          }
        ]
      },
      {
        id: 'sec-edu-m18',
        type: 'formation',
        titre: 'FORMATION',
        ordre: 3,
        visible: true,
        contenu: [
          {
            id: 'edu-1',
            diplome: 'Diplôme obtenu',
            etablissement: 'Université, lycée ou école',
            dateDebut: '20XX',
            dateFin: '20XX'
          }
        ]
      },
      {
        id: 'sec-sk-m18',
        type: 'competences',
        titre: 'COMPÉTENCES',
        ordre: 4,
        visible: true,
        contenu: [
          { id: 's-1', nom: 'Google Drive & Outils Collaboratifs', niveau: 5, categorie: 'Bureautique' },
          { id: 's-2', nom: 'Travail en équipe & Leadership', niveau: 5, categorie: 'Soft Skills' },
          { id: 's-3', nom: 'Gestion de crise & SEO', niveau: 4, categorie: 'Spécialité' }
        ]
      }
    ]
  },

  // ==================== MODEL 19: BLEU ROI INTÉRIMAIRE ====================
  'modele-19': {
    titre: 'CV Bleu Roi Intérimaire Pro',
    couleurAccent: '#1E3A8A',
    police: 'Roboto',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    sections: [
      {
        id: 'sec-p-m19',
        type: 'profil',
        titre: 'PROFIL & CONTACT',
        ordre: 1,
        visible: true,
        contenu: {
          nomComplet: 'PRÉNOM NOM',
          titreProfessionnel: 'INTÉRIMAIRE / ASSISTANT',
          email: 'prenom.nom@gmail.com',
          telephone: '+33 6 66 66 66 66',
          adresse: 'Paris, France',
          linkedin: 'linkedin.com/in/prenom.nom',
          resume: 'Je suis un professionnel polyvalent et organisé avec une solide expérience en tant qu\'assistant administratif. J\'ai démontré ma capacité à gérer efficacement les tâches quotidiennes, communiquer avec les clients et résoudre les problèmes.'
        }
      },
      {
        id: 'sec-exp-m19',
        type: 'experience',
        titre: 'EXPÉRIENCES PROFESSIONNELLES',
        ordre: 2,
        visible: true,
        contenu: [
          {
            id: 'exp-1',
            poste: 'Assistant Administratif',
            entreprise: 'Entreprise ABC',
            dateDebut: '20XX',
            dateFin: '20XX',
            actuel: false,
            description: '• Gestion de l\'agenda du directeur général, organisation de réunions et programmation des déplacements.\n• Préparation de rapports et de présentations en utilisant Microsoft Office.'
          },
          {
            id: 'exp-2',
            poste: 'Assistant Administratif',
            entreprise: 'Entreprise XYZ',
            dateDebut: '20XX',
            dateFin: '20XX',
            actuel: false,
            description: '• Traitement des appels téléphoniques et de la correspondance.\n• Saisie de données et mise à jour de bases de données clients.'
          }
        ]
      },
      {
        id: 'sec-edu-m19',
        type: 'formation',
        titre: 'FORMATION',
        ordre: 3,
        visible: true,
        contenu: [
          {
            id: 'edu-1',
            diplome: 'Bachelor en Gestion Administrative',
            etablissement: 'Établissement Supérieur',
            dateDebut: '20XX',
            dateFin: '20XX'
          }
        ]
      },
      {
        id: 'sec-sk-m19',
        type: 'competences',
        titre: 'COMPÉTENCES & OUTILS',
        ordre: 4,
        visible: true,
        contenu: [
          { id: 's-1', nom: 'Microsoft Office & Trello', niveau: 5, categorie: 'Logiciels' },
          { id: 's-2', nom: 'Organisation & Time Management', niveau: 5, categorie: 'Savoir-être' },
          { id: 's-3', nom: 'Français (Maternelle), Anglais (Courant)', niveau: 4, categorie: 'Langues' }
        ]
      }
    ]
  },

  // ==================== MODEL 20: MICHEL MARTIN (COURBES VERTES) ====================
  'modele-20': {
    titre: 'CV Michel Martin — Courbes Vertes',
    couleurAccent: '#65A30D',
    police: 'Trebuchet MS',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    sections: [
      {
        id: 'sec-p-m20',
        type: 'profil',
        titre: 'Coordonnées & Titre',
        ordre: 1,
        visible: true,
        contenu: {
          nomComplet: 'Michel MARTIN',
          titreProfessionnel: 'Chef de projet internet / multimédia',
          email: 'michel.martin@primocv.com',
          telephone: '01 00 00 00 00 / 06 00 00 00 00',
          adresse: '320 avenue de la Liberté apt 7B, 75000 Paris',
          siteWeb: 'www.monsite.com',
          resume: 'Chef de projet multimédia passionné par le webdesign, le développement interactif et la création graphique 3D.'
        }
      },
      {
        id: 'sec-exp-m20',
        type: 'experience',
        titre: 'PRINCIPALES EXPÉRIENCES PROFESSIONNELLES',
        ordre: 2,
        visible: true,
        contenu: [
          {
            id: 'exp-1',
            poste: 'Chef de projet',
            entreprise: 'Agence Combo',
            dateDebut: 'août 2009',
            dateFin: 'juillet 2011',
            actuel: false,
            description: '• Gestion de Projet | Réalisation de CD-ROM multimédias et plaquettes institutionnelles.'
          },
          {
            id: 'exp-2',
            poste: 'Infographiste',
            entreprise: 'Groupe Danone',
            dateDebut: 'décembre 2003',
            dateFin: 'mai 2009',
            actuel: false,
            description: '• Réalisation de la campagne de promotion internet et supports PLV.'
          }
        ]
      },
      {
        id: 'sec-edu-m20',
        type: 'formation',
        titre: 'FORMATION',
        ordre: 3,
        visible: true,
        contenu: [
          {
            id: 'edu-1',
            diplome: 'École des beaux arts de Dijon',
            etablissement: 'Dijon',
            dateDebut: '1999',
            dateFin: '2000'
          }
        ]
      },
      {
        id: 'sec-sk-m20',
        type: 'competences',
        titre: 'DOMAINES DE COMPÉTENCES',
        ordre: 4,
        visible: true,
        contenu: [
          { id: 's-1', nom: 'Création 3D (Concept, artwork, modélisation)', niveau: 5, categorie: '3D & Motion' },
          { id: 's-2', nom: 'Web Design (XHTML/CSS, Dreamweaver)', niveau: 5, categorie: 'Web' },
          { id: 's-3', nom: 'Graphisme (Illustrator, Photoshop, Quark)', niveau: 5, categorie: 'Design' },
          { id: 's-4', nom: 'Vidéos (Première, After Effects, 3ds Max)', niveau: 4, categorie: 'Vidéo' }
        ]
      }
    ]
  },

  // ==================== MODEL 21: CONSULTANT RH ====================
  'modele-21': {
    titre: 'CV Consultant RH — Cyan Marine',
    couleurAccent: '#0284C7',
    police: 'Poppins',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    sections: [
      {
        id: 'sec-p-m21',
        type: 'profil',
        titre: 'MON PROFIL & CONTACT',
        ordre: 1,
        visible: true,
        contenu: {
          nomComplet: 'SOPHIE MARTIN',
          titreProfessionnel: 'CONSULTANTE RESSOURCES HUMAINES',
          email: 'sophie.martin@hr-consult.fr',
          telephone: '+33 6 21 00 11 22',
          adresse: 'Lyon, France',
          resume: 'Spécialiste de la conduite du changement, du recrutement des cadres et du développement des talents avec 8 ans d\'expérience.'
        }
      },
      {
        id: 'sec-exp-m21',
        type: 'experience',
        titre: 'PARCOURS PROFESSIONNEL',
        ordre: 2,
        visible: true,
        contenu: [
          {
            id: 'exp-21-1',
            poste: 'Senior Consultant RH',
            entreprise: 'TALENT SOLUTIONS',
            ville: 'Lyon',
            dateDebut: '2020',
            dateFin: 'Présent',
            description: '• Recrutement stratégique de profils Tech & Executive.\n• Audit du climat social et accompagnement du management.'
          }
        ]
      },
      {
        id: 'sec-form-m21',
        type: 'formation',
        titre: 'FORMATIONS ACCRÉDITÉES',
        ordre: 3,
        visible: true,
        contenu: [
          { id: 'f-21-1', diplome: 'Master 2 Management des RH', etablissement: 'IAE Lyon', dateDebut: '2017', dateFin: '2019' }
        ]
      },
      {
        id: 'sec-comp-m21',
        type: 'competences',
        titre: 'EXPERTISES CLEFS',
        ordre: 4,
        visible: true,
        contenu: [
          { id: 's-21-1', nom: 'Recrutement & Sourcing Advanced', niveau: 5 },
          { id: 's-21-2', nom: 'Gestion des Conflits & Négo', niveau: 5 },
          { id: 's-21-3', nom: 'GPEC & Bilan de Compétences', niveau: 4 }
        ]
      }
    ]
  },

  // ==================== MODEL 22: INGÉNIEUR DATA ====================
  'modele-22': {
    titre: 'CV Ingénieur Data — Bleu Ardoise',
    couleurAccent: '#3B82F6',
    police: 'Roboto',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    sections: [
      {
        id: 'sec-p-m22',
        type: 'profil',
        titre: 'INFORMATIONS & RENSEIGNEMENTS',
        ordre: 1,
        visible: true,
        contenu: {
          nomComplet: 'ALEXANDRE DUBOIS',
          titreProfessionnel: 'INGÉNIEUR DATA & CLOUD ARCHITECT',
          email: 'a.dubois@data-tech.io',
          telephone: '+33 6 44 55 66 77',
          adresse: 'Toulouse, France',
          resume: 'Conception de pipelines ETL volumineux, architecture Big Data et modélisation prédictive sous environnement AWS / GCP.'
        }
      },
      {
        id: 'sec-exp-m22',
        type: 'experience',
        titre: 'EXPÉRIENCES IT & BIG DATA',
        ordre: 2,
        visible: true,
        contenu: [
          { id: 'exp-22-1', poste: 'Lead Data Engineer', entreprise: 'AIRBUS DATA LAB', ville: 'Toulouse', dateDebut: '2021', dateFin: 'Présent', description: '• Pipeline Spark/Kafka traitant 5TB/jour.\n• Migration vers Snowflake & Databricks.' }
        ]
      },
      {
        id: 'sec-form-m22',
        type: 'formation',
        titre: 'DIPLÔMES D\'INGÉNIEUR',
        ordre: 3,
        visible: true,
        contenu: [
          { id: 'f-22-1', diplome: 'Diplôme d\'Ingénieur Informatique', etablissement: 'INSA Toulouse', dateDebut: '2016', dateFin: '2021' }
        ]
      },
      {
        id: 'sec-comp-m22',
        type: 'competences',
        titre: 'STACK TECHNIQUE DATA',
        ordre: 4,
        visible: true,
        contenu: [
          { id: 's-22-1', nom: 'Python, PySpark, SQL, Scala', niveau: 5 },
          { id: 's-22-2', nom: 'AWS Big Data (Redshift, S3, Glue)', niveau: 5 },
          { id: 's-22-3', nom: 'Docker, Kubernetes, Terraform', niveau: 4 }
        ]
      }
    ]
  },

  // ==================== MODEL 23: ARCHITECTE DESIGN ====================
  'modele-23': {
    titre: 'CV Architecte D.E. — Sable & Terre',
    couleurAccent: '#D97706',
    police: 'Outfit',
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    sections: [
      {
        id: 'sec-p-m23',
        type: 'profil',
        titre: 'PROFIL & CONTACT ARCHI',
        ordre: 1,
        visible: true,
        contenu: {
          nomComplet: 'CAMILLE MOREAU',
          titreProfessionnel: 'ARCHITECTE D.E. & DESIGN D\'ESPACE',
          email: 'camille@moreau-archi.fr',
          telephone: '+33 6 88 99 00 11',
          adresse: 'Bordeaux, France',
          resume: 'Conception de projets écologiques à forte valeur ajoutée esthétique, réhabilitation du patrimoine et modélisation BIM.'
        }
      },
      {
        id: 'sec-exp-m23',
        type: 'experience',
        titre: 'PROJETS & RÉALISATIONS ARCHI',
        ordre: 2,
        visible: true,
        contenu: [
          { id: 'exp-23-1', poste: 'Chef de Projet Architecte', entreprise: 'STUDIO OCRE', ville: 'Bordeaux', dateDebut: '2019', dateFin: 'Présent', description: '• Suivi de chantier pour résidences 40 logements HQE.\n• Modélisation Revit BIM Niveaux 2 et 3.' }
        ]
      },
      {
        id: 'sec-form-m23',
        type: 'formation',
        titre: 'CURSUS ACADÉMIQUE ARCHI',
        ordre: 3,
        visible: true,
        contenu: [
          { id: 'f-23-1', diplome: 'Diplôme d\'État d\'Architecte (DEA)', etablissement: 'ENSAP Bordeaux', dateDebut: '2014', dateFin: '2019' }
        ]
      },
      {
        id: 'sec-comp-m23',
        type: 'competences',
        titre: 'LOGICIELS & SAVOIR-FAIRE',
        ordre: 4,
        visible: true,
        contenu: [
          { id: 's-23-1', nom: 'Autocad 2D/3D, Revit, ArchiCAD', niveau: 5 },
          { id: 's-23-2', nom: 'Rhino 3D, V-Ray, Photoshop', niveau: 5 },
          { id: 's-23-3', nom: 'Normes PMR, RE2020 & HQE', niveau: 4 }
        ]
      }
    ]
  },

  // ==================== MODEL 24: JURISTE D\'AFFAIRES ====================
  'modele-24': {
    titre: 'CV Juriste d\'Affaires — Bleu Nuit Noble',
    couleurAccent: '#1E3A8A',
    police: 'Garamond',
    photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    sections: [
      {
        id: 'sec-p-m24',
        type: 'profil',
        titre: 'COORDONNÉES & PRÉSENTATION JURIDIQUE',
        ordre: 1,
        visible: true,
        contenu: {
          nomComplet: 'ANTOINE DE SAINT-CYR',
          titreProfessionnel: 'JURISTE SENIOR EN DROIT DES AFFAIRES',
          email: 'a.saintcyr@cabinet-avocats.fr',
          telephone: '+33 1 45 67 89 00',
          adresse: 'Paris, France',
          resume: 'Spécialisé en fusions-acquisitions, rédaction de contrats complexes et conformité RGPD / Sapin II pour multinationales.'
        }
      },
      {
        id: 'sec-exp-m24',
        type: 'experience',
        titre: 'PRATIQUE JURIDIQUE & CONTRACTUELLE',
        ordre: 2,
        visible: true,
        contenu: [
          { id: 'exp-24-1', poste: 'Responsable Juridique M&A', entreprise: 'GROUPE LAGARDÈRE', ville: 'Paris', dateDebut: '2018', dateFin: 'Présent', description: '• Négociation et rédaction de contrats de cession internationaux.\n• Gestion du risque contentieux et gouvernance d\'entreprise.' }
        ]
      },
      {
        id: 'sec-form-m24',
        type: 'formation',
        titre: 'DIPLÔMES ET CERTIFICATS DROIT',
        ordre: 3,
        visible: true,
        contenu: [
          { id: 'f-24-1', diplome: 'Master 2 Droit des Affaires & DJCE', etablissement: 'Université Paris 1 Panthéon-Sorbonne', dateDebut: '2016', dateFin: '2018' }
        ]
      },
      {
        id: 'sec-comp-m24',
        type: 'competences',
        titre: 'COMPÉTENCES JURIDIQUES CLEFS',
        ordre: 4,
        visible: true,
        contenu: [
          { id: 's-24-1', nom: 'Droit des Sociétés & M&A', niveau: 5 },
          { id: 's-24-2', nom: 'Négociation Contractuelle Fr/En', niveau: 5 },
          { id: 's-24-3', nom: 'Conformité RGPD & Anticorruption', niveau: 5 }
        ]
      }
    ]
  },

  // ==================== MODEL 25: NOEL TAYLOR (CREATIF) ====================
  'modele-25': {
    titre: 'CV Noël Taylor — Blocs Arches Minimal',
    couleurAccent: '#18181B',
    police: 'Poppins',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    sections: [
      {
        id: 'sec-p-m25',
        type: 'profil',
        titre: 'CONTACT & IDENTITÉ',
        ordre: 1,
        visible: true,
        contenu: {
          nomComplet: 'NOËL TAYLOR',
          titreProfessionnel: 'DIRECTEUR ARTISTIQUE & BRAND STRATEGIST',
          email: 'noel@taylor-studio.com',
          telephone: '+33 6 99 88 77 66',
          adresse: 'Nantes, France',
          resume: 'Direction de création globale, identité visuelle et stratégie de marque pour marques de luxe et culturelles.'
        }
      },
      {
        id: 'sec-exp-m25',
        type: 'experience',
        titre: 'EXPÉRIENCES ARTISTIQUES',
        ordre: 2,
        visible: true,
        contenu: [
          { id: 'exp-25-1', poste: 'Directeur Artistique Lead', entreprise: 'AGENCE PUBLICIS', ville: 'Paris/Nantes', dateDebut: '2019', dateFin: 'Présent', description: '• Conception de campagnes 360° pour comptes premium.\n• Management d\'une équipe de 6 designers et motion artists.' }
        ]
      },
      {
        id: 'sec-form-m25',
        type: 'formation',
        titre: 'ÉCOLE DES BEAUX-ARTS',
        ordre: 3,
        visible: true,
        contenu: [
          { id: 'f-25-1', diplome: 'Master Design & Direction Artistique', etablissement: 'École Boulle', dateDebut: '2015', dateFin: '2019' }
        ]
      },
      {
        id: 'sec-comp-m25',
        type: 'competences',
        titre: 'MAÎTRISE OUTILS ART',
        ordre: 4,
        visible: true,
        contenu: [
          { id: 's-25-1', nom: 'Figma, Adobe CC, Blender 3D', niveau: 5 },
          { id: 's-25-2', nom: 'Typographie & Layout Design', niveau: 5 }
        ]
      }
    ]
  },

  // ==================== MODEL 26: TECH STARTUP INDIGO ====================
  'modele-26': {
    titre: 'CV Tech Startup — Indigo Minimal',
    couleurAccent: '#4F46E5',
    police: 'Inter',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    sections: [
      {
        id: 'sec-p-m26',
        type: 'profil',
        titre: 'PROFIL TECH & COORDONNÉES',
        ordre: 1,
        visible: true,
        contenu: {
          nomComplet: 'LUCAS VERNON',
          titreProfessionnel: 'FULLSTACK DEVELOPER & DEVOPS',
          email: 'lucas.vernon@tech-startup.io',
          telephone: '+33 6 01 02 03 04',
          adresse: 'Lille, France',
          resume: 'Développeur passionné TypeScript/React/Node.js orienté haute performance et architecture cloud serverless.'
        }
      },
      {
        id: 'sec-exp-m26',
        type: 'experience',
        titre: 'EXPÉRIENCES DÉVELOPPEMENT',
        ordre: 2,
        visible: true,
        contenu: [
          { id: 'exp-26-1', poste: 'Senior Fullstack Eng', entreprise: 'SCALE-UP PAY', ville: 'Lille', dateDebut: '2021', dateFin: 'Présent', description: '• Refonte de l\'architecture micro-services sous Kubernetes.\n• Amélioration du temps de réponse de 35%.' }
        ]
      },
      {
        id: 'sec-form-m26',
        type: 'formation',
        titre: 'CURSUS INFORMATIQUE',
        ordre: 3,
        visible: true,
        contenu: [
          { id: 'f-26-1', diplome: 'Master Informatique & Génie Logiciel', etablissement: 'Epitech Lille', dateDebut: '2016', dateFin: '2021' }
        ]
      },
      {
        id: 'sec-comp-m26',
        type: 'competences',
        titre: 'STACK DE DÉVELOPPEMENT',
        ordre: 4,
        visible: true,
        contenu: [
          { id: 's-26-1', nom: 'React, Next.js, TypeScript, Node', niveau: 5 },
          { id: 's-26-2', nom: 'PostgreSQL, Redis, Docker, GCP', niveau: 5 }
        ]
      }
    ]
  },

  // ==================== MODEL 27: LUXE BORDEAUX ====================
  'modele-27': {
    titre: 'CV Luxe Bordeaux — Prestige Serif',
    couleurAccent: '#800020',
    police: 'Playfair Display',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    sections: [
      {
        id: 'sec-p-m27',
        type: 'profil',
        titre: 'CONTACT & PRÉSENTATION PRESTIGE',
        ordre: 1,
        visible: true,
        contenu: {
          nomComplet: 'ÉLÉONORE DE BEAUMONT',
          titreProfessionnel: 'DIRECTRICE HÔTELLERIE DE LUXE',
          email: 'e.beaumont@palace-hotel.com',
          telephone: '+33 1 40 00 11 22',
          adresse: 'Paris, France',
          resume: 'Gestion d\'établissements 5 étoiles et Palaces. Excellence du service client, optimisation de la rentabilité et management d\'élite.'
        }
      },
      {
        id: 'sec-exp-m27',
        type: 'experience',
        titre: 'PARCOURS EN PALACE & HÔTELLERIE',
        ordre: 2,
        visible: true,
        contenu: [
          { id: 'exp-27-1', poste: 'Directrice Générale Adjointe', entreprise: 'HOTEL RITZ PARIS', ville: 'Paris', dateDebut: '2018', dateFin: 'Présent', description: '• Supervison de 180 collaborateurs et taux d\'occupation de 92%.\n• Supervision de l\'expérience client d\'exception.' }
        ]
      },
      {
        id: 'sec-form-m27',
        type: 'formation',
        titre: 'ENSEIGNEMENT SUPÉRIEUR HÔTELIER',
        ordre: 3,
        visible: true,
        contenu: [
          { id: 'f-27-1', diplome: 'MBA International Hospitality Management', etablissement: 'École Hôtelière de Lausanne', dateDebut: '2014', dateFin: '2018' }
        ]
      },
      {
        id: 'sec-comp-m27',
        type: 'competences',
        titre: 'COMPÉTENCES DE DIRECTION',
        ordre: 4,
        visible: true,
        contenu: [
          { id: 's-27-1', nom: 'Gestion Opérationnelle & Yield Mgmt', niveau: 5 },
          { id: 's-27-2', nom: 'Standards d\'Excellence & VIP', niveau: 5 }
        ]
      }
    ]
  },

  // ==================== MODEL 28: ÉMERAUDE BIO ====================
  'modele-28': {
    titre: 'CV Émeraude Bio — Vert Nature',
    couleurAccent: '#059669',
    police: 'Poppins',
    photoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
    sections: [
      {
        id: 'sec-p-m28',
        type: 'profil',
        titre: 'PROFIL ÉCOLOGIE & TRANSITION',
        ordre: 1,
        visible: true,
        contenu: {
          nomComplet: 'LEA FOURNIER',
          titreProfessionnel: 'CHEF DE PROJET TRANSITION ÉCOLOGIQUE',
          email: 'lea.fournier@eco-impact.org',
          telephone: '+33 6 55 44 33 22',
          adresse: 'Rennes, France',
          resume: 'Accompagnement des collectivités et entreprises vers la neutralité carbone et le développement durable.'
        }
      },
      {
        id: 'sec-exp-m28',
        type: 'experience',
        titre: 'RÉALISATIONS RSE & IMPACT',
        ordre: 2,
        visible: true,
        contenu: [
          { id: 'exp-28-1', poste: 'Consultante RSE Lead', entreprise: 'GREEN CONSULTING', ville: 'Rennes', dateDebut: '2020', dateFin: 'Présent', description: '• Bilans Carbone certifiés pour 25 PME territoriales.\n• Déploiement de stratégies d\'économie circulaire.' }
        ]
      },
      {
        id: 'sec-form-m28',
        type: 'formation',
        titre: 'DIPLÔMES DÉVELOPPEMENT DURABLE',
        ordre: 3,
        visible: true,
        contenu: [
          { id: 'f-28-1', diplome: 'Master RSE & Environnement', etablissement: 'Sciences Po Rennes', dateDebut: '2016', dateFin: '2020' }
        ]
      },
      {
        id: 'sec-comp-m28',
        type: 'competences',
        titre: 'SAVOIR-FAIRE ENVIRONNEMENTAL',
        ordre: 4,
        visible: true,
        contenu: [
          { id: 's-28-1', nom: 'Méthode Bilan Carbone® & ISO 14001', niveau: 5 },
          { id: 's-28-2', nom: 'Conduite du Changement RSE', niveau: 5 }
        ]
      }
    ]
  },

  // ==================== MODEL 29: TERRACOTTA STUDIO ====================
  'modele-29': {
    titre: 'CV Terracotta Studio — Design Ocre',
    couleurAccent: '#C2410C',
    police: 'Outfit',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    sections: [
      {
        id: 'sec-p-m29',
        type: 'profil',
        titre: 'COORDONNÉES CREATIVE STUDIO',
        ordre: 1,
        visible: true,
        contenu: {
          nomComplet: 'HUGO ROUSSEAU',
          titreProfessionnel: 'MOTION DESIGNER & MONTEUR VIDÉO',
          email: 'hugo@terracotta-studio.fr',
          telephone: '+33 6 12 99 88 77',
          adresse: 'Marseille, France',
          resume: 'Créateur de contenus animés 2D/3D dynamique pour réseaux sociaux, publicité TV et branding digital.'
        }
      },
      {
        id: 'sec-exp-m29',
        type: 'experience',
        titre: 'PROJETS VIDÉO & MOTION',
        ordre: 2,
        visible: true,
        contenu: [
          { id: 'exp-29-1', poste: 'Senior Motion Designer', entreprise: 'STUDIO SUNSHINE', ville: 'Marseille', dateDebut: '2019', dateFin: 'Présent', description: '• Animation de spots publicitaires pour marques nationales.\n• Sound design et montage vidéo 4K.' }
        ]
      },
      {
        id: 'sec-form-m29',
        type: 'formation',
        titre: 'DIPLÔMES CINÉMA & MOTION',
        ordre: 3,
        visible: true,
        contenu: [
          { id: 'f-29-1', diplome: 'Bachelor Cinéma d\'Animation', etablissement: 'Gobelins Marseille', dateDebut: '2015', dateFin: '2019' }
        ]
      },
      {
        id: 'sec-comp-m29',
        type: 'competences',
        titre: 'LOGICIELS DE CRÉATION',
        ordre: 4,
        visible: true,
        contenu: [
          { id: 's-29-1', nom: 'After Effects, Premiere Pro, Cinema 4D', niveau: 5 },
          { id: 's-29-2', nom: 'DaVinci Resolve & Sound Design', niveau: 4 }
        ]
      }
    ]
  },

  // ==================== MODEL 30: NOIR & OR EXEC ====================
  'modele-30': {
    titre: 'CV Noir & Or — Exec Pro',
    couleurAccent: '#0F172A',
    police: 'Montserrat',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    sections: [
      {
        id: 'sec-p-m30',
        type: 'profil',
        titre: 'EXECUTIVE PROFILE & CONTACT',
        ordre: 1,
        visible: true,
        contenu: {
          nomComplet: 'MARC-ANTOINE VALOIS',
          titreProfessionnel: 'CHIEF OPERATING OFFICER (COO)',
          email: 'valois@exec-advisory.com',
          telephone: '+33 1 50 60 70 80',
          adresse: 'Paris / Genève',
          resume: 'Dirigeant chevronné spécialisé en restructuration, pilotage du P&L et expansion internationale de groupes industriels.'
        }
      },
      {
        id: 'sec-exp-m30',
        type: 'experience',
        titre: 'CARRIÈRE DE DIRECTION GÉNÉRALE',
        ordre: 2,
        visible: true,
        contenu: [
          { id: 'exp-30-1', poste: 'Chief Operating Officer', entreprise: 'VALOIS GLOBAL GROUP', ville: 'Paris', dateDebut: '2017', dateFin: 'Présent', description: '• Pilotage d\'un chiffre d\'affaires de 120M€ et 450 salariés.\n• Croissance externe et ouverture de filiales en Asie.' }
        ]
      },
      {
        id: 'sec-form-m30',
        type: 'formation',
        titre: 'HAUTES ÉTUDES COMMERCIALES',
        ordre: 3,
        visible: true,
        contenu: [
          { id: 'f-30-1', diplome: 'Executive MBA', etablissement: 'HEC Paris', dateDebut: '2013', dateFin: '2015' }
        ]
      },
      {
        id: 'sec-comp-m30',
        type: 'competences',
        titre: 'COMPÉTENCES STRATÉGIQUES',
        ordre: 4,
        visible: true,
        contenu: [
          { id: 's-30-1', nom: 'Stratégie P&L & Restructuration', niveau: 5 },
          { id: 's-30-2', nom: 'Gouvernance & M&A International', niveau: 5 }
        ]
      }
    ]
  },

  // ==================== MODEL 31: NORDIC FROST WAVE ====================
  'modele-31': {
    titre: 'CV Vague Nordique — Bleu Glacier',
    couleurAccent: '#0284C7',
    couleurAccentSecondaire: '#F0F9FF',
    couleurFondSidebar: '#F0F9FF',
    couleurTexteSidebar: '#0369A1',
    police: 'Inter',
    formeSidebarDecor: 'wave-cut',
    styleEnTete: 'modern-split',
    styleEnTeteSection: 'pill',
    styleCompetences: 'badges',
    photoForme: 'arrondie',
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    sections: [
      {
        id: 'sec-p-m31',
        type: 'profil',
        titre: 'PROFIL & CONTACT',
        ordre: 1,
        visible: true,
        contenu: {
          nomComplet: 'Inès Lindqvist',
          titreProfessionnel: 'Lead Data Scientist & IA Engineer',
          email: 'ines.lindqvist@nordictech.io',
          telephone: '+33 6 12 34 56 78',
          adresse: 'Paris / Stockholm',
          linkedin: 'linkedin.com/in/ines-lindqvist',
          resume: 'Experte en intelligence artificielle générative et architectures de deep learning à grande échelle.'
        }
      },
      {
        id: 'sec-exp-m31',
        type: 'experience',
        titre: 'EXPÉRIENCES SIGNIFICATIVES',
        ordre: 2,
        visible: true,
        contenu: [
          { id: 'exp-31-1', poste: 'Lead Data Scientist', entreprise: 'NORDIC AI LABS', ville: 'Stockholm', dateDebut: '2021', dateFin: 'Présent', description: '• Déploiement de modèles LLM multi-agents réduisant le temps de traitement de 40%.\n• Management d\'une équipe de 8 ingénieurs machine learning.' }
        ]
      },
      {
        id: 'sec-proj-m31',
        type: 'projets',
        titre: 'PROJETS MAJEURS & PUBLICATIONS',
        ordre: 3,
        visible: true,
        contenu: [
          { id: 'proj-31-1', titre: 'GenAI Enterprise Engine', technologies: 'PyTorch, Transformers, FastAPI, Docker', lien: 'github.com/ines-l/genai-engine', description: 'Framework d\'inférence haute performance supportant 10k requêtes/seconde.' }
        ]
      },
      {
        id: 'sec-comp-m31',
        type: 'competences',
        titre: 'SAVOIR-FAIRE TECHNIQUE',
        ordre: 4,
        visible: true,
        contenu: [
          { id: 'sk-31-1', nom: 'Python / PyTorch / CUDA', niveau: 5 },
          { id: 'sk-31-2', nom: 'MLOps & Kubernetes', niveau: 5 },
          { id: 'sk-31-3', nom: 'Architecture LLM & RAG', niveau: 5 }
        ]
      },
      {
        id: 'sec-lang-m31',
        type: 'langues',
        titre: 'LANGUES',
        ordre: 5,
        visible: true,
        contenu: [
          { id: 'l-31-1', langue: 'Français', niveau: 'Langue maternelle' },
          { id: 'l-31-2', langue: 'Anglais', niveau: 'Bilingue / C2' },
          { id: 'l-31-3', langue: 'Suédois', niveau: 'Intermédiaire' }
        ]
      }
    ]
  },

  // ==================== MODEL 32: TECH OBSIDIAN & AMBER ====================
  'modele-32': {
    titre: 'CV Obsidienne & Ambre Tech',
    couleurAccent: '#F59E0B',
    couleurAccentSecondaire: '#1E293B',
    couleurFondSidebar: '#1E293B',
    couleurTexteSidebar: '#F8FAFC',
    police: 'Outfit',
    styleEnTete: 'banner',
    styleEnTeteSection: 'left-border',
    styleCompetences: 'progress',
    photoForme: 'hexagone',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    sections: [
      {
        id: 'sec-p-m32',
        type: 'profil',
        titre: 'IDENTITÉ & COORDONNÉES',
        ordre: 1,
        visible: true,
        contenu: {
          nomComplet: 'Kevin Zhang',
          titreProfessionnel: 'Senior DevSecOps & Cloud Security Architect',
          email: 'kevin.zhang@cybercloud.com',
          telephone: '+33 6 45 89 12 30',
          adresse: 'Lyon, France',
          resume: 'Architecte sécurité cloud certifié AWS/CISS, spécialiste des infrastructures zéro-trust et de l\'automatisation CI/CD sécurisée.'
        }
      },
      {
        id: 'sec-exp-m32',
        type: 'experience',
        titre: 'PARCOURS PROFESSIONNEL',
        ordre: 2,
        visible: true,
        contenu: [
          { id: 'exp-32-1', poste: 'Head of Cloud Security', entreprise: 'SECURE MATRIX', ville: 'Lyon', dateDebut: '2020', dateFin: 'Présent', description: '• Conception de la politique Zéro-Trust pour 500+ microservices Kubernetes.\n• Réduction des vulnérabilités critiques de 95% via l\'automatisation SAST/DAST.' }
        ]
      },
      {
        id: 'sec-comp-m32',
        type: 'competences',
        titre: 'COMPÉTENCES CLOUD & SÉCURITÉ',
        ordre: 3,
        visible: true,
        contenu: [
          { id: 'sk-32-1', nom: 'AWS / GCP Multi-Region Security', niveau: 5 },
          { id: 'sk-32-2', nom: 'Kubernetes & Terraform HCL', niveau: 5 },
          { id: 'sk-32-3', nom: 'Audit Zéro-Trust & ISO 27001', niveau: 5 }
        ]
      }
    ]
  },

  // ==================== MODEL 33: ARCH & ROSE GOLD PRESTIGE ====================
  'modele-33': {
    titre: 'CV Arche Rose Gold Prestige',
    couleurAccent: '#BE185D',
    couleurAccentSecondaire: '#FDF2F8',
    couleurFondSidebar: '#FDF2F8',
    couleurTexteSidebar: '#831843',
    police: 'Playfair Display',
    formeSidebarDecor: 'arch-top',
    styleEnTete: 'arch',
    styleEnTeteSection: 'pill',
    styleCompetences: 'badges',
    photoForme: 'arche',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    sections: [
      {
        id: 'sec-p-m33',
        type: 'profil',
        titre: 'PROFIL & SCÉNOGRAPHIE',
        ordre: 1,
        visible: true,
        contenu: {
          nomComplet: 'Camille de Montmirail',
          titreProfessionnel: 'Directrice Artistique & Scénographe',
          email: 'camille@atelier-montmirail.fr',
          telephone: '+33 1 42 68 55 00',
          adresse: 'Paris, France',
          resume: 'Direction artistique d\'expositions immersives, scénographies de défilés de mode et identités visuelles d\'exception.'
        }
      },
      {
        id: 'sec-exp-m33',
        type: 'experience',
        titre: 'RÉALISATIONS & CRÉATIONS',
        ordre: 2,
        visible: true,
        contenu: [
          { id: 'exp-33-1', poste: 'Directrice de Création', entreprise: 'MAISON ÉTINCELLE', ville: 'Paris', dateDebut: '2019', dateFin: 'Présent', description: '• Scénographie complète de 14 pavillons lors de la Fashion Week de Paris et Milan.\n• Conception d\'expériences immersives avec projection mapping 3D.' }
        ]
      },
      {
        id: 'sec-comp-m33',
        type: 'competences',
        titre: 'EXCELLENCE CRÉATIVE',
        ordre: 3,
        visible: true,
        contenu: [
          { id: 'sk-33-1', nom: 'Scénographie Spatiale & 3D', niveau: 5 },
          { id: 'sk-33-2', nom: 'Direction Artistique & Luxe', niveau: 5 },
          { id: 'sk-33-3', nom: 'Design d\'Éclairage & Immersion', niveau: 5 }
        ]
      }
    ]
  },

  // ==================== MODEL 34: SWISS GRID MODERN ====================
  'modele-34': {
    titre: 'CV Grille Suisse Internationale',
    couleurAccent: '#111827',
    couleurAccentSecondaire: '#F3F4F6',
    police: 'Helvetica',
    styleEnTete: 'clean',
    styleEnTeteSection: 'double-line',
    styleCompetences: 'tags',
    photoForme: 'carree',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    sections: [
      {
        id: 'sec-p-m34',
        type: 'profil',
        titre: 'PROFILE',
        ordre: 1,
        visible: true,
        contenu: {
          nomComplet: 'Lukas Meier',
          titreProfessionnel: 'Design System Lead & Information Architect',
          email: 'lukas.meier@swissgrid.design',
          telephone: '+41 22 730 59 00',
          adresse: 'Genève / Zurich',
          resume: 'Puriste de la typographie internationale et des systèmes de composants modulaires à grande échelle.'
        }
      },
      {
        id: 'sec-exp-m34',
        type: 'experience',
        titre: 'PROFESSIONAL EXPERIENCE',
        ordre: 2,
        visible: true,
        contenu: [
          { id: 'exp-34-1', poste: 'Head of Design Systems', entreprise: 'HELVETIA DIGITAL', ville: 'Zurich', dateDebut: '2018', dateFin: 'Présent', description: '• Architecture du Design System unifié pour 12 applications bancaires critiques.\n• Standardisation WCAG AAA de l\'ensemble des interfaces numériques.' }
        ]
      },
      {
        id: 'sec-comp-m34',
        type: 'competences',
        titre: 'CORE COMPETENCIES',
        ordre: 3,
        visible: true,
        contenu: [
          { id: 'sk-34-1', nom: 'Design Systems & Tokens', niveau: 5 },
          { id: 'sk-34-2', nom: 'Accessibility WCAG AAA', niveau: 5 },
          { id: 'sk-34-3', nom: 'Information Architecture', niveau: 5 }
        ]
      }
    ]
  },

  // ==================== MODEL 35: DIAGONAL SAPPHIRE ====================
  'modele-35': {
    titre: 'CV Découpe Diagonale & Saphir',
    couleurAccent: '#1D4ED8',
    couleurAccentSecondaire: '#EFF6FF',
    couleurFondSidebar: '#EFF6FF',
    couleurTexteSidebar: '#1E3A8A',
    police: 'Montserrat',
    formeSidebarDecor: 'diagonal-cut',
    styleEnTete: 'diagonal-split',
    styleEnTeteSection: 'pill',
    styleCompetences: 'grid',
    photoForme: 'galet',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    sections: [
      {
        id: 'sec-p-m35',
        type: 'profil',
        titre: 'PROFIL INVESTISSEUR',
        ordre: 1,
        visible: true,
        contenu: {
          nomComplet: 'Alexandre Laurent',
          titreProfessionnel: 'Directeur des Investissements & Private Equity',
          email: 'alexandre.laurent@capitale-equity.com',
          telephone: '+33 1 45 60 70 80',
          adresse: 'Paris, France',
          resume: 'Gestionnaire d\'actifs et investisseur en capital-développement, avec plus de 450M€ déployés dans la tech et les énergies renouvelables.'
        }
      },
      {
        id: 'sec-exp-m35',
        type: 'experience',
        titre: 'PARCOURS & MANDATS D\'ADMINISTRATEUR',
        ordre: 2,
        visible: true,
        contenu: [
          { id: 'exp-35-1', poste: 'Partner Investissements', entreprise: 'CAPITALE EQUITY PARTNERS', ville: 'Paris', dateDebut: '2016', dateFin: 'Présent', description: '• Conduite de 18 opérations de fusion-acquisition et sorties en bourse (IPO).\n• Membre du conseil de surveillance de 6 scale-ups européennes.' }
        ]
      },
      {
        id: 'sec-comp-m35',
        type: 'competences',
        titre: 'EXPERTISE FINANCIÈRE',
        ordre: 3,
        visible: true,
        contenu: [
          { id: 'sk-35-1', nom: 'M&A & LBO Structuring', niveau: 5 },
          { id: 'sk-35-2', nom: 'Due Diligence Stratégique', niveau: 5 },
          { id: 'sk-35-3', nom: 'Gouvernance de Conseil (Board)', niveau: 5 }
        ]
      }
    ]
  },

  // ==================== MODEL 36: FLOATING CARD STUDIO ====================
  'modele-36': {
    titre: 'CV Carte Flottante & Violet Studio',
    couleurAccent: '#7C3AED',
    couleurAccentSecondaire: '#FAF5FF',
    couleurFondSidebar: '#FAF5FF',
    couleurTexteSidebar: '#581C87',
    police: 'Poppins',
    formeSidebarDecor: 'card-float',
    styleEnTete: 'clean',
    styleEnTeteSection: 'boxed',
    styleCompetences: 'badges',
    photoForme: 'ronde',
    photoUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80',
    sections: [
      {
        id: 'sec-p-m36',
        type: 'profil',
        titre: 'À PROPOS',
        ordre: 1,
        visible: true,
        contenu: {
          nomComplet: 'Maya Benali',
          titreProfessionnel: 'Senior Product Designer & UX Researcher',
          email: 'maya.design@studio-ux.fr',
          telephone: '+33 6 88 99 00 11',
          adresse: 'Bordeaux / Full Remote',
          resume: 'Passionnée par la psychologie des utilisateurs et la création d\'expériences produit intuitives et impactantes.'
        }
      },
      {
        id: 'sec-exp-m36',
        type: 'experience',
        titre: 'EXPÉRIENCES PRODUIT',
        ordre: 2,
        visible: true,
        contenu: [
          { id: 'exp-36-1', poste: 'Lead UX/UI Designer', entreprise: 'FINTECH PULSE', ville: 'Paris', dateDebut: '2021', dateFin: 'Présent', description: '• Refonte globale de l\'application mobile générant une hausse de 32% de l\'activation.\n• Animation d\'ateliers de Design Sprint et tests utilisateurs continus.' }
        ]
      },
      {
        id: 'sec-comp-m36',
        type: 'competences',
        titre: 'STACK & DESIGN',
        ordre: 3,
        visible: true,
        contenu: [
          { id: 'sk-36-1', nom: 'Figma & Prototypage Avancé', niveau: 5 },
          { id: 'sk-36-2', nom: 'Recherche Utilisateur (User Testing)', niveau: 5 },
          { id: 'sk-36-3', nom: 'Micro-interactions & Motion', niveau: 5 }
        ]
      }
    ]
  },

  // ==================== MODEL 37: MEDITERRANEAN OLIVE ====================
  'modele-37': {
    titre: 'CV Vert Olive Méditerranéen & Lin',
    couleurAccent: '#4D7C0F',
    couleurAccentSecondaire: '#F7FEE7',
    couleurFondSidebar: '#F7FEE7',
    couleurTexteSidebar: '#365314',
    police: 'Lato',
    styleEnTete: 'clean',
    styleEnTeteSection: 'underline',
    styleCompetences: 'stars',
    photoForme: 'ronde',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    sections: [
      {
        id: 'sec-p-m37',
        type: 'profil',
        titre: 'PROFIL AGRONOMIE',
        ordre: 1,
        visible: true,
        contenu: {
          nomComplet: 'Matteo Rossi',
          titreProfessionnel: 'Ingénieur Agronome & Transition Écologique',
          email: 'matteo.rossi@agri-durable.org',
          telephone: '+33 4 91 22 33 44',
          adresse: 'Aix-en-Provence, France',
          resume: 'Expert en agroécologie, régénération des sols et modélisation de cultures résilientes face aux aléas climatiques.'
        }
      },
      {
        id: 'sec-exp-m37',
        type: 'experience',
        titre: 'PARCOURS SCIENTIFIQUE & TERRAIN',
        ordre: 2,
        visible: true,
        contenu: [
          { id: 'exp-37-1', poste: 'Responsable Projets Agroécologiques', entreprise: 'INSTITUT BIO-MÉDITERRANÉE', ville: 'Marseille', dateDebut: '2019', dateFin: 'Présent', description: '• Coordination de 25 exploitations pilotes pour la réduction de 80% des intrants chimiques.\n• Déploiement de capteurs IoT hydriques et cartographie satellite.' }
        ]
      },
      {
        id: 'sec-comp-m37',
        type: 'competences',
        titre: 'DOMAINES D\'EXPERTISE',
        ordre: 3,
        visible: true,
        contenu: [
          { id: 'sk-37-1', nom: 'Agroécologie & Pédologie', niveau: 5 },
          { id: 'sk-37-2', nom: 'SIG & Cartographie QGIS', niveau: 4 },
          { id: 'sk-37-3', nom: 'Gestion de l\'Eau & Climat', niveau: 5 }
        ]
      }
    ]
  },

  // ==================== MODEL 38: CYBER DARK INDIGO ====================
  'modele-38': {
    titre: 'CV Cyber Dark Indigo & Néon',
    couleurAccent: '#6366F1',
    couleurAccentSecondaire: '#0F172A',
    couleurFondSidebar: '#0F172A',
    couleurTexteSidebar: '#F8FAFC',
    police: 'Outfit',
    styleEnTete: 'banner',
    styleEnTeteSection: 'left-border',
    styleCompetences: 'progress',
    photoForme: 'hexagone',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    sections: [
      {
        id: 'sec-p-m38',
        type: 'profil',
        titre: 'DEV IDENTITY',
        ordre: 1,
        visible: true,
        contenu: {
          nomComplet: 'Elena Volkov',
          titreProfessionnel: 'Principal Blockchain & Smart Contract Engineer',
          email: 'elena@web3-core.dev',
          telephone: '+33 7 80 12 34 56',
          adresse: 'Nice / Remote',
          resume: 'Développeuse principale spécialisée dans les protocoles DeFi, les smart contracts Solidity sécurisés et les rollups ZK.'
        }
      },
      {
        id: 'sec-exp-m38',
        type: 'experience',
        titre: 'PROTOCOL ENGINEERING',
        ordre: 2,
        visible: true,
        contenu: [
          { id: 'exp-38-1', poste: 'Core Protocol Developer', entreprise: 'ETHEREUM DEFI LABS', ville: 'Remote', dateDebut: '2020', dateFin: 'Présent', description: '• Audit et déploiement de pools de liquidité gérant plus de 80M$ de TVL sans exploit.\n• Optimisation du coût en gaz de 45% sur les contrats de staking.' }
        ]
      },
      {
        id: 'sec-comp-m38',
        type: 'competences',
        titre: 'CORE TECH STACK',
        ordre: 3,
        visible: true,
        contenu: [
          { id: 'sk-38-1', nom: 'Solidity / Rust / Move', niveau: 5 },
          { id: 'sk-38-2', nom: 'EVM & ZK-Rollup Internals', niveau: 5 },
          { id: 'sk-38-3', nom: 'Formal Verification & Auditing', niveau: 5 }
        ]
      }
    ]
  },

  // ==================== MODEL 39: PARISIAN EDITORIAL VOGUE ====================
  'modele-39': {
    titre: 'CV Éditorial Vogue Paris (Crimson)',
    couleurAccent: '#991B1B',
    couleurAccentSecondaire: '#FEF2F2',
    police: 'Playfair Display',
    styleEnTete: 'clean',
    styleEnTeteSection: 'minimal',
    styleCompetences: 'list',
    photoForme: 'arche',
    photoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
    sections: [
      {
        id: 'sec-p-m39',
        type: 'profil',
        titre: 'PROFIL ÉDITORIAL',
        ordre: 1,
        visible: true,
        contenu: {
          nomComplet: 'Victoire Saint-Germain',
          titreProfessionnel: 'Rédactrice en Chef & Critique Culturelle',
          email: 'victoire.saintgermain@revue-paris.fr',
          telephone: '+33 1 40 20 30 40',
          adresse: 'Paris VIe, France',
          resume: 'Plume littéraire et journaliste culturelle reconnue, avec 12 années d\'expérience à la tête de rédactions prestigieuses.'
        }
      },
      {
        id: 'sec-exp-m39',
        type: 'experience',
        titre: 'DIRECTIONS DE RÉDACTION',
        ordre: 2,
        visible: true,
        contenu: [
          { id: 'exp-39-1', poste: 'Rédactrice en Chef Culture & Arts', entreprise: 'ÉDITIONS DE L\'ÉTOILE', ville: 'Paris', dateDebut: '2017', dateFin: 'Présent', description: '• Pilotage de la ligne éditoriale du mensuel tiré à 150 000 exemplaires.\n• Interview exclusive de grands auteurs, réalisateurs et lauréats de prix internationaux.' }
        ]
      },
      {
        id: 'sec-comp-m39',
        type: 'competences',
        titre: 'DOMAINES D\'EXPERTISE',
        ordre: 3,
        visible: true,
        contenu: [
          { id: 'sk-39-1', nom: 'Ligne Éditoriale & Écriture d\'Art', niveau: 5 },
          { id: 'sk-39-2', nom: 'Interviews & Grands Reportages', niveau: 5 },
          { id: 'sk-39-3', nom: 'Management d\'Équipes de Journalistes', niveau: 5 }
        ]
      }
    ]
  },

  // ==================== MODEL 40: EMERALD CROWN GOLD ====================
  'modele-40': {
    titre: 'CV Couronne Émeraude Royale & Or',
    couleurAccent: '#065F46',
    couleurAccentSecondaire: '#ECFDF5',
    couleurFondSidebar: '#ECFDF5',
    couleurTexteSidebar: '#064E3B',
    police: 'Georgia',
    formeSidebarDecor: 'arch-top',
    styleEnTete: 'banner',
    styleEnTeteSection: 'pill',
    styleCompetences: 'badges',
    photoForme: 'arche',
    photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    sections: [
      {
        id: 'sec-p-m40',
        type: 'profil',
        titre: 'CABINET & MANDATS',
        ordre: 1,
        visible: true,
        contenu: {
          nomComplet: 'Me Henri de Castries',
          titreProfessionnel: 'Avocat Associé — Droit des Affaires & Fusions-Acquisitions',
          email: 'h.castries@castries-avocats.com',
          telephone: '+33 1 44 55 66 77',
          adresse: 'Paris VIIIe, France',
          resume: 'Avocat au Barreau de Paris depuis 20 ans, conseil stratégique des multinationales et fonds souverains dans des opérations transfrontalières.'
        }
      },
      {
        id: 'sec-exp-m40',
        type: 'experience',
        titre: 'PRATIQUE DU BARREAU & AFFAIRES',
        ordre: 2,
        visible: true,
        contenu: [
          { id: 'exp-40-1', poste: 'Associé Gérant', entreprise: 'DE CASTRIES & ASSOCIÉS', ville: 'Paris', dateDebut: '2012', dateFin: 'Présent', description: '• Négociation et clôture d\'opérations M&A d\'une valeur totale excédant 2 milliards d\'euros.\n• Représentation dans des arbitrages commerciaux internationaux (CCI).' }
        ]
      },
      {
        id: 'sec-comp-m40',
        type: 'competences',
        titre: 'EXCELLENCE JURIDIQUE',
        ordre: 3,
        visible: true,
        contenu: [
          { id: 'sk-40-1', nom: 'Fusions-Acquisitions (M&A) & Joint-Ventures', niveau: 5 },
          { id: 'sk-40-2', nom: 'Contentieux des Affaires & Arbitrage CCI', niveau: 5 },
          { id: 'sk-40-3', nom: 'Droit Boursier & Restructurations', niveau: 5 }
        ]
      }
    ]
  },

  // ==================== MODEL 41: ZEN MINIMAL SLATE ====================
  'modele-41': {
    titre: 'CV Zen Minimal Slate Wabi-Sabi',
    couleurAccent: '#475569',
    couleurAccentSecondaire: '#F8FAFC',
    couleurFondSidebar: '#F8FAFC',
    couleurTexteSidebar: '#1E293B',
    police: 'Inter',
    styleEnTete: 'clean',
    styleEnTeteSection: 'underline',
    styleCompetences: 'tags',
    photoForme: 'ronde',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    sections: [
      {
        id: 'sec-p-m41',
        type: 'profil',
        titre: 'PROFIL & PHILOSOPHIE',
        ordre: 1,
        visible: true,
        contenu: {
          nomComplet: 'Kenzo Takahashi',
          titreProfessionnel: 'Architecte d\'Intérieur Minimaliste & Designer d\'Espace',
          email: 'kenzo.takahashi@zen-architecture.jp',
          telephone: '+33 6 55 44 33 22',
          adresse: 'Tokyo / Paris',
          resume: 'Conception d\'espaces résidentiels et hôteliers épurés alliant tradition japonaise et matériaux bruts contemporains.'
        }
      },
      {
        id: 'sec-exp-m41',
        type: 'experience',
        titre: 'RÉALISATIONS D\'ARCHITECTURE',
        ordre: 2,
        visible: true,
        contenu: [
          { id: 'exp-41-1', poste: 'Architecte Principal', entreprise: 'TAKAHASHI STUDIO', ville: 'Tokyo', dateDebut: '2018', dateFin: 'Présent', description: '• Réalisation de 30+ projets hôteliers et villas privées au Japon et en Europe.\n• Lauréat du Prix d\'Excellence du Design d\'Intérieur Durable 2022.' }
        ]
      },
      {
        id: 'sec-comp-m41',
        type: 'competences',
        titre: 'DISCIPLINES & OUTILS',
        ordre: 3,
        visible: true,
        contenu: [
          { id: 'sk-41-1', nom: 'Architecture d\'Intérieur & Espaces Zen', niveau: 5 },
          { id: 'sk-41-2', nom: 'Rendu 3D Photoréaliste & BIM', niveau: 5 },
          { id: 'sk-41-3', nom: 'Matériaux Éco-sourcés & Bois Massif', niveau: 5 }
        ]
      }
    ]
  },

  // ==================== MODEL 42: SUNSET GRADIENT CREATIVE ====================
  'modele-42': {
    titre: 'CV Sunset Corail & Vague Créative',
    couleurAccent: '#EA580C',
    couleurAccentSecondaire: '#FFF7ED',
    couleurFondSidebar: '#FFF7ED',
    couleurTexteSidebar: '#9A3412',
    police: 'Poppins',
    formeSidebarDecor: 'wave-cut',
    styleEnTete: 'modern-split',
    styleEnTeteSection: 'pill',
    styleCompetences: 'badges',
    photoForme: 'galet',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    sections: [
      {
        id: 'sec-p-m42',
        type: 'profil',
        titre: 'BIO & CONTACT',
        ordre: 1,
        visible: true,
        contenu: {
          nomComplet: 'Sofia Morales',
          titreProfessionnel: 'Directrice de Marque & Stratège Créative',
          email: 'sofia@sunset-brands.com',
          telephone: '+33 6 77 88 99 00',
          adresse: 'Barcelone / Paris',
          resume: 'Créatrice d\'univers de marques vibrantes et mémorables, alliant storytelling émotionnel et stratégie marketing omnicanale.'
        }
      },
      {
        id: 'sec-exp-m42',
        type: 'experience',
        titre: 'EXPÉRIENCES BRANDING',
        ordre: 2,
        visible: true,
        contenu: [
          { id: 'exp-42-1', poste: 'Global Brand Director', entreprise: 'VIBRANT LAB', ville: 'Barcelone', dateDebut: '2020', dateFin: 'Présent', description: '• Lancement de 5 nouvelles marques D2C générant plus de 15M€ de revenus la première année.\n• Direction de campagnes 360° virales sur les réseaux sociaux et affichage urbain.' }
        ]
      },
      {
        id: 'sec-comp-m42',
        type: 'competences',
        titre: 'TALENTS CLÉS',
        ordre: 3,
        visible: true,
        contenu: [
          { id: 'sk-42-1', nom: 'Brand Strategy & Storytelling', niveau: 5 },
          { id: 'sk-42-2', nom: 'Campagnes Publicitaires 360°', niveau: 5 },
          { id: 'sk-42-3', nom: 'Direction de Shooting & Contenu', niveau: 5 }
        ]
      }
    ]
  },

  // ==================== MODEL 43: BIOTECH TEAL MATRIX ====================
  'modele-43': {
    titre: 'CV Biotech Turquoise & Matrice Data',
    couleurAccent: '#0D9488',
    couleurAccentSecondaire: '#CCFBF1',
    couleurFondSidebar: '#CCFBF1',
    couleurTexteSidebar: '#115E59',
    police: 'Roboto',
    styleEnTete: 'banner',
    styleEnTeteSection: 'boxed',
    styleCompetences: 'progress',
    photoForme: 'arrondie',
    photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    sections: [
      {
        id: 'sec-p-m43',
        type: 'profil',
        titre: 'RECHERCHE & COORDONNÉES',
        ordre: 1,
        visible: true,
        contenu: {
          nomComplet: 'Dr. Arthur Vaneck',
          titreProfessionnel: 'Docteur en Bio-Ingénierie & Génétique Moléculaire',
          email: 'arthur.vaneck@genom-lab.eu',
          telephone: '+33 4 72 00 11 22',
          adresse: 'Grenoble, France',
          resume: 'Chercheur spécialisé dans l\'édition génomique CRISPR, le criblage de molécules thérapeutiques et l\'analyse bioinformatique haut débit.'
        }
      },
      {
        id: 'sec-exp-m43',
        type: 'experience',
        titre: 'TRAVAUX DE RECHERCHE CLINIQUE',
        ordre: 2,
        visible: true,
        contenu: [
          { id: 'exp-43-1', poste: 'Principal Investigator', entreprise: 'EURO-GENOME INSTITUTE', ville: 'Grenoble', dateDebut: '2019', dateFin: 'Présent', description: '• Pilotage de 3 programmes européens de thérapie ciblée contre les maladies rares.\n• Dépôt de 4 brevets internationaux et publication dans Nature Biotechnology.' }
        ]
      },
      {
        id: 'sec-comp-m43',
        type: 'competences',
        titre: 'COMPÉTENCES SCIENTIFIQUES',
        ordre: 3,
        visible: true,
        contenu: [
          { id: 'sk-43-1', nom: 'CRISPR-Cas9 & Ingénierie Génomique', niveau: 5 },
          { id: 'sk-43-2', nom: 'Bio-informatique & Next-Gen Sequencing', niveau: 5 },
          { id: 'sk-43-3', nom: 'Réglementation Essais Cliniques FDA/EMA', niveau: 5 }
        ]
      }
    ]
  },

  // ==================== MODEL 44: LONDON LAW CHAMBERS ====================
  'modele-44': {
    titre: 'CV Chambers & Droit Britannique',
    couleurAccent: '#1E3A8A',
    couleurAccentSecondaire: '#DBEAFE',
    police: 'Garamond',
    styleEnTete: 'banner',
    styleEnTeteSection: 'double-line',
    styleCompetences: 'stars',
    photoForme: 'carree',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    sections: [
      {
        id: 'sec-p-m44',
        type: 'profil',
        titre: 'CURRICULUM VITAE',
        ordre: 1,
        visible: true,
        contenu: {
          nomComplet: 'Sir Edward Sterling',
          titreProfessionnel: 'Senior Legal Counsel & Arbitre International',
          email: 'e.sterling@lincolns-chambers.co.uk',
          telephone: '+44 20 7946 0912',
          adresse: 'Londres / Paris',
          resume: 'Conseiller juridique de haut rang auprès d\'institutions financières internationales et de cours d\'arbitrage mondiales.'
        }
      },
      {
        id: 'sec-exp-m44',
        type: 'experience',
        titre: 'EXPERIENCE & JUDICIAL APPOINTMENTS',
        ordre: 2,
        visible: true,
        contenu: [
          { id: 'exp-44-1', poste: 'Senior Barrister & Arbitrator', entreprise: 'LINCOLN\'S INN CHAMBERS', ville: 'Londres', dateDebut: '2015', dateFin: 'Présent', description: '• Arbitrage de 40+ litiges maritimes et commerciaux internationaux.\n• Conseil spécial auprès du Ministère du Commerce International.' }
        ]
      },
      {
        id: 'sec-comp-m44',
        type: 'competences',
        titre: 'AREAS OF EXPERTISE',
        ordre: 3,
        visible: true,
        contenu: [
          { id: 'sk-44-1', nom: 'International Commercial Arbitration', niveau: 5 },
          { id: 'sk-44-2', nom: 'Maritime & Energy Law', niveau: 5 },
          { id: 'sk-44-3', nom: 'Cross-Border Asset Recovery', niveau: 5 }
        ]
      }
    ]
  },

  // ==================== MODEL 45: MONOCHROME BOLD SWISS ====================
  'modele-45': {
    titre: 'CV Monochrome Bold Contrast',
    couleurAccent: '#000000',
    couleurAccentSecondaire: '#F4F4F5',
    couleurFondSidebar: '#F4F4F5',
    couleurTexteSidebar: '#18181B',
    police: 'Helvetica',
    styleEnTete: 'clean',
    styleEnTeteSection: 'left-border',
    styleCompetences: 'grid',
    photoForme: 'carree',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    sections: [
      {
        id: 'sec-p-m45',
        type: 'profil',
        titre: 'PROFIL GRAPHIQUE',
        ordre: 1,
        visible: true,
        contenu: {
          nomComplet: 'David Keller',
          titreProfessionnel: 'Directeur de la Photographie & Artiste Visuel',
          email: 'david.keller@keller-photo.com',
          telephone: '+33 6 11 22 33 44',
          adresse: 'Berlin / Paris',
          resume: 'Vision photographique forte et direction artistique pour les plus grandes marques de mode et galeries contemporaines.'
        }
      },
      {
        id: 'sec-exp-m45',
        type: 'experience',
        titre: 'PARCOURS & EXPOSITIONS',
        ordre: 2,
        visible: true,
        contenu: [
          { id: 'exp-45-1', poste: 'Directeur Artistique & Photographe', entreprise: 'STUDIO NOIR', ville: 'Berlin', dateDebut: '2019', dateFin: 'Présent', description: '• Réalisation de 20+ campagnes publicitaires globales en noir et blanc haute résolution.\n• Expositions personnelles à la MEP Paris et à Berlin.' }
        ]
      },
      {
        id: 'sec-comp-m45',
        type: 'competences',
        titre: 'MAÎTRISE TECHNIQUE',
        ordre: 3,
        visible: true,
        contenu: [
          { id: 'sk-45-1', nom: 'Photographie Argentique & Numérique HD', niveau: 5 },
          { id: 'sk-45-2', nom: 'Étalonnage & Post-Production Capture One', niveau: 5 },
          { id: 'sk-45-3', nom: 'Direction de Modèles & Lumière Studio', niveau: 5 }
        ]
      }
    ]
  },

  // ==================== MODEL 46: ALPINE AZURE HORIZON ====================
  'modele-46': {
    titre: 'CV Azur Alpin & Découpe Horizon',
    couleurAccent: '#0284C7',
    couleurAccentSecondaire: '#E0F2FE',
    couleurFondSidebar: '#E0F2FE',
    couleurTexteSidebar: '#075985',
    police: 'Outfit',
    formeSidebarDecor: 'diagonal-cut',
    styleEnTete: 'diagonal-split',
    styleEnTeteSection: 'pill',
    styleCompetences: 'badges',
    photoForme: 'ronde',
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    sections: [
      {
        id: 'sec-p-m46',
        type: 'profil',
        titre: 'COORDONNÉES',
        ordre: 1,
        visible: true,
        contenu: {
          nomComplet: 'Clara Fontaine',
          titreProfessionnel: 'Chef de Projet Énergies Renouvelables & Éolien Offshore',
          email: 'clara.fontaine@horizon-energy.eu',
          telephone: '+33 6 99 88 77 66',
          adresse: 'Nantes / Rennes',
          resume: 'Ingénieure en génie électrique et gestionnaire de projets éoliens offshore majeurs d\'une capacité de 500+ MW.'
        }
      },
      {
        id: 'sec-exp-m46',
        type: 'experience',
        titre: 'PROJETS ÉNERGÉTIQUES',
        ordre: 2,
        visible: true,
        contenu: [
          { id: 'exp-46-1', poste: 'Chef de Projet Éolien Offshore', entreprise: 'ATLANTIC CLEAN POWER', ville: 'Nantes', dateDebut: '2020', dateFin: 'Présent', description: '• Pilotage de la construction du parc éolien marin de 480 MW raccordé au réseau RTE.\n• Gestion d\'un budget global de 850M€ et management de 45 sous-traitants.' }
        ]
      },
      {
        id: 'sec-comp-m46',
        type: 'competences',
        titre: 'SAVOIR-FAIRE TECHNIQUE',
        ordre: 3,
        visible: true,
        contenu: [
          { id: 'sk-46-1', nom: 'Ingénierie Réseau & Haute Tension', niveau: 5 },
          { id: 'sk-46-2', nom: 'Réglementation Environnementale Maritime', niveau: 5 },
          { id: 'sk-46-3', nom: 'Contrats FIDIC & Gestion des Risques', niveau: 5 }
        ]
      }
    ]
  },

  // ==================== MODEL 47: ROYAL VIOLET MONOGRAM ====================
  'modele-47': {
    titre: 'CV Monogramme Pourpre Impérial',
    couleurAccent: '#581C87',
    couleurAccentSecondaire: '#F3E8FF',
    couleurFondSidebar: '#F3E8FF',
    couleurTexteSidebar: '#3B0764',
    police: 'Playfair Display',
    formeSidebarDecor: 'arch-top',
    styleEnTete: 'banner',
    styleEnTeteSection: 'underline',
    styleCompetences: 'stars',
    photoForme: 'arche',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    sections: [
      {
        id: 'sec-p-m47',
        type: 'profil',
        titre: 'CARRIÈRE DIPLOMATIQUE',
        ordre: 1,
        visible: true,
        contenu: {
          nomComplet: 'S.E. Gaston Valéry',
          titreProfessionnel: 'Ambassadeur & Directeur des Affaires Publiques Internationales',
          email: 'gaston.valery@diplomatie-gov.fr',
          telephone: '+33 1 43 17 53 53',
          adresse: 'Paris / Bruxelles',
          resume: 'Haut fonctionnaire diplomatique, expert en négociations multilatérales, géopolitique et accords commerciaux transatlantiques.'
        }
      },
      {
        id: 'sec-exp-m47',
        type: 'experience',
        titre: 'MANDATS & MISSIONS DIPLOMATIQUES',
        ordre: 2,
        visible: true,
        contenu: [
          { id: 'exp-47-1', poste: 'Représentant Permanent Adjoint', entreprise: 'DÉLÉGATION EUROPÉENNE', ville: 'Bruxelles', dateDebut: '2016', dateFin: 'Présent', description: '• Négociation de 8 traités bilatéraux stratégiques sur la souveraineté technologique.\n• Coordination des sommets des chefs d\'État et de gouvernement.' }
        ]
      },
      {
        id: 'sec-comp-m47',
        type: 'competences',
        titre: 'DOMAINES DIPLOMATIQUES',
        ordre: 3,
        visible: true,
        contenu: [
          { id: 'sk-47-1', nom: 'Négociation Diplomatique & Traités', niveau: 5 },
          { id: 'sk-47-2', nom: 'Affaires Publiques Européennes', niveau: 5 },
          { id: 'sk-47-3', nom: 'Gestion de Crises Géopolitiques', niveau: 5 }
        ]
      }
    ]
  },

  // ==================== MODEL 48: EARTHY OCHRE CLAY ====================
  'modele-48': {
    titre: 'CV Argile Chaude & Ocre Terrestre',
    couleurAccent: '#B45309',
    couleurAccentSecondaire: '#FEF3C7',
    couleurFondSidebar: '#FEF3C7',
    couleurTexteSidebar: '#78350F',
    police: 'Lato',
    formeSidebarDecor: 'card-float',
    styleEnTete: 'clean',
    styleEnTeteSection: 'pill',
    styleCompetences: 'tags',
    photoForme: 'galet',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    sections: [
      {
        id: 'sec-p-m48',
        type: 'profil',
        titre: 'À PROPOS',
        ordre: 1,
        visible: true,
        contenu: {
          nomComplet: 'Gabriel Santos',
          titreProfessionnel: 'Artisan Designer Mobilier & Matières Naturelles',
          email: 'gabriel.santos@atelier-argile.com',
          telephone: '+33 6 44 55 66 77',
          adresse: 'Lisbonne / Marseille',
          resume: 'Sculpteur de formes organiques et concepteur de mobilier d\'art en céramique, terre cuite et bois de récupération.'
        }
      },
      {
        id: 'sec-exp-m48',
        type: 'experience',
        titre: 'CRÉATIONS & COLLABORATIONS',
        ordre: 2,
        visible: true,
        contenu: [
          { id: 'exp-48-1', poste: 'Designer Fondateur', entreprise: 'ATELIER TERRA', ville: 'Marseille', dateDebut: '2019', dateFin: 'Présent', description: '• Édition de collections de luminaires et tables pour des hôtels de luxe à Paris et Lisbonne.\n• Récompense de l\'Artisanat d\'Art Méditerranéen 2023.' }
        ]
      },
      {
        id: 'sec-comp-m48',
        type: 'competences',
        titre: 'SAVOIR-FAIRE MATIÈRE',
        ordre: 3,
        visible: true,
        contenu: [
          { id: 'sk-48-1', nom: 'Céramique & Modelage Manuel', niveau: 5 },
          { id: 'sk-48-2', nom: 'Ébénisterie d\'Art & Finitions Naturelles', niveau: 5 },
          { id: 'sk-48-3', nom: 'Prototypage & Fabrication d\'Art', niveau: 5 }
        ]
      }
    ]
  },

  // ==================== MODEL 49: CYBERPUNK DARK CRIMSON ====================
  'modele-49': {
    titre: 'CV Dark Crimson Cyber & Jauges',
    couleurAccent: '#E11D48',
    couleurAccentSecondaire: '#18181B',
    couleurFondSidebar: '#18181B',
    couleurTexteSidebar: '#FAFAFA',
    police: 'Outfit',
    styleEnTete: 'banner',
    styleEnTeteSection: 'left-border',
    styleCompetences: 'progress',
    photoForme: 'hexagone',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    sections: [
      {
        id: 'sec-p-m49',
        type: 'profil',
        titre: 'OPERATOR ID',
        ordre: 1,
        visible: true,
        contenu: {
          nomComplet: 'Rayan Khelil',
          titreProfessionnel: 'Lead Game Engine & Unreal 5 Graphics Engineer',
          email: 'rayan.k@unreal-graphics.dev',
          telephone: '+33 6 77 00 11 22',
          adresse: 'Montpellier, France',
          resume: 'Développeur moteur de jeu spécialisé dans le ray-tracing temps réel, les shaders HLSL/C++ et la physique des fluides.'
        }
      },
      {
        id: 'sec-exp-m49',
        type: 'experience',
        titre: 'ENGINE DEVELOPMENT HISTORY',
        ordre: 2,
        visible: true,
        contenu: [
          { id: 'exp-49-1', poste: 'Senior Graphics Engineer', entreprise: 'NEO GAMES STUDIO', ville: 'Montpellier', dateDebut: '2020', dateFin: 'Présent', description: '• Optimisation du pipeline de rendu Nanite & Lumen pour un titre AAA sur PS5 et PC.\n• Développement de shaders de volumétrie atmosphérique à 120 FPS constants.' }
        ]
      },
      {
        id: 'sec-comp-m49',
        type: 'competences',
        titre: 'GRAPHICS SKILLS',
        ordre: 3,
        visible: true,
        contenu: [
          { id: 'sk-49-1', nom: 'C++ / HLSL / DirectX 12 / Vulkan', niveau: 5 },
          { id: 'sk-49-2', nom: 'Unreal Engine 5 Source Internals', niveau: 5 },
          { id: 'sk-49-3', nom: 'Real-Time Raytracing & GPU Profiling', niveau: 5 }
        ]
      }
    ]
  },

  // ==================== MODEL 50: EXECUTIVE PLATINUM DIAMOND ====================
  'modele-50': {
    titre: 'CV Platine & Diamant (C-Level Diamond)',
    couleurAccent: '#334155',
    couleurAccentSecondaire: '#F1F5F9',
    couleurFondSidebar: '#F1F5F9',
    couleurTexteSidebar: '#0F172A',
    police: 'Montserrat',
    formeSidebarDecor: 'arch-top',
    styleEnTete: 'banner',
    styleEnTeteSection: 'boxed',
    styleCompetences: 'grid',
    photoForme: 'arche',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    sections: [
      {
        id: 'sec-p-m50',
        type: 'profil',
        titre: 'DIRECTION GÉNÉRALE & BOARD',
        ordre: 1,
        visible: true,
        contenu: {
          nomComplet: 'Victoria Stirling-Cross',
          titreProfessionnel: 'Présidente du Conseil d\'Administration & Board Member',
          email: 'victoria.cross@stirling-board.com',
          telephone: '+33 1 70 80 90 00',
          adresse: 'Paris / Londres / New York',
          resume: 'Leader internationale avec 25 ans d\'expérience dans la gouvernance de groupes cotés (CAC 40 / FTSE 100), la transformation ESG et l\'hypercroissance.'
        }
      },
      {
        id: 'sec-exp-m50',
        type: 'experience',
        titre: 'MANDATS DE DIRECTION & GOUVERNANCE',
        ordre: 2,
        visible: true,
        contenu: [
          { id: 'exp-50-1', poste: 'Chairwoman of the Board', entreprise: 'GLOBAL INDUSTRIAL DYNAMICS', ville: 'Paris', dateDebut: '2017', dateFin: 'Présent', description: '• Présidence du conseil d\'administration d\'un groupe de 4,2 milliards d\'euros de CA.\n• Conduite du plan de transition carbone et alignement stratégique actionnaires.' }
        ]
      },
      {
        id: 'sec-comp-m50',
        type: 'competences',
        titre: 'HAUTE GOUVERNANCE',
        ordre: 3,
        visible: true,
        contenu: [
          { id: 'sk-50-1', nom: 'Gouvernance de Conseil & Audit', niveau: 5 },
          { id: 'sk-50-2', nom: 'Stratégie ESG & Décarbonation', niveau: 5 },
          { id: 'sk-50-3', nom: 'M&A Stratégique & Capital Market', niveau: 5 }
        ]
      }
    ]
  },
  'modele-51': {
    titre: 'Ingénieur Génie Logiciel | Infrastructure & Systèmes IT',
    couleurAccent: '#0F2744',
    couleurAccentSecondaire: '#0284C7',
    couleurFond: '#FFFFFF',
    couleurTexte: '#1E293B',
    couleurTitreSection: '#0F2744',
    police: 'Inter',
    nombreColonnes: 1,
    styleEnTete: 'tech-arches',
    styleEnTeteSection: 'badge-line',
    styleCompetences: 'tech-cards',
    photoForme: 'carree',
    sections: [
      {
        id: 'sec-p-m51',
        type: 'profil',
        titre: 'PROFIL PROFESSIONNEL',
        ordre: 1,
        visible: true,
        contenu: {
          nomComplet: 'ONIMB MOUSSENI YANN LANDY',
          titreProfessionnel: 'Ingénieur Génie Logiciel | Infrastructure, Systèmes & Solutions IT',
          email: 'mousseniy@gmail.com',
          telephone: '+237 6 98 95 83 57',
          adresse: 'Douala, Yassa – Cameroun',
          resume: 'Ingénieur en Génie Logiciel diplômé de l’École Nationale Supérieure Polytechnique de Douala, avec un profil transversal en ingénierie logicielle, systèmes et infrastructures informatiques. Fort d’une expérience en conception de solutions numériques, développement d’applications et exploitation des environnements informatiques, je souhaite mettre mes compétences au service de projets technologiques à fort enjeu opérationnel, en contribuant à la conception, la sécurisation et l’évolution de solutions fiables et maintenables.'
        }
      },
      {
        id: 'sec-comp-m51',
        type: 'competences',
        titre: 'COMPÉTENCES CLÉS',
        ordre: 2,
        visible: true,
        contenu: [
          {
            id: 'sk-51-1',
            nom: 'DEVELOPPEMENT & IT',
            niveau: 5,
            listSousCompetences: [
              { id: 'sub-51-1', nom: 'Création des tableaux de bord et KPI opérationnels' },
              { id: 'sub-51-2', nom: 'Analyse et modélisation des processus métiers' },
              { id: 'sub-51-3', nom: 'Développement d’API REST' },
              { id: 'sub-51-4', nom: 'Intégration de systèmes et services' },
              { id: 'sub-51-5', nom: 'ORM, modélisation et gestion des données relationnelles et NoSQL' }
            ]
          },
          {
            id: 'sk-51-2',
            nom: 'SYSTEMES & INFRASTRUCTURES',
            niveau: 5,
            listSousCompetences: [
              { id: 'sub-51-6', nom: 'Administration des environnements Windows & Linux' },
              { id: 'sub-51-7', nom: 'Gestion & exploitation des serveurs via des connexions ssh' },
              { id: 'sub-51-8', nom: 'Configuration des services systèmes' },
              { id: 'sub-51-9', nom: 'Diagnostic et résolution d’incidents' }
            ]
          },
          {
            id: 'sk-51-3',
            nom: 'AUTOMATISATION, SECURITE & PERFORMANCE',
            niveau: 5,
            listSousCompetences: [
              { id: 'sub-51-10', nom: 'Automatisation des cycles de développement, déploiement et livraison des applications' },
              { id: 'sub-51-11', nom: 'Gestion des projets informatiques selon des méthodologies en cascade, agile et bien autres' },
              { id: 'sub-51-12', nom: 'Intégrations des processus de sécurité selon des normes iso' }
            ]
          }
        ]
      },
      {
        id: 'sec-tools-m51',
        type: 'personnalisee',
        titre: 'OUTILS & TECHNOLOGIES',
        ordre: 3,
        visible: true,
        contenu: [
          { id: 'tool-1', titre: 'Systèmes', description: 'Linux, Windows' },
          { id: 'tool-2', titre: 'Développement', description: 'JavaScript/TypeScript, Node.js, React, PHP/Laravel' },
          { id: 'tool-3', titre: 'Bases de données', description: 'MongoDB, MySQL, PostgreSQL' },
          { id: 'tool-4', titre: 'Virtualisation & conteneurs', description: 'Docker, Kubernetes, environnements virtualisés (VirtualBox, Hyper-V)' },
          { id: 'tool-5', titre: 'Versionnement & automatisation', description: 'Git, GitHub, CI/CD (GitHub Actions, Jenkins)' },
          { id: 'tool-6', titre: 'Supervision & exploitation', description: 'Prometheus, Grafana' }
        ]
      },
      {
        id: 'sec-exp-m51',
        type: 'experience',
        titre: 'EXPÉRIENCES PROFESSIONNELLES & ACADÉMIQUES',
        ordre: 4,
        visible: true,
        contenu: [
          {
            id: 'exp-51-1',
            poste: 'Stagiaire Infrastructure & Système',
            entreprise: 'BOISSONS DU CAMEROUN',
            ville: 'Douala',
            dateDebut: 'Février 2026',
            dateFin: 'Juillet 2026',
            description: '**Contexte : Migration et modernisation du déploiement d’applications**\n• Mise en place d’une infrastructure de déploiement Kubernetes à deux nœuds pour améliorer la disponibilité et la gestion des applications.\n• Migration d’une application pilote d’une infrastructure virtualisée vers une infrastructure conteneurisée afin de standardiser et fiabiliser cette méthode de déploiement pour les autres applications.\n• Mise en place d’une solution de supervision centralisée pour améliorer le suivi des applications, des ressources systèmes et des incidents.'
          },
          {
            id: 'exp-51-2',
            poste: 'Stagiaire Digitalisation & IT',
            entreprise: 'IWOMI TECHNOLOGIES',
            ville: 'Douala',
            dateDebut: 'Juin 2025',
            dateFin: 'Septembre 2025',
            description: '**Contexte : Surveillance continue des serveurs, prévention et alertes automatiques des incidents**\n• Mise en place d’un système de centralisation des données d’un serveur.\n• Mise en place d’une supervision périodique de 5min pour la vérification de la santé des serveurs.\n• Automatisation d’un système d’alertes en cas d’incident par mail via des protocoles SMTP Brevo.'
          },
          {
            id: 'exp-51-3',
            poste: 'Projet académique — Digitalisation administrative',
            entreprise: 'ÉCOLE NATIONALE SUPÉRIEURE POLYTECHNIQUE DE DOUALA',
            ville: 'Douala',
            dateDebut: '2025',
            dateFin: '2026',
            description: '**Contexte : Digitalisation et automatisation de la demande de documents administratifs pour étudiants**\n• Soumission en ligne des demandes et pièces justificatives.\n• Traitement administratif dématérialisé avec validation ou rejet motivé.\n• Stockage sécurisé des documents et gestion centralisée des pièces.\n• Notifications et transmissions automatisées des réponses et documents par mail.'
          }
        ]
      },
      {
        id: 'sec-form-m51',
        type: 'formation',
        titre: 'FORMATION & CERTIFICATIONS',
        ordre: 5,
        visible: true,
        contenu: [
          {
            id: 'form-51-1',
            diplome: 'Diplôme d’Ingénieur en Génie Logiciel',
            etablissement: 'École Nationale Supérieure Polytechnique de Douala (ENSPD)',
            ville: 'Douala',
            dateDebut: '2020',
            dateFin: '2026 (En cours)',
            description: 'Formation approfondie en génie logiciel, architectures distribuées, bases de données, systèmes d’exploitation et cybersécurité.'
          },
          {
            id: 'form-51-2',
            diplome: 'Formation complète en Administration Système AWS | CISCO',
            etablissement: 'Certifications Professionnelles IT',
            ville: 'En ligne',
            dateDebut: '2024',
            dateFin: '2025',
            description: 'Administration réseau, routage CISCO, virtualisation et déploiements cloud AWS.'
          }
        ]
      },
      {
        id: 'sec-lang-m51',
        type: 'langues',
        titre: 'LANGUES',
        ordre: 6,
        visible: true,
        contenu: [
          { id: 'lang-51-1', langue: 'Français', niveau: 'Courant (Langue de travail)' },
          { id: 'lang-51-2', langue: 'Anglais', niveau: 'Intermédiaire (Lecture technique, documentation)' }
        ]
      }
    ]
  },
  'modele-52': {
    titre: 'Ingénieur IT Senior | Architecture Systèmes & Cloud',
    couleurAccent: '#18181B',
    couleurAccentSecondaire: '#D97706',
    couleurFond: '#FFFFFF',
    couleurTexte: '#18181B',
    couleurTitreSection: '#18181B',
    police: 'Outfit',
    nombreColonnes: 1,
    styleEnTete: 'tech-arches',
    styleEnTeteSection: 'badge-line',
    styleCompetences: 'tech-cards',
    photoForme: 'carree',
    sections: [
      {
        id: 'sec-p-m52',
        type: 'profil',
        titre: 'PROFIL PROFESSIONNEL',
        ordre: 1,
        visible: true,
        contenu: {
          nomComplet: 'ALEXANDRE VANDENBERG',
          titreProfessionnel: 'Architecte Systèmes & Solutions Cloud | Lead DevOps',
          email: 'a.vandenberg@tech-executive.com',
          telephone: '+33 6 12 34 56 78',
          adresse: 'Paris & Télétravail international',
          resume: 'Architecte Systèmes d’Information et Cloud avec 8 ans d’expertise dans le dimensionnement d’infrastructures critiques, la transition vers Kubernetes et la sécurisation des pipelines CI/CD à haute disponibilité.'
        }
      },
      {
        id: 'sec-comp-m52',
        type: 'competences',
        titre: 'COMPÉTENCES CLÉS',
        ordre: 2,
        visible: true,
        contenu: [
          {
            id: 'sk-52-1',
            nom: 'CLOUD & ARCHITECTURE',
            niveau: 5,
            listSousCompetences: [
              { id: 'sub-52-1', nom: 'Conception d’infrastructures hybrides AWS / Azure' },
              { id: 'sub-52-2', nom: 'Orchestration Kubernetes & Helm charts' },
              { id: 'sub-52-3', nom: 'Infrastructure as Code avec Terraform & Ansible' }
            ]
          },
          {
            id: 'sk-52-2',
            nom: 'SYSTÈMES & OBSERVABILITÉ',
            niveau: 5,
            listSousCompetences: [
              { id: 'sub-52-4', nom: 'Administration Linux RedHat / Debian avancée' },
              { id: 'sub-52-5', nom: 'Supervision Datadog, Prometheus & Grafana' },
              { id: 'sub-52-6', nom: 'Audit de performance et optimisation kernel' }
            ]
          },
          {
            id: 'sk-52-3',
            nom: 'SÉCURITÉ & DEVOPS',
            niveau: 5,
            listSousCompetences: [
              { id: 'sub-52-7', nom: 'Hardening des conteneurs et conformité ISO 27001' },
              { id: 'sub-52-8', nom: 'Pipelines CI/CD GitLab & GitHub Actions sécurisés' },
              { id: 'sub-52-9', nom: 'Gestion des secrets avec HashiCorp Vault' }
            ]
          }
        ]
      },
      {
        id: 'sec-exp-m52',
        type: 'experience',
        titre: 'EXPÉRIENCES PROFESSIONNELLES',
        ordre: 3,
        visible: true,
        contenu: [
          {
            id: 'exp-52-1',
            poste: 'Lead Architecte Cloud & DevOps',
            entreprise: 'NEXUS CLOUD SOLUTIONS',
            ville: 'Paris',
            dateDebut: '2023',
            dateFin: 'Présent',
            description: '**Contexte : Migration multi-cloud pour des clients bancaires et e-commerce**\n• Déploiement d’architectures microservices sur EKS avec haute tolérance aux pannes.\n• Réduction des coûts d’infrastructure de 35% grâce au finOps et à l’autoscaling intelligent.'
          }
        ]
      },
      {
        id: 'sec-form-m52',
        type: 'formation',
        titre: 'FORMATION & CERTIFICATIONS',
        ordre: 4,
        visible: true,
        contenu: [
          {
            id: 'form-52-1',
            diplome: 'Master en Informatique & Systèmes Distribués',
            etablissement: 'Université Paris-Saclay',
            ville: 'Paris',
            dateDebut: '2016',
            dateFin: '2021',
            description: 'Spécialisation réseaux haute performance et virtualisation.'
          }
        ]
      }
    ]
  },
  'modele-53': {
    titre: 'Ingénieur Cloud & DevOps | Émeraude & GreenTech',
    couleurAccent: '#064E3B',
    couleurAccentSecondaire: '#0D9488',
    couleurFond: '#FFFFFF',
    couleurTexte: '#1E293B',
    couleurTitreSection: '#064E3B',
    police: 'Inter',
    nombreColonnes: 1,
    styleEnTete: 'tech-arches',
    styleEnTeteSection: 'badge-line',
    styleCompetences: 'tech-cards',
    photoForme: 'carree',
    sections: [
      {
        id: 'sec-p-m53',
        type: 'profil',
        titre: 'PROFIL PROFESSIONNEL',
        ordre: 1,
        visible: true,
        contenu: {
          nomComplet: 'MATHIEU DELORME',
          titreProfessionnel: 'Ingénieur Infrastructure & Solutions Green IT',
          email: 'mathieu.delorme@greentech-cloud.fr',
          telephone: '+33 6 45 89 12 30',
          adresse: 'Lyon / Genève',
          resume: 'Expert en éco-conception logicielle et optimisation énergétique des datacenters. Passionné par l’automatisation des déploiements conteneurisés et la mesure d’empreinte carbone des systèmes IT.'
        }
      },
      {
        id: 'sec-comp-m53',
        type: 'competences',
        titre: 'COMPÉTENCES CLÉS',
        ordre: 2,
        visible: true,
        contenu: [
          {
            id: 'sk-53-1',
            nom: 'DÉVELOPPEMENT & ECO-DESIGN',
            niveau: 5,
            listSousCompetences: [
              { id: 'sub-53-1', nom: 'Mesure et réduction d’empreinte carbone IT' },
              { id: 'sub-53-2', nom: 'Développement API Node.js / Go performant' },
              { id: 'sub-53-3', nom: 'Optimisation des requêtes SQL / NoSQL' }
            ]
          },
          {
            id: 'sk-53-2',
            nom: 'INFRASTRUCTURE & DOCKER',
            niveau: 5,
            listSousCompetences: [
              { id: 'sub-53-3', nom: 'Conteneurisation légère multi-arch' },
              { id: 'sub-53-4', nom: 'Clusters Kubernetes K3s & edge computing' },
              { id: 'sub-53-5', nom: 'Réseaux virtuels et VPN sécurisés' }
            ]
          },
          {
            id: 'sk-53-3',
            nom: 'AUTOMATISATION & QUALITÉ',
            niveau: 5,
            listSousCompetences: [
              { id: 'sub-53-6', nom: 'CI/CD automatisé et tests de régression' },
              { id: 'sub-53-7', nom: 'Monitoring open-source Prometheus/Grafana' },
              { id: 'sub-53-8', nom: 'Gestion de configuration avec Ansible' }
            ]
          }
        ]
      },
      {
        id: 'sec-exp-m53',
        type: 'experience',
        titre: 'EXPÉRIENCES PROFESSIONNELLES',
        ordre: 3,
        visible: true,
        contenu: [
          {
            id: 'exp-53-1',
            poste: 'Ingénieur Cloud & Systèmes',
            entreprise: 'ECO-CLOUD SYSTEMS',
            ville: 'Lyon',
            dateDebut: '2022',
            dateFin: 'Présent',
            description: '**Contexte : Déploiement d’infrastructures cloud sobres en carbone**\n• Supervision continue de 50+ nœuds de calcul et alertes proactives.\n• Réduction de 40% de la consommation CPU moyenne des applications web.'
          }
        ]
      }
    ]
  },
  'modele-54': {
    titre: 'Expert Cybersécurité & Ingénieur Systèmes | Cyber Indigo',
    couleurAccent: '#1E1B4B',
    couleurAccentSecondaire: '#6366F1',
    couleurFond: '#FFFFFF',
    couleurTexte: '#1E1B4B',
    couleurTitreSection: '#1E1B4B',
    police: 'Inter',
    nombreColonnes: 1,
    styleEnTete: 'tech-arches',
    styleEnTeteSection: 'badge-line',
    styleCompetences: 'tech-cards',
    photoForme: 'carree',
    sections: [
      {
        id: 'sec-p-m54',
        type: 'profil',
        titre: 'PROFIL PROFESSIONNEL',
        ordre: 1,
        visible: true,
        contenu: {
          nomComplet: 'DAMIEN KOUASSI',
          titreProfessionnel: 'Ingénieur Sécurité des Systèmes d’Information & DevSecOps',
          email: 'damien.kouassi@cyber-defense.io',
          telephone: '+225 07 89 45 12 36',
          adresse: 'Abidjan / Paris',
          resume: 'Ingénieur en sécurité des systèmes et réseaux avec certification CEH et CISSP. Spécialiste de la détection d’intrusions, du durcissement des serveurs Linux/Windows et de l’intégration de la sécurité dans le cycle DevOps.'
        }
      },
      {
        id: 'sec-comp-m54',
        type: 'competences',
        titre: 'COMPÉTENCES CLÉS',
        ordre: 2,
        visible: true,
        contenu: [
          {
            id: 'sk-54-1',
            nom: 'CYBERDÉFENSE & SOC',
            niveau: 5,
            listSousCompetences: [
              { id: 'sub-54-1', nom: 'Analyse des logs SIEM (Wazuh, Splunk)' },
              { id: 'sub-54-2', nom: 'Détection d’anomalies et réponse aux incidents' },
              { id: 'sub-54-3', nom: 'Tests d’intrusion et audits de vulnérabilités' }
            ]
          },
          {
            id: 'sk-54-2',
            nom: 'DEVSECOPS & CONTENEURS',
            niveau: 5,
            listSousCompetences: [
              { id: 'sub-54-4', nom: 'Scan de vulnérabilités Trivy & SonarQube' },
              { id: 'sub-54-5', nom: 'Durcissement Kubernetes (Falco, OPA Gatekeeper)' },
              { id: 'sub-54-6', nom: 'Gestion d’accès IAM et Zero Trust' }
            ]
          },
          {
            id: 'sk-54-3',
            nom: 'INFRASTRUCTURES CRITIQUES',
            niveau: 5,
            listSousCompetences: [
              { id: 'sub-54-7', nom: 'Administration serveurs Linux Debian/RHEL' },
              { id: 'sub-54-8', nom: 'Protocoles cryptographiques TLS, PKI, SSH' },
              { id: 'sub-54-9', nom: 'Plans de reprise d’activité (PRA / PCA)' }
            ]
          }
        ]
      },
      {
        id: 'sec-exp-m54',
        type: 'experience',
        titre: 'EXPÉRIENCES PROFESSIONNELLES',
        ordre: 3,
        visible: true,
        contenu: [
          {
            id: 'exp-54-1',
            poste: 'Ingénieur Sécurité & Systèmes',
            entreprise: 'CYBERDEFENSE AFRICA',
            ville: 'Abidjan',
            dateDebut: '2023',
            dateFin: 'Présent',
            description: '**Contexte : Protection des infrastructures bancaires et télécoms**\n• Déploiement d’un SIEM open-source centralisé pour 200+ serveurs.\n• Conduite de simulations d’attaques et durcissement des configurations réseau.'
          }
        ]
      }
    ]
  },
  'modele-55': {
    titre: 'Directeur Technique & Lead IT | Bordeaux & Ambre Royal',
    couleurAccent: '#881337',
    couleurAccentSecondaire: '#E11D48',
    couleurFond: '#FFFFFF',
    couleurTexte: '#1C1917',
    couleurTitreSection: '#881337',
    police: 'Montserrat',
    nombreColonnes: 1,
    styleEnTete: 'tech-arches',
    styleEnTeteSection: 'badge-line',
    styleCompetences: 'tech-cards',
    photoForme: 'carree',
    sections: [
      {
        id: 'sec-p-m55',
        type: 'profil',
        titre: 'PROFIL PROFESSIONNEL',
        ordre: 1,
        visible: true,
        contenu: {
          nomComplet: 'JEAN-BAPTISTE MOREL',
          titreProfessionnel: 'Directeur des Systèmes d’Information | Head of IT Infrastructure',
          email: 'jb.morel@direction-it.fr',
          telephone: '+33 6 78 90 12 34',
          adresse: 'Bordeaux & Paris',
          resume: 'Directeur Technique avec 12 ans d’expérience dans le pilotage de programmes de transformation numérique, la direction d’équipes d’ingénieurs et la gouvernance budgétaire et sécuritaire des SI.'
        }
      },
      {
        id: 'sec-comp-m55',
        type: 'competences',
        titre: 'COMPÉTENCES CLÉS',
        ordre: 2,
        visible: true,
        contenu: [
          {
            id: 'sk-55-1',
            nom: 'MANAGEMENT & STRATÉGIE',
            niveau: 5,
            listSousCompetences: [
              { id: 'sub-55-1', nom: 'Pilotage de budgets IT (> 5M€)' },
              { id: 'sub-55-2', nom: 'Management d’équipes pluridisciplinaires (25+ pers.)' },
              { id: 'sub-55-3', nom: 'Alignement stratégique métiers et ROI technologique' }
            ]
          },
          {
            id: 'sk-55-2',
            nom: 'ARCHITECTURE & MODERNISATION',
            niveau: 5,
            listSousCompetences: [
              { id: 'sub-55-4', nom: 'Refonte de SI legacy vers le Cloud natif' },
              { id: 'sub-55-5', nom: 'Gouvernance des données et conformité RGPD' },
              { id: 'sub-55-6', nom: 'Contractualisation et pilotage des éditeurs/prestataires' }
            ]
          },
          {
            id: 'sk-55-3',
            nom: 'CYBERSÉCURITÉ & CONTINUITÉ',
            niveau: 5,
            listSousCompetences: [
              { id: 'sub-55-7', nom: 'Politique de Sécurité des SI (PSSI)' },
              { id: 'sub-55-8', nom: 'Gestion des crises cyber et résilience opérationnelle' },
              { id: 'sub-55-9', nom: 'Audit de maturité technologique' }
            ]
          }
        ]
      },
      {
        id: 'sec-exp-m55',
        type: 'experience',
        titre: 'EXPÉRIENCES PROFESSIONNELLES',
        ordre: 3,
        visible: true,
        contenu: [
          {
            id: 'exp-55-1',
            poste: 'Head of IT & Infrastructure',
            entreprise: 'GROUPE ATLANTIC DIGITAL',
            ville: 'Bordeaux',
            dateDebut: '2020',
            dateFin: 'Présent',
            description: '**Contexte : Direction globale des infrastructures et du support utilisateurs**\n• Migration complète de l’infrastructure vers un modèle hybride sécurisé.\n• Optimisation du taux de disponibilité des services critiques à 99,98%.'
          }
        ]
      }
    ]
  }
};

export function getPresetForTemplate(templateId: string, langue: Language = 'fr'): CVTemplatePreset {
  const basePreset = TEMPLATE_PRESETS[templateId] || TEMPLATE_PRESETS['modele-1'];
  const tmpl = CV_TEMPLATES.find((t) => t.id === templateId);

  const isTwoCol = tmpl ? tmpl.layoutFamily !== 'single-column' : (basePreset.nombreColonnes !== 1);
  const numCols: 1 | 2 = isTwoCol ? 2 : 1;
  const sidebarPos: 'gauche' | 'droite' = tmpl
    ? (tmpl.layoutFamily === 'two-column-right' ? 'droite' : 'gauche')
    : (basePreset.positionSidebar || 'gauche');
  const leftWidth = basePreset.largeurColonneGauche ?? 32;

  // Localize section titles and guarantee columns are assigned so sidebars are never empty
  const assignedSections: Section[] = basePreset.sections.map((sec) => {
    let col = sec.colonne;
    if (!col) {
      if (numCols === 1) {
        col = 'principale';
      } else {
        if (['profil', 'competences', 'langues', 'interets', 'coordonnees', 'references', 'qualites', 'certifications'].includes(sec.type) || (sec.type === 'personnalisee' && !sec.titre?.toLowerCase().includes('projet') && !sec.titre?.toLowerCase().includes('exp'))) {
          col = 'gauche';
        } else {
          col = 'droite';
        }
      }
    }

    let newTitle = sec.titre;
    if (langue !== 'fr') {
      if (sec.type === 'profil') {
        newTitle = langue === 'en' ? 'PROFILE & CONTACT' : 'الملف الشخصي والاتصال';
      } else if (sec.type === 'experience') {
        newTitle = langue === 'en' ? 'WORK EXPERIENCE' : 'الخبرات المهنية';
      } else if (sec.type === 'formation') {
        newTitle = langue === 'en' ? 'EDUCATION' : 'المؤهلات التعليمية';
      } else if (sec.type === 'competences') {
        newTitle = langue === 'en' ? 'SKILLS' : 'المهارات';
      } else if (sec.type === 'langues') {
        newTitle = langue === 'en' ? 'LANGUAGES' : 'اللغات';
      } else if (sec.type === 'benevolat') {
        newTitle = langue === 'en' ? 'VOLUNTEERING' : 'العمل التطوعي';
      } else if (sec.type === 'publications') {
        newTitle = langue === 'en' ? 'PUBLICATIONS & RESEARCH' : 'المنشورات والأبحاث';
      } else if (sec.type === 'distinctions') {
        newTitle = langue === 'en' ? 'AWARDS & HONORS' : 'الجوائز والتكريمات';
      } else if (sec.type === 'qualites') {
        newTitle = langue === 'en' ? 'SOFT SKILLS' : 'المهارات الشخصية';
      }
    }
    return {
      ...sec,
      colonne: col,
      titre: newTitle
    };
  });

  return {
    ...basePreset,
    nombreColonnes: numCols,
    positionSidebar: sidebarPos,
    largeurColonneGauche: leftWidth,
    sections: assignedSections
  };
}

export function getCleanPresetForTemplate(templateId: string, langue: Language = 'fr'): CVTemplatePreset {
  const base = getPresetForTemplate(templateId, langue);
  
  const cleanSections: Section[] = base.sections.map((sec) => {
    if (sec.type === 'profil') {
      return {
        ...sec,
        contenu: {
          nomComplet: '',
          titreProfessionnel: '',
          email: '',
          telephone: '',
          adresse: '',
          website: '',
          linkedin: '',
          resume: ''
        }
      };
    }
    if (['experience', 'formation', 'competences', 'langues', 'interets', 'certifications', 'projets', 'benevolat', 'publications', 'distinctions', 'qualites', 'references'].includes(sec.type)) {
      return {
        ...sec,
        contenu: []
      };
    }
    return {
      ...sec,
      contenu: typeof sec.contenu === 'object' && !Array.isArray(sec.contenu) ? {} : []
    };
  });

  return {
    ...base,
    photoUrl: '', // No stranger photo defaulted
    sections: cleanSections
  };
}

export function applyTemplatePresetToCV(currentCV: CV, presetKey: string): CV {
  const preset = TEMPLATE_PRESETS[presetKey] || TEMPLATE_PRESETS['modele-1'];
  const tmpl = CV_TEMPLATES.find((t) => t.id === presetKey);

  const isTwoCol = tmpl ? tmpl.layoutFamily !== 'single-column' : (preset.nombreColonnes !== 1);
  const numCols: 1 | 2 = isTwoCol ? 2 : 1;
  const sidebarPos: 'gauche' | 'droite' = tmpl
    ? (tmpl.layoutFamily === 'two-column-right' ? 'droite' : 'gauche')
    : (preset.positionSidebar || 'gauche');
  const leftWidth = preset.largeurColonneGauche ?? 32;

  // Map user sections to appropriate columns
  const baseSections = currentCV.sections && currentCV.sections.length > 0 ? currentCV.sections : preset.sections;
  const updatedSections: Section[] = baseSections.map((sec) => {
    if (numCols === 1) {
      return { ...sec, colonne: 'principale' as const };
    }
    if (['profil', 'competences', 'langues', 'interets', 'coordonnees', 'references', 'qualites', 'certifications'].includes(sec.type) || (sec.type === 'personnalisee' && !sec.titre?.toLowerCase().includes('projet') && !sec.titre?.toLowerCase().includes('exp'))) {
      return { ...sec, colonne: 'gauche' as const };
    }
    return { ...sec, colonne: 'droite' as const };
  });

  return {
    ...currentCV,
    templateId: presetKey,
    couleurAccent: preset.couleurAccent || tmpl?.themeConfig.primaryColor || currentCV.couleurAccent || '#2563EB',
    couleurAccentSecondaire: preset.couleurAccentSecondaire || tmpl?.themeConfig.secondaryColor || currentCV.couleurAccentSecondaire || '#93C5FD',
    couleurFond: preset.couleurFond || tmpl?.themeConfig.backgroundColor || currentCV.couleurFond,
    couleurFondSidebar: preset.couleurFondSidebar || tmpl?.themeConfig.sidebarBackgroundColor || currentCV.couleurFondSidebar || '#F8FAFC',
    couleurTexte: preset.couleurTexte || tmpl?.themeConfig.textColor || currentCV.couleurTexte,
    couleurTexteSidebar: preset.couleurTexteSidebar || tmpl?.themeConfig.sidebarTextColor || currentCV.couleurTexteSidebar,
    couleurTitreSection: preset.couleurTitreSection || tmpl?.themeConfig.headingColor || currentCV.couleurTitreSection,
    couleurTitreSectionSidebar: preset.couleurTitreSectionSidebar || currentCV.couleurTitreSectionSidebar,
    styleEnTete: preset.styleEnTete || tmpl?.themeConfig.headerStyle || currentCV.styleEnTete || 'banner',
    styleEnTeteSection: preset.styleEnTeteSection || tmpl?.themeConfig.sectionHeaderStyle || currentCV.styleEnTeteSection || 'underline',
    styleCompetences: preset.styleCompetences || tmpl?.themeConfig.skillsDisplayMode || currentCV.styleCompetences || 'badges',
    photoForme: preset.photoForme || currentCV.photoForme || 'ronde',
    photoPosition: preset.photoPosition || currentCV.photoPosition || 'in-header',
    police: preset.police || tmpl?.defaultFont || currentCV.police || 'Inter',
    nombreColonnes: numCols,
    largeurColonneGauche: leftWidth,
    positionSidebar: sidebarPos,
    formeSidebarDecor: preset.formeSidebarDecor || 'straight',
    timelineStyle: preset.timelineStyle || 'none',
    cadrePhotoRing: preset.cadrePhotoRing || 'none',
    sections: updatedSections
  };
}

