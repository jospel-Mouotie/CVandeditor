import React, { useState } from 'react';
import { CV, Language, LinkedInOptimizationResult } from '../types';
import { 
  Linkedin, 
  Sparkles, 
  Copy, 
  CheckCircle2, 
  FileText, 
  RefreshCw, 
  ArrowLeft, 
  Briefcase, 
  Tag, 
  Eye, 
  Check
} from 'lucide-react';

interface LinkedInGeneratorViewProps {
  cvs: CV[];
  activeCV: CV | null;
  langue: Language;
  onGoToDashboard: () => void;
}

export const LinkedInGeneratorView: React.FC<LinkedInGeneratorViewProps> = ({
  cvs,
  activeCV,
  langue,
  onGoToDashboard
}) => {
  const [selectedCVId, setSelectedCVId] = useState<string>(
    activeCV?.id || (cvs.length > 0 ? cvs[0].id : '')
  );
  const selectedCV = cvs.find(c => c.id === selectedCVId) || activeCV || cvs[0] || null;

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<LinkedInOptimizationResult | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast('Copié dans le presse-papier !');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleGenerateLinkedIn = async () => {
    if (!selectedCV) {
      showToast('Veuillez sélectionner un CV source.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/linkedin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cv: selectedCV,
          langue
        })
      });

      if (!res.ok) throw new Error('Erreur lors de la génération');
      const data: LinkedInOptimizationResult = await res.json();
      setResult(data);
      showToast('Profil LinkedIn optimisé généré avec succès !');
    } catch (err) {
      console.error('Error generating LinkedIn profile:', err);
      showToast('Une erreur est survenue lors de la génération.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 dark:bg-slate-800 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-bounce border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
              <Linkedin className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Optimisation Profil LinkedIn Pro
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Transformez votre CV en profil LinkedIn influent, optimisé pour l'algorithme et les recruteurs.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onGoToDashboard}
          className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all flex items-center gap-1.5 w-fit cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Tableau de bord</span>
        </button>
      </div>

      {/* Selector & Generator Action Card */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <FileText className="w-4 h-4 text-sky-500" />
            <span>Sélectionnez le CV à convertir en profil LinkedIn</span>
          </label>
          <select
            value={selectedCVId}
            onChange={(e) => setSelectedCVId(e.target.value)}
            className="w-full px-4 py-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl focus:border-sky-500 outline-hidden font-medium"
          >
            {cvs.map(c => (
              <option key={c.id} value={c.id}>
                {c.titre} {c.isModified ? '(Modifié / Adapté)' : ''}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={handleGenerateLinkedIn}
          disabled={isLoading}
          className="w-full py-3.5 bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-700 hover:to-blue-800 text-white font-black text-xs rounded-2xl shadow-lg shadow-sky-500/25 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Optimisation algorithmique LinkedIn en cours...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Générer mon Titre, Bio & Expériences LinkedIn Pro</span>
            </>
          )}
        </button>
      </div>

      {/* Results Display */}
      {result && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* 1. Headline / Titre Professionnel */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950 px-2 py-0.5 rounded-md border border-sky-200 dark:border-sky-800">
                  Titre du Profil (Headline)
                </span>
                <span className="text-[11px] text-slate-400">Positionnement & Mots-clés</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(result.titreProfil, 'headline')}
                className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1.5 cursor-pointer px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/60"
              >
                {copiedKey === 'headline' ? (
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Copié !
                  </span>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copier le titre</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              {result.titreProfil}
            </p>
          </div>

          {/* 2. About / Résumé Bio */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950 px-2 py-0.5 rounded-md border border-sky-200 dark:border-sky-800">
                  Section "Infos" (Bio / Résumé)
                </span>
                <span className="text-[11px] text-slate-400">Storytelling professionnel</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(result.resumeBio, 'about')}
                className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1.5 cursor-pointer px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/60"
              >
                {copiedKey === 'about' ? (
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Copié !
                  </span>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copier la bio</span>
                  </>
                )}
              </button>
            </div>
            <div className="p-4 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
              {result.resumeBio}
            </div>
          </div>

          {/* 3. Experiences Bullet Points */}
          {result.experiencesLinkedIn && result.experiencesLinkedIn.length > 0 && (
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950 px-2 py-0.5 rounded-md border border-sky-200 dark:border-sky-800">
                  Expériences Clés Reformulées
                </span>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Descriptions axées sur les résultats</h3>
              </div>

              <div className="space-y-4">
                {result.experiencesLinkedIn.map((exp, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-extrabold text-xs text-slate-900 dark:text-white">{exp.titrePoste}</p>
                      <button
                        type="button"
                        onClick={() => handleCopy(exp.pointsCles.join('\n'), `exp-${idx}`)}
                        className="text-[11px] font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === `exp-${idx}` ? 'Copié !' : 'Copier les puces'}
                      </button>
                    </div>
                    <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300 list-disc list-inside">
                      {exp.pointsCles.map((pt, pIdx) => (
                        <li key={pIdx} className="leading-relaxed">{pt}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. SEO Keywords Badges */}
          {result.motsClesRecommandes && result.motsClesRecommandes.length > 0 && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-sky-500" />
                  <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider">Mots-clés Algorithmiques Recommandés</h3>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(result.motsClesRecommandes.join(', '), 'keywords')}
                  className="text-xs font-bold text-sky-600 hover:text-sky-700 cursor-pointer"
                >
                  Tout copier
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.motsClesRecommandes.map((mot, idx) => (
                  <span
                    key={idx}
                    onClick={() => handleCopy(mot, `kw-${idx}`)}
                    className="px-3 py-1.5 text-xs font-extrabold bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 rounded-xl cursor-pointer hover:scale-105 transition-transform"
                    title="Cliquez pour copier"
                  >
                    #{mot}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 5. Visibility Advice */}
          {result.conseilsVisibilite && result.conseilsVisibilite.length > 0 && (
            <div className="p-6 rounded-3xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-2 text-xs text-amber-900 dark:text-amber-200">
              <h4 className="font-extrabold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Conseils pour maximiser les vues recruteurs</span>
              </h4>
              <ul className="space-y-1 list-disc list-inside text-amber-800 dark:text-amber-300">
                {result.conseilsVisibilite.map((c, idx) => (
                  <li key={idx}>{c}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
