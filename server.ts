import express from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import * as pdfParseModule from 'pdf-parse';

async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  // Try v1 / function export
  const fn = typeof pdfParseModule === 'function'
    ? pdfParseModule
    : ((pdfParseModule as any)?.default);

  if (typeof fn === 'function') {
    try {
      const res = await fn(buffer);
      if (res && typeof res.text === 'string') {
        return res.text;
      }
    } catch (e) {
      console.warn('pdf-parse function export failed, attempting PDFParse class:', e);
    }
  }

  // Try v2 PDFParse class export
  const PDFParseClass = (pdfParseModule as any)?.PDFParse || (pdfParseModule as any)?.default?.PDFParse;
  if (PDFParseClass) {
    const parser = new PDFParseClass({ data: buffer });
    try {
      const result = await parser.getText();
      if (result && typeof result.text === 'string') {
        return result.text;
      }
    } finally {
      if (typeof parser.destroy === 'function') {
        try { await parser.destroy(); } catch {}
      }
    }
  }

  throw new Error('Impossible d\'initialiser le moteur de lecture PDF.');
}
import mammoth from 'mammoth';
import { createServer as createViteServer } from 'vite';
import { TEMPLATE_PRESETS, getPresetForTemplate, getCleanPresetForTemplate } from './src/data/templatePresets';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '25mb' }));

// File upload configuration for CV import (memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB
});

// Ensure database file exists
const DB_FILE = path.join(process.cwd(), 'data', 'db.json');
if (!fs.existsSync(path.dirname(DB_FILE))) {
  fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
}

interface DB {
  users: Array<{ id: string; nom: string; email: string; motDePasseHash: string; role?: string; langue: string; createdAt: string }>;
  cvs: Array<any>;
  payments: Array<any>;
  letters: Array<any>;
}

function loadDB(): DB {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsedDB: DB = JSON.parse(raw);
      let needsSave = false;

      if (!parsedDB.letters) {
        parsedDB.letters = [];
        needsSave = true;
      }

      // Guarantee admin user exists with required credentials
      let admin = parsedDB.users.find(u => u.email.toLowerCase() === 'mouotiejospel@gmail.com');
      if (!admin) {
        admin = {
          id: 'u-admin',
          nom: 'Administrateur Jospel',
          email: 'mouotiejospel@gmail.com',
          motDePasseHash: 'Iorimarou1@',
          role: 'ADMIN',
          langue: 'fr',
          createdAt: new Date().toISOString()
        };
        parsedDB.users.push(admin);
        needsSave = true;
      } else {
        if (admin.motDePasseHash !== 'Iorimarou1@' || admin.role !== 'ADMIN') {
          admin.motDePasseHash = 'Iorimarou1@';
          admin.role = 'ADMIN';
          needsSave = true;
        }
      }

      // Guarantee photoUrl and photo settings on CVs
      if (parsedDB.cvs) {
        parsedDB.cvs.forEach(c => {
          if (c.photoUrl === undefined) {
            c.photoUrl = '';
            needsSave = true;
          }
          if (c.afficherPhoto === undefined) {
            c.afficherPhoto = true;
            needsSave = true;
          }
        });
      }

      if (needsSave) {
        saveDB(parsedDB);
      }
      return parsedDB;
    }
  } catch (err) {
    console.error('Error loading db.json:', err);
  }

  // Initial seed data
  const initialDB: DB = {
    users: [
      {
        id: 'u-demo-1',
        nom: 'Jean Dupont',
        email: 'jean.dupont@exemple.com',
        motDePasseHash: 'demo123',
        role: 'USER',
        langue: 'fr',
        createdAt: new Date().toISOString()
      },
      {
        id: 'u-admin',
        nom: 'Administrateur Jospel',
        email: 'mouotiejospel@gmail.com',
        motDePasseHash: 'Iorimarou1@',
        role: 'ADMIN',
        langue: 'fr',
        createdAt: new Date().toISOString()
      }
    ],
    cvs: [
      {
        id: 'cv-demo-1',
        utilisateurId: 'u-demo-1',
        titre: 'Mon CV Développeur Full Stack',
        templateId: 'moderne-1',
        langue: 'fr',
        couleurAccent: '#2563EB',
        police: 'Inter',
        statutPaiement: 'PAYE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        sections: [
          {
            id: 'sec-p-1',
            type: 'profil',
            titre: 'Profil & Coordonnées',
            ordre: 1,
            visible: true,
            contenu: {
              nomComplet: 'Jean Dupont',
              titreProfessionnel: 'Développeur Full Stack Senior',
              email: 'jean.dupont@exemple.com',
              telephone: '+237 658 60 61 03',
              adresse: 'Douala, Cameroun',
              website: 'www.jeandupont.dev',
              linkedin: 'linkedin.com/in/jeandupont',
              resume: 'Développeur passionné avec 5+ années d\'expérience dans le développement d\'applications web performantes. Spécialisé en React, Node.js, TypeScript et architectures modernes.'
            }
          },
          {
            id: 'sec-exp-1',
            type: 'experience',
            titre: 'Expériences professionnelles',
            ordre: 2,
            visible: true,
            contenu: [
              {
                id: 'exp-1',
                poste: 'Lead Developer Frontend',
                entreprise: 'Tech Vision Africa',
                ville: 'Douala',
                dateDebut: 'Janvier 2022',
                dateFin: 'Présent',
                actuel: true,
                description: 'Direction technique d\'une équipe de 5 développeurs. Conception d\'interfaces web responsives et optimisation des performances.'
              },
              {
                id: 'exp-2',
                poste: 'Développeur Web Full Stack',
                entreprise: 'Innov Digital Solutions',
                ville: 'Yaoundé',
                dateDebut: 'Juin 2019',
                dateFin: 'Décembre 2021',
                actuel: false,
                description: 'Développement d\'API RESTful sécurisées et de tableaux de bord interactifs pour clients grands comptes.'
              }
            ]
          },
          {
            id: 'sec-edu-1',
            type: 'formation',
            titre: 'Formations & Diplômes',
            ordre: 3,
            visible: true,
            contenu: [
              {
                id: 'edu-1',
                diplome: 'Master en Génie Logiciel',
                etablissement: 'Université de Douala - IUT',
                ville: 'Douala',
                dateDebut: '2017',
                dateFin: '2019',
                description: 'Spécialité Systèmes d\'information et Sécurité. Mention Très Bien.'
              }
            ]
          },
          {
            id: 'sec-sk-1',
            type: 'competences',
            titre: 'Compétences',
            ordre: 4,
            visible: true,
            contenu: [
              { id: 's-1', nom: 'TypeScript / JavaScript', niveau: 5 },
              { id: 's-2', nom: 'React / Next.js', niveau: 5 },
              { id: 's-3', nom: 'Node.js & Express', niveau: 4 },
              { id: 's-4', nom: 'Tailwind CSS', niveau: 5 },
              { id: 's-5', nom: 'PostgreSQL / MongoDB', niveau: 4 }
            ]
          },
          {
            id: 'sec-l-1',
            type: 'langues',
            titre: 'Langues',
            ordre: 5,
            visible: true,
            contenu: [
              { id: 'l-1', langue: 'Français', niveau: 'Langue maternelle' },
              { id: 'l-2', langue: 'Anglais', niveau: 'Courant (C1 / Professionnel)' }
            ]
          }
        ]
      }
    ],
    payments: [
      {
        id: 'pay-demo-1',
        utilisateurId: 'u-demo-1',
        cvId: 'cv-demo-1',
        montant: 100,
        numeroReception: '653998494',
        numeroExpediteur: '690001122',
        referenceTransaction: 'OM202608061234',
        statut: 'VALIDE',
        valideLe: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        userEmail: 'jean.dupont@exemple.com',
        userName: 'Jean Dupont',
        cvTitle: 'Mon CV Développeur Full Stack'
      }
    ],
    letters: [
      {
        id: 'lettre-demo-1',
        utilisateurId: 'u-demo-1',
        cvId: 'cv-demo-1',
        titre: 'Lettre Développeur Senior - Orange Cameroun',
        destinataire: 'Direction des Ressources Humaines & Talents',
        entreprise: 'Orange Cameroun',
        poste: 'Développeur Full Stack Senior',
        villeDate: 'Douala, le 15 Août 2026',
        dateCreation: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        langue: 'fr',
        police: 'Inter',
        taillePolice: 11,
        couleurAccent: '#2563EB',
        expediteur: {
          nomComplet: 'Jean Dupont',
          titreProfessionnel: 'Développeur Full Stack Senior',
          email: 'jean.dupont@exemple.com',
          telephone: '+237 658 60 61 03',
          adresse: 'Douala, Cameroun'
        },
        objet: 'Candidature spontanée au poste de Développeur Full Stack Senior',
        formulePolitesseEntree: 'Madame, Monsieur,',
        paragrapheAccroche: 'Fort d\'une expérience significative de plus de 5 ans dans la conception et le déploiement d\'architectures web évolutives, je me permets de vous soumettre ma candidature pour intégrer vos équipes techniques à Douala.',
        paragrapheValeurAjoutee: 'Au cours de mes précédentes missions, j\'ai notamment piloté le développement d\'applications critiques sous React, Node.js et TypeScript, en garantissant un haut niveau de performance, de sécurité et d\'ergonomie. Ma maîtrise du cycle complet de développement logiciel et mon attachement aux méthodologies agiles me permettent de m\'intégrer rapidement et efficacement au sein de projets d\'envergure.',
        paragrapheAdequationEntreprise: 'La réputation d\'Orange Cameroun en matière d\'innovation technologique et de transformation digitale correspond parfaitement à mon ambition d\'apporter des solutions logicielles robustes et à fort impact.',
        paragrapheConclusion: 'Je serais honoré de pouvoir échanger avec vous lors d\'un entretien afin de vous exposer de vive voix mes motivations et la valeur que je pourrais apporter à vos projets.',
        formulePolitesseSortie: 'Je vous prie d\'agréer, Madame, Monsieur, l\'expression de mes salutations les plus distinguées.',
        texteComplet: 'Madame, Monsieur,\n\nFort d\'une expérience significative de plus de 5 ans dans la conception et le déploiement d\'architectures web évolutives, je me permets de vous soumettre ma candidature pour intégrer vos équipes techniques à Douala.\n\nAu cours de mes précédentes missions, j\'ai notamment piloté le développement d\'applications critiques sous React, Node.js et TypeScript, en garantissant un haut niveau de performance, de sécurité et d\'ergonomie. Ma maîtrise du cycle complet de développement logiciel et mon attachement aux méthodologies agiles me permettent de m\'intégrer rapidement et efficacement au sein de projets d\'envergure.\n\nLa réputation d\'Orange Cameroun en matière d\'innovation technologique et de transformation digitale correspond parfaitement à mon ambition d\'apporter des solutions logicielles robustes et à fort impact.\n\nJe serais honoré de pouvoir échanger avec vous lors d\'un entretien afin de vous exposer de vive voix mes motivations et la valeur que je pourrais apporter à vos projets.\n\nJe vous prie d\'agréer, Madame, Monsieur, l\'expression de mes salutations les plus distinguées.\n\nJean Dupont',
        signature: 'Jean Dupont'
      }
    ]
  };

  saveDB(initialDB);
  return initialDB;
}

