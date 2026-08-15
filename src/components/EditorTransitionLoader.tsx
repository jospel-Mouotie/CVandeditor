import React from 'react';
import { Language } from '../types';
import { Loader2, Sparkles, FileText } from 'lucide-react';

interface EditorTransitionLoaderProps {
  message?: string;
  langue?: Language;
}

export const EditorTransitionLoader: React.FC<EditorTransitionLoaderProps> = ({
  message,
  langue = 'fr'
}) => {
  const defaultText = 
    langue === 'en' ? 'Preparing your CV editor & step-by-step form...' :
    langue === 'ar' ? 'جاري إعداد محرر السيرة الذاتية ونموذج التعبئة...' :
    'Préparation de votre éditeur de CV et du formulaire...';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
      <div className="relative">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 p-0.5 shadow-2xl shadow-blue-500/30 animate-pulse">
          <div className="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center">
            <FileText className="w-9 h-9 text-blue-400 animate-bounce" />
          </div>
        </div>
        <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-xl shadow-lg animate-spin">
          <Loader2 className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-6 max-w-sm space-y-2">
        <h3 className="text-base font-black text-white tracking-tight flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{message || defaultText}</span>
        </h3>
        <p className="text-xs text-slate-400 font-medium">
          {langue === 'en' ? 'Loading high-definition layout and form wizard...' :
           langue === 'ar' ? 'تحميل التخطيط عالي الدقة ومساعد التعبئة...' :
           'Chargement du modèle haute définition et du mode assistant...'}
        </p>
      </div>

      <div className="mt-6 w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 rounded-full animate-[shimmer_1.5s_infinite_linear] w-full" />
      </div>
    </div>
  );
};
