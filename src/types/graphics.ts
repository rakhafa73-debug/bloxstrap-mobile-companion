export type GraphicsModePreference = 'automatic' | 'manual';
export type PerformancePriority = 'performance' | 'balanced' | 'visual';
export type BatteryPriority = 'standard' | 'battery_saver';

export interface GraphicsConfig {
  graphicsModePreference: GraphicsModePreference;
  qualityPreference: number; // 1 - 10
  performancePriority: PerformancePriority;
  batteryPriority: BatteryPriority;
  companionAnimations: boolean;
}

export interface GraphicsPreset extends GraphicsConfig {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  isBuiltIn?: boolean;
  userId: string;
  recommendations: string[];
}

export interface PresetExportPackage {
  app: string;
  schemaVersion: string;
  exportedAt: string;
  presets: GraphicsPreset[];
}

export interface RobloxApplyResult {
  success: boolean;
  method: 'manual_guide';
  directApiAvailable: boolean;
  explanation: string;
  timestamp: string;
  recommendedRobloxSettings: {
    mode: GraphicsModePreference;
    qualityLevel: number;
    notes: string[];
  };
}

export interface DeviceDiagnosticsData {
  deviceMemoryGB: number | null;
  hardwareConcurrency: number;
  maxTouchPoints: number;
  screenResolution: string;
  pixelRatio: number;
  effectiveConnectionType: string | null;
  batteryLevel: number | null;
  batteryCharging: boolean | null;
  platform: string;
  prefersReducedMotion: boolean;
}

export interface HardwareRecommendation {
  recommendedPresetId: string;
  recommendedPresetName: string;
  recommendedQuality: number;
  tier: 'Entry Level' | 'Mid Range' | 'Flagship / High End';
  reason: string;
  thermalAdvice: string;
}

export interface RobloxExperience {
  placeId: string;
  name: string;
  category: string;
  thumbnailUrl?: string;
  recommendedQuality: number;
}

export interface RobloxConnectionState {
  isConnected: boolean;
  username: string;
  userId: string;
  displayName: string;
  avatarUrl: string;
  status: 'offline' | 'online' | 'in_game';
  connectedAt?: string;
  currentGame?: string;
}