function saveDB(data: DB) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving db.json:', err);
  }
}

// -------------------------------------------------------------
// API ROUTES
// -------------------------------------------------------------

// Document Parsing Route for CV Import (PDF & DOCX)
app.post('/api/import/parse', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Aucun fichier reçu.' });
  }

  const file = req.file;
  const fileName = file.originalname || 'document';
  const ext = path.extname(fileName).toLowerCase();

  try {
    let extractedText = '';

    if (ext === '.pdf' || file.mimetype === 'application/pdf') {
      extractedText = await extractTextFromPDF(file.buffer);
    } else if (ext === '.docx' || file.mimetype.includes('wordprocessingml') || file.mimetype.includes('msword')) {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      extractedText = result.value || '';
    } else if (ext === '.txt' || file.mimetype.includes('text/plain')) {
      extractedText = file.buffer.toString('utf-8');
    } else {
      return res.status(400).json({
        error: 'Format non supporté. Veuillez importer un fichier .pdf, .docx ou .txt.'
      });
    }

    // Clean up non-printable control characters while preserving lines
    extractedText = extractedText
      .replace(/\r\n/g, '\n')
      .replace(/[ \t]+/g, ' ')
      .trim();

    if (!extractedText || extractedText.length < 20) {
      return res.status(400).json({
        error: 'Impossible d\'extraire le texte de ce fichier. S\'il s\'agit d\'un document scanné ou basé sur des images (sans couche texte), veuillez sélectionner un fichier vectoriel ou copier/coller votre texte.'
      });
    }

    res.json({
      text: extractedText,
      fileName,
      characterCount: extractedText.length
    });
  } catch (err: any) {
    console.error('Error parsing document file:', err?.message || err);
    res.status(500).json({
      error: 'Erreur lors de l\'extraction du texte du document. Le fichier est peut-être corrompu ou protégé.'
    });
  }
});

// Auth Routes
app.post('/api/auth/register', (req, res) => {
  const { nom, email, motDePasse, langue } = req.body;
  if (!email || !motDePasse || !nom) {
    return res.status(400).json({ error: 'Tous les champs sont requis' });
  }

  const db = loadDB();
  const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'Un compte existe déjà avec cet e-mail' });
  }

  const newUser = {
    id: `u-${Date.now()}`,
    nom,
    email,
    motDePasseHash: motDePasse,
    role: email.toLowerCase() === 'mouotiejospel@gmail.com' ? 'ADMIN' : 'USER',
    langue: langue || 'fr',
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  saveDB(db);

  const { motDePasseHash, ...safeUser } = newUser;
  res.json({ user: safeUser, token: `jwt-token-${newUser.id}` });
});

app.post('/api/auth/login', (req, res) => {
  const { email, motDePasse } = req.body;
  const db = loadDB();

  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user || user.motDePasseHash !== motDePasse) {
    return res.status(401).json({ error: 'Identifiants incorrects' });
  }

  const { motDePasseHash, ...safeUser } = user;
  res.json({ user: safeUser, token: `jwt-token-${user.id}` });
});

app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Non authentifié' });
  }

  const userId = authHeader.replace('Bearer jwt-token-', '');
  const db = loadDB();
  const user = db.users.find(u => u.id === userId);

  if (!user) {
    return res.status(401).json({ error: 'Session expirée' });
  }

  const { motDePasseHash, ...safeUser } = user;
  res.json({ user: safeUser });
});

