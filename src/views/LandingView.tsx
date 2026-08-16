import React from 'react';
import { Language } from '../types';
import { getTranslation } from '../i18n/translations';
import { 
  FileText, 
  Sparkles, 
  Layout, 
  ShieldCheck, 
  Download, 
  Upload, 
  ArrowRight, 
  CheckCircle2, 
  FilePlus, 
  Sliders,
  Target,
  Linkedin,
  Mail,
  Zap,
  Wand2
} from 'lucide-react';

interface LandingViewProps {
  langue: Language;
  onStartCreate: () => void;
  onBrowseTemplates: () => void;
  onImportClick: () => void;
  onCreateBlankCV?: () => void;
  onOpenLetterGenerator?: () => void;
  onOpenLinkedInGenerator?: () => void;
  onOpenJobTargeting?: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  langue,
  onStartCreate,
  onBrowseTemplates,
  onImportClick,
  onCreateBlankCV,
  onOpenLetterGenerator,
  onOpenLinkedInGenerator,
  onOpenJobTargeting
}) => {
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(langue, key);

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/80 via-white to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 pt-10 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-7">
          
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-4 py-1.5 rounded-full text-xs font-black shadow-2xs border border-blue-200 dark:border-blue-800">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>{langue === 'en' ? 'AI-Powered Career Suite' : langue === 'ar' ? 'منصة السيرة الذاتية والتوظيف بالذكاء الاصطناعي' : 'Suite Carrière & Création de CV IA'}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            {langue === 'en' 
              ? 'Create, Import & Personalize Your CVs with AI' 
              : langue === 'ar'
              ? 'أنشئ واستورد وخصص سيرتك الذاتية وخطابات التوظيف بذكاء'
              : 'Créez, Importez & Personnalisez vos CVs et Lettres avec l\'IA'}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {langue === 'en'
              ? 'Design high-impact resumes, import existing PDF/Word files, generate tailored cover letters and optimize your LinkedIn profile in minutes.'
              : langue === 'ar'
              ? 'صمم سيرتك الذاتية بدقة عالية، استورد ملفات PDF/Word، وأنشئ خطابات تقديم مخصصة وحسن حساب لينكد إن بسهولة.'
              : 'Concevez des CVs professionnels, importez vos fichiers PDF/Word, générez des lettres de motivation sur mesure et optimisez votre profil LinkedIn instantanément.'}
          </p>

          {/* KEY SERVICES DIRECT SHOWCASE (Lettres, LinkedIn, Import, Personnalisation Offre) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto pt-2 text-left">
            
            {/* 1. Import de CV */}
            <div 
              onClick={onImportClick}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-400 shadow-xs hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                <Upload className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                {langue === 'en' ? 'Import CV' : langue === 'ar' ? 'استيراد السيرة' : 'Import de CV'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                {langue === 'en' ? 'Extract from PDF/Word in 1 click' : 'Extraction auto depuis PDF & Word'}
              </p>
            </div>

            {/* 2. Personnalisation par Offre */}
            <div 
              onClick={onOpenJobTargeting || onBrowseTemplates}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-400 shadow-xs hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-black text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                {langue === 'en' ? 'Job Offer Adaptation' : langue === 'ar' ? 'تخصيص حسب العرض' : 'Cibler une Offre'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                {langue === 'en' ? 'Adapt CV with job screenshot' : 'Photo/texte de l\'offre + IA'}
              </p>
            </div>

            {/* 3. Lettre de Motivation IA */}
            <div 
              onClick={onOpenLetterGenerator || onBrowseTemplates}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-400 shadow-xs hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-black text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                {langue === 'en' ? 'Cover Letter IA' : langue === 'ar' ? 'خطاب التقديم' : 'Lettre de Motivation'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                {langue === 'en' ? 'Personalized letter generator' : 'Génération IA sur mesure'}
              </p>
            </div>

            {/* 4. Profil LinkedIn */}
            <div 
              onClick={onOpenLinkedInGenerator || onBrowseTemplates}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-sky-500 dark:hover:border-sky-400 shadow-xs hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                <Linkedin className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-black text-slate-900 dark:text-white group-hover:text-sky-600 transition-colors">
                {langue === 'en' ? 'LinkedIn Profile' : langue === 'ar' ? 'ملف لينكد إن' : 'Profil LinkedIn'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                {langue === 'en' ? 'Catchy headline & summary' : 'Titre accrocheur & résumé'}
              </p>
            </div>

          </div>

          {/* TWO MAIN MODES HIGHLIGHT CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 text-left max-w-4xl mx-auto">
            
            {/* MODE 1: PAGE BLANCHE / ÉDITEUR DIRECT */}
            <div
              onClick={onCreateBlankCV || onStartCreate}
              className="group bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-8 rounded-3xl shadow-xl shadow-blue-500/20 border border-blue-500/30 hover:scale-[1.02] transition-all cursor-pointer flex flex-col justify-between space-y-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold">
                  <FilePlus className="w-6 h-6 text-white" />
                </div>
                <div className="inline-block bg-blue-400/30 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider">
                  {langue === 'en' ? 'Blank Page Mode' : 'Mode Page Vierge'}
                </div>
                <h3 className="text-2xl font-black tracking-tight">
                  {langue === 'en' ? 'Start From Scratch' : 'Créer un CV Vierge'}
                </h3>
                <p className="text-blue-100 text-sm leading-relaxed">
                  {langue === 'en' 
                    ? 'Fill your details step-by-step with assistant and customize your layout, fonts, and colors.'
                    : 'Composez librement votre CV étape par étape avec l\'assistant de saisie et la personnalisation intégrale.'}
                </p>
              </div>

              <div className="flex items-center space-x-2 font-bold text-sm text-white pt-2 group-hover:translate-x-1 transition-transform">
                <span>{t('ctaCreateCV')}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* MODE 2: FORMULAIRE & TEMPLATES */}
            <div
              onClick={onBrowseTemplates}
              className="group bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:scale-[1.02] transition-all cursor-pointer flex flex-col justify-between space-y-6 relative overflow-hidden"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                  <Sliders className="w-6 h-6" />
                </div>
                <div className="inline-block bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider">
                  {t('navTemplates')}
                </div>
                <h3 className="text-2xl font-black tracking-tight">{t('galleryTitle')}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {t('gallerySubtitle')}
                </p>
              </div>

              <div className="flex items-center space-x-2 font-bold text-sm text-blue-600 dark:text-blue-400 pt-2 group-hover:translate-x-1 transition-transform">
                <span>{t('ctaBrowseTemplates')}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

          </div>

          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={onImportClick}
              className="px-6 py-3.5 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm rounded-2xl transition-all flex items-center space-x-2 border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              <Upload className="w-4 h-4 text-blue-600" />
              <span>{t('ctaImportCV')}</span>
            </button>
          </div>

          {/* Highlights bar */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> {langue === 'en' ? '50 HD Templates' : '50 Modèles Pro HD'}</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> {langue === 'en' ? 'Cover Letter & LinkedIn' : 'Lettre de Motivation & LinkedIn'}</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> {langue === 'en' ? 'Instant PDF Export' : 'Export PDF Instantané'}</span>
          </div>

        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-300 dark:hover:border-blue-600 transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Layout className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('feature1Title')}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{t('feature1Desc')}</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-300 dark:hover:border-blue-600 transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {langue === 'en' ? 'Cover Letter & LinkedIn' : 'Lettre de Motivation & Profil LinkedIn'}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {langue === 'en'
                ? 'Generate tailored cover letters and optimized LinkedIn headlines and summaries matching your target positions.'
                : 'Générez des lettres de motivation personnalisées et optimisez votre profil LinkedIn avec un résumé professionnel percutant.'}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-300 dark:hover:border-blue-600 transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {langue === 'en' ? 'Target Job Offers' : 'Personnalisation selon l\'Offre'}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {langue === 'en'
                ? 'Upload job offer screenshots or paste requirements. Get tailored questions to adapt your CV with zero hallucination.'
                : 'Importez la photo ou le texte d\'une annonce pour ajuster les points clés de votre CV et maximiser vos chances d\'entretien.'}
            </p>
          </div>

        </div>
      </section>

    </div>
  );
};

