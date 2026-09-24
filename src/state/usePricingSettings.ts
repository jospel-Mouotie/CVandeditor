import { useState, useEffect, useCallback } from 'react';
import { Language } from '../types';

export interface PricingPlan {
  id: string;
  code: 'decouverte' | 'classique' | 'premium' | string;
  nom: string;
  prix: number; // in FCFA (base)
  prixUsd?: number;
  devise: string;
  dureeJours: number;
  description: string;
  actif: boolean;
}

export interface AppSettingsData {
  paiementActif: boolean;
  pricingPlans: PricingPlan[];
}

const DEFAULT_SETTINGS: AppSettingsData = {
  paiementActif: true,
  pricingPlans: [
    {
      id: 'plan-decouverte',
      code: 'decouverte',
      nom: 'Pack Découverte',
      prix: 1000,
      prixUsd: 1.70,
      devise: 'FCFA',
      dureeJours: 7,
      description: 'Accès illimité aux 59+ modèles HD et au Creator Studio pendant 7 jours',
      actif: true
    },
    {
      id: 'plan-classique',
      code: 'classique',
      nom: 'Pack Classique',
      prix: 2500,
      prixUsd: 4.20,
      devise: 'FCFA',
      dureeJours: 30,
      description: 'Accès illimité aux 59+ modèles HD et au Creator Studio complet pendant 1 mois',
      actif: true
    },
    {
      id: 'plan-premium',
      code: 'premium',
      nom: 'Pack Premium VIP',
      prix: 5000,
      prixUsd: 8.50,
      devise: 'FCFA',
      dureeJours: 30,
      description: 'Suite IA complète : Ciblage offres, Lettres de motivation, Profil LinkedIn pendant 1 mois',
      actif: true
    }
  ]
};

// Global cache to avoid flicker
let cachedSettings: AppSettingsData = DEFAULT_SETTINGS;
const listeners = new Set<() => void>();

export function usePricingSettings() {
  const [settings, setSettings] = useState<AppSettingsData>(cachedSettings);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/app-settings');
      if (res.ok) {
        const data = await res.json();
        const updated: AppSettingsData = {
          paiementActif: data.paiementActif ?? true,
          pricingPlans: (data.pricingPlans && data.pricingPlans.length > 0)
            ? data.pricingPlans.map((p: PricingPlan) => ({
                ...p,
                prixUsd: p.prixUsd || Math.round((p.prix / 600) * 100) / 100
              }))
            : DEFAULT_SETTINGS.pricingPlans
        };
        cachedSettings = updated;
        if (typeof window !== 'undefined') {
          localStorage.setItem('app_settings_paiementActif', String(updated.paiementActif));
          window.dispatchEvent(new CustomEvent('app_settings_updated'));
        }
        setSettings(updated);
        listeners.forEach(cb => cb());
      }
    } catch (e) {
      console.warn('Failed to fetch app settings, using fallback', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const handler = () => setSettings({ ...cachedSettings });
    listeners.add(handler);
    fetchSettings();
    return () => {
      listeners.delete(handler);
    };
  }, [fetchSettings]);

  // Helper to format price with USD first, then FCFA
  const formatPlanPrice = (planCode: string, currencyMode: 'usd-first' | 'usd' | 'fcfa' = 'usd-first', langue: Language = 'fr') => {
    const plan = settings.pricingPlans.find(p => p.code === planCode) || 
      DEFAULT_SETTINGS.pricingPlans.find(p => p.code === planCode) || {
        prix: 2500,
        prixUsd: 4.20,
        dureeJours: 30
      };
    
    const fcfa = plan.prix;
    const usd = plan.prixUsd || Math.round((fcfa / 600) * 100) / 100;
    const durationDays = plan.dureeJours || 30;
    const durationLabel = durationDays === 7
      ? (langue === 'en' ? '7 days' : langue === 'ar' ? '7 أيام' : '7 jours (1 semaine)')
      : (langue === 'en' ? 'month' : langue === 'ar' ? 'شهر' : 'mois');

    if (currencyMode === 'usd') {
      return {
        primary: `$${usd.toFixed(2)} USD`,
        secondary: `${fcfa.toLocaleString('fr-FR')} FCFA`,
        fullLabel: `$${usd.toFixed(2)} USD / ${durationLabel} (${fcfa.toLocaleString('fr-FR')} FCFA)`
      };
    }

    if (currencyMode === 'fcfa') {
      return {
        primary: `${fcfa.toLocaleString('fr-FR')} FCFA`,
        secondary: `$${usd.toFixed(2)} USD`,
        fullLabel: `${fcfa.toLocaleString('fr-FR')} FCFA / ${durationLabel} (~ $${usd.toFixed(2)} USD)`
      };
    }

    // Default: USD FIRST
    return {
      primary: `$${usd.toFixed(2)} USD`,
      secondary: `${fcfa.toLocaleString('fr-FR')} FCFA`,
      fullLabel: `$${usd.toFixed(2)} USD (${fcfa.toLocaleString('fr-FR')} FCFA) / ${durationLabel}`
    };
  };

  return {
    settings,
    loading,
    paiementActif: settings.paiementActif,
    pricingPlans: settings.pricingPlans,
    refreshSettings: fetchSettings,
    formatPlanPrice
  };
}
