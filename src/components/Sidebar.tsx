import React from 'react';
import { User, Language } from '../types';
import { getTranslation } from '../i18n/translations';
import { 
  LayoutDashboard, 
  Grid, 
  FileText, 
  Shield, 
  Home, 
  Moon, 
  Sun, 
  Globe, 
  LogOut, 
  User as UserIcon, 
  Settings,
  X,
  Sparkles,
  Mail,
  Linkedin,
  Target,
  Download,
  Upload,
  Layers,
  Sliders,
  FileCheck
} from 'lucide-react';

export type AppView = 'home' | 'dashboard' | 'gallery' | 'editor' | 'job-targeting' | 'letter-generator' | 'letters' | 'linkedin' | 'admin';

interface SidebarProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  langue: Language;
  setLangue: (lang: Language) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  user: User | null;
  onLogout: () => void;
  onQuickLoginDemo: () => void;
  onQuickLoginAdmin: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  hasActiveCv: boolean;
  onOpenEditorChoice?: () => void;
  onCreateBlankCV?: () => void;
  onOpenLetterGenerator?: () => void;
  onOpenLinkedInGenerator?: () => void;
  onOpenJobTargeting?: () => void;
  onOpenExportPDF?: () => void;
  onOpenModifiedCVs?: () => void;
  onOpenLettersDashboard?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  setCurrentView,
  langue,
  setLangue,
  isDarkMode,
  toggleDarkMode,
  user,
  onLogout,
  onQuickLoginDemo,
  onQuickLoginAdmin,
  isOpen,
  setIsOpen,
  hasActiveCv,
  onOpenEditorChoice,
  onCreateBlankCV,
  onOpenLetterGenerator,
  onOpenLinkedInGenerator,
  onOpenJobTargeting,
  onOpenExportPDF,
  onOpenModifiedCVs,
  onOpenLettersDashboard
}) => {
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(langue, key);

  const labels = {
    mainNav: langue === 'en' ? 'Main Navigation' : langue === 'ar' ? 'التنقل الرئيسي' : 'Navigation Principale',
    careerTools: langue === 'en' ? 'AI Career Tools & Pages' : langue === 'ar' ? 'أدوات التوظيف بالذكاء الاصطناعي' : 'Outils Carrière & IA (Pages Dédiées)',
    coverLetter: langue === 'en' ? 'Cover Letter Generator' : langue === 'ar' ? 'إنشاء خطاب التقديم' : 'Rédiger une Lettre IA',
    myLetters: langue === 'en' ? 'My Cover Letters' : langue === 'ar' ? 'رسائل التحفيز الخاصة بي' : 'Mes Lettres de Motivation',
    linkedIn: langue === 'en' ? 'LinkedIn Profile Pro' : langue === 'ar' ? 'ملف لينكد إن' : 'Profil LinkedIn Pro',
    jobTarget: langue === 'en' ? 'Tailor to Job Offer' : langue === 'ar' ? 'تخصيص حسب الوظيفة' : 'Cibler une Offre d\'Emploi',
    modifiedCvs: langue === 'en' ? 'My Tailored CVs' : langue === 'ar' ? 'سيري الذاتية المعدلة' : 'Mes CVs Modifiés / Ciblés',
    exportPdf: langue === 'en' ? 'Export CV (PDF HD)' : langue === 'ar' ? 'تصدير السيرة (PDF)' : 'Exporter en PDF (A4 HD)',
    createBlankModel: langue === 'en' ? 'Create My Own Model' : langue === 'ar' ? 'إنشاء نموذجي الخاص' : 'Créer mon propre modèle',
    blankPageTag: langue === 'en' ? 'Blank Canvas' : langue === 'ar' ? 'صفحة بيضاء' : 'Page Blanche',
    aiTag: 'Page IA',
    settings: langue === 'en' ? 'Settings & Preferences' : langue === 'ar' ? 'الإعدادات والتفضيلات' : 'Paramètres & Préférences',
    langLabel: langue === 'en' ? 'Interface Language' : langue === 'ar' ? 'لغة الواجهة' : 'Langue de l\'interface',
    darkMode: langue === 'en' ? 'Dark Mode' : langue === 'ar' ? 'الوضع الداكن' : 'Mode Sombre',
    lightMode: langue === 'en' ? 'Light Mode' : langue === 'ar' ? 'الوضع الفاتح' : 'Mode Clair',
    demoProfiles: langue === 'en' ? 'Quick Demo Profiles' : langue === 'ar' ? 'ملفات تعريف سريعة' : 'Profils Rapides de Démo',
    candidate: langue === 'en' ? 'Candidate' : langue === 'ar' ? 'مرشح' : 'Candidat',
    admin: langue === 'en' ? 'Admin' : langue === 'ar' ? 'مسؤول' : 'Admin',
    close: langue === 'en' ? 'Close menu' : langue === 'ar' ? 'إغلاق القائمة' : 'Fermer le menu'
  };

  const navItems = [
    { id: 'home' as AppView, label: t('navHome'), icon: Home },
    { id: 'dashboard' as AppView, label: t('navDashboard'), icon: LayoutDashboard },
    { id: 'letters' as AppView, label: labels.myLetters, icon: Mail },
    { id: 'gallery' as AppView, label: t('navTemplates'), icon: Grid },
    { 
      id: 'editor' as AppView, 
      label: langue === 'en' ? 'CV Editor' : langue === 'ar' ? 'محرر السيرة الذاتية' : 'Éditeur de CV', 
      icon: FileText 
    },
    ...(user?.role === 'ADMIN' ? [{ id: 'admin' as AppView, label: t('navAdmin'), icon: Shield }] : [])
  ];

  return (
    <>
      {/* Backdrop Overlay when Sidebar Drawer is open */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 transition-opacity animate-fadeIn"
        />
      )}

      {/* Slide-over Sidebar Drawer */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 flex flex-col justify-between shadow-2xl w-80 max-w-[85vw] ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        dir={langue === 'ar' ? 'rtl' : 'ltr'}
      >
        {/* TOP BRAND HEADER & CLOSE BUTTON */}
        <div className="overflow-y-auto max-h-[calc(100vh-140px)]">
          <div className="h-16 px-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm z-10">
            <div 
              onClick={() => { setCurrentView('home'); setIsOpen(false); }}
              className="flex items-center space-x-3 cursor-pointer select-none group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 flex items-center justify-center text-white font-black text-lg shadow-md group-hover:scale-105 transition-transform shrink-0">
                CVB
              </div>
              <div className="leading-tight">
                <span className="font-extrabold text-slate-900 dark:text-white tracking-tight text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  MYCV BUILDER
                </span>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[10px] bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 font-bold px-1.5 py-0.2 rounded border border-blue-200 dark:border-blue-800">
                    PRO HD
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={labels.close}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* MAIN NAVIGATION LINKS */}
          <div className="p-4 space-y-1.5">
            <p className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider px-2 mb-1">
              {labels.mainNav}
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'editor' && onOpenEditorChoice) {
                      onOpenEditorChoice();
                    } else if (item.id === 'letters' && onOpenLettersDashboard) {
                      onOpenLettersDashboard();
                    } else {
                      setCurrentView(item.id);
                    }
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                  <span className="truncate flex-1 text-left">{item.label}</span>
                </button>
              );
            })}

            {/* CREATE MY OWN MODEL / BLANK CANVAS ACTION */}
            {onCreateBlankCV && (
              <button
                type="button"
                onClick={() => {
                  onCreateBlankCV();
                  setIsOpen(false);
                }}
                className="w-full mt-1.5 flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-600/10 via-blue-600/10 to-indigo-600/10 hover:from-emerald-600/20 hover:to-indigo-600/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 hover:border-emerald-500/60 transition-all cursor-pointer group shadow-2xs"
              >
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                      {labels.createBlankModel}
                    </span>
                    <span className="text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shrink-0">
                      {labels.blankPageTag}
                    </span>
                  </div>
                </div>
              </button>
            )}
          </div>

          {/* DEDICATED AI CAREER PAGES IN SIDEBAR */}
          <div className="px-4 pb-2 space-y-1.5">
            <p className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider px-2 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{labels.careerTools}</span>
            </p>

            {/* 1. Page Cibler une Offre d'Emploi */}
            <button
              type="button"
              onClick={() => {
                if (onOpenJobTargeting) onOpenJobTargeting();
                else setCurrentView('job-targeting');
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer group ${
                currentView === 'job-targeting'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-emerald-50/60 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
                <span>{labels.jobTarget}</span>
              </div>
              <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md shadow-2xs ${
                currentView === 'job-targeting' ? 'bg-emerald-700 text-white' : 'bg-emerald-600 text-white'
              }`}>
                {labels.aiTag}
              </span>
            </button>

            {/* 2. Page Rédiger une Lettre IA */}
            <button
              type="button"
              onClick={() => {
                if (onOpenLetterGenerator) onOpenLetterGenerator();
                else setCurrentView('letter-generator');
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer group ${
                currentView === 'letter-generator'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-indigo-50/60 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 group-hover:scale-110 transition-transform" />
                <span>{labels.coverLetter}</span>
              </div>
              <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md shadow-2xs ${
                currentView === 'letter-generator' ? 'bg-indigo-700 text-white' : 'bg-indigo-600 text-white'
              }`}>
                {labels.aiTag}
              </span>
            </button>

            {/* 3. Section Mes CVs Modifiés / Adaptés */}
            {onOpenModifiedCVs && (
              <button
                type="button"
                onClick={() => {
                  onOpenModifiedCVs();
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer group"
              >
                <div className="flex items-center space-x-2.5">
                  <FileCheck className="w-4 h-4 text-emerald-500 shrink-0 group-hover:scale-110 transition-transform" />
                  <span>{labels.modifiedCvs}</span>
                </div>
              </button>
            )}

            {/* 4. Page Optimisation LinkedIn */}
            <button
              type="button"
              onClick={() => {
                if (onOpenLinkedInGenerator) onOpenLinkedInGenerator();
                else setCurrentView('linkedin');
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer group ${
                currentView === 'linkedin'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'bg-sky-50/60 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/60 text-sky-700 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800/60'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Linkedin className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 group-hover:scale-110 transition-transform" />
                <span>{labels.linkedIn}</span>
              </div>
              <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md shadow-2xs ${
                currentView === 'linkedin' ? 'bg-sky-700 text-white' : 'bg-sky-600 text-white'
              }`}>
                {labels.aiTag}
              </span>
            </button>

            {/* 5. Export PDF */}
            {onOpenExportPDF && (
              <button
                type="button"
                onClick={() => {
                  onOpenExportPDF();
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer group"
              >
                <div className="flex items-center space-x-2.5">
                  <Download className="w-4 h-4 text-blue-600 shrink-0 group-hover:scale-110 transition-transform" />
                  <span>{labels.exportPdf}</span>
                </div>
              </button>
            )}
          </div>

          {/* CONFIGURATION & PREFERENCES SECTION */}
          <div className="mx-4 my-2 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="flex items-center space-x-1.5 text-slate-400 dark:text-slate-400 text-[10px] font-black uppercase tracking-wider">
              <Settings className="w-3.5 h-3.5" />
              <span>{labels.settings}</span>
            </div>

            {/* Language Switcher */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-500" />
                <span>{labels.langLabel}</span>
              </label>
              <div className="grid grid-cols-3 gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setLangue('fr')}
                  className={`py-1.5 text-[11px] font-bold rounded-lg transition-all flex items-center justify-center space-x-1 cursor-pointer ${
                    langue === 'fr' 
                      ? 'bg-blue-600 text-white shadow-xs' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>🇫🇷</span>
                  <span>FR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLangue('en')}
                  className={`py-1.5 text-[11px] font-bold rounded-lg transition-all flex items-center justify-center space-x-1 cursor-pointer ${
                    langue === 'en' 
                      ? 'bg-blue-600 text-white shadow-xs' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>🇬🇧</span>
                  <span>EN</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLangue('ar')}
                  className={`py-1.5 text-[11px] font-bold rounded-lg transition-all flex items-center justify-center space-x-1 cursor-pointer ${
                    langue === 'ar' 
                      ? 'bg-blue-600 text-white shadow-xs' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>🇸🇦</span>
                  <span>AR</span>
                </button>
              </div>
            </div>

            {/* Dark / Light Mode Toggle */}
            <div className="pt-1">
              <button
                type="button"
                onClick={toggleDarkMode}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  {isDarkMode ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                  <span>{isDarkMode ? labels.darkMode : labels.lightMode}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {isDarkMode ? 'DARK' : 'LIGHT'}
                </span>
              </button>
            </div>
          </div>

          {/* DEMO PROFILES SWITCHER */}
          <div className="mx-4 my-2 p-3 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/60 space-y-2">
            <p className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 tracking-wider">
              {labels.demoProfiles}
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => { onQuickLoginDemo(); setIsOpen(false); }}
                className="px-2 py-1.5 text-[11px] font-extrabold bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-center space-x-1 cursor-pointer shadow-2xs"
              >
                <UserIcon className="w-3 h-3 text-blue-500" />
                <span>{labels.candidate}</span>
              </button>

              <button
                type="button"
                onClick={() => { onQuickLoginAdmin(); setIsOpen(false); }}
                className="px-2 py-1.5 text-[11px] font-extrabold bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-slate-700 text-purple-700 dark:text-purple-300 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-center space-x-1 cursor-pointer shadow-2xs"
              >
                <Shield className="w-3 h-3 text-purple-500" />
                <span>{labels.admin}</span>
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM USER STATUS & LOGOUT */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80">
          {user ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {user.nom.charAt(0).toUpperCase()}
                </div>
                <div className="truncate">
                  <p className="text-xs font-extrabold text-slate-900 dark:text-white truncate">{user.nom}</p>
                  <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => { onLogout(); setIsOpen(false); }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                title="Se déconnecter"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-slate-400 animate-ping" />
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Mode Démo Public</span>
              </div>
              <button
                type="button"
                onClick={() => { onQuickLoginDemo(); setIsOpen(false); }}
                className="text-xs font-extrabold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Connexion
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
