import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Briefcase,
  ArrowRight,
  Filter,
  CheckCircle2,
  ChevronRight,
  Layers,
  Award
} from 'lucide-react';
import { Language, SubscriptionTier } from '../types';
import { JOB_LANDING_PAGES, SECTEUR_LABELS, JobLandingPage } from '../data/jobLandingPages';
import { CV_TEMPLATES } from '../data/templates';

interface JobCatalogViewProps {
  langue: Language;
  userTier?: SubscriptionTier;
  onCreateCVWithJob: (jobSlug: string) => void;
}

export const JobCatalogView: React.FC<JobCatalogViewProps> = ({
  langue,
  userTier = 'freemium',
  onCreateCVWithJob
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('all');

  useEffect(() => {
    document.title = 'Modèles de CV par Métier (36 professions) | MonCVGratuit';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Découvrez nos 36 modèles de CV par métier avec compétences clés recherchées, conseils recruteurs et templates recommandés pour décrocher votre prochain emploi.'
      );
    }
  }, []);

  const sectors = useMemo(() => {
    const list: { id: string; label: string; icon: string; count: number }[] = [
      { id: 'all', label: 'Tous les métiers', icon: '💼', count: JOB_LANDING_PAGES.length }
    ];
    Object.entries(SECTEUR_LABELS).forEach(([key, val]) => {
      const count = JOB_LANDING_PAGES.filter(p => p.secteur === key).length;
      if (count > 0) {
        list.push({ id: key, label: val.fr, icon: val.icon, count });
      }
    });
    return list;
  }, []);

  const filteredJobs = useMemo(() => {
    return JOB_LANDING_PAGES.filter(job => {
      const matchSector = selectedSector === 'all' || job.secteur === selectedSector;
      if (!matchSector) return false;
      if (!searchTerm.trim()) return true;

      const q = searchTerm.toLowerCase();
      const inTitle = job.metier.toLowerCase().includes(q);
      const inKeywords = (job.motsClesRecherches || []).some(k => k.toLowerCase().includes(q));
      const inSkills = job.competencesCles.some(s => s.toLowerCase().includes(q));
      const inTools = (job.outilsTypiques || []).some(t => t.toLowerCase().includes(q));
      return inTitle || inKeywords || inSkills || inTools;
    });
  }, [selectedSector, searchTerm]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 text-slate-900 dark:text-slate-100 pb-20">
      {/* Header Banner */}
      <div className="bg-white dark:bg-neutral-900 border-b border-slate-200 dark:border-neutral-800 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav aria-label="Fil d'Ariane" className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
            <Link to="/" className="hover:text-blue-600 transition-colors">Accueil</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-slate-900 dark:text-white">Modèles de CV par Métier</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-neutral-800 text-slate-800 dark:text-slate-200 text-xs font-semibold mb-3 border border-slate-200 dark:border-neutral-700">
              <Award className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>36 Modèles Métiers Recommandés par les Recruteurs</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Trouvez le modèle de CV taillé pour votre profession
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Chaque page métier comprend les compétences clés attendues par les recruteurs, un template graphique adapté, des conseils réels et un formulaire pré-orienté.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mt-6 relative max-w-xl">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un métier, une compétence, un outil (ex. comptable, python, sage)..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-neutral-800 border border-slate-300 dark:border-neutral-700 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-inner"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Effacer
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        {/* Sector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none">
          {sectors.map((sec) => {
            const isActive = selectedSector === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => setSelectedSector(sec.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-neutral-800'
                }`}
              >
                <span>{sec.icon}</span>
                <span>{sec.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-neutral-800 text-slate-500'}`}>
                  {sec.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Results Counter */}
        <div className="py-3 text-xs text-slate-500 dark:text-slate-400">
          Affichage de <span className="font-bold text-slate-900 dark:text-white">{filteredJobs.length}</span> modèle(s) de CV
        </div>

        {/* Job Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
          {filteredJobs.map((job) => {
            const secInfo = SECTEUR_LABELS[job.secteur] || SECTEUR_LABELS.autre;
            const templateObj = CV_TEMPLATES.find(t => t.id === job.templateRecommandeId);
            const templateName = templateObj ? templateObj.name : 'Modèle Recommandé';
            return (
              <div
                key={job.slug}
                className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-5 shadow-xs hover:shadow-lg hover:border-blue-400 dark:hover:border-blue-600 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
                      <span>{secInfo.icon}</span>
                      <span>{secInfo.fr}</span>
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-slate-300">
                      {templateName}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    CV {job.metier}
                  </h2>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-3 leading-relaxed font-normal">
                    {job.descriptionHero || job.accroche}
                  </p>

                  {/* Top skills pills */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-neutral-800">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1.5">
                      Compétences clés suggérées :
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {job.competencesCles.slice(0, 3).map((comp, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 rounded-md bg-slate-100 dark:bg-neutral-800 text-[11px] text-slate-700 dark:text-slate-300 font-medium truncate max-w-[200px]"
                        >
                          {comp}
                        </span>
                      ))}
                      {job.competencesCles.length > 3 && (
                        <span className="px-1.5 py-1 text-[11px] text-slate-400 font-medium">
                          +{job.competencesCles.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-neutral-800 flex items-center gap-2">
                  <Link
                    to={`/${job.slug}`}
                    className="flex-1 px-3 py-2 text-center rounded-xl bg-slate-100 dark:bg-neutral-800 hover:bg-slate-200 dark:hover:bg-neutral-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all"
                  >
                    Voir le modèle & conseils
                  </Link>

                  <button
                    type="button"
                    onClick={() => onCreateCVWithJob(job.slug)}
                    className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0"
                    title={`Créer mon CV de ${job.metier}`}
                  >
                    <span>Créer</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-neutral-900 rounded-2xl border border-slate-200 dark:border-neutral-800 my-8">
            <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Aucun métier correspondant</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Essayez un autre mot-clé ou réinitialisez vos filtres pour découvrir nos 36 modèles.
            </p>
            <button
              type="button"
              onClick={() => { setSearchTerm(''); setSelectedSector('all'); }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
