import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  GraphicsConfig,
  GraphicsPreset,
  RobloxApplyResult,
  RobloxConnectionState,
} from '../types/graphics';
import { INITIAL_PRESETS } from '../lib/defaultPresets';
import {
  GraphicsConfigSchema,
  GraphicsPresetSchema,
  PresetImportSchema,
} from '../lib/schemas';
import { robloxAdapter } from '../lib/robloxAdapter';
import { robloxBridge } from '../lib/robloxBridge';

interface ToastState {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface UserProfile {
  id: string;
  name: string;
  avatarSeed: string;
}

export const AVAILABLE_USERS: UserProfile[] = [
  { id: 'user_gamer_01', name: 'Mobile Player 1 (Main)', avatarSeed: 'MP1' },
  { id: 'user_gamer_02', name: 'Low-Spec Test Profile', avatarSeed: 'LT2' },
];

interface GraphicsContextType {
  // User Management (Data isolation / RLS)
  currentUser: UserProfile;
  switchUser: (userId: string) => void;

  // Active configuration
  config: GraphicsConfig;
  updateConfig: (patch: Partial<GraphicsConfig>) => void;
  isDirty: boolean;
  lastSavedAt: string | null;

  // Presets
  presets: GraphicsPreset[];
  activePresetId: string;
  activePreset: GraphicsPreset | undefined;
  selectPreset: (presetId: string) => void;
  createPreset: (presetData: Omit<GraphicsPreset, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => { success: boolean; error?: string };
  updatePreset: (id: string, patch: Partial<Omit<GraphicsPreset, 'id' | 'userId'>>) => { success: boolean; error?: string };
  duplicatePreset: (id: string) => { success: boolean; error?: string };
  deletePreset: (id: string) => { success: boolean; error?: string };

  // Actions
  saveConfiguration: () => { success: boolean; error?: string };
  resetConfiguration: () => void;
  exportPresets: () => string;
  importPresets: (jsonString: string) => { success: boolean; count?: number; error?: string };

  // Direct Roblox Bridge & Launch
  robloxConnection: RobloxConnectionState;
  connectRoblox: (username: string) => void;
  disconnectRoblox: () => void;
  launchRobloxApp: () => void;
  launchRobloxExperience: (placeId: string, gameName?: string) => void;
  isRobloxConnectModalOpen: boolean;
  setIsRobloxConnectModalOpen: (open: boolean) => void;

  // Manual Roblox apply flow
  isApplyModalOpen: boolean;
  setIsApplyModalOpen: (open: boolean) => void;
  applyResult: RobloxApplyResult | null;
  executeApplyInRoblox: () => Promise<RobloxApplyResult>;

  // Toasts
  toast: ToastState | null;
  dismissToast: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const GraphicsContext = createContext<GraphicsContextType | undefined>(undefined);

export const GraphicsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // User isolation
  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    return localStorage.getItem('bloxstrap_active_user') || AVAILABLE_USERS[0].id;
  });

  const currentUser = useMemo(() => {
    return AVAILABLE_USERS.find(u => u.id === currentUserId) || AVAILABLE_USERS[0];
  }, [currentUserId]);

  // Storage key per user (RLS / Data Isolation demonstration)
  const presetsStorageKey = `bloxstrap_presets_${currentUserId}`;
  const activePresetKey = `bloxstrap_active_preset_${currentUserId}`;
  const lastSavedKey = `bloxstrap_last_saved_${currentUserId}`;

  // Helper to normalize any preset and guarantee all required fields
  const normalizePreset = (raw: any, userId: string): GraphicsPreset => ({
    id: typeof raw?.id === 'string' && raw.id ? raw.id : `preset-${Date.now()}`,
    name: typeof raw?.name === 'string' && raw.name ? raw.name : 'Custom Preset',
    description: typeof raw?.description === 'string' ? raw.description : '',
    graphicsModePreference: raw?.graphicsModePreference === 'automatic' ? 'automatic' : 'manual',
    qualityPreference: typeof raw?.qualityPreference === 'number' && raw.qualityPreference >= 1 && raw.qualityPreference <= 10 ? raw.qualityPreference : 5,
    performancePriority: ['performance', 'balanced', 'visual'].includes(raw?.performancePriority) ? raw.performancePriority : 'balanced',
    batteryPriority: raw?.batteryPriority === 'battery_saver' ? 'battery_saver' : 'standard',
    companionAnimations: typeof raw?.companionAnimations === 'boolean' ? raw.companionAnimations : true,
    createdAt: typeof raw?.createdAt === 'string' ? raw.createdAt : new Date().toISOString(),
    updatedAt: typeof raw?.updatedAt === 'string' ? raw.updatedAt : new Date().toISOString(),
    isBuiltIn: Boolean(raw?.isBuiltIn),
    userId: typeof raw?.userId === 'string' ? raw.userId : userId,
    recommendations: Array.isArray(raw?.recommendations) ? raw.recommendations : ['Terapkan secara manual di menu Roblox.'],
  });

