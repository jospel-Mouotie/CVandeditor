import React, { useEffect, useState } from 'react';
import { FileText, Sparkles, CheckCircle2, ShieldCheck, Zap, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SplashScreenProps {
  onFinish?: () => void;
  duration?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish, duration = 2200 }) => {
  const [progress, setProgress] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const onFinishRef = React.useRef(onFinish);
  onFinishRef.current = onFinish;

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(interval);
        setIsClosing(true);
        setTimeout(() => {
          if (onFinishRef.current) onFinishRef.current();
        }, 400);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [duration]);

  // Dynamic step message based on loading percentage
  const getStepMessage = () => {
    if (progress < 30) return { title: 'Initialisation du moteur de rendu', sub: 'Chargement des polices et des styles HD...' };
    if (progress < 65) return { title: 'Assemblage des modèles CV', sub: 'Configuration des sections & mises en page...' };
    if (progress < 90) return { title: 'Préparation du studio créatif', sub: 'Optimisation pour export PDF vectoriel...' };
    return { title: 'Prêt !', sub: 'Bienvenue sur MYCV BUILDER PRO' };
  };

  const currentStep = getStepMessage();

  return (
    <AnimatePresence>
      {!isClosing ? (
        <motion.div
          key="splash-container"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04, filter: 'blur(8px)' }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] bg-slate-950 text-white flex flex-col items-center justify-center p-6 select-none overflow-hidden"
        >
          {/* Dynamic Ambient Background Glows */}
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-gradient-to-tr from-blue-600/15 via-violet-600/10 to-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Grid pattern overlay */}
          <div 
            className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]"
          />

          {/* Main Card / Emblem Container */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex flex-col items-center text-center max-w-md w-full"
          >
            {/* High-End Animated Brand Emblem */}
            <div className="relative w-28 h-28 mb-7 flex items-center justify-center">
              {/* Outer Glowing Rotating Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
                className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-blue-500/30 via-indigo-500/10 to-amber-400/30 blur-md pointer-events-none"
              />

              {/* Animated Dashed Tech Ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
                className="absolute -inset-3 rounded-full border border-dashed border-blue-400/25 pointer-events-none"
              />

              {/* Central Logo Box with Glassmorphism */}
              <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/95 to-slate-800/90 p-[1.5px] shadow-2xl shadow-blue-500/20 backdrop-blur-xl border border-white/15">
                <div className="w-full h-full rounded-[14px] bg-gradient-to-br from-blue-600/20 via-indigo-600/30 to-slate-900/80 flex flex-col items-center justify-center p-3 relative overflow-hidden">
                  
                  {/* Glass Shimmer Bar */}
                  <motion.div
                    animate={{
                      x: ['-150%', '200%']
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2.5,
                      ease: 'easeInOut',
                      repeatDelay: 0.5
                    }}
                    className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-25 pointer-events-none"
                  />

                  {/* CV Document Hologram Mini-Badge */}
                  <div className="relative flex items-center justify-center">
                    <div className="w-11 h-13 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 p-1 flex flex-col items-center justify-between shadow-lg border border-white/25">
                      <FileText className="w-5 h-5 text-white" />
                      <div className="w-full space-y-0.75 px-0.5 mb-0.5">
                        <div className="w-full h-0.5 bg-white/90 rounded-full" />
                        <div className="w-3/4 h-0.5 bg-white/70 rounded-full" />
                        <div className="w-1/2 h-0.5 bg-white/50 rounded-full" />
                      </div>
                    </div>
                    {/* Floating Sparkle on Logo */}
                    <motion.div
                      animate={{ scale: [1, 1.3, 1], rotate: [0, 15, -15, 0] }}
                      transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                      className="absolute -top-1.5 -right-2 bg-gradient-to-tr from-amber-400 to-amber-300 text-slate-950 p-1 rounded-full shadow-md"
                    >
                      <Sparkles className="w-2.5 h-2.5" />
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>

            {/* Brand Title & Tagline */}
            <div className="space-y-1.5 mb-6">
              <div className="flex items-center justify-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  MYCV <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-amber-300 bg-clip-text text-transparent">BUILDER</span>
                </h1>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 backdrop-blur-sm shadow-xs">
                  PRO HD
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Générateur de CV Professionnel & Export PDF Haute Définition
              </p>
            </div>

            {/* Step Status Live Indicator */}
            <div className="h-10 flex flex-col items-center justify-center mb-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep.title}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-0.5"
                >
                  <p className="text-xs font-bold text-slate-200 flex items-center justify-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping inline-block" />
                    {currentStep.title}
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium">
                    {currentStep.sub}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Precision Loading Progress Bar */}
            <div className="w-full max-w-xs space-y-2 mb-6">
              <div className="relative w-full bg-slate-900/90 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-800 shadow-inner">
                {/* Progress bar fill */}
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-500 to-amber-400 relative shadow-sm"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: 'easeOut', duration: 0.1 }}
                >
                  {/* Glowing Leading Head */}
                  <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/80 rounded-full shadow-[0_0_8px_#fff]" />
                </motion.div>
              </div>

              <div className="flex justify-between items-center text-[11px] font-semibold text-slate-400 px-1">
                <span className="text-slate-500 font-mono text-[10px]">MYCVBUILDER-PRO v2.0</span>
                <span className="text-amber-400 font-mono font-bold">{progress}%</span>
              </div>
            </div>

            {/* Feature Highlight Badges */}
            <div className="flex flex-wrap justify-center gap-2 text-[10px] font-medium text-slate-400">
              <span className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-800/80 shadow-xs">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Modèles ATS
              </span>
              <span className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-800/80 shadow-xs">
                <Download className="w-3 h-3 text-blue-400" /> Export PDF HD
              </span>
              <span className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-800/80 shadow-xs">
                <Zap className="w-3 h-3 text-amber-400" /> Éditeur Visuel
              </span>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};
