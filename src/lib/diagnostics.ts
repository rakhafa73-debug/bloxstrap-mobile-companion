import { DeviceDiagnosticsData, HardwareRecommendation } from '../types/graphics';

interface BatteryManager extends EventTarget {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
  onchargingchange: ((this: BatteryManager, ev: Event) => void) | null;
  onlevelchange: ((this: BatteryManager, ev: Event) => void) | null;
}

interface NavigatorWithBattery extends Navigator {
  getBattery?: () => Promise<BatteryManager>;
  deviceMemory?: number;
  connection?: {
    effectiveType?: string;
    downlink?: number;
    rtt?: number;
    saveData?: boolean;
  };
}

export async function fetchDeviceDiagnostics(): Promise<DeviceDiagnosticsData> {
  const nav = navigator as NavigatorWithBattery;

  let batteryLevel: number | null = null;
  let batteryCharging: boolean | null = null;

  try {
    if (typeof nav.getBattery === 'function') {
      const b = await nav.getBattery();
      batteryLevel = Math.round(b.level * 100);
      batteryCharging = b.charging;
    }
  } catch {
    // Battery API not supported or permissions restricted
  }

  const effectiveConnectionType = nav.connection?.effectiveType || null;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return {
    deviceMemoryGB: nav.deviceMemory || null,
    hardwareConcurrency: nav.hardwareConcurrency || 4,
    maxTouchPoints: nav.maxTouchPoints || 0,
    screenResolution: `${window.screen.width} × ${window.screen.height}`,
    pixelRatio: Number(window.devicePixelRatio.toFixed(2)),
    effectiveConnectionType,
    batteryLevel,
    batteryCharging,
    platform: nav.platform || 'Android / Mobile Web',
    prefersReducedMotion,
  };
}
export type { HardwareRecommendation };

export function evaluateHardwareRecommendation(data: DeviceDiagnosticsData): HardwareRecommendation {
  const mem = data.deviceMemoryGB || 4;
  const cores = data.hardwareConcurrency || 4;

  if (mem <= 3 || cores <= 4) {
    return {
      recommendedPresetId: 'preset-performance',
      recommendedPresetName: 'Performance Mode',
      recommendedQuality: 2,
      tier: 'Entry Level',
      reason: 'Kapasitas RAM (~3GB atau kurang) atau CPU quad-core membatasi buffer texture rendering Roblox Mobile.',
      thermalAdvice: 'Hindari multitasking aplikasi berat di latar belakang dan pastikan ventilasi casing ponsel tidak tertutup.',
    };
  }

  if (mem >= 8 && cores >= 8) {
    return {
      recommendedPresetId: 'preset-quality',
      recommendedPresetName: 'Quality Mode',
      recommendedQuality: 8,
      tier: 'Flagship / High End',
      reason: 'Perangkat memiliki sumber daya RAM (≥8GB) dan octa-core CPU yang memadai untuk shader dan draw distance luas.',
      thermalAdvice: 'Pantau suhu baterai jika bermain di atas 30 menit terus-menerus. Jika bodi terasa panas, turunkan ke Balanced.',
    };
  }

  return {
    recommendedPresetId: 'preset-balanced',
    recommendedPresetName: 'Balanced Mode',
    recommendedQuality: 5,
    tier: 'Mid Range',
    reason: 'Konfigurasi seimbang untuk perangkat dengan 4GB–6GB RAM guna menjaga stabilitas tanpa lag atau panas berlebih.',
    thermalAdvice: 'Kecerahan layar 50%–70% disarankan untuk mencegah pelambatan termal (thermal throttling) pada prosesor.',
  };
}