// CV Routes
app.get('/api/cv', (req, res) => {
  const userId = req.query.userId as string;
  const db = loadDB();

  let userCVs = db.cvs;
  if (userId) {
    userCVs = db.cvs.filter(c => c.utilisateurId === userId);
  }

  res.json({ cvs: userCVs });
});

app.post('/api/cv', (req, res) => {
  const { utilisateurId, titre, templateId, langue, couleurAccent, police, sections, photoUrl, isPrefilled, isBlank } = req.body;
  const db = loadDB();

  const selectedTemplateId = templateId || 'modele-1';
  const selectedLangue = langue || 'fr';

  const cleanPreset = getCleanPresetForTemplate(selectedTemplateId, selectedLangue);
  const samplePreset = getPresetForTemplate(selectedTemplateId, selectedLangue);

  const prefilledBool = isPrefilled !== undefined ? Boolean(isPrefilled) : (isBlank !== undefined ? !isBlank : true);
  const activePreset = prefilledBool ? samplePreset : cleanPreset;
  const defaultSections = sections || activePreset.sections;

  const newCV = {
    id: `cv-${Date.now()}`,
    utilisateurId: utilisateurId || 'u-demo-1',
    titre: titre || activePreset.titre || 'Nouveau CV',
    templateId: selectedTemplateId,
    langue: selectedLangue,
    couleurAccent: couleurAccent || activePreset.couleurAccent || '#2563EB',
    police: police || activePreset.police || 'Inter',
    taillePolice: 'md',
    taillePoliceValeur: 6,
    tailleTitreSectionValeur: 8,
    hauteurLigneValeur: 0.8,
    hauteurLigne: 'tight',
    ecartementTexte: 'normal',
    margeSection: 'compact',
    photoUrl: photoUrl !== undefined ? photoUrl : (prefilledBool ? samplePreset.photoUrl : ''),
    afficherPhoto: true,
    titrePrincipalEnGrand: 'NOM',
    statutPaiement: 'NON_PAYE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...activePreset,
    sections: defaultSections
  };

  db.cvs.push(newCV);
  saveDB(db);

  res.json({ cv: newCV });
});

app.get('/api/cv/:id', (req, res) => {
  const { id } = req.params;
  const db = loadDB();
  const cv = db.cvs.find(c => c.id === id);

  if (!cv) {
    return res.status(404).json({ error: 'CV non trouvé' });
  }

  res.json({ cv });
});

app.put('/api/cv/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const db = loadDB();

  const index = db.cvs.findIndex(c => c.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'CV non trouvé' });
  }

  db.cvs[index] = {
    ...db.cvs[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  saveDB(db);
  res.json({ cv: db.cvs[index] });
});

app.delete('/api/cv/:id', (req, res) => {
  const { id } = req.params;
  const db = loadDB();

  db.cvs = db.cvs.filter(c => c.id !== id);
  db.payments = db.payments.filter(p => p.cvId !== id);

  saveDB(db);
  res.json({ success: true });
});

