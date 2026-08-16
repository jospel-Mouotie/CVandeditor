import React, { useState, useEffect, useRef } from 'react';
import { CV, Language, SavedLetter, LettreMotivationResult } from '../types';
import { 
  FileText, 
  Sparkles, 
  ArrowLeft, 
  Save, 
  Printer, 
  Copy, 
  CheckCircle2, 
  RefreshCw, 
  Building, 
  Briefcase, 
  User as UserIcon, 
  Type, 
  Sliders, 
  Palette,
  Check,
  Download,
  Eye,
  Edit2
} from 'lucide-react';

interface LetterGeneratorViewProps {
  cvs: CV[];
  activeCV: CV | null;
  langue: Language;
  initialLetter?: SavedLetter | null;
  onSaveLetter: (letter: SavedLetter) => Promise<void>;
  onBackToLetters: () => void;
}

export const LetterGeneratorView: React.FC<LetterGeneratorViewProps> = ({
  cvs,
  activeCV,
  langue,
  initialLetter,
  onSaveLetter,
  onBackToLetters
}) => {
  // Source CV selection
  const [selectedCVId, setSelectedCVId] = useState<string>(
    initialLetter?.cvId || activeCV?.id || (cvs.length > 0 ? cvs[0].id : '')
  );

  const selectedCV = cvs.find(c => c.id === selectedCVId) || activeCV || cvs[0] || null;

  // Extract profil sender details from CV
  const profilSection = selectedCV?.sections?.find(s => s.type === 'profil');
  const profilContent = profilSection?.contenu || {};

  // Form parameters
  const [entreprise, setEntreprise] = useState(initialLetter?.entreprise || '');
  const [poste, setPoste] = useState(initialLetter?.poste || profilContent.titreProfessionnel || '');
  const [destinataire, setDestinataire] = useState(initialLetter?.destinataire || 'Direction des Ressources Humaines');
  const [ton, setTon] = useState('professionnel');
  const [pointsCles, setPointsCles] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Letter editable fields
  const [letterId, setLetterId] = useState<string>(initialLetter?.id || `lettre-${Date.now()}`);
  const [titreLettre, setTitreLettre] = useState<string>(
    initialLetter?.titre || `Lettre de motivation - ${entreprise || 'Candidature'}`
  );
  const [villeDate, setVilleDate] = useState<string>(
    initialLetter?.villeDate || `Fait le ${new Date().toLocaleDateString('fr-FR')}`
  );
  const [police, setPolice] = useState<string>(initialLetter?.police || 'Inter');
  const [taillePolice, setTaillePolice] = useState<number>(initialLetter?.taillePolice || 11);
  const [couleurAccent, setCouleurAccent] = useState<string>(initialLetter?.couleurAccent || '#2563EB');

  // Sender details
  const [expediteurNom, setExpediteurNom] = useState(initialLetter?.expediteur?.nomComplet || profilContent.nomComplet || 'Mon Nom');
  const [expediteurTitre, setExpediteurTitre] = useState(initialLetter?.expediteur?.titreProfessionnel || profilContent.titreProfessionnel || '');
  const [expediteurEmail, setExpediteurEmail] = useState(initialLetter?.expediteur?.email || profilContent.email || '');
  const [expediteurTel, setExpediteurTel] = useState(initialLetter?.expediteur?.telephone || profilContent.telephone || '');
  const [expediteurAdresse, setExpediteurAdresse] = useState(initialLetter?.expediteur?.adresse || profilContent.adresse || '');

  // Body content
  const [objet, setObjet] = useState(initialLetter?.objet || `Candidature au poste de ${poste || 'Professionnel'}`);
  const [formuleEntree, setFormuleEntree] = useState(initialLetter?.formulePolitesseEntree || 'Madame, Monsieur,');
  const [accroche, setAccroche] = useState(initialLetter?.paragrapheAccroche || '');
  const [valeurAjoutee, setValeurAjoutee] = useState(initialLetter?.paragrapheValeurAjoutee || '');
  const [adequation, setAdequation] = useState(initialLetter?.paragrapheAdequationEntreprise || '');
  const [conclusion, setConclusion] = useState(initialLetter?.paragrapheConclusion || '');
  const [formuleSortie, setFormuleSortie] = useState(initialLetter?.formulePolitesseSortie || 'Je vous prie d\'agréer, Madame, Monsieur, l\'expression de mes salutations distinguées.');
  const [signature, setSignature] = useState(initialLetter?.signature || expediteurNom);

  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [isSaved, setIsSaved] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Sync sender info when CV selection changes if not loaded from an existing letter
  useEffect(() => {
    if (!initialLetter && selectedCV) {
      const p = selectedCV.sections?.find(s => s.type === 'profil')?.contenu || {};
      if (p.nomComplet) setExpediteurNom(p.nomComplet);
      if (p.titreProfessionnel) {
        setExpediteurTitre(p.titreProfessionnel);
        if (!poste) setPoste(p.titreProfessionnel);
      }
      if (p.email) setExpediteurEmail(p.email);
      if (p.telephone) setExpediteurTel(p.telephone);
      if (p.adresse) setExpediteurAdresse(p.adresse);
    }
  }, [selectedCVId]);

  // Generate Letter with Gemini AI
  const handleGenerateWithAI = async () => {
    if (!selectedCV) {
      showToast('Veuillez sélectionner un CV source.');
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/lettre-motivation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cv: selectedCV,
          langue,
          entreprise,
          poste,
          ton,
          pointsCles
        })
      });

      if (!res.ok) throw new Error('Erreur lors de la génération');
      const data: LettreMotivationResult = await res.json();

      if (data.objet) setObjet(data.objet);
      if (data.formulePolitesseEntree) setFormuleEntree(data.formulePolitesseEntree);
      if (data.paragrapheAccroche) setAccroche(data.paragrapheAccroche);
      if (data.paragrapheValeurAjoutee) setValeurAjoutee(data.paragrapheValeurAjoutee);
      if (data.paragrapheAdequationEntreprise) setAdequation(data.paragrapheAdequationEntreprise);
      if (data.paragrapheConclusion) setConclusion(data.paragrapheConclusion);
      if (data.formulePolitesseSortie) setFormuleSortie(data.formulePolitesseSortie);
      if (data.destinataire) setDestinataire(data.destinataire);
      if (data.entreprise) setEntreprise(data.entreprise);

      setTitreLettre(`Lettre ${poste || 'Candidature'} - ${entreprise || 'Entreprise'}`);
      setIsSaved(false);
      showToast('Lettre générée avec succès par l\'IA !');

      // Auto-save the generated letter
      const constructedLetter: SavedLetter = {
        id: letterId,
        utilisateurId: selectedCV.utilisateurId || 'u-demo-1',
        cvId: selectedCV.id,
        titre: `Lettre ${poste || 'Candidature'} - ${entreprise || 'Entreprise'}`,
        destinataire: data.destinataire || destinataire,
        entreprise: data.entreprise || entreprise,
        poste: data.poste || poste,
        villeDate,
        dateCreation: initialLetter?.dateCreation || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        langue,
        police,
        taillePolice,
        couleurAccent,
        expediteur: {
          nomComplet: expediteurNom,
          titreProfessionnel: expediteurTitre,
          email: expediteurEmail,
          telephone: expediteurTel,
          adresse: expediteurAdresse
        },
        objet: data.objet || objet,
        formulePolitesseEntree: data.formulePolitesseEntree || formuleEntree,
        paragrapheAccroche: data.paragrapheAccroche || accroche,
        paragrapheValeurAjoutee: data.paragrapheValeurAjoutee || valeurAjoutee,
        paragrapheAdequationEntreprise: data.paragrapheAdequationEntreprise || adequation,
        paragrapheConclusion: data.paragrapheConclusion || conclusion,
        formulePolitesseSortie: data.formulePolitesseSortie || formuleSortie,
        texteComplet: data.texteComplet || '',
        signature: signature || expediteurNom
      };

      await onSaveLetter(constructedLetter);
      setIsSaved(true);
    } catch (err) {
      console.error('Error generating cover letter:', err);
      showToast('Une erreur est survenue lors de la génération.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Construct complete letter object
  const getLetterObject = (): SavedLetter => {
    const fullText = `${formuleEntree}\n\n${accroche}\n\n${valeurAjoutee}\n\n${adequation}\n\n${conclusion}\n\n${formuleSortie}\n\n${signature}`;
    return {
      id: letterId,
      utilisateurId: selectedCV?.utilisateurId || 'u-demo-1',
      cvId: selectedCV?.id,
      titre: titreLettre,
      destinataire,
      entreprise,
      poste,
      villeDate,
      dateCreation: initialLetter?.dateCreation || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      langue,
      police,
      taillePolice,
      couleurAccent,
      expediteur: {
        nomComplet: expediteurNom,
        titreProfessionnel: expediteurTitre,
        email: expediteurEmail,
        telephone: expediteurTel,
        adresse: expediteurAdresse
      },
      objet,
      formulePolitesseEntree: formuleEntree,
      paragrapheAccroche: accroche,
      paragrapheValeurAjoutee: valeurAjoutee,
      paragrapheAdequationEntreprise: adequation,
      paragrapheConclusion: conclusion,
      formulePolitesseSortie: formuleSortie,
      texteComplet: fullText,
      signature
    };
  };

  // Manual save
  const handleSave = async () => {
    const letter = getLetterObject();
    await onSaveLetter(letter);
    setIsSaved(true);
    showToast('Lettre de motivation enregistrée !');
  };

  // Copy full text
  const handleCopy = () => {
    const letter = getLetterObject();
    const formatted = `${letter.expediteur.nomComplet}
${letter.expediteur.adresse}
${letter.expediteur.telephone} | ${letter.expediteur.email}

${letter.entreprise}
${letter.destinataire}

${letter.villeDate}

Objet : ${letter.objet}

${letter.formulePolitesseEntree}

${letter.paragrapheAccroche}

${letter.paragrapheValeurAjoutee}

${letter.paragrapheAdequationEntreprise}

${letter.paragrapheConclusion}

${letter.formulePolitesseSortie}

${letter.signature}`;

    navigator.clipboard.writeText(formatted);
    showToast('Texte complet de la lettre copié !');
  };

  // Print PDF directly
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-16">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 dark:bg-slate-800 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-bounce border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top Header Sticky Bar */}
      <div className="sticky top-16 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={onBackToLetters}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
            title="Retour à mes lettres"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <input
              type="text"
              value={titreLettre}
              onChange={(e) => { setTitreLettre(e.target.value); setIsSaved(false); }}
              className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white bg-transparent border-b border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 focus:border-indigo-600 outline-hidden px-1 py-0.5"
              placeholder="Titre de la lettre..."
            />
            <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
              <span>{isSaved ? '✓ Enregistré automatiquement' : '• Modifications non enregistrées'}</span>
            </p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Copier le texte"
          >
            <Copy className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Copier</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-3.5 py-2 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 font-bold text-xs rounded-xl border border-indigo-200 dark:border-indigo-800 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Enregistrer</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer PDF HD</span>
          </button>
        </div>
      </div>

      {/* Main Studio Content: 2-Column Responsive Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: PARAMETERS & AI GENERATOR (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* 1. CV Source & Target Details Card */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
              <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Générateur IA & Paramètres</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Configurez votre candidature ciblée</p>
                </div>
              </div>

              {/* Source CV Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-indigo-500" />
                  <span>CV Source utilisé comme base</span>
                </label>
                <select
                  value={selectedCVId}
                  onChange={(e) => setSelectedCVId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 outline-hidden font-medium"
                >
                  {cvs.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.titre} {c.isModified ? '(Modifié / Adapté)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Company & Position */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>Entreprise ciblée</span>
                  </label>
                  <input
                    type="text"
                    value={entreprise}
                    onChange={(e) => { setEntreprise(e.target.value); setIsSaved(false); }}
                    placeholder="Ex: Orange, Total, Société Générale..."
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    <span>Poste visé</span>
                  </label>
                  <input
                    type="text"
                    value={poste}
                    onChange={(e) => { setPoste(e.target.value); setIsSaved(false); }}
                    placeholder="Ex: Chef de Projet, Développeur..."
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 outline-hidden"
                  />
                </div>
              </div>

              {/* Recipient & Tone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Destinataire</label>
                  <input
                    type="text"
                    value={destinataire}
                    onChange={(e) => { setDestinataire(e.target.value); setIsSaved(false); }}
                    placeholder="Ex: Direction des RH"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Ton de rédaction</label>
                  <select
                    value={ton}
                    onChange={(e) => setTon(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 outline-hidden font-medium"
                  >
                    <option value="professionnel">Professionnel & Équilibré</option>
                    <option value="dynamique">Dynamique & Innovant</option>
                    <option value="formel">Formel & Rigoureux</option>
                    <option value="executif">Exécutif & Stratégique</option>
                  </select>
                </div>
              </div>

              {/* Specific focus points */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Points forts particuliers à valoriser (optionnel)</label>
                <textarea
                  value={pointsCles}
                  onChange={(e) => setPointsCles(e.target.value)}
                  placeholder="Ex: Maîtrise avancée de React, bilingue anglais, gestion d'équipe de 5 personnes..."
                  rows={2}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 outline-hidden resize-none"
                />
              </div>

              {/* Generate AI Button */}
              <button
                type="button"
                onClick={handleGenerateWithAI}
                disabled={isGenerating}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-black text-xs rounded-2xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Rédaction IA en cours avec Gemini...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Rédiger / Régénérer avec l'IA</span>
                  </>
                )}
              </button>
            </div>

            {/* 2. Formatting & Typography Controls Card */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <Sliders className="w-4 h-4 text-slate-400" />
                <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider">Mise en Page & Typographie</h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Police de caractères</label>
                  <select
                    value={police}
                    onChange={(e) => { setPolice(e.target.value); setIsSaved(false); }}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 outline-hidden font-medium"
                  >
                    <option value="Inter">Inter (Moderne)</option>
                    <option value="Playfair Display">Playfair Display (Élégant)</option>
                    <option value="Merriweather">Merriweather (Classique)</option>
                    <option value="Roboto">Roboto (Clair)</option>
                    <option value="Montserrat">Montserrat (Dynamique)</option>
                    <option value="Lora">Lora (Littéraire)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Taille du texte ({taillePolice}pt)</label>
                  <input
                    type="range"
                    min="9"
                    max="14"
                    step="0.5"
                    value={taillePolice}
                    onChange={(e) => { setTaillePolice(parseFloat(e.target.value)); setIsSaved(false); }}
                    className="w-full accent-indigo-600 cursor-pointer mt-2"
                  />
                </div>
              </div>

              {/* Accent Color Picker */}
              <div className="space-y-1.5 pt-1">
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Couleur d'accentuation</label>
                <div className="flex items-center gap-2 flex-wrap">
                  {['#2563EB', '#4F46E5', '#059669', '#0891B2', '#D97706', '#DC2626', '#1E293B'].map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => { setCouleurAccent(col); setIsSaved(false); }}
                      className={`w-7 h-7 rounded-full transition-transform cursor-pointer border-2 ${
                        couleurAccent === col ? 'scale-110 border-slate-900 dark:border-white shadow-xs' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: col }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Sender Contact Overrides */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center space-x-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <UserIcon className="w-4 h-4 text-slate-400" />
                <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider">Vos Coordonnées (Expéditeur)</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <input
                  type="text"
                  value={expediteurNom}
                  onChange={(e) => { setExpediteurNom(e.target.value); setIsSaved(false); }}
                  placeholder="Nom complet"
                  className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl outline-hidden"
                />
                <input
                  type="text"
                  value={expediteurTitre}
                  onChange={(e) => { setExpediteurTitre(e.target.value); setIsSaved(false); }}
                  placeholder="Titre professionnel"
                  className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl outline-hidden"
                />
                <input
                  type="email"
                  value={expediteurEmail}
                  onChange={(e) => { setExpediteurEmail(e.target.value); setIsSaved(false); }}
                  placeholder="Email"
                  className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl outline-hidden"
                />
                <input
                  type="text"
                  value={expediteurTel}
                  onChange={(e) => { setExpediteurTel(e.target.value); setIsSaved(false); }}
                  placeholder="Téléphone"
                  className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl outline-hidden"
                />
              </div>
              <input
                type="text"
                value={expediteurAdresse}
                onChange={(e) => { setExpediteurAdresse(e.target.value); setIsSaved(false); }}
                placeholder="Adresse postale / Ville"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl outline-hidden"
              />
            </div>
          </div>

          {/* RIGHT COLUMN: REAL-TIME A4 LETTER SHEET PREVIEW & INLINE EDITING (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* View Tab Selector: Éditer Champs vs Aperçu Feuille A4 */}
            <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-2xl w-fit">
              <button
                type="button"
                onClick={() => setActiveTab('editor')}
                className={`px-4 py-1.5 text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'editor'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Édition Détaillée</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-4 py-1.5 text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'preview'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Aperçu Document A4</span>
              </button>
            </div>

            {/* TAB 1: STRUCTURED INLINE FIELD EDITOR */}
            {activeTab === 'editor' && (
              <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                
                {/* Subject / Objet */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">Objet de la lettre</label>
                  <input
                    type="text"
                    value={objet}
                    onChange={(e) => { setObjet(e.target.value); setIsSaved(false); }}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 outline-hidden"
                  />
                </div>

                {/* Formule d'ouverture */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Formule de politesse d'ouverture</label>
                  <input
                    type="text"
                    value={formuleEntree}
                    onChange={(e) => { setFormuleEntree(e.target.value); setIsSaved(false); }}
                    className="w-full px-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 outline-hidden"
                  />
                </div>

                {/* Paragraphe 1 : Accroche */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>1. Paragraphe d'Accroche & Motivation</span>
                    <span className="text-[10px] text-slate-400">Présentation & poste ciblé</span>
                  </label>
                  <textarea
                    value={accroche}
                    onChange={(e) => { setAccroche(e.target.value); setIsSaved(false); }}
                    rows={3}
                    className="w-full p-3.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 outline-hidden leading-relaxed"
                  />
                </div>

                {/* Paragraphe 2 : Valeur Ajoutée */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>2. Paragraphe Valeur Ajoutée & Réalisations</span>
                    <span className="text-[10px] text-slate-400">Compétences réelles du CV</span>
                  </label>
                  <textarea
                    value={valeurAjoutee}
                    onChange={(e) => { setValeurAjoutee(e.target.value); setIsSaved(false); }}
                    rows={4}
                    className="w-full p-3.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 outline-hidden leading-relaxed"
                  />
                </div>

                {/* Paragraphe 3 : Adéquation Entreprise */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>3. Paragraphe Adéquation avec l'Entreprise</span>
                    <span className="text-[10px] text-slate-400">Vision & synergie</span>
                  </label>
                  <textarea
                    value={adequation}
                    onChange={(e) => { setAdequation(e.target.value); setIsSaved(false); }}
                    rows={3}
                    className="w-full p-3.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 outline-hidden leading-relaxed"
                  />
                </div>

                {/* Paragraphe 4 : Conclusion & Appel Entretien */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>4. Paragraphe Conclusion & Entretien</span>
                    <span className="text-[10px] text-slate-400">Disponibilité</span>
                  </label>
                  <textarea
                    value={conclusion}
                    onChange={(e) => { setConclusion(e.target.value); setIsSaved(false); }}
                    rows={2}
                    className="w-full p-3.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 outline-hidden leading-relaxed"
                  />
                </div>

                {/* Formule de sortie & Signature */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Formule de politesse finale</label>
                    <input
                      type="text"
                      value={formuleSortie}
                      onChange={(e) => { setFormuleSortie(e.target.value); setIsSaved(false); }}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 outline-hidden"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Signature</label>
                    <input
                      type="text"
                      value={signature}
                      onChange={(e) => { setSignature(e.target.value); setIsSaved(false); }}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 outline-hidden"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2 / PRINT DOCUMENT: REAL-TIME A4 LETTER SHEET */}
            <div
              id="letter-a4-sheet"
              className={`bg-white text-slate-900 p-8 sm:p-12 md:p-16 rounded-3xl shadow-xl border border-slate-200 min-h-[750px] relative transition-all ${
                activeTab === 'editor' ? 'hidden md:block' : 'block'
              }`}
              style={{
                fontFamily: police,
                fontSize: `${taillePolice}pt`,
                lineHeight: 1.6
              }}
            >
              {/* Header Accent Line */}
              <div 
                className="h-1.5 w-16 rounded-full mb-8"
                style={{ backgroundColor: couleurAccent }}
              />

              {/* Sender & Recipient Blocks */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-slate-100">
                {/* Sender Left */}
                <div className="space-y-1 text-xs">
                  <p className="font-extrabold text-sm text-slate-900">{expediteurNom}</p>
                  {expediteurTitre && <p className="font-semibold text-slate-600">{expediteurTitre}</p>}
                  {expediteurAdresse && <p className="text-slate-500">{expediteurAdresse}</p>}
                  <p className="text-slate-500">{expediteurTel} {expediteurEmail && `• ${expediteurEmail}`}</p>
                </div>

                {/* Recipient Right */}
                <div className="sm:text-right space-y-1 text-xs">
                  <p className="font-extrabold text-sm text-slate-900">{entreprise || 'Entreprise'}</p>
                  <p className="font-medium text-slate-600">{destinataire || 'Direction des Ressources Humaines'}</p>
                  <p className="text-slate-400 pt-1 italic">{villeDate}</p>
                </div>
              </div>

              {/* Objet Banner */}
              <div className="my-6 p-3 rounded-xl bg-slate-50 border-l-4" style={{ borderColor: couleurAccent }}>
                <p className="font-black text-xs sm:text-sm text-slate-900">
                  <span className="text-slate-500 uppercase tracking-wider text-[10px] mr-2">Objet :</span>
                  {objet}
                </p>
              </div>

              {/* Body Content */}
              <div className="space-y-4 text-slate-800 text-justify">
                <p className="font-semibold">{formuleEntree}</p>

                {accroche && <p className="leading-relaxed">{accroche}</p>}
                {valeurAjoutee && <p className="leading-relaxed">{valeurAjoutee}</p>}
                {adequation && <p className="leading-relaxed">{adequation}</p>}
                {conclusion && <p className="leading-relaxed">{conclusion}</p>}

                <p className="pt-2 font-medium">{formuleSortie}</p>
              </div>

              {/* Signature Block */}
              <div className="mt-8 pt-4 flex flex-col items-end">
                <p className="font-extrabold text-slate-900 text-sm">{signature || expediteurNom}</p>
                <div 
                  className="h-0.5 w-24 mt-2 rounded" 
                  style={{ backgroundColor: couleurAccent, opacity: 0.5 }}
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
