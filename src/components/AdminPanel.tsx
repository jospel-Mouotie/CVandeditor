import React, { useState, useEffect } from 'react';
import { Payment, Language } from '../types';
import { getTranslation } from '../i18n/translations';
import { CV_TEMPLATES } from '../data/templates';
import { FREE_TEMPLATE_IDS } from '../utils/subscriptionGates';
import { 
  getAdminPaidMatrixConfig, 
  saveAdminPaidMatrixConfig, 
  AdminPaidMatrixConfig,
  STUDIO_17_MENUS
} from '../utils/adminPaidMatrix';
import { 
  Shield, 
  CheckCircle2, 
  XCircle, 
  Search, 
  RefreshCw, 
  Clock, 
  Check, 
  ToggleLeft, 
  ToggleRight, 
  DollarSign, 
  Edit2, 
  Save, 
  Users, 
  Sparkles,
  Calendar,
  CreditCard,
  Lock,
  Unlock,
  Palette,
  Type,
  Layout,
  Layers,
  Sliders,
  FileText,
  AlertTriangle,
  Bell,
  Send
} from 'lucide-react';
import { AdminNotificationsTab } from './AdminNotificationsTab';

interface AdminPanelProps {
  langue: Language;
  onRefresh: () => void;
}

interface PricingPlanSetting {
  id: string;
  code: string;
  nom: string;
  prix: number;
  prixUsd?: number;
  devise: string;
  dureeJours: number;
  description: string;
  actif: boolean;
}