app.post('/api/cv/:id/duplicate', (req, res) => {
  const { id } = req.params;
  const db = loadDB();

  const original = db.cvs.find(c => c.id === id);
  if (!original) {
    return res.status(404).json({ error: 'CV non trouvé' });
  }

  const duplicated = {
    ...JSON.parse(JSON.stringify(original)),
    id: `cv-${Date.now()}`,
    titre: `${original.titre} (Copie)`,
    statutPaiement: 'NON_PAYE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.cvs.push(duplicated);
  saveDB(db);

  res.json({ cv: duplicated });
});

// Payment Routes
app.post('/api/paiement/soumettre', (req, res) => {
  const { utilisateurId, cvId, numeroReception, numeroExpediteur, referenceTransaction } = req.body;
  if (!cvId || !numeroReception || !numeroExpediteur || !referenceTransaction) {
    return res.status(400).json({ error: 'Informations de paiement incomplètes' });
  }

  const db = loadDB();
  const cvIndex = db.cvs.findIndex(c => c.id === cvId);
  if (cvIndex === -1) {
    return res.status(404).json({ error: 'CV non trouvé' });
  }

  const user = db.users.find(u => u.id === utilisateurId) || { nom: 'Utilisateur', email: 'user@exemple.com' };

  // Set CV status to EN_ATTENTE when user submits code so admin can review and validate
  db.cvs[cvIndex].statutPaiement = 'EN_ATTENTE';
  db.cvs[cvIndex].updatedAt = new Date().toISOString();

  // Remove previous pending payments for this CV if any
  db.payments = db.payments.filter(p => p.cvId !== cvId);

  const newPayment = {
    id: `pay-${Date.now()}`,
    utilisateurId: utilisateurId || 'u-demo-1',
    cvId,
    montant: 500,
    numeroReception: numeroReception || '653998494',
    numeroExpediteur,
    referenceTransaction,
    statut: 'EN_ATTENTE',
    createdAt: new Date().toISOString(),
    userEmail: user.email,
    userName: user.nom,
    cvTitle: db.cvs[cvIndex].titre
  };

  db.payments.push(newPayment);
  saveDB(db);

  res.json({ payment: newPayment, cv: db.cvs[cvIndex] });
});

// Admin Routes
app.get('/api/admin/paiements', (req, res) => {
  const db = loadDB();
  res.json({ payments: db.payments });
});

app.post('/api/admin/paiement/:id/valider', (req, res) => {
  const { id } = req.params;
  const db = loadDB();

  const paymentIndex = db.payments.findIndex(p => p.id === id);
  if (paymentIndex === -1) {
    return res.status(404).json({ error: 'Paiement non trouvé' });
  }

  db.payments[paymentIndex].statut = 'VALIDE';
  db.payments[paymentIndex].valideLe = new Date().toISOString();

  const cvId = db.payments[paymentIndex].cvId;
  const cvIndex = db.cvs.findIndex(c => c.id === cvId);
  if (cvIndex !== -1) {
    db.cvs[cvIndex].statutPaiement = 'PAYE';
    db.cvs[cvIndex].updatedAt = new Date().toISOString();
  }

  saveDB(db);
  res.json({ payment: db.payments[paymentIndex] });
});

app.post('/api/admin/paiement/:id/rejeter', (req, res) => {
  const { id } = req.params;
  const { noteAdmin } = req.body;
  const db = loadDB();

  const paymentIndex = db.payments.findIndex(p => p.id === id);
  if (paymentIndex === -1) {
    return res.status(404).json({ error: 'Paiement non trouvé' });
  }

  db.payments[paymentIndex].statut = 'REJETE';
  db.payments[paymentIndex].noteAdmin = noteAdmin || 'Refusé par l\'administrateur';

  const cvId = db.payments[paymentIndex].cvId;
  const cvIndex = db.cvs.findIndex(c => c.id === cvId);
  if (cvIndex !== -1) {
    db.cvs[cvIndex].statutPaiement = 'NON_PAYE';
    db.cvs[cvIndex].updatedAt = new Date().toISOString();
  }

  saveDB(db);
  res.json({ payment: db.payments[paymentIndex] });
});

// -------------------------------------------------------------
// COVER LETTERS (LETTRES DE MOTIVATION) PERSISTENCE CRUD
// -------------------------------------------------------------
app.get('/api/lettres', (req, res) => {
  const { userId } = req.query;
  const db = loadDB();
  let userLetters = db.letters || [];
  if (userId) {
    userLetters = userLetters.filter(l => l.utilisateurId === userId);
  }
  res.json({ letters: userLetters });
});

app.post('/api/lettres', (req, res) => {
  const letterData = req.body;
  const db = loadDB();
  if (!db.letters) db.letters = [];

  const newLetter = {
    id: letterData.id || `lettre-${Date.now()}`,
    utilisateurId: letterData.utilisateurId || 'u-demo-1',
    cvId: letterData.cvId,
    titre: letterData.titre || (letterData.poste ? `Lettre ${letterData.poste} - ${letterData.entreprise || 'Candidature'}` : 'Nouvelle lettre de motivation'),
    destinataire: letterData.destinataire || 'Direction des Ressources Humaines',
    entreprise: letterData.entreprise || 'Entreprise Cible',
    poste: letterData.poste || 'Poste Visé',
    villeDate: letterData.villeDate || `Fait le ${new Date().toLocaleDateString('fr-FR')}`,
    dateCreation: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    langue: letterData.langue || 'fr',
    police: letterData.police || 'Inter',
    taillePolice: letterData.taillePolice || 11,
    couleurAccent: letterData.couleurAccent || '#2563EB',
    expediteur: letterData.expediteur || {
      nomComplet: 'Mon Nom',
      titreProfessionnel: '',
      email: '',
      telephone: '',
      adresse: ''
    },
    objet: letterData.objet || 'Candidature',
    formulePolitesseEntree: letterData.formulePolitesseEntree || 'Madame, Monsieur,',
    paragrapheAccroche: letterData.paragrapheAccroche || '',
    paragrapheValeurAjoutee: letterData.paragrapheValeurAjoutee || '',
    paragrapheAdequationEntreprise: letterData.paragrapheAdequationEntreprise || '',
    paragrapheConclusion: letterData.paragrapheConclusion || '',
    formulePolitesseSortie: letterData.formulePolitesseSortie || 'Veuillez agréer mes salutations distinguées.',
    texteComplet: letterData.texteComplet || '',
    signature: letterData.signature || (letterData.expediteur?.nomComplet || '')
  };

  db.letters.unshift(newLetter);
  saveDB(db);
  res.json({ letter: newLetter });
});

app.get('/api/lettres/:id', (req, res) => {
  const { id } = req.params;
  const db = loadDB();
  const letter = (db.letters || []).find(l => l.id === id);
  if (!letter) {
    return res.status(404).json({ error: 'Lettre de motivation non trouvée' });
  }
  res.json({ letter });
});

app.put('/api/lettres/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const db = loadDB();
  if (!db.letters) db.letters = [];

  const index = db.letters.findIndex(l => l.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Lettre non trouvée' });
  }

  db.letters[index] = {
    ...db.letters[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  saveDB(db);
  res.json({ letter: db.letters[index] });
});

app.delete('/api/lettres/:id', (req, res) => {
  const { id } = req.params;
  const db = loadDB();
  if (!db.letters) db.letters = [];

  db.letters = db.letters.filter(l => l.id !== id);
  saveDB(db);
  res.json({ success: true });
});

app.post('/api/lettres/:id/duplicate', (req, res) => {
  const { id } = req.params;
  const db = loadDB();
  if (!db.letters) db.letters = [];

  const original = db.letters.find(l => l.id === id);
  if (!original) {
    return res.status(404).json({ error: 'Lettre non trouvée' });
  }

  const duplicated = {
    ...JSON.parse(JSON.stringify(original)),
    id: `lettre-${Date.now()}`,
    titre: `${original.titre} (Copie)`,
    dateCreation: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.letters.unshift(duplicated);
  saveDB(db);
  res.json({ letter: duplicated });
});

// -------------------------------------------------------------
// AI SPELLCHECK & GRAMMAR CORRECTION ENDPOINTS (GEMINI API)
// -------------------------------------------------------------

import { GoogleGenAI } from '@google/genai';

let geminiAi: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!geminiAi) {
    geminiAi = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return geminiAi;
}

// Simple in-memory cache for spellcheck to minimize Gemini API calls
const spellcheckCache = new Map<string, any>();
const MAX_CACHE_SIZE = 300;

function getCachedCorrection(key: string) {
  return spellcheckCache.get(key);
}

function setCachedCorrection(key: string, val: any) {
  if (spellcheckCache.size >= MAX_CACHE_SIZE) {
    const firstKey = spellcheckCache.keys().next().value;
    if (firstKey) spellcheckCache.delete(firstKey);
  }
  spellcheckCache.set(key, val);
}

function safeJsonParse<T>(text: string | null | undefined, fallback: T): T {
  if (!text || typeof text !== 'string') return fallback;
  try {
    const cleaned = text
      .trim()
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();
    return JSON.parse(cleaned);
  } catch {
    try {
      const match = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      if (match) {
        return JSON.parse(match[0]);
      }
    } catch (e) {
      console.warn('safeJsonParse fallback used:', e);
    }
    return fallback;
  }
}

async function generateGeminiContentWithFallback(ai: GoogleGenAI, contents: any, responseMimeType: string = 'application/json'): Promise<string | null> {
  const modelsToTry = [
    'gemini-2.5-flash',
    'gemini-3.7-flash',
    'gemini-2.5-flash-lite',
    'gemini-3.1-flash-lite',
    'gemini-2.5-pro'
  ];
  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          responseMimeType
        }
      });
      if (response?.text) {
        return response.text;
      }
    } catch (err: any) {
      lastError = err;
      console.warn(`[Gemini] Model ${model} encountered an issue (${err?.message || err?.status || 'error'}), attempting next fallback model...`);
      // Proceed seamlessly to the next available model
    }
  }

  console.warn('[Gemini] All AI models temporarily unavailable or rate-limited. Returning fallback result.', lastError?.message || lastError);
  return null;
}

app.post('/api/ai/reformuler-experience', async (req, res) => {
  const { texteOriginal, langue = 'fr', action = 'ameliorer' } = req.body;

  if (!texteOriginal || typeof texteOriginal !== 'string' || texteOriginal.trim().length === 0) {
    return res.status(400).json({ error: 'Texte original requis' });
  }

  const ai = getGemini();
  if (!ai) {
    let fallback = texteOriginal;
    if (action === 'professionnel') {
      fallback = `Gestion et optimisation de : ${texteOriginal.replace(/J'ai fait|Je me suis occupé de/gi, 'Supervision et déploiement de')}`;
    } else {
      fallback = `Mise en œuvre et optimisation : ${texteOriginal}`;
    }
    return res.json({ texteReformule: fallback });
  }

  try {
    const prompt = `Tu es un consultant expert en recrutement et révision de CV en langue ${langue === 'en' ? 'Anglaise' : 'Française'}.
Améliore et réécris le texte suivant de manière très professionnelle, dynamique et adaptée aux normes des recruteurs:
"${texteOriginal.replace(/"/g, '\\"')}"

Retourne EXCLUSIVEMENT un objet JSON valide au format:
{
  "texteReformule": "texte optimisé"
}`;

    const responseText = await generateGeminiContentWithFallback(ai, prompt);
    if (!responseText) {
      let fallback = texteOriginal;
      if (action === 'professionnel') {
        fallback = `Pilotage et déploiement stratégique : ${texteOriginal.replace(/J'ai fait|Je me suis occupé de/gi, 'Supervision intégrale de')}`;
      } else {
        fallback = `Optimisation de l'impact opérationnel : ${texteOriginal}`;
      }
      return res.json({ texteReformule: fallback });
    }

    try {
      const parsed = JSON.parse(responseText);
      const texteReformule = parsed.texteReformule || responseText;
      return res.json({ texteReformule });
    } catch {
      return res.json({ texteReformule: responseText });
    }
  } catch (err: any) {
    console.warn('Gemini AI reformulate route error:', err?.message || err);
    return res.json({
      texteReformule: `Optimisation de la performance : ${texteOriginal}`
    });
  }
});

