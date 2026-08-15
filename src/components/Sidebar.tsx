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
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  currentView: 'home' | 'dashboard' | 'gallery' | 'editor' | 'admin';
  setCurrentView: (view: 'home' | 'dashboard' | 'gallery' | 'editor' | 'admin') => void;
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
  onCreateBlankCV
}) => {
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(langue, key);

  const labels = {
    mainNav: langue === 'en' ? 'Main Navigation' : langue === 'ar' ? 'التنقل الرئيسي' : 'Navigation Principale',
    createBlankModel: langue === 'en' ? 'Create My Own Model' : langue === 'ar' ? 'إنشاء نموذجي الخاص' : 'Créer mon propre modèle',
    blankPageTag: langue === 'en' ? 'Blank Canvas' : langue === 'ar' ? 'صفحة بيضاء' : 'Page Blanche',
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
    { id: 'home', label: t('navHome'), icon: Home },
    { id: 'dashboard', label: t('navDashboard'), icon: LayoutDashboard },
    { id: 'gallery', label: t('navTemplates'), icon: Grid },
    { 
      id: 'editor', 
      label: langue === 'en' ? 'CV Editor' : langue === 'ar' ? 'محرر السيرة الذاتية' : 'Éditeur de CV', 
      icon: FileText 
    },
    ...(user?.role === 'ADMIN' ? [{ id: 'admin', label: t('navAdmin'), icon: Shield }] : [])
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
        <div>
          <div className="h-16 px-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
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
            <p className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider px-2 mb-2">
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
                    } else {
                      setCurrentView(item.id as any);
                    }
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
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
                className="w-full mt-2 flex items-center space-x-3 px-3.5 py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-600/10 via-blue-600/10 to-indigo-600/10 hover:from-emerald-600/20 hover:to-indigo-600/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 hover:border-emerald-500/60 transition-all cursor-pointer group shadow-2xs"
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

            {/* Dark Mode Toggle */}
            <div className="pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                {isDarkMode ? <Moon className="w-3.5 h-3.5 text-amber-400" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
                <span>{isDarkMode ? labels.darkMode : labels.lightMode}</span>
              </span>
              <button
                type="button"
                onClick={toggleDarkMode}
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                  isDarkMode ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
                }`}
                title="Basculer le thème"
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-md transform transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM USER PROFILE / LOGIN FOOTER */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          {user ? (
            <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center space-x-2.5 overflow-hidden">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                  {user.nom ? user.nom[0].toUpperCase() : 'U'}
                </div>
                <div className="overflow-hidden leading-tight">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">{user.nom}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  onLogout();
                  setIsOpen(false);
                }}
                className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors cursor-pointer"
                title={t('logout')}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-slate-400 text-center">{labels.demoProfiles}</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onQuickLoginDemo();
                    setIsOpen(false);
                  }}
                  className="py-2 px-2 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold text-[11px] rounded-xl border border-blue-200/60 dark:border-blue-800 transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>{labels.candidate}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onQuickLoginAdmin();
                    setIsOpen(false);
                  }}
                  className="py-2 px-2 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900 text-amber-700 dark:text-amber-300 font-bold text-[11px] rounded-xl border border-amber-200/60 dark:border-amber-800 transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>{labels.admin}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