  // Load presets for user safely
  const [presets, setPresets] = useState<GraphicsPreset[]>(() => {
    try {
      const stored = localStorage.getItem(presetsStorageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const normalized = parsed.map(p => normalizePreset(p, currentUserId));
          // If built-ins were accidentally wiped by previous test runs, replenish them
          const hasBuiltIns = normalized.some(p => p.isBuiltIn || p.id === 'preset-performance');
          if (hasBuiltIns) {
            return normalized;
          }
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_PRESETS.map(p => ({ ...p, userId: currentUserId }));
  });

  const [activePresetId, setActivePresetId] = useState<string>(() => {
    return localStorage.getItem(activePresetKey) || 'preset-balanced';
  });

  const activePreset = useMemo(() => {
    return presets.find(p => p.id === activePresetId) || presets[0] || INITIAL_PRESETS[0];
  }, [presets, activePresetId]);

  // Current working config
  const [config, setConfig] = useState<GraphicsConfig>(() => ({
    graphicsModePreference: activePreset?.graphicsModePreference ?? 'manual',
    qualityPreference: activePreset?.qualityPreference ?? 5,
    performancePriority: activePreset?.performancePriority ?? 'balanced',
    batteryPriority: activePreset?.batteryPriority ?? 'standard',
    companionAnimations: activePreset?.companionAnimations ?? true,
  }));

  const [lastSavedAt, setLastSavedAt] = useState<string | null>(() => {
    return localStorage.getItem(lastSavedKey) || null;
  });

  // Direct Roblox Connection State
  const [robloxConnection, setRobloxConnection] = useState<RobloxConnectionState>(() => {
    try {
      const stored = localStorage.getItem(`bloxstrap_roblox_conn_${currentUserId}`);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return {
      isConnected: false,
      username: '',
      userId: '',
      displayName: '',
      avatarUrl: '',
      status: 'offline',
    };
  });

  const [isRobloxConnectModalOpen, setIsRobloxConnectModalOpen] = useState(false);

  const connectRoblox = (username: string) => {
    const cleanUser = username.trim() || 'BloxPlayer';
    const fakeId = Math.floor(100000000 + Math.random() * 900000000).toString();
    const newConnection: RobloxConnectionState = {
      isConnected: true,
      username: cleanUser,
      displayName: cleanUser,
      userId: fakeId,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanUser}`,
      status: 'online',
      connectedAt: new Date().toISOString(),
    };
    setRobloxConnection(newConnection);
    localStorage.setItem(`bloxstrap_roblox_conn_${currentUserId}`, JSON.stringify(newConnection));
    showToast(`Tersambung ke akun Roblox: @${cleanUser}`, 'success');
  };

  const disconnectRoblox = () => {
    const emptyConn: RobloxConnectionState = {
      isConnected: false,
      username: '',
      userId: '',
      displayName: '',
      avatarUrl: '',
      status: 'offline',
    };
    setRobloxConnection(emptyConn);
    localStorage.removeItem(`bloxstrap_roblox_conn_${currentUserId}`);
    showToast('Koneksi profil Roblox diputuskan.', 'info');
  };

  const launchRobloxApp = () => {
    robloxBridge.launchApp();
    showToast('Membuka aplikasi Roblox di perangkat Anda...', 'info');
  };

  const launchRobloxExperience = (placeId: string, gameName?: string) => {
    robloxBridge.launchExperience(placeId);
    showToast(`Meluncurkan experience Roblox: ${gameName || placeId}...`, 'info');
  };

  // Modal & Apply
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applyResult, setApplyResult] = useState<RobloxApplyResult | null>(null);

  // Toast
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToast({ id, type, message });
  };

  const dismissToast = () => setToast(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  // When switching user, reload user presets
  const switchUser = (userId: string) => {
    setCurrentUserId(userId);
    localStorage.setItem('bloxstrap_active_user', userId);

    const userPresetsKey = `bloxstrap_presets_${userId}`;
    const userActivePresetKey = `bloxstrap_active_preset_${userId}`;
    const userLastSavedKey = `bloxstrap_last_saved_${userId}`;

    let loadedPresets = INITIAL_PRESETS.map(p => ({ ...p, userId }));
    try {
      const stored = localStorage.getItem(userPresetsKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const normalized = parsed.map(p => normalizePreset(p, userId));
          if (normalized.some(p => p.isBuiltIn || p.id === 'preset-performance')) {
            loadedPresets = normalized;
          }
        }
      }
    } catch {
      // use default
    }

    const loadedActiveId = localStorage.getItem(userActivePresetKey) || 'preset-balanced';
    const foundPreset = loadedPresets.find(p => p.id === loadedActiveId) || loadedPresets[0];

    setPresets(loadedPresets);
    setActivePresetId(loadedActiveId);
    setConfig({
      graphicsModePreference: foundPreset.graphicsModePreference,
      qualityPreference: foundPreset.qualityPreference,
      performancePriority: foundPreset.performancePriority,
      batteryPriority: foundPreset.batteryPriority,
      companionAnimations: foundPreset.companionAnimations,
    });
    setLastSavedAt(localStorage.getItem(userLastSavedKey) || null);
    showToast(`Beralih profil ke: ${AVAILABLE_USERS.find(u => u.id === userId)?.name}`, 'info');
  };

  // Sync presets to localStorage when updated
  useEffect(() => {
    localStorage.setItem(presetsStorageKey, JSON.stringify(presets));
  }, [presets, presetsStorageKey]);

  // Check if current config differs from active preset (isDirty)
  const isDirty = useMemo(() => {
    if (!activePreset) return false;
    return (
      config.graphicsModePreference !== activePreset.graphicsModePreference ||
      config.qualityPreference !== activePreset.qualityPreference ||
      config.performancePriority !== activePreset.performancePriority ||
      config.batteryPriority !== activePreset.batteryPriority ||
      config.companionAnimations !== activePreset.companionAnimations
    );
  }, [config, activePreset]);

  // Update working config
  const updateConfig = (patch: Partial<GraphicsConfig>) => {
    setConfig(prev => ({
      ...prev,
      ...patch,
    }));
  };

  // Select Preset
  const selectPreset = (presetId: string) => {
    const target = presets.find(p => p.id === presetId);
    if (!target) return;

    setActivePresetId(presetId);
    localStorage.setItem(activePresetKey, presetId);
    setConfig({
      graphicsModePreference: target.graphicsModePreference,
      qualityPreference: target.qualityPreference,
      performancePriority: target.performancePriority,
      batteryPriority: target.batteryPriority,
      companionAnimations: target.companionAnimations,
    });
    showToast(`Preset "${target.name}" dipilih sebagai preferensi aktif.`);
  };

  // Save current working config to active preset or update it
  const saveConfiguration = () => {
    const validation = GraphicsConfigSchema.safeParse(config);
    if (!validation.success) {
      const err = validation.error.issues[0]?.message || 'Konfigurasi tidak valid';
      showToast(err, 'error');
      return { success: false, error: err };
    }

    const now = new Date().toISOString();
    setPresets(prev => {
      return prev.map(p => {
        if (p.id === activePresetId) {
          return {
            ...p,
            ...validation.data,
            updatedAt: now,
          };
        }
        return p;
      });
    });

    setLastSavedAt(now);
    localStorage.setItem(lastSavedKey, now);
    showToast('Konfigurasi preferensi berhasil disimpan di Bloxstrap Mobile Companion.');
    return { success: true };
  };

  // Reset current config to match active preset
  const resetConfiguration = () => {
    if (!activePreset) return;
    setConfig({
      graphicsModePreference: activePreset.graphicsModePreference,
      qualityPreference: activePreset.qualityPreference,
      performancePriority: activePreset.performancePriority,
      batteryPriority: activePreset.batteryPriority,
      companionAnimations: activePreset.companionAnimations,
    });
    showToast('Pengaturan dikembalikan sesuai nilai preset aktif.', 'info');
  };

  // Create new preset
  const createPreset = (
    data: Omit<GraphicsPreset, 'id' | 'createdAt' | 'updatedAt' | 'userId'>
  ) => {
    const now = new Date().toISOString();
    const newId = `preset-${Date.now()}`;
    const newPreset: GraphicsPreset = {
      ...data,
      id: newId,
      userId: currentUserId,
      createdAt: now,
      updatedAt: now,
      isBuiltIn: false,
    };

    const validation = GraphicsPresetSchema.safeParse(newPreset);
    if (!validation.success) {
      const err = validation.error.issues[0]?.message || 'Data preset tidak valid';
      showToast(err, 'error');
      return { success: false, error: err };
    }

    setPresets(prev => [...prev, validation.data]);
    setActivePresetId(newId);
    localStorage.setItem(activePresetKey, newId);
    showToast(`Preset baru "${data.name}" berhasil dibuat.`);
    return { success: true };
  };

  // Update preset
  const updatePreset = (id: string, patch: Partial<Omit<GraphicsPreset, 'id' | 'userId'>>) => {
    const existing = presets.find(p => p.id === id);
    if (!existing) {
      showToast('Preset tidak ditemukan', 'error');
      return { success: false, error: 'Preset tidak ditemukan' };
    }

    const now = new Date().toISOString();
    const candidate: GraphicsPreset = {
      ...existing,
      ...patch,
      updatedAt: now,
    };

    const validation = GraphicsPresetSchema.safeParse(candidate);
    if (!validation.success) {
      const err = validation.error.issues[0]?.message || 'Gagal memperbarui preset';
      showToast(err, 'error');
      return { success: false, error: err };
    }

    setPresets(prev => prev.map(p => (p.id === id ? validation.data : p)));
    if (id === activePresetId) {
      setConfig({
        graphicsModePreference: validation.data.graphicsModePreference,
        qualityPreference: validation.data.qualityPreference,
        performancePriority: validation.data.performancePriority,
        batteryPriority: validation.data.batteryPriority,
        companionAnimations: validation.data.companionAnimations,
      });
    }
    showToast(`Preset "${validation.data.name}" berhasil diperbarui.`);
    return { success: true };
  };

  // Duplicate preset
  const duplicatePreset = (id: string) => {
    const target = presets.find(p => p.id === id);
    if (!target) {
      showToast('Preset tidak ditemukan untuk diduplikasi', 'error');
      return { success: false, error: 'Preset tidak ditemukan' };
    }

    const now = new Date().toISOString();
    const duplicated: GraphicsPreset = {
      ...target,
      id: `preset-copy-${Date.now()}`,
      name: `${target.name} (Salinan)`,
      isBuiltIn: false,
      userId: currentUserId,
      createdAt: now,
      updatedAt: now,
    };

    setPresets(prev => [...prev, duplicated]);
    showToast(`Preset "${target.name}" berhasil digandakan.`);
    return { success: true };
  };

  // Delete preset
  const deletePreset = (id: string) => {
    const target = presets.find(p => p.id === id);
    if (!target) {
      showToast('Preset tidak ditemukan', 'error');
      return { success: false, error: 'Preset tidak ditemukan' };
    }

    if (target.isBuiltIn) {
      showToast('Preset bawaan sistem tidak dapat dihapus', 'error');
      return { success: false, error: 'Preset bawaan sistem tidak dapat dihapus' };
    }

    const nextPresets = presets.filter(p => p.id !== id);
    setPresets(nextPresets);

    if (activePresetId === id) {
      const fallbackId = nextPresets[0]?.id || 'preset-balanced';
      setActivePresetId(fallbackId);
      localStorage.setItem(activePresetKey, fallbackId);
      const fallbackPreset = nextPresets[0];
      if (fallbackPreset) {
        setConfig({
          graphicsModePreference: fallbackPreset.graphicsModePreference,
          qualityPreference: fallbackPreset.qualityPreference,
          performancePriority: fallbackPreset.performancePriority,
          batteryPriority: fallbackPreset.batteryPriority,
          companionAnimations: fallbackPreset.companionAnimations,
        });
      }
    }

    showToast(`Preset "${target.name}" berhasil dihapus.`);
    return { success: true };
  };

  // Export presets as JSON
  const exportPresets = (): string => {
    const exportData = {
      app: 'Bloxstrap Mobile Companion',
      schemaVersion: '1.0.0',
      exportedAt: new Date().toISOString(),
      user: currentUser.name,
      presets: presets,
    };
    return JSON.stringify(exportData, null, 2);
  };

  // Import presets with Zod validation
  const importPresets = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      const validation = PresetImportSchema.safeParse(parsed);

      if (!validation.success) {
        const issues = validation.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ');
        const errorMsg = `Validasi skema gagal: ${issues}`;
        showToast(errorMsg, 'error');
        return { success: false, error: errorMsg };
      }

      const data = validation.data;
      let newPresetsToAdd: GraphicsPreset[] = [];

      if ('presets' in data && Array.isArray(data.presets)) {
        newPresetsToAdd = data.presets.map((p, idx) => ({
          ...p,
          id: `imported-${Date.now()}-${idx}`,
          userId: currentUserId,
          isBuiltIn: false,
        }));
      } else if (Array.isArray(data)) {
        newPresetsToAdd = (data as GraphicsPreset[]).map((p, idx) => ({
          ...p,
          id: `imported-${Date.now()}-${idx}`,
          userId: currentUserId,
          isBuiltIn: false,
        }));
      } else if ('name' in data && 'qualityPreference' in data) {
        newPresetsToAdd = [
          {
            ...(data as GraphicsPreset),
            id: `imported-${Date.now()}`,
            userId: currentUserId,
            isBuiltIn: false,
          },
        ];
      } else if ('qualityPreference' in data) {
        const c = data as GraphicsConfig;
        newPresetsToAdd = [
          {
            id: `imported-${Date.now()}`,
            name: `Imported Config (${new Date().toLocaleDateString()})`,
            description: 'Konfigurasi grafik yang diimpor dari JSON',
            graphicsModePreference: c.graphicsModePreference,
            qualityPreference: c.qualityPreference,
            performancePriority: c.performancePriority,
            batteryPriority: c.batteryPriority,
            companionAnimations: c.companionAnimations,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isBuiltIn: false,
            userId: currentUserId,
            recommendations: ['Terapkan secara manual di menu Roblox sesuai preferensi impor.'],
          },
        ];
      }

      if (newPresetsToAdd.length === 0) {
        showToast('Tidak ada preset yang valid ditemukan di berkas.', 'error');
        return { success: false, error: 'Tidak ada preset valid' };
      }

      setPresets(prev => [...prev, ...newPresetsToAdd]);
      showToast(`${newPresetsToAdd.length} preset berhasil diimpor dan divalidasi.`);
      return { success: true, count: newPresetsToAdd.length };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Format JSON tidak valid';
      showToast(`Kesalahan parsing JSON: ${msg}`, 'error');
      return { success: false, error: msg };
    }
  };

  // Execute Roblox Apply flow (honest manual guidance)
  const executeApplyInRoblox = async (): Promise<RobloxApplyResult> => {
    // 1. Validate & Save current config
    saveConfiguration();

    // 2. Pass to adapter
    const res = await robloxAdapter.applyConfiguration(config);
    setApplyResult(res);
    setIsApplyModalOpen(true);
    return res;
  };

  return (
    <GraphicsContext.Provider
      value={{
        currentUser,
        switchUser,
        config,
        updateConfig,
        isDirty,
        lastSavedAt,
        presets,
        activePresetId,
        activePreset,
        selectPreset,
        createPreset,
        updatePreset,
        duplicatePreset,
        deletePreset,
        saveConfiguration,
        resetConfiguration,
        exportPresets,
        importPresets,
        isApplyModalOpen,
        setIsApplyModalOpen,
        applyResult,
        executeApplyInRoblox,
        robloxConnection,
        connectRoblox,
        disconnectRoblox,
        launchRobloxApp,
        launchRobloxExperience,
        isRobloxConnectModalOpen,
        setIsRobloxConnectModalOpen,
        toast,
        dismissToast,
        showToast,
      }}
    >
      {children}
    </GraphicsContext.Provider>
  );
};

export const useGraphics = () => {
  const context = useContext(GraphicsContext);
  if (!context) {
    throw new Error('useGraphics must be used within a GraphicsProvider');
  }
  return context;
};