app.post('/api/correction', async (req, res) => {
  const { texte, langue = 'fr' } = req.body;

  if (!texte || typeof texte !== 'string' || texte.trim().length === 0) {
    return res.json({ erreurs: [] });
  }

  const cacheKey = `${langue}:${texte.trim()}`;
  const cached = getCachedCorrection(cacheKey);
  if (cached) {
    return res.json({ erreurs: cached });
  }

  const ai = getGemini();

  if (!ai) {
    return res.json({
      erreurs: [],
      warning: 'API Key Gemini non configurée sur le serveur.'
    });
  }

  try {
    const prompt = `Tu es un expert en révision de CV professionnel en langue ${langue === 'en' ? 'Anglaise' : 'Française'}.
Analyse le texte suivant et identifie TOUTES les fautes d'orthographe, de grammaire, de conjugaison, d'accord et de ponctuation.
Retourne EXCLUSIVEMENT un objet JSON valide au format exact suivant:
{
  "erreurs": [
    {
      "motOriginal": "mot ou expression fautive",
      "correction": "mot ou expression corrigée",
      "explication": "brève explication claire",
      "type": "orthographe"
    }
  ]
}

Si le texte n'a aucune faute, retourne {"erreurs": []}.
Ne rajoute aucun texte avant ou après le JSON.

Texte à analyser:
"${texte.replace(/"/g, '\\"')}"`;

    const responseText = await generateGeminiContentWithFallback(ai, prompt);
    if (!responseText) {
      return res.json({ erreurs: [] });
    }

    const parsed = JSON.parse(responseText || '{}');
    const erreurs = Array.isArray(parsed.erreurs) ? parsed.erreurs : [];

    setCachedCorrection(cacheKey, erreurs);

    res.json({ erreurs });
  } catch (err: any) {
    const isQuota = err?.status === 'RESOURCE_EXHAUSTED' ||
                    err?.status === 429 ||
                    err?.message?.includes('429') ||
                    err?.message?.includes('Quota exceeded');

    if (isQuota) {
      console.warn('Gemini spellcheck API quota/rate limit reached. Returning fallback response.');
      return res.json({
        erreurs: [],
        warning: 'Quota d\'analyse orthographique temporairement atteint.'
      });
    }

    console.error('Gemini spellcheck error:', err?.message || err);
    res.json({
      erreurs: [],
      warning: 'Erreur lors de la vérification orthographique par IA.'
    });
  }
});

app.post('/api/correction/cv', async (req, res) => {
  const { cv } = req.body;
  if (!cv || !cv.sections) {
    return res.status(400).json({ error: 'CV invalide' });
  }

  const ai = getGemini();
  if (!ai) {
    return res.json({
      correctionsGlobales: [],
      warning: 'API Key Gemini non configurée.'
    });
  }

  try {
    const prompt = `Tu es un consultant en recrutement et expert en rédaction de CV.
Examine la structure et les textes de ce CV au format JSON et suggère des corrections orthographiques, grammaticales et d'amélioration d'impact professionnel.

Retourne un JSON avec cette structure:
{
  "correctionsGlobales": [
    {
      "sectionId": "id de la section",
      "champ": "nom du champ",
      "texteOriginal": "texte original",
      "texteCorrige": "texte corrigé",
      "explication": "explication"
    }
  ]
}

CV: ${JSON.stringify(cv).slice(0, 8000)}`;

    const responseText = await generateGeminiContentWithFallback(ai, prompt);
    if (!responseText) {
      return res.json({ correctionsGlobales: [] });
    }

    const parsed = JSON.parse(responseText || '{}');
    res.json(parsed);
  } catch (err: any) {
    const isQuota = err?.status === 'RESOURCE_EXHAUSTED' ||
                    err?.status === 429 ||
                    err?.message?.includes('429') ||
                    err?.message?.includes('Quota exceeded');

    if (isQuota) {
      console.warn('Gemini CV correction API quota/rate limit reached.');
      return res.json({
        correctionsGlobales: [],
        warning: 'Quota d\'analyse IA temporairement atteint.'
      });
    }

    console.error('Error correcting entire CV with Gemini:', err?.message || err);
    res.json({ correctionsGlobales: [], error: err?.message || 'Erreur inconnue' });
  }
});