interface UserSubscription {
  userId: string;
  userName: string;
  userEmail: string;
  role: string;
  subscriptionTier: string;
  subscriptionExpiresAt: string | null;
  isExpired: boolean;
  remainingDays: number;
  createdAt: string;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ langue, onRefresh }) => {
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(langue, key);

  const [activeTab, setActiveTab] = useState<'payments' | 'subscriptions' | 'pricing' | 'matrix' | 'notifications'>('payments');
  const [payments, setPayments] = useState<Payment[]>([]);
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'EN_ATTENTE' | 'ALL'>('EN_ATTENTE');
  const [searchQuery, setSearchQuery] = useState('');
  const [rejectionNote, setRejectionNote] = useState<{ id: string; note: string } | null>(null);

  // Admin Paid Matrix state
  const [matrixConfig, setMatrixConfig] = useState<AdminPaidMatrixConfig>(getAdminPaidMatrixConfig());

  // Helper to detect free template conflicts
  const getFreeTemplateConflicts = (itemType: 'font' | 'menu' | 'subOption' | 'pattern', itemId: string): string[] => {
    const freeTemplates = CV_TEMPLATES.filter(t => FREE_TEMPLATE_IDS.includes(t.id));
    const matchedNames: string[] = [];

    if (itemType === 'font') {
      freeTemplates.forEach(t => {
        if (t.defaultFont === itemId) {
          matchedNames.push(t.name);
        }
      });
    } else if (itemType === 'menu') {
      if (['template', 'colors', 'typography', 'header', 'sectionHeaders', 'photo', 'badges'].includes(itemId)) {
        freeTemplates.slice(0, 4).forEach(t => matchedNames.push(t.name));
      }
    } else if (itemType === 'subOption') {
      if (
        itemId === 'template:column_layout' ||
        itemId === 'typography:font_family' ||
        itemId === 'typography:text_size' ||
        itemId === 'typography:heading_size' ||
        itemId === 'sectionHeaders:underline' ||
        itemId === 'header:banner'
      ) {
        freeTemplates.slice(0, 4).forEach(t => matchedNames.push(t.name));
      }
    }

    return Array.from(new Set(matchedNames));
  };

  const [conflictModal, setConflictModal] = useState<{
    itemName: string;
    itemType: 'font' | 'menu' | 'subOption' | 'pattern';
    itemId: string;
    affectedTemplates: string[];
    onConfirm: () => void;
  } | null>(null);

  const toggleFontPaid = (fontName: string) => {
    const isPaid = matrixConfig.paidFonts.includes(fontName);
    const executeToggle = () => {
      const updatedFonts = isPaid
        ? matrixConfig.paidFonts.filter(f => f !== fontName)
        : [...matrixConfig.paidFonts, fontName];
      const newConfig = { ...matrixConfig, paidFonts: updatedFonts };
      setMatrixConfig(newConfig);
      saveAdminPaidMatrixConfig(newConfig);
    };

    if (!isPaid) {
      const conflicts = getFreeTemplateConflicts('font', fontName);
      if (conflicts.length > 0) {
        setConflictModal({
          itemName: `Police ${fontName}`,
          itemType: 'font',
          itemId: fontName,
          affectedTemplates: conflicts,
          onConfirm: executeToggle
        });
        return;
      }
    }
    executeToggle();
  };

  const toggleStudioMenuPaid = (menuId: string, menuLabel?: string) => {
    const currentMenus = matrixConfig.paidStudioMenus || [];
    const isPaid = currentMenus.includes(menuId);
    const executeToggle = () => {
      const updatedMenus = isPaid
        ? currentMenus.filter(m => m !== menuId)
        : [...currentMenus, menuId];
      const newConfig = { ...matrixConfig, paidStudioMenus: updatedMenus };
      setMatrixConfig(newConfig);
      saveAdminPaidMatrixConfig(newConfig);
    };

    if (!isPaid) {
      const conflicts = getFreeTemplateConflicts('menu', menuId);
      if (conflicts.length > 0) {
        setConflictModal({
          itemName: `Menu ${menuLabel || menuId}`,
          itemType: 'menu',
          itemId: menuId,
          affectedTemplates: conflicts,
          onConfirm: executeToggle
        });
        return;
      }
    }
    executeToggle();
  };

  const toggleSubOptionPaid = (subOptionId: string, subLabel?: string) => {
    const currentSub = matrixConfig.paidSubOptions || [];
    const isPaid = currentSub.includes(subOptionId);
    const executeToggle = () => {
      const updatedSub = isPaid
        ? currentSub.filter(s => s !== subOptionId)
        : [...currentSub, subOptionId];
      const newConfig = { ...matrixConfig, paidSubOptions: updatedSub };
      setMatrixConfig(newConfig);
      saveAdminPaidMatrixConfig(newConfig);
    };

    if (!isPaid) {
      const conflicts = getFreeTemplateConflicts('subOption', subOptionId);
      if (conflicts.length > 0) {
        setConflictModal({
          itemName: `Option ${subLabel || subOptionId}`,
          itemType: 'subOption',
          itemId: subOptionId,
          affectedTemplates: conflicts,
          onConfirm: executeToggle
        });
        return;
      }
    }
    executeToggle();
  };

  const togglePatternPaid = (patternName: string) => {
    const isPaid = matrixConfig.paidPatterns.includes(patternName);
    const updatedPatterns = isPaid
      ? matrixConfig.paidPatterns.filter(p => p !== patternName)
      : [...matrixConfig.paidPatterns, patternName];
    const newConfig = { ...matrixConfig, paidPatterns: updatedPatterns };
    setMatrixConfig(newConfig);
    saveAdminPaidMatrixConfig(newConfig);
  };

  // App Settings state
  const [paiementActif, setPaiementActif] = useState<boolean>(true);
  const [pricingPlans, setPricingPlans] = useState<PricingPlanSetting[]>([]);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [editPlanForm, setEditPlanForm] = useState<Partial<PricingPlanSetting>>({});
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [templateSearchQuery, setTemplateSearchQuery] = useState<string>('');

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('cv_builder_token');
      const res = await fetch('/api/admin/paiements', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPayments(data.payments || []);
      }
    } catch (err) {
      console.error('Error fetching payments:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscriptions = async () => {
    try {
      const token = localStorage.getItem('cv_builder_token');
      const res = await fetch('/api/admin/subscriptions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSubscriptions(data.subscriptions || []);
      }
    } catch (err) {
      console.error('Error fetching subscriptions:', err);
    }
  };

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('cv_builder_token');
      const res = await fetch('/api/admin/settings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.appSettings) {
          setPaiementActif(data.appSettings.paiementActif);
          setPricingPlans(data.appSettings.pricingPlans || []);
        }
      }
    } catch (err) {
      console.error('Error fetching admin settings:', err);
    }
  };

  useEffect(() => {
    fetchPayments();
    fetchSubscriptions();
    fetchSettings();
  }, []);

  const handleTogglePaymentSwitch = async () => {
    const nextVal = !paiementActif;
    setPaiementActif(nextVal);
    localStorage.setItem('app_settings_paiementActif', String(nextVal));
    window.dispatchEvent(new CustomEvent('app_settings_updated'));
    try {
      const token = localStorage.getItem('cv_builder_token');
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ paiementActif: nextVal, pricingPlans })
      });
      setSaveSuccessMsg(`Statut paiement mis à jour : ${nextVal ? 'ACTIVÉ' : 'DÉSACTIVÉ (100% GRATUIT)'}`);
      setTimeout(() => setSaveSuccessMsg(null), 3000);
      onRefresh();
    } catch (err) {
      console.error('Error updating payment toggle:', err);
    }
  };

  const savePlansToServer = async (plansToSave: PricingPlanSetting[]) => {
    setPricingPlans(plansToSave);
    localStorage.setItem('app_settings_pricingPlans', JSON.stringify(plansToSave));
    window.dispatchEvent(new CustomEvent('app_settings_updated'));

    try {
      const token = localStorage.getItem('cv_builder_token');
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ paiementActif, pricingPlans: plansToSave })
      });
      setSaveSuccessMsg('Offres et forfaits mis à jour avec succès.');
      setTimeout(() => setSaveSuccessMsg(null), 3000);
      onRefresh();
    } catch (err) {
      console.error('Error updating plan settings:', err);
    }
  };

  const handleTogglePlanActif = (planId: string) => {
    const updated = pricingPlans.map(p =>
      p.id === planId ? { ...p, actif: p.actif === false ? true : false } : p
    );
    savePlansToServer(updated);
  };

  const handleStartEditPlan = (plan: PricingPlanSetting) => {
    setEditingPlanId(plan.id);
    setEditPlanForm({ ...plan });
  };

  const handleSavePlanDetails = (planId: string) => {
    const updated = pricingPlans.map(p =>
      p.id === planId ? ({ ...p, ...editPlanForm } as PricingPlanSetting) : p
    );
    setEditingPlanId(null);
    setEditPlanForm({});
    savePlansToServer(updated);
  };

  const handleAddNewPlan = () => {
    const newId = `plan-${Date.now()}`;
    const newPlan: PricingPlanSetting = {
      id: newId,
      code: `custom-${Date.now()}`,
      nom: 'Nouveau Pack',
      prix: 2000,
      prixUsd: 3.50,
      devise: 'FCFA',
      dureeJours: 14,
      description: 'Description de la nouvelle offre d\'abonnement',
      actif: true
    };
    const updated = [...pricingPlans, newPlan];
    setEditingPlanId(newId);
    setEditPlanForm(newPlan);
    savePlansToServer(updated);
  };

  const toggleTemplatePaid = (templateId: string) => {
    const currentPaid = matrixConfig.paidTemplates || [];
    const isPaid = currentPaid.includes(templateId);
    const updatedTemplates = isPaid
      ? currentPaid.filter(id => id !== templateId)
      : [...currentPaid, templateId];
    const newConfig = { ...matrixConfig, paidTemplates: updatedTemplates };
    setMatrixConfig(newConfig);
    saveAdminPaidMatrixConfig(newConfig);
  };

  const handleValidate = async (id: string) => {
    try {
      const token = localStorage.getItem('cv_builder_token');
      const res = await fetch(`/api/admin/paiement/${id}/valider`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchPayments();
        fetchSubscriptions();
        onRefresh();
      }
    } catch (err) {
      console.error('Error validating payment:', err);
    }
  };

  const handleReject = async (id: string) => {
    try {
      const token = localStorage.getItem('cv_builder_token');
      const res = await fetch(`/api/admin/paiement/${id}/rejeter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ noteAdmin: rejectionNote?.note || 'Invalide' })
      });
      if (res.ok) {
        setRejectionNote(null);
        fetchPayments();
        onRefresh();
      }
    } catch (err) {
      console.error('Error rejecting payment:', err);
    }
  };

  const safePayments = Array.isArray(payments) ? payments : [];
  const filteredPayments = safePayments.filter(p => {
    const matchesStatus = filterStatus === 'ALL' || p.statut === filterStatus;
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      (p.referenceTransaction || '').toLowerCase().includes(query) ||
      (p.numeroExpediteur || '').toLowerCase().includes(query) ||
      (p.userEmail && p.userEmail.toLowerCase().includes(query)) ||
      (p.userName && p.userName.toLowerCase().includes(query));
    
    return matchesStatus && matchesSearch;
  });

  const filteredSubscriptions = subscriptions.filter(s => {
    const query = searchQuery.toLowerCase();
    return s.userName.toLowerCase().includes(query) || s.userEmail.toLowerCase().includes(query);
  });

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 bg-white dark:bg-black text-black dark:text-white">
      
      {/* Header */}
      <div className="flex flex-row items-center justify-between gap-3 bg-white dark:bg-neutral-950 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xs">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black text-black dark:text-white">{t('adminTitle')}</h1>
            <p className="text-[11px] text-neutral-500 font-medium">Gestion des paiements, forfaits et contrôle des accès</p>
          </div>
        </div>

        <button
          onClick={() => { fetchPayments(); fetchSubscriptions(); fetchSettings(); }}
          className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-black dark:text-white text-xs font-bold rounded-lg transition-colors flex items-center space-x-1.5 border border-neutral-300 dark:border-neutral-700 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Actualiser</span>
        </button>
      </div>

      {saveSuccessMsg && (
        <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-lg text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* GLOBAL SETTINGS & PRICING PLANS CONTROL CARD */}
      <div className="bg-neutral-950 text-white p-4 sm:p-5 rounded-xl border border-neutral-800 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">Mode de Paiement Global</h2>
          </div>

          <button
            onClick={handleTogglePaymentSwitch}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg font-black text-xs transition-all cursor-pointer border ${
              paiementActif
                ? 'bg-white text-black border-neutral-200 shadow-xs hover:bg-neutral-100'
                : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-400 border-neutral-700'
            }`}
          >
            {paiementActif ? <ToggleRight className="w-4 h-4 text-black" /> : <ToggleLeft className="w-4 h-4 text-neutral-500" />}
            <span>PAIEMENT : {paiementActif ? 'ACTIVÉ (PAYANT)' : 'DÉSACTIVÉ (GRATUIT)'}</span>
          </button>
        </div>

        {/* PRICING PLANS TABLE */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-amber-400" />
              <span>Forfaits d'Abonnement ({pricingPlans.length})</span>
            </h3>
            <button
              type="button"
              onClick={handleAddNewPlan}
              className="px-2.5 py-1 rounded-lg bg-white text-black hover:bg-neutral-200 text-xs font-black flex items-center gap-1 transition-all cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3 h-3" />
              <span>+ Pack</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {pricingPlans.map((plan) => {
              const isEditing = editingPlanId === plan.id;
              const isActif = plan.actif !== false;

              return (
                <div
                  key={plan.id}
                  className={`p-3 rounded-lg border space-y-2 transition-all ${
                    isActif
                      ? 'bg-black border-neutral-800 shadow-xs'
                      : 'bg-neutral-900/40 border-neutral-800/60 opacity-60'
                  }`}
                >
                  {/* Top Bar */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
                        isActif ? 'bg-amber-400 text-black' : 'bg-neutral-800 text-neutral-400'
                      }`}>
                        {plan.code.toUpperCase()}
                      </span>
                      {!isEditing && (
                        <span className="font-extrabold text-xs text-white truncate max-w-[120px]">
                          {plan.nom}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Active/Inactive Toggle */}
                      <button
                        type="button"
                        onClick={() => handleTogglePlanActif(plan.id)}
                        className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase transition-all cursor-pointer ${
                          isActif
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                            : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                        }`}
                      >
                        {isActif ? 'Actif' : 'Inactif'}
                      </button>

                      {isEditing ? (
                        <button
                          type="button"
                          onClick={() => handleSavePlanDetails(plan.id)}
                          className="px-2 py-0.5 rounded bg-white text-black text-xs font-black flex items-center gap-1 cursor-pointer"
                        >
                          <Save className="w-3 h-3" />
                          <span>Enregistrer</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleStartEditPlan(plan)}
                          className="px-2 py-0.5 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-bold border border-neutral-700 cursor-pointer flex items-center gap-1"
                        >
                          <Edit2 className="w-2.5 h-2.5" />
                          <span>Modifier</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Edit Form or View Display */}
                  {isEditing ? (
                    <div className="space-y-1.5 pt-1.5 border-t border-neutral-800 text-xs">
                      <input
                        type="text"
                        placeholder="Nom du pack"
                        value={editPlanForm.nom || ''}
                        onChange={(e) => setEditPlanForm({ ...editPlanForm, nom: e.target.value })}
                        className="w-full px-2 py-1 bg-neutral-900 border border-neutral-700 rounded text-white font-bold text-xs"
                      />

                      <div className="grid grid-cols-2 gap-1.5">
                        <input
                          type="number"
                          placeholder="Prix FCFA"
                          value={editPlanForm.prix || 0}
                          onChange={(e) => setEditPlanForm({ ...editPlanForm, prix: Number(e.target.value) })}
                          className="w-full px-2 py-1 bg-neutral-900 border border-neutral-700 rounded text-white font-bold text-xs"
                        />
                        <input
                          type="number"
                          step="0.1"
                          placeholder="Prix USD ($)"
                          value={editPlanForm.prixUsd || 0}
                          onChange={(e) => setEditPlanForm({ ...editPlanForm, prixUsd: Number(e.target.value) })}
                          className="w-full px-2 py-1 bg-neutral-900 border border-neutral-700 rounded text-white font-bold text-xs"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-1.5">
                        <input
                          type="number"
                          placeholder="Durée (jours)"
                          value={editPlanForm.dureeJours || 30}
                          onChange={(e) => setEditPlanForm({ ...editPlanForm, dureeJours: Number(e.target.value) })}
                          className="w-full px-2 py-1 bg-neutral-900 border border-neutral-700 rounded text-white font-bold text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Description"
                          value={editPlanForm.description || ''}
                          onChange={(e) => setEditPlanForm({ ...editPlanForm, description: e.target.value })}
                          className="w-full px-2 py-1 bg-neutral-900 border border-neutral-700 rounded text-white text-xs"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between border-t border-neutral-800/80 pt-1.5 text-xs">
                      <div>
                        <span className="font-black text-white text-sm">
                          ${(plan.prixUsd || Math.round((plan.prix / 600) * 100) / 100).toFixed(2)}
                        </span>
                        <span className="text-[11px] font-bold text-neutral-400 ml-1.5">
                          {plan.prix.toLocaleString('fr-FR')} FCFA
                        </span>
                      </div>
                      <span className="text-[10px] text-neutral-400 font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" />
                        {plan.dureeJours}j
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* KPI DASHBOARD SUMMARY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        <div className="bg-white dark:bg-neutral-950 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xs">
          <div className="text-[10px] font-black uppercase text-neutral-500">Chiffre d'Affaires</div>
          <div className="text-lg font-black text-black dark:text-white mt-0.5">
            {(safePayments.filter(p => p.statut === 'VALIDE').reduce((acc, p) => acc + (p.montant || 2500), 0)).toLocaleString('fr-FR')} FCFA
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-950 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xs">
          <div className="text-[10px] font-black uppercase text-neutral-500">En Attente</div>
          <div className="text-lg font-black text-black dark:text-white mt-0.5">
            {safePayments.filter(p => p.statut === 'EN_ATTENTE').length}
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-950 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xs">
          <div className="text-[10px] font-black uppercase text-neutral-500">Abonnements Actifs</div>
          <div className="text-lg font-black text-black dark:text-white mt-0.5">
            {subscriptions.filter(s => s.subscriptionTier !== 'freemium' && !s.isExpired).length}
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-950 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xs">
          <div className="text-[10px] font-black uppercase text-neutral-500">Rejetés</div>
          <div className="text-lg font-black text-black dark:text-white mt-0.5">
            {safePayments.filter(p => p.statut === 'REJETE').length}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-2.5">
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'payments'
                ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Paiements ({safePayments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'subscriptions'
                ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Abonnements ({subscriptions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'matrix'
                ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                : 'bg-black/5 dark:bg-white/10 text-black/70 dark:text-white/70 hover:bg-black/10 dark:hover:bg-white/15'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Matrice des Accès Payants</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'notifications'
                ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                : 'bg-black/5 dark:bg-white/10 text-black/70 dark:text-white/70 hover:bg-black/10 dark:hover:bg-white/15'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Diffusions & Mails</span>
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-neutral-400" />
          <input
            type="text"
            placeholder="Recherche..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-black dark:text-white placeholder-neutral-400 rounded-lg outline-hidden focus:border-black dark:focus:border-white"
          />
        </div>
      </div>

      {/* TAB 1: PAYMENTS */}
      {activeTab === 'payments' && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('EN_ATTENTE')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                filterStatus === 'EN_ATTENTE'
                  ? 'bg-black text-white dark:bg-white dark:text-black'
                  : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400'
              }`}
            >
              En attente ({safePayments.filter(p => p.statut === 'EN_ATTENTE').length})
            </button>
            <button
              onClick={() => setFilterStatus('ALL')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                filterStatus === 'ALL'
                  ? 'bg-black text-white dark:bg-white dark:text-black'
                  : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400'
              }`}
            >
              Tous les paiements ({safePayments.length})
            </button>
          </div>

          <div className="bg-white dark:bg-neutral-950 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-neutral-400 text-sm">Chargement des données...</div>
            ) : filteredPayments.length === 0 ? (
              <div className="p-12 text-center text-neutral-400 text-sm">
                Aucun paiement trouvé
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-neutral-600 dark:text-neutral-300">
                  <thead className="bg-neutral-50 dark:bg-neutral-900 text-black dark:text-white font-black border-b border-neutral-200 dark:border-neutral-800 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Utilisateur</th>
                      <th className="px-4 py-3">Réf. Transaction</th>
                      <th className="px-4 py-3">Forfait</th>
                      <th className="px-4 py-3">Montant</th>
                      <th className="px-4 py-3">Statut</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                    {filteredPayments.map((p) => (
                      <tr key={p.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                        <td className="px-4 py-3 font-mono whitespace-nowrap">
                          {new Date(p.createdAt).toLocaleDateString()} {new Date(p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>

                        <td className="px-4 py-3">
                          <p className="font-bold text-black dark:text-white">{p.userName || 'Utilisateur'}</p>
                          <p className="text-[11px] text-neutral-400">{p.userEmail}</p>
                        </td>

                        <td className="px-4 py-3 font-mono font-bold text-black dark:text-white">
                          {p.referenceTransaction || p.id}
                        </td>

                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white border border-neutral-300 dark:border-neutral-700">
                            {p.planTier ? p.planTier.toUpperCase() : 'CLASSIQUE'}
                          </span>
                        </td>

                        <td className="px-4 py-3 font-bold text-black dark:text-white whitespace-nowrap">
                          {(p.montant || 2500).toLocaleString('fr-FR')} FCFA
                        </td>

                        <td className="px-4 py-3 whitespace-nowrap">
                          {p.statut === 'VALIDE' && (
                            <span className="font-bold px-2.5 py-1 rounded-full text-[10px] inline-flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white border border-neutral-300 dark:border-neutral-700">
                              <CheckCircle2 className="w-3 h-3" />
                              Validé (1 Mois)
                            </span>
                          )}
                          {p.statut === 'EN_ATTENTE' && (
                            <span className="font-bold px-2.5 py-1 rounded-full text-[10px] inline-flex items-center gap-1 bg-black text-white dark:bg-white dark:text-black">
                              <Clock className="w-3 h-3 animate-pulse" />
                              En attente
                            </span>
                          )}
                          {p.statut === 'REJETE' && (
                            <span className="font-bold px-2.5 py-1 rounded-full text-[10px] inline-flex items-center gap-1 bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                              <XCircle className="w-3 h-3" />
                              Rejeté
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          {p.statut === 'EN_ATTENTE' ? (
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => handleValidate(p.id)}
                                className="bg-black hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-black font-black px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center space-x-1 cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Valider (1 Mois)</span>
                              </button>

                              <button
                                onClick={() => setRejectionNote({ id: p.id, note: '' })}
                                className="bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold px-2.5 py-1.5 rounded-lg text-xs transition-colors border border-neutral-300 dark:border-neutral-700 cursor-pointer"
                              >
                                Rejeter
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-neutral-400 font-medium">Traité</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: USER SUBSCRIPTIONS (1 MOIS) */}
      {activeTab === 'subscriptions' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-neutral-950 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-600 dark:text-neutral-300">
                <thead className="bg-neutral-50 dark:bg-neutral-900 text-black dark:text-white font-black border-b border-neutral-200 dark:border-neutral-800 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-4 py-3">Utilisateur</th>
                    <th className="px-4 py-3">Rôle</th>
                    <th className="px-4 py-3">Forfait Actif</th>
                    <th className="px-4 py-3">Validité / Durée</th>
                    <th className="px-4 py-3">Date d'Expiration (1 Mois)</th>
                    <th className="px-4 py-3 text-right">Statut Abonnement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {filteredSubscriptions.map((sub) => (
                    <tr key={sub.userId} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-bold text-black dark:text-white">{sub.userName}</p>
                        <p className="text-[11px] text-neutral-400">{sub.userEmail}</p>
                      </td>

                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700">
                          {sub.role}
                        </span>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-black text-white dark:bg-white dark:text-black">
                          {sub.subscriptionTier.toUpperCase()}
                        </span>
                      </td>

                      <td className="px-4 py-3 font-medium whitespace-nowrap">
                        {sub.role === 'ADMIN' ? (
                          <span className="font-bold text-black dark:text-white">Illimité (Administrateur)</span>
                        ) : sub.subscriptionTier === 'freemium' ? (
                          <span className="text-neutral-400">Gratuit standard</span>
                        ) : sub.isExpired ? (
                          <span className="font-bold text-neutral-500">Expiré (réinitialisé en freemium)</span>
                        ) : (
                          <span className="font-bold text-black dark:text-white">
                            Reste {sub.remainingDays} jour(s) sur 30 jours
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3 font-mono text-[11px] whitespace-nowrap">
                        {sub.subscriptionExpiresAt 
                          ? new Date(sub.subscriptionExpiresAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })
                          : '—'}
                      </td>

                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        {sub.role === 'ADMIN' ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700">
                            ADMIN ACTIF
                          </span>
                        ) : sub.isExpired || sub.subscriptionTier === 'freemium' ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-neutral-500">
                            STANDARD
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-black text-white dark:bg-white dark:text-black">
                            ACTIF (1 MOIS)
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ADMIN FEATURE & TYPOGRAPHY MATRIX */}
      {activeTab === 'matrix' && (
        <div className="space-y-4">
          <div className="bg-neutral-950 text-white p-4 rounded-xl border border-amber-500/40 shadow-md flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Shield className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-amber-400">
                  Matrice des Accès Payants (VIP Doré)
                </h2>
                <p className="text-[11px] text-neutral-400">
                  Cochez les éléments pour activer le verrouillage PRO dans l'éditeur.
                </p>
              </div>
            </div>
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-amber-400 text-black font-black uppercase shrink-0">
              PRO DORÉ
            </span>
          </div>

          {/* SECTION 0: CONTRÔLE INDIVIDUEL DES MODÈLES DE CV (59 MODÈLES) */}
          <div className="bg-white dark:bg-neutral-950 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Layout className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-black uppercase tracking-wider text-black dark:text-white">
                  Modèles de CV ({CV_TEMPLATES.length})
                </h3>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] font-black text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-800">
                  {(matrixConfig.paidTemplates || []).length} Payants
                </span>
                <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                  {CV_TEMPLATES.length - (matrixConfig.paidTemplates || []).length} Gratuits
                </span>
              </div>
            </div>

            {/* Template Search Bar */}
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-neutral-400" />
              <input
                type="text"
                placeholder="Filtrer un modèle..."
                value={templateSearchQuery}
                onChange={(e) => setTemplateSearchQuery(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-black dark:text-white placeholder-neutral-400 rounded-lg outline-hidden focus:border-amber-500"
              />
            </div>

            {/* Template Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 max-h-80 overflow-y-auto pr-1">
              {CV_TEMPLATES.filter(t => {
                if (!templateSearchQuery.trim()) return true;
                const q = templateSearchQuery.toLowerCase();
                return (
                  t.name.toLowerCase().includes(q) ||
                  t.id.toLowerCase().includes(q) ||
                  t.category.toLowerCase().includes(q)
                );
              }).map((template) => {
                const isPaid = (matrixConfig.paidTemplates || []).includes(template.id);

                return (
                  <div
                    key={template.id}
                    className={`p-2 rounded-lg border flex flex-col justify-between space-y-1.5 transition-all ${
                      isPaid
                        ? 'bg-amber-950/10 border-amber-400/80 dark:border-amber-500/60 text-amber-950 dark:text-amber-200'
                        : 'bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    <div>
                      <div className="text-[9px] font-mono text-neutral-400 truncate">
                        {template.category}
                      </div>
                      <h4 className="font-bold text-[11px] text-black dark:text-white truncate">
                        {template.name}
                      </h4>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleTemplatePaid(template.id)}
                      className={`w-full py-1 px-1.5 rounded text-[10px] font-black flex items-center justify-center gap-1 transition-all cursor-pointer ${
                        isPaid
                          ? 'bg-amber-400 text-black shadow-2xs hover:bg-amber-300'
                          : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-700'
                      }`}
                    >
                      {isPaid ? <Lock className="w-2.5 h-2.5" /> : <Unlock className="w-2.5 h-2.5" />}
                      <span>{isPaid ? 'PAYANT' : 'GRATUIT'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 1: POLICES DE CARACTÈRES */}
          <div className="bg-white dark:bg-neutral-950 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-black uppercase tracking-wider text-black dark:text-white">
                  Polices de Caractères
                </h3>
              </div>
              <span className="text-[11px] font-black text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-800">
                {matrixConfig.paidFonts.length} payante(s)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
              {[
                'Inter', 'Roboto', 'Playfair Display', 'Montserrat', 'Space Grotesk',
                'Outfit', 'Cinzel', 'Plus Jakarta Sans', 'Syne', 'Bebas Neue',
                'Lora', 'Garamond', 'Oswald', 'Fira Code'
              ].map((fontName) => {
                const isPaid = matrixConfig.paidFonts.includes(fontName);
                return (
                  <button
                    key={fontName}
                    type="button"
                    onClick={() => toggleFontPaid(fontName)}
                    className={`p-2 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                      isPaid
                        ? 'bg-amber-500/10 border-amber-400 text-amber-950 dark:text-amber-200 font-black'
                        : 'bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    <span className="font-bold text-xs truncate" style={{ fontFamily: fontName }}>{fontName}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase flex items-center gap-0.5 ml-1 ${
                      isPaid ? 'bg-amber-400 text-black' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500'
                    }`}>
                      {isPaid ? <Lock className="w-2.5 h-2.5" /> : <Unlock className="w-2.5 h-2.5" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: CONTRÔLE DES 17 MENUS DU CREATOR STUDIO & SOUS-PARTIES */}
          <div className="bg-white dark:bg-neutral-950 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-black uppercase tracking-wider text-black dark:text-white">
                  Menus du Creator Studio (17 Menus)
                </h3>
              </div>
              <span className="text-[11px] text-amber-700 dark:text-amber-400 font-black px-2 py-0.5 bg-amber-50 dark:bg-amber-950/60 rounded-full border border-amber-300 dark:border-amber-700">
                {(matrixConfig.paidStudioMenus || []).length} / 17 Payants
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {STUDIO_17_MENUS.map((menu) => {
                const isMenuPaid = (matrixConfig.paidStudioMenus || []).includes(menu.id);
                return (
                  <div
                    key={menu.id}
                    className={`p-3 rounded-lg border transition-all ${
                      isMenuPaid
                        ? 'bg-amber-500/10 border-amber-400 dark:border-amber-500/70'
                        : 'bg-neutral-50 dark:bg-neutral-900/60 border-neutral-200 dark:border-neutral-800'
                    }`}
                  >
                    {/* Menu Header Toggle */}
                    <div className="flex items-center justify-between gap-2 pb-2 border-b border-neutral-200/60 dark:border-neutral-800">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
                          isMenuPaid ? 'bg-amber-400 text-black' : 'bg-black text-white dark:bg-white dark:text-black'
                        }`}>
                          {menu.number}
                        </span>
                        <span className="font-black text-xs text-black dark:text-white">{menu.label}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleStudioMenuPaid(menu.id, menu.label)}
                        className={`px-2 py-0.5 rounded text-[10px] font-black uppercase flex items-center gap-1 transition-all cursor-pointer ${
                          isMenuPaid
                            ? 'bg-amber-400 text-black border border-amber-500'
                            : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-300'
                        }`}
                      >
                        {isMenuPaid ? <Lock className="w-2.5 h-2.5" /> : <Unlock className="w-2.5 h-2.5" />}
                        <span>{isMenuPaid ? 'PAYANT' : 'GRATUIT'}</span>
                      </button>
                    </div>

                    {/* Sub-Options List */}
                    {menu.subOptions && menu.subOptions.length > 0 && (
                      <div className="mt-2 grid grid-cols-2 gap-1.5">
                        {menu.subOptions.map((sub) => {
                          const isSubPaid = (matrixConfig.paidSubOptions || []).includes(sub.id);
                          const effectivePaid = isMenuPaid || isSubPaid;
                          return (
                            <button
                              key={sub.id}
                              type="button"
                              onClick={() => toggleSubOptionPaid(sub.id, sub.label)}
                              className={`p-1.5 rounded border text-left flex items-center justify-between transition-all cursor-pointer ${
                                effectivePaid
                                  ? 'bg-amber-400 text-black border-amber-500 font-bold'
                                  : 'bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400'
                              }`}
                            >
                              <span className="text-[10px] truncate pr-1">{sub.label}</span>
                              <span className={`px-1 py-0.2 rounded text-[8px] font-black uppercase shrink-0 ${
                                effectivePaid ? 'bg-black text-amber-300' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'
                              }`}>
                                {effectivePaid ? 'PRO' : 'FREE'}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 3: MOTIFS D'ARRIÈRE-PLAN */}
          <div className="bg-white dark:bg-neutral-950 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-black uppercase tracking-wider text-black dark:text-white">
                  Motifs d'Arrière-Plan
                </h3>
              </div>
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold">
                {matrixConfig.paidPatterns.length} réservé(s)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
              {[
                'dots', 'stripes', 'grid', 'mesh', 'waves',
                'hexagons', 'polka', 'chevrons', 'circuit', 'cubes', 'mandala'
              ].map((patternName) => {
                const isPaid = matrixConfig.paidPatterns.includes(patternName);
                return (
                  <button
                    key={patternName}
                    type="button"
                    onClick={() => togglePatternPaid(patternName)}
                    className={`p-2 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                      isPaid
                        ? 'bg-amber-500/10 border-amber-400 text-amber-950 dark:text-amber-200 font-bold'
                        : 'bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    <span className="font-bold text-xs capitalize truncate">{patternName}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase flex items-center gap-0.5 ml-1 ${
                      isPaid ? 'bg-amber-400 text-black' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500'
                    }`}>
                      {isPaid ? <Lock className="w-2.5 h-2.5" /> : <Unlock className="w-2.5 h-2.5" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: NOTIFICATIONS & EMAIL BROADCASTS */}
      {activeTab === 'notifications' && (
        <AdminNotificationsTab langue={langue} />
      )}

      {/* Reject Modal */}
      {rejectionNote && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-950 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-neutral-300 dark:border-neutral-700">
            <h3 className="font-black text-black dark:text-white text-base">Raison du rejet du paiement</h3>
            <textarea
              rows={3}
              placeholder="Ex : Référence transaction introuvable sur le compte..."
              value={rejectionNote.note}
              onChange={(e) => setRejectionNote({ ...rejectionNote, note: e.target.value })}
              className="w-full p-3 text-xs bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-black dark:text-white rounded-xl outline-hidden focus:border-black dark:focus:border-white"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setRejectionNote(null)}
                className="px-4 py-2 text-xs font-bold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-xl cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={() => handleReject(rejectionNote.id)}
                className="px-4 py-2 text-xs font-black text-white bg-black hover:bg-neutral-800 dark:bg-white dark:text-black rounded-xl shadow-xs cursor-pointer"
              >
                Confirmer le rejet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Free Template Conflict Warning Modal */}
      {conflictModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-neutral-950 border-2 border-amber-500/80 rounded-2xl p-6 max-w-lg w-full text-white space-y-4 shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="p-3 bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-500 text-slate-950 rounded-xl shrink-0 shadow-lg">
                <AlertTriangle className="w-6 h-6 text-slate-950 font-bold" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black uppercase text-amber-400 tracking-wide">
                  ⚠️ Conflit Détecté — Modèle Gratuit Affecté
                </h3>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Attention ! La fonctionnalité <strong className="text-amber-300 font-extrabold">{conflictModal.itemName}</strong> est directement utilisée par les modèles gratuits suivants :
                </p>
              </div>
            </div>

            {/* List of affected free templates */}
            <div className="bg-amber-950/40 border border-amber-500/40 rounded-xl p-3 space-y-2 max-h-40 overflow-y-auto">
              <span className="text-[10px] font-black uppercase text-amber-400 block tracking-wider">Modèles Gratuits Associés :</span>
              <div className="flex flex-wrap gap-1.5">
                {conflictModal.affectedTemplates.map((tmplName, i) => (
                  <span key={`tmpl-${tmplName}-${i}`} className="text-xs font-bold px-2.5 py-1 bg-amber-500/20 text-amber-200 border border-amber-500/40 rounded-lg flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>{tmplName}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-neutral-300 space-y-1.5">
              <strong className="block text-white font-extrabold">💡 Protection Automatique de l'Expérience :</strong>
              <p className="text-[11px] leading-relaxed text-neutral-400">
                Si vous confirmez le passage en <strong>PAYANT (DORÉ PRO)</strong>, cette option sera verrouillée pour les créations sur-mesure et les modèles Premium. Toutefois, pour garantir l'intégrité des modèles gratuits, elle restera automatiquement déverrouillée par défaut sur ces modèles de base.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setConflictModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-extrabold text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-800 transition-all cursor-pointer"
              >
                Annuler & Garder Gratuit
              </button>
              <button
                type="button"
                onClick={() => {
                  conflictModal.onConfirm();
                  setConflictModal(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-black uppercase bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 hover:brightness-110 shadow-lg shadow-amber-500/20 cursor-pointer flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5 text-slate-950" />
                <span>Confirmer le Passage en Payant</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
