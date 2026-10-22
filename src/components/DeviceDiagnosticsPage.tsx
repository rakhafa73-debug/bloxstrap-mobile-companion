import React, { useEffect, useState } from 'react';
import {
  Activity,
  Cpu,
  HardDrive,
  BatteryCharging,
  Battery,
  Wifi,
  Monitor,
  Flame,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import {
  DeviceDiagnosticsData,
  HardwareRecommendation,
} from '../types/graphics';
import {
  fetchDeviceDiagnostics,
  evaluateHardwareRecommendation,
} from '../lib/diagnostics';
import { useGraphics } from '../context/GraphicsContext';

interface DeviceDiagnosticsPageProps {
  onNavigateToGraphics: () => void;
}

export const DeviceDiagnosticsPage: React.FC<DeviceDiagnosticsPageProps> = ({
  onNavigateToGraphics,
}) => {
  const { selectPreset, showToast } = useGraphics();

  const [diagnostics, setDiagnostics] = useState<DeviceDiagnosticsData | null>(null);
  const [recommendation, setRecommendation] = useState<HardwareRecommendation | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchDeviceDiagnostics();
    const rec = evaluateHardwareRecommendation(data);
    setDiagnostics(data);
    setRecommendation(rec);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApplyRecommendedPreset = () => {
    if (!recommendation) return;
    selectPreset(recommendation.recommendedPresetId);
    showToast(`Preset rekomendasi "${recommendation.recommendedPresetName}" diaktifkan.`);
    onNavigateToGraphics();
  };

  return (
    <div className="space-y-6 pb-24 md:pb-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display">
            Device Diagnostics & Thermal Guide
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Analisis kapabilitas perangkat keras dan panduan termal Android saat menjalankan Roblox
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${loading ? 'animate-spin' : ''}`} />
          <span>Segarkan Diagnostik</span>
        </button>
      </div>

      {loading && !diagnostics ? (
        <div className="py-12 text-center text-slate-400 text-xs">
          Membaca metrik perangkat keras...
        </div>
      ) : (
        diagnostics &&
        recommendation && (
          <div className="space-y-6">
            {/* Recommendation Hero Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-cyan-900/60 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-cyan-400 px-2 py-0.5 bg-cyan-950/80 border border-cyan-800 rounded">
                      {recommendation.tier}
                    </span>
                    <span className="text-xs text-slate-400">
                      Rekomendasi Berdasarkan Profil Hardware
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
                    Preset yang Disarankan: {recommendation.recommendedPresetName}
                  </h2>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {recommendation.reason}
                  </p>
                </div>

                <div className="shrink-0 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={handleApplyRecommendedPreset}
                    className="min-h-[48px] px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-transform active:scale-[0.98] shadow-lg shadow-cyan-500/20 cursor-pointer"
                  >
                    <span>Gunakan Preset Ini ({recommendation.recommendedPresetName})</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Hardware Metrics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {/* RAM */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-semibold">Memori / RAM</span>
                  <HardDrive className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-xl font-bold text-white font-mono tabular-nums">
                  {diagnostics.deviceMemoryGB ? `~${diagnostics.deviceMemoryGB} GB` : 'Tersedia (Web Standard)'}
                </div>
                <p className="text-[11px] text-slate-500">Estimasi alokasi RAM peramban</p>
              </div>

              {/* CPU Cores */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-semibold">CPU Cores</span>
                  <Cpu className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-xl font-bold text-white font-mono tabular-nums">
                  {diagnostics.hardwareConcurrency} Cores
                </div>
                <p className="text-[11px] text-slate-500">Hardware threads konkuren</p>
              </div>

              {/* Baterai */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-semibold">Status Baterai</span>
                  {diagnostics.batteryCharging ? (
                    <BatteryCharging className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Battery className="w-4 h-4 text-amber-400" />
                  )}
                </div>
                <div className="text-xl font-bold text-white font-mono tabular-nums">
                  {diagnostics.batteryLevel !== null ? `${diagnostics.batteryLevel}%` : 'Didukung Sistem'}
                </div>
                <p className="text-[11px] text-slate-500">
                  {diagnostics.batteryCharging ? 'Sedang Mengisi Daya (Waspada Panas)' : 'Daya Baterai Portabel'}
                </p>
              </div>

              {/* Layar & Resolusi */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-semibold">Resolusi Layar</span>
                  <Monitor className="w-4 h-4 text-sky-400" />
                </div>
                <div className="text-base font-bold text-white font-mono truncate">
                  {diagnostics.screenResolution}
                </div>
                <p className="text-[11px] text-slate-500">DPI Scale: {diagnostics.pixelRatio}x</p>
              </div>
            </div>

            {/* Thermal & Android Performance Guide */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Flame className="w-4 h-4" />
                  <h3>Manajemen Panas & Throttling di Android</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {recommendation.thermalAdvice}
                </p>
                <div className="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-400">
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span>
                      <strong>Hindari Bermain Sambil Fast-Charging:</strong> Pengisian daya cepat memanaskan baterai dan menyebabkan chip throttling (frame rate drop tajam).
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span>
                      <strong>Lepas Casing Tebal Saat Bermain:</strong> Casing karet tebal menghambat pelepasan panas dari pelat belakang ponsel.
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                  <ShieldAlert className="w-4 h-4" />
                  <h3>Tips Pengaturan Roblox Mobile Tambahan</h3>
                </div>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="font-semibold text-white block">Tutup Aplikasi Latar Belakang</span>
                    <span className="text-slate-400 text-[11px]">
                      Bersihkan aplikasi media sosial atau perekam layar yang tidak terpakai dari panel Recent Apps untuk menjaga sisa RAM.
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="font-semibold text-white block">Atur Kecerahan Layar Secara Moderat</span>
                    <span className="text-slate-400 text-[11px]">
                      Layar AMOLED pada kecerahan 100% merupakan salah satu konsumen daya dan sumber panas terbesar selama gaming.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};