// -------------------------------------------------------------
// 1. GENERATE COVER LETTER (LETTRE DE MOTIVATION) FROM CV
// -------------------------------------------------------------
app.post('/api/ai/lettre-motivation', async (req, res) => {
  const { cv, langue = 'fr', entreprise = '', poste = '', ton = 'professionnel' } = req.body;
  if (!cv) {
    return res.status(400).json({ error: 'CV requis' });
  }

  const ai = getGemini();
  const profilSection = cv.sections?.find((s: any) => s.type === 'profil');
  const nomCandidat = profilSection?.contenu?.nomComplet || 'Le Candidat';
  const titrePro = profilSection?.contenu?.titreProfessionnel || poste || 'Professionnel';

  if (!ai) {
    // Elegant fallback if AI is offline
    const fallbackText = `Madame, Monsieur,\n\nActuellement ${titrePro}, je vous adresse ma candidature pour rejoindre votre équipe ${entreprise ? `au sein de ${entreprise}` : ''}.\n\nFort d'un parcours riche et diversifié, j'ai développé de solides compétences et une capacité reconnue à mener à bien des missions ambitieuses. Mon expérience m'a permis d'acquérir une rigueur et une polyvalence qui correspondent parfaitement aux exigences de vos projets.\n\nIntégrer votre structure représente pour moi une réelle opportunité de mettre mon enthousiasme et mes compétences au service de vos objectifs.\n\nDans l'attente d'un échange, je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.\n\n${nomCandidat}`;
    return res.json({
      destinataire: 'Responsable du Recrutement',
      entreprise: entreprise || 'Votre Entreprise',
      poste: poste || titrePro,
      objet: `Candidature au poste de ${poste || titrePro}`,
      formulePolitesseEntree: 'Madame, Monsieur,',
      paragrapheAccroche: `Actuellement ${titrePro}, je souhaite vous soumettre ma candidature.`,
      paragrapheValeurAjoutee: `Au cours de mes différentes expériences, j'ai su développer des compétences concrètes et adaptables.`,
      paragrapheAdequationEntreprise: `Votre organisation offre un environnement stimulant où je pourrai apporter une réelle valeur ajoutée.`,
      paragrapheConclusion: `Je serais ravi de vous rencontrer lors d'un entretien pour vous exposer plus en détail mes motivations.`,
      formulePolitesseSortie: `Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.`,
      texteComplet: fallbackText
    });
  }

  try {
    const prompt = `Tu es un expert mondial en recrutement et en rédaction de lettres de motivation percutantes en langue ${langue === 'en' ? 'Anglaise' : langue === 'ar' ? 'Arabe' : 'Française'}.
Rédige une lettre de motivation exceptionnelle, moderne, persuasive et personnalisée en te basant EXCLUSIVEMENT sur les véritables expériences et compétences présentes dans le CV ci-dessous.
IMPORTANT: Ne JAMAIS inventer d'expériences, de diplômes ou de compétences qui ne figurent pas dans le CV.
Ton de rédaction souhaité: ${ton}.
Entreprise ciblée (si mentionnée): ${entreprise || 'Non spécifiée / Entreprise cible'}
Poste ciblé (si mentionné): ${poste || titrePro}

Données du CV:
${JSON.stringify(cv).slice(0, 7000)}

Retourne EXCLUSIVEMENT un objet JSON valide avec cette structure exacte:
{
  "destinataire": "Responsable du Recrutement",
  "entreprise": "${entreprise || 'Entreprise'}",
  "poste": "${poste || titrePro}",
  "objet": "Objet clair et professionnel",
  "formulePolitesseEntree": "Formule d'ouverture appropriée",
  "paragrapheAccroche": "Paragraphe 1 : introduction percutante et motivation",
  "paragrapheValeurAjoutee": "Paragraphe 2 : réalisations concrètes et compétences clés tirées du CV",
  "paragrapheAdequationEntreprise": "Paragraphe 3 : adéquation entre le profil et les besoins de l'entreprise",
  "paragrapheConclusion": "Paragraphe 4 : appel à l'action pour un entretien",
  "formulePolitesseSortie": "Formule de politesse finale distinguée",
  "texteComplet": "Texte intégral mis en page et prêt à l'emploi"
}`;

    const responseText = await generateGeminiContentWithFallback(ai, prompt);
    const parsed = safeJsonParse<any>(responseText, {});
    if (!parsed.texteComplet && (parsed.paragrapheAccroche || parsed.objet)) {
      parsed.texteComplet = `${parsed.formulePolitesseEntree || 'Madame, Monsieur,'}\n\n${parsed.paragrapheAccroche || ''}\n\n${parsed.paragrapheValeurAjoutee || ''}\n\n${parsed.paragrapheAdequationEntreprise || ''}\n\n${parsed.paragrapheConclusion || ''}\n\n${parsed.formulePolitesseSortie || 'Cordialement,'}\n\n${nomCandidat}`;
    }
    if (!parsed.texteComplet) {
      parsed.texteComplet = `Madame, Monsieur,\n\nActuellement ${titrePro}, je vous adresse ma candidature pour rejoindre votre équipe ${entreprise ? `au sein de ${entreprise}` : ''}.\n\nFort d'un parcours riche et rigoureux, j'ai développé des compétences concrètes et une solide polyvalence.\n\nDans l'attente d'un échange lors d'un entretien, je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.\n\n${nomCandidat}`;
      parsed.objet = parsed.objet || `Candidature au poste de ${poste || titrePro}`;
    }
    return res.json(parsed);
  } catch (err: any) {
    console.error('Error generating cover letter:', err?.message || err);
    return res.json({
      objet: `Candidature au poste de ${poste || titrePro}`,
      texteComplet: `Madame, Monsieur,\n\nJe vous propose ma candidature pour le poste de ${poste || titrePro}.\n\nCordialement,\n${nomCandidat}`
    });
  }
});

// -------------------------------------------------------------
// 2. GENERATE OPTIMIZED LINKEDIN PROFILE FROM CV
// -------------------------------------------------------------
const handleLinkedInGeneration = async (req: express.Request, res: express.Response) => {
  const { cv, langue = 'fr' } = req.body;
  if (!cv) {
    return res.status(400).json({ error: 'CV requis' });
  }

  const ai = getGemini();
  const profilSection = cv.sections?.find((s: any) => s.type === 'profil');
  const nomCandidat = profilSection?.contenu?.nomComplet || '';
  const titrePro = profilSection?.contenu?.titreProfessionnel || 'Professionnel';

  const defaultLinkedIn = {
    titreProfessionnel: `${titrePro} | Expert Orienté Résultats & Impact`,
    titreProfil: `${titrePro} | Expert Orienté Résultats & Impact`,
    resumeAPropos: `Passionné par l'excellence opérationnelle et l'innovation, j'accompagne les projets avec rigueur et détermination.\n\n💡 Compétences clés : Leadership, Stratégie, Gestion de projet\n📬 Contact : ${profilSection?.contenu?.email || 'contact@linkedin.com'}`,
    resumeBio: `Passionné par l'excellence opérationnelle et l'innovation, j'accompagne les projets avec rigueur et détermination.\n\n💡 Compétences clés : Leadership, Stratégie, Gestion de projet\n📬 Contact : ${profilSection?.contenu?.email || 'contact@linkedin.com'}`,
    motsClesStrategiques: ['Leadership', 'Gestion de projet', 'Innovation', 'Stratégie', 'Performance'],
    motsClesRecommandes: ['Leadership', 'Gestion de projet', 'Innovation', 'Stratégie', 'Performance'],
    experiencesOptimisees: [],
    experiencesLinkedIn: [],
    conseilsVisibilite: [
      'Ajoutez une photo de profil souriante sur fond neutre',
      'Personnalisez votre bannière LinkedIn en lien avec votre secteur',
      'Sollicitez 3 recommandations de collègues ou managers'
    ]
  };

  if (!ai) {
    return res.json(defaultLinkedIn);
  }

  try {
    const prompt = `Tu es le meilleur expert en Personal Branding et optimisation de profils LinkedIn.
Analyse en profondeur le CV ci-dessous et crée un profil LinkedIn captivant, professionnel et ultra-optimisé pour les algorithmes et les recruteurs en langue ${langue === 'en' ? 'Anglaise' : langue === 'ar' ? 'Arabe' : 'Française'}.

IMPORTANT:
- Reste strictement fidèle aux expériences et compétences réelles du CV. N'invente rien.
- Crée une Headline (titre) à fort impact (moins de 220 caractères).
- Rédige une section "À propos" (About) dynamique avec structure en paragraphes, emojis professionnels et appel à l'action.
- Formule des bullet points d'impact orientés résultats (verbes d'action + métriques si possibles) pour les expériences clés.
- Liste 5 à 8 mots-clés stratégiques pour le référencement LinkedIn.
- Donne 3 conseils pratiques de visibilité.

CV:
${JSON.stringify(cv).slice(0, 7000)}

Retourne EXCLUSIVEMENT un JSON valide au format:
{
  "titreProfessionnel": "Titre d'accroche LinkedIn (Headline)",
  "resumeAPropos": "Texte complet de la section À propos",
  "motsClesStrategiques": ["mot1", "mot2", "mot3"],
  "experiencesOptimisees": [
    {
      "poste": "Intitulé",
      "entreprise": "Entreprise",
      "pointsCles": ["point 1 avec impact", "point 2 orienté résultat"]
    }
  ],
  "conseilsVisibilite": ["conseil 1", "conseil 2", "conseil 3"]
}`;

    const responseText = await generateGeminiContentWithFallback(ai, prompt);
    const parsed = safeJsonParse(responseText, defaultLinkedIn);
    
    // Normalize aliases for both formats
    const finalResult = {
      ...defaultLinkedIn,
      ...parsed,
      titreProfil: parsed.titreProfil || parsed.titreProfessionnel || defaultLinkedIn.titreProfil,
      titreProfessionnel: parsed.titreProfessionnel || parsed.titreProfil || defaultLinkedIn.titreProfessionnel,
      resumeBio: parsed.resumeBio || parsed.resumeAPropos || defaultLinkedIn.resumeBio,
      resumeAPropos: parsed.resumeAPropos || parsed.resumeBio || defaultLinkedIn.resumeAPropos,
      motsClesRecommandes: parsed.motsClesRecommandes || parsed.motsClesStrategiques || defaultLinkedIn.motsClesRecommandes,
      motsClesStrategiques: parsed.motsClesStrategiques || parsed.motsClesRecommandes || defaultLinkedIn.motsClesStrategiques,
      experiencesLinkedIn: parsed.experiencesLinkedIn || (parsed.experiencesOptimisees || []).map((e: any) => ({
        titrePoste: e.poste || e.titrePoste || 'Poste',
        pointsCles: e.pointsCles || []
      })),
      experiencesOptimisees: parsed.experiencesOptimisees || (parsed.experiencesLinkedIn || []).map((e: any) => ({
        poste: e.titrePoste || e.poste || 'Poste',
        entreprise: e.entreprise || 'Entreprise',
        pointsCles: e.pointsCles || []
      }))
    };

    return res.json(finalResult);
  } catch (err: any) {
    console.error('Error generating LinkedIn profile:', err?.message || err);
    return res.json(defaultLinkedIn);
  }
};

