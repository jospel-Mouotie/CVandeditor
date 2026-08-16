import React from 'react';
import { Menu, Plus, Shield } from 'lucide-react';
import { Language, User } from '../types';
import { getTranslation } from '../i18n/translations';
import { AppView } from './Sidebar';

interface NavbarProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  langue: Language;
  onSelectLanguage?: (lang: Language) => void;
  onToggleSidebar: () => void;
  user: User | null;
  activeCvTitle?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  langue,
  onSelectLanguage,
  onToggleSidebar,
  user,
  activeCvTitle
}) => {
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(langue, key);

  const getViewTitle = () => {
    switch (currentView) {
      case 'home': return t('navHome');
      case 'dashboard': return t('navDashboard');
      case 'gallery': return t('navTemplates');
      case 'editor': return activeCvTitle ? `${t('editorTitle')}: ${activeCvTitle}` : t('editorTitle');
      case 'letters': return 'Mes Lettres de Motivation';
      case 'letter-generator': return 'Générateur de Lettre de Motivation';
      case 'job-targeting': return 'Cibler une Offre d\'Emploi & Personnalisation CV';
      case 'linkedin': return 'Optimisation Profil LinkedIn Pro';
      case 'admin': return t('navAdmin');
      default: return 'MYCV BUILDER';
    }
  };

  return (
    <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-2xs transition-colors duration-200">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Sidebar Toggle Button & View Context Title */}
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700 flex items-center gap-2 shadow-2xs"
            title="Ouvrir le menu"
          >
            <Menu className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-bold hidden sm:inline text-slate-700 dark:text-slate-300">Menu</span>
          </button>

          <div>
            <h1 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
              <span>{getViewTitle()}</span>
              {currentView === 'editor' && (
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-300 font-bold rounded-full border border-emerald-200 dark:border-emerald-800">
                  {t('autoSaveSaved')}
                </span>
              )}
            </h1>
          </div>
        </div>

        {/* Center/Right: Language Selector & Action CTA */}
        <div className="flex items-center space-x-3">
          
          {/* Language Selector Pills */}
          {onSelectLanguage && (
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
              <button
                type="button"
                onClick={() => onSelectLanguage('fr')}
                className={`px-2.5 py-1 text-xs font-extrabold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  langue === 'fr'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
                title="Français"
              >
                <span>🇫🇷</span>
                <span className="hidden md:inline">FR</span>
              </button>
              <button
                type="button"
                onClick={() => onSelectLanguage('en')}
                className={`px-2.5 py-1 text-xs font-extrabold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  langue === 'en'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
                title="English"
              >
                <span>🇬🇧</span>
                <span className="hidden md:inline">EN</span>
              </button>
              <button
                type="button"
                onClick={() => onSelectLanguage('ar')}
                className={`px-2.5 py-1 text-xs font-extrabold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  langue === 'ar'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
                title="العربية"
              >
                <span>🇸🇦</span>
                <span className="hidden md:inline">AR</span>
              </button>
            </div>
          )}

          {currentView !== 'gallery' && (
            <button
              type="button"
              onClick={() => setCurrentView('gallery')}
              className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center space-x-1.5 cursor-pointer active:scale-98"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">{t('createNewCV')}</span>
              <span className="sm:hidden">+</span>
            </button>
          )}

          {user?.role === 'ADMIN' && currentView !== 'admin' && (
            <button
              type="button"
              onClick={() => setCurrentView('admin')}
              className="px-3 py-2 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900 text-amber-700 dark:text-amber-300 font-bold text-xs rounded-xl border border-amber-200/80 dark:border-amber-800 transition-colors flex items-center space-x-1 cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Admin</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