app.post('/api/ai/linkedin-profile', handleLinkedInGeneration);
app.post('/api/ai/linkedin', handleLinkedInGeneration);

// -------------------------------------------------------------
// 3. ANALYZE JOB OFFER (FROM IMAGE OR TEXT) & GENERATE DYNAMIC QUESTIONS
// -------------------------------------------------------------
const handleJobOfferAnalysis = async (req: express.Request, res: express.Response) => {
  const {
    texteOffre,
    offreTexte,
    imageBase64,
    offreImage,
    cv,
    langue = 'fr'
  } = req.body;

  const rawText = (texteOffre || offreTexte || '').trim();
  const rawImage = imageBase64 || offreImage || '';

  if (!rawText && !rawImage) {
    return res.status(400).json({ error: 'Texte ou image de l\'offre requis' });
  }

  const defaultAnalysis = {
    titrePoste: rawText ? (rawText.split('\n')[0]?.slice(0, 60) || 'Poste Détecté') : 'Poste Détecté',
    entreprise: 'Entreprise Cible',
    lieu: 'Non spécifié',
    competencesClesRequises: ['Rigueur professionnelle', 'Gestion de projet', 'Travail en équipe', 'Adaptabilité'],
    competencesRequises: ['Rigueur professionnelle', 'Gestion de projet', 'Travail en équipe', 'Adaptabilité'],
    competencesCles: ['Rigueur professionnelle', 'Gestion de projet', 'Travail en équipe', 'Adaptabilité'],
    pointsFortsDetectes: ['Adéquation solide avec les compétences du profil', 'Expériences pertinentes valorisables'],
    questionsPrecision: [
      {
        id: 'q1',
        question: 'Quels sont vos atouts majeurs ou projets récents en lien direct avec cette opportunité ?',
        description: 'Précisez un résultat concret ou un outil maîtrisé.',
        contexte: 'Compétences & Réalisations'
      },
      {
        id: 'q2',
        question: 'Avez-vous une expérience spécifique avec l\'environnement de travail ou le secteur ciblé ?',
        description: 'Donnez un exemple factuel de situation similaire vécue.',
        contexte: 'Expérience sectorielle'
      }
    ],
    questionsPersonnalisees: [
      {
        id: 'q1',
        question: 'Quels sont vos atouts majeurs ou projets récents en lien direct avec cette opportunité ?',
        description: 'Précisez un résultat concret ou un outil maîtrisé.',
        contexte: 'Compétences & Réalisations'
      },
      {
        id: 'q2',
        question: 'Avez-vous une expérience spécifique avec l\'environnement de travail ou le secteur ciblé ?',
        description: 'Donnez un exemple factuel de situation similaire vécue.',
        contexte: 'Expérience sectorielle'
      }
    ]
  };

  const ai = getGemini();
  if (!ai) {
    return res.json(defaultAnalysis);
  }

  try {
    let contents: any;
    const instructionPrompt = `Tu es un expert senior en recrutement et en analyse d'offres d'emploi en langue ${langue === 'en' ? 'Anglaise' : langue === 'ar' ? 'Arabe' : 'Française'}.
Ta mission :
1. Analyser précisément l'offre d'emploi fournie (qui peut être une image d'annonce ou un texte d'offre).
2. Extraire le titre du poste, le nom de l'entreprise (si présent), le lieu, ainsi que les compétences clés et critères décisifs demandés par l'employeur.
3. Comparer avec le CV du candidat fourni ci-dessous.
4. GÉNÉRER 2 à 3 QUESTIONS TRÈS SPÉCIFIQUES ET DYNAMIQUES ADAPTÉES STRICTEMENT À CETTE OFFRE pour permettre au candidat d'apporter des précisions réelles SANS INVENTER DE FAUSSES INFORMATIONS.
IMPORTANTISSIME : Les questions DOIVENT CHANGER SELON L'OFFRE. Interroge précisément le candidat sur sa réalité par rapport aux prérequis réels de cette offre.

CV du candidat actuel:
${JSON.stringify(cv || {}).slice(0, 4000)}

Retourne EXCLUSIVEMENT un JSON valide au format:
{
  "titrePoste": "Titre extrait du poste",
  "entreprise": "Nom de l'entreprise (ou 'Entreprise')",
  "lieu": "Lieu (ou 'Non précisé')",
  "competencesClesRequises": ["compétence 1", "compétence 2", "compétence 3"],
  "pointsFortsDetectes": ["point fort 1 de correspondance", "point fort 2"],
  "questionsPrecision": [
    {
      "id": "q1",
      "question": "Question sur-mesure ultra précise liée à l'offre",
      "description": "Explication brève du pourquoi de la question",
      "contexte": "Thématique (ex: Maîtrise Outil X, Gestion de budget, Anglais)"
    }
  ]
}`;

    if (rawImage) {
      const base64Data = rawImage.replace(/^data:image\/[a-z]+;base64,/, '');
      const mimeTypeMatch = rawImage.match(/^data:(image\/[a-z]+);base64,/);
      const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : 'image/jpeg';

      contents = [
        {
          role: 'user',
          parts: [
            { text: instructionPrompt },
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType
              }
            }
          ]
        }
      ];
    } else {
      contents = `${instructionPrompt}\n\nTexte de l'offre d'emploi fournie:\n"""\n${rawText}\n"""`;
    }

    const responseText = await generateGeminiContentWithFallback(ai, contents);
    const parsed = safeJsonParse(responseText, defaultAnalysis);

    const questions = parsed.questionsPrecision || parsed.questionsPersonnalisees || defaultAnalysis.questionsPrecision;
    const skills = parsed.competencesClesRequises || parsed.competencesRequises || parsed.competencesCles || defaultAnalysis.competencesClesRequises;

    const normalizedResponse = {
      ...defaultAnalysis,
      ...parsed,
      titrePoste: parsed.titrePoste || defaultAnalysis.titrePoste,
      entreprise: parsed.entreprise || defaultAnalysis.entreprise,
      lieu: parsed.lieu || defaultAnalysis.lieu,
      competencesClesRequises: skills,
      competencesRequises: skills,
      competencesCles: skills,
      questionsPrecision: questions,
      questionsPersonnalisees: questions,
      pointsFortsDetectes: parsed.pointsFortsDetectes || defaultAnalysis.pointsFortsDetectes
    };

    return res.json(normalizedResponse);
  } catch (err: any) {
    console.error('Error analysing job offer:', err?.message || err);
    return res.json(defaultAnalysis);
  }
};

app.post('/api/ai/analyse-offre', handleJobOfferAnalysis);
app.post('/api/ai/cibler-offre', handleJobOfferAnalysis);

// -------------------------------------------------------------
// 4. ADAPT CV & GENERATE TARGETED COVER LETTER BASED ON USER ANSWERS
// -------------------------------------------------------------
const handleAdaptCandidateCV = async (req: express.Request, res: express.Response) => {
  const {
    cv,
    offreAnalyse,
    offre,
    reponsesQuestions = {},
    reponsesCandidat = {},
    langue = 'fr'
  } = req.body;

  const targetOffer = offreAnalyse || offre;
  const targetAnswers = { ...reponsesQuestions, ...reponsesCandidat };

  if (!cv || !targetOffer) {
    return res.status(400).json({ error: 'CV et analyse d\'offre requis' });
  }

  const profilSection = cv.sections?.find((s: any) => s.type === 'profil');
  const nomCandidat = profilSection?.contenu?.nomComplet || 'Le Candidat';
  const titreVisé = targetOffer.titrePoste || profilSection?.contenu?.titreProfessionnel || 'Poste Cible';
  const entrepriseCible = targetOffer.entreprise || 'Votre Entreprise';

  const defaultAdaptation = {
    cvModifie: cv,
    cvPersonnalise: cv,
    lettreMotivation: {
      destinataire: 'Responsable du Recrutement',
      entreprise: entrepriseCible,
      poste: titreVisé,
      objet: `Candidature pour le poste de ${titreVisé}`,
      formulePolitesseEntree: 'Madame, Monsieur,',
      paragrapheAccroche: `Actuellement ${profilSection?.contenu?.titreProfessionnel || 'en poste'}, je vous adresse ma candidature motivée pour le poste de ${titreVisé} au sein de ${entrepriseCible}.`,
      paragrapheValeurAjoutee: `Mon parcours m'a permis de développer une expertise solide et une rigueur qui me permettront d'être immédiatement opérationnel et de contribuer activement à vos objectifs.`,
      paragrapheAdequationEntreprise: `Rejoindre ${entrepriseCible} est pour moi l'opportunité d'apporter mon dynamisme et mon savoir-faire à vos projets d'envergure.`,
      paragrapheConclusion: `Je serais ravi de vous exposer mes motivations plus en détail lors d'un prochain entretien.`,
      formulePolitesseSortie: `Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.`,
      texteComplet: `Madame, Monsieur,\n\nActuellement ${profilSection?.contenu?.titreProfessionnel || 'en poste'}, je vous adresse ma candidature motivée pour le poste de ${titreVisé} au sein de ${entrepriseCible}.\n\nMon parcours m'a permis de développer une expertise solide et une rigueur qui me permettront d'être immédiatement opérationnel et de contribuer activement à vos objectifs.\n\nRejoindre ${entrepriseCible} est pour moi l'opportunité d'apporter mon dynamisme et mon savoir-faire à vos projets d'envergure.\n\nJe serais ravi de vous exposer mes motivations plus en détail lors d'un prochain entretien.\n\nJe vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.\n\n${nomCandidat}`
    },
    modificationsApportees: [
      'Mise en valeur ciblée des expériences pertinentes sans ajout fictif.',
      'Alignement du titre professionnel et du résumé sur le poste visé.',
      'Génération d\'une lettre de motivation dédiée et percutante.'
    ],
    tauxCorrespondanceEstime: 94
  };

  const ai = getGemini();
  if (!ai) {
    return res.json(defaultAdaptation);
  }

  try {
    const prompt = `Tu es un conseiller en recrutement d'élite spécialisé dans l'adaptation stratégique de candidatures.
Voici le CV initial du candidat, l'analyse de l'offre d'emploi ciblée, et les réponses réelles fournies par le candidat aux questions d'alignement.

RÈGLE D'OR ABSOLUE :
- Tu ne dois JAMAIS inventer d'expérience professionnelle, de diplôme, de durée d'expérience ou de compétence fictive.
- Tu dois réorganiser, valoriser, reformuler le résumé professionnel et mettre en lumière les expériences réelles existantes du candidat qui résonnent le plus avec l'offre.
- Intègre les réponses données par le candidat pour enrichir avec exactitude les descriptions de ses expériences réelles existantes.
- Adapte le titre professionnel du CV pour qu'il soit parfaitement en phase avec le poste visé (${titreVisé}), si cela reste cohérent avec le profil.
- Rédige simultanément une lettre de motivation sur-mesure pour cette offre spécifique.

Offre d'emploi ciblée:
${JSON.stringify(targetOffer)}

Réponses du candidat aux questions personnalisées:
${JSON.stringify(targetAnswers)}

CV Initial du candidat:
${JSON.stringify(cv)}

Retourne EXCLUSIVEMENT un JSON valide au format:
{
  "cvPersonnalise": { ...même structure exacte que le CV d'origine avec textes optimisés et réordonnés... },
  "lettreMotivation": {
    "destinataire": "Responsable du Recrutement",
    "entreprise": "${entrepriseCible}",
    "poste": "${titreVisé}",
    "objet": "Objet percutant",
    "formulePolitesseEntree": "Formule d'entrée",
    "paragrapheAccroche": "Accroche sur-mesure",
    "paragrapheValeurAjoutee": "Valeur ajoutée alignée sur l'offre",
    "paragrapheAdequationEntreprise": "Pourquoi cette entreprise et ce poste",
    "paragrapheConclusion": "Conclusion",
    "formulePolitesseSortie": "Formule de politesse",
    "texteComplet": "Texte complet prêt à l'emploi"
  },
  "modificationsApportees": [
    "Explication claire 1 des adaptations stratégiques effectuées",
    "Explication claire 2",
    "Explication claire 3"
  ],
  "tauxCorrespondanceEstime": 94
}`;

    const responseText = await generateGeminiContentWithFallback(ai, prompt);
    const parsed = safeJsonParse(responseText, defaultAdaptation);

    const tailoredCv = parsed.cvPersonnalise || parsed.cvModifie || cv;
    const finalResult = {
      ...defaultAdaptation,
      ...parsed,
      cvPersonnalise: tailoredCv,
      cvModifie: tailoredCv,
      modificationsApportees: parsed.modificationsApportees || defaultAdaptation.modificationsApportees,
      tauxCorrespondanceEstime: parsed.tauxCorrespondanceEstime || 94
    };

    return res.json(finalResult);
  } catch (err: any) {
    console.error('Error adapting application:', err?.message || err);
    return res.json(defaultAdaptation);
  }
};

app.post('/api/ai/adapter-candidature', handleAdaptCandidateCV);
app.post('/api/ai/personnaliser-cv', handleAdaptCandidateCV);

// -------------------------------------------------------------
// VITE INTEGRATION & SERVER STARTUP
// -------------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        watch: {
          ignored: ['**/data/**', '**/data/db.json', '**/dist/**', '**/.git/**']
        }
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CV Builder server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
