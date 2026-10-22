import React, { useState } from 'react';
import {
  Sliders,
  Zap,
  Battery,
  ShieldCheck,
  RotateCcw,
  Save,
  Play,
  Info,
  Check,
  Sparkles,
  Flame,
  Layers,
  ChevronRight,
  Gauge,
  SlidersHorizontal,
  Gamepad2,
} from 'lucide-react';
import { useGraphics } from '../context/GraphicsContext';
import { GraphicsModePreference, PerformancePriority, BatteryPriority } from '../types/graphics';
import { RobloxVisualizerPreview } from './RobloxVisualizerPreview';

interface GraphicsSettingsPageProps {
  onOpenPresets: () => void;
  onOpenDiagnostics: () => void;
}

export const GraphicsSettingsPage: React.FC<GraphicsSettingsPageProps> = ({
  onOpenPresets,
  onOpenDiagnostics,
}) => {
  const {
    config,
    updateConfig,
    isDirty,
    lastSavedAt,
    presets,
    activePresetId,
    activePreset,
    selectPreset,
    saveConfiguration,
    resetConfiguration,
    executeApplyInRoblox,
    setIsRobloxConnectModalOpen,
  } = useGraphics();

  const [savingState, setSavingState] = useState(false);
  const [applyingState, setApplyingState] = useState(false);

  // Quality descriptor label helper
  const getQualityDescriptor = (val: number) => {
    if (val <= 2) return { text: 'Performa Maksimal (Ultra Ringan)', tone: 'text-emerald-400', border: 'border-emerald-500/40', bg: 'bg-emerald-950/20' };
    if (val <= 4) return { text: 'Efisiensi Hemat Daya & Lancar', tone: 'text-teal-400', border: 'border-teal-500/40', bg: 'bg-teal-950/20' };
    if (val <= 6) return { text: 'Keseimbangan Standar Rekomendasi', tone: 'text-cyan-400', border: 'border-cyan-500/40', bg: 'bg-cyan-950/20' };
    if (val <= 8) return { text: 'Visual Detail & Efek Jernih', tone: 'text-violet-400', border: 'border-violet-500/40', bg: 'bg-violet-950/20' };
    return { text: 'Kualitas Grafis Maksimum (Beban Tinggi)', tone: 'text-amber-400', border: 'border-amber-500/40', bg: 'bg-amber-950/20' };
  };

  const handleSave = () => {
    setSavingState(true);
    saveConfiguration();
    setTimeout(() => setSavingState(false), 500);
  };

  const handleApply = async () => {
    setApplyingState(true);
    await executeApplyInRoblox();
    setApplyingState(false);
  };

  const descriptor = getQualityDescriptor(config.qualityPreference);

  // Helper for preset card styling and icon
  const getPresetTheme = (id: string, isSelected: boolean) => {
    if (id === 'preset-performance') {
      return {
        icon: Zap,
        accent: 'text-emerald-400',
        bg: isSelected ? 'bg-emerald-950/40 border-emerald-500 shadow-emerald-950/50' : 'hover:border-emerald-800/60',
      };
    }
    if (id === 'preset-balanced') {
      return {
        icon: SlidersHorizontal,
        accent: 'text-cyan-400',
        bg: isSelected ? 'bg-cyan-950/40 border-cyan-500 shadow-cyan-950/50' : 'hover:border-cyan-800/60',
      };
    }
    if (id === 'preset-quality') {
      return {
        icon: Sparkles,
        accent: 'text-violet-400',
        bg: isSelected ? 'bg-violet-950/40 border-violet-500 shadow-violet-950/50' : 'hover:border-violet-800/60',
      };
    }
    if (id === 'preset-battery-saver') {
      return {
        icon: Battery,
        accent: 'text-amber-400',
        bg: isSelected ? 'bg-amber-950/40 border-amber-500 shadow-amber-950/50' : 'hover:border-amber-800/60',
      };
    }
    return {
      icon: Flame,
      accent: 'text-fuchsia-400',
      bg: isSelected ? 'bg-fuchsia-950/40 border-fuchsia-500 shadow-fuchsia-950/50' : 'hover:border-fuchsia-800/60',
    };
  };

  return (
    <div className="space-y-6 pb-24 md:pb-12 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display flex items-center gap-2.5">
              <span>Roblox Graphics</span>
              <span className="text-xs font-mono font-semibold text-cyan-400 bg-cyan-950/70 border border-cyan-800/80 px-2 py-0.5 rounded-md">
                Mobile Optimizer
              </span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Pengaturan preferensi dan panduan grafik
            </p>
          </div>

          {/* Quick links */}
          <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
            <button
              onClick={onOpenPresets}
              className="min-h-[44px] px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer shadow-sm"
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Kelola Preset ({presets.length})</span>
            </button>
            <button
              onClick={onOpenDiagnostics}
              className="min-h-[44px] px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer shadow-sm"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Cek Suhu & HW</span>
            </button>
          </div>
        </div>

        {/* Honest System Transparency Notice */}
        <div className="mt-4 p-3.5 bg-slate-900/80 border border-slate-800/90 rounded-2xl flex items-start gap-3 shadow-md">
          <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 space-y-1">
            <p className="font-semibold text-white">
              Transparansi Integrasi & Keamanan Bloxstrap Mobile:
            </p>
            <p className="text-slate-400 leading-relaxed">
              Pengaturan pada halaman ini adalah preferensi panduan terstruktur di aplikasi pendamping (Bloxstrap Mobile Companion). Karena tidak ada API pihak ketiga resmi Roblox di mobile, aplikasi ini tidak menyentuh memori atau file internal Roblox. Nilai preferensi ini akan dipandu secara manual ke menu in-game Anda.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: 2 columns on desktop (Controls on left, Visualizer & Summary on right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Preset Cards & Controls (7 cols on lg) */}
        <div className="lg:col-span-7 xl:col-span-7 space-y-6">
          {/* Section: Kartu Preset Grafik */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                <span>Pilih Preset Preferensi</span>
              </h2>
              <span className="text-xs text-slate-500 font-mono">
                {presets.length} profil
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {presets.slice(0, 5).map(preset => {
                const isSelected = activePresetId === preset.id;
                const theme = getPresetTheme(preset.id, isSelected);
                const IconComponent = theme.icon;

                return (
                  <button
                    key={preset.id}
                    onClick={() => selectPreset(preset.id)}
                    className={`min-h-[84px] text-left p-3.5 rounded-2xl border transition-all flex flex-col justify-between relative cursor-pointer group ${
                      isSelected
                        ? `${theme.bg} shadow-lg ring-1 ring-cyan-500/50`
                        : `bg-slate-900/60 border-slate-800/80 hover:bg-slate-900 ${theme.bg}`
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 w-full">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <IconComponent className={`w-4 h-4 shrink-0 ${theme.accent}`} />
                          <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                            {preset.name}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {preset.description}
                        </p>
                      </div>

                      <div className="shrink-0 pt-0.5">
                        <span className="text-xs font-mono font-bold px-2 py-1 bg-slate-950 border border-slate-800 rounded-lg text-cyan-400 tabular-nums">
                          Lv.{preset.qualityPreference}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 w-full">
                      <span className="capitalize">
                        Mode: <strong className="text-slate-300 font-medium">{preset.graphicsModePreference}</strong>
                      </span>
                      <span className="capitalize">
                        Prioritas: <strong className="text-slate-300 font-medium">{preset.performancePriority}</strong>
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Kontrol Graphics Settings */}
          <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-5 space-y-6 shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>Kontrol Konfigurasi Grafik</span>
              </h2>
              <span className="text-xs font-mono text-cyan-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                Level {config.qualityPreference} / 10
              </span>
            </div>

            {/* 1. Graphics Mode Preference: Automatic vs Manual */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-200">
                  1. Preferensi Mode Grafik Roblox (Graphics Mode)
                </label>
                <span className="text-xs text-slate-400 font-mono">
                  {config.graphicsModePreference.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Pilih "Manual" agar Anda dapat mengatur slider kualitas grafis di menu Roblox secara mandiri.
              </p>

              {/* Segmented Buttons with min-h-[44px] touch targets */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 border border-slate-800 rounded-xl">
                <button
                  type="button"
                  onClick={() => updateConfig({ graphicsModePreference: 'manual' })}
                  className={`min-h-[44px] rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    config.graphicsModePreference === 'manual'
                      ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Check className={`w-3.5 h-3.5 ${config.graphicsModePreference === 'manual' ? 'opacity-100' : 'opacity-0'}`} />
                  <span>Manual (Disarankan)</span>
                </button>

                <button
                  type="button"
                  onClick={() => updateConfig({ graphicsModePreference: 'automatic' })}
                  className={`min-h-[44px] rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    config.graphicsModePreference === 'automatic'
                      ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Check className={`w-3.5 h-3.5 ${config.graphicsModePreference === 'automatic' ? 'opacity-100' : 'opacity-0'}`} />
                  <span>Automatic (Roblox Auto)</span>
                </button>
              </div>
            </div>

            {/* 2. Graphics Quality Preference: Slider 1 - 10 + 10 Quick Tap Buttons */}
            <div className="space-y-3 pt-4 border-t border-slate-800/80">
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="quality-slider" className="text-xs font-semibold text-slate-200 block">
                    2. Preferensi Kualitas Grafik (Quality Level)
                  </label>
                  <span className={`text-xs font-medium ${descriptor.tone} mt-0.5 block`}>
                    {descriptor.text}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold font-mono text-cyan-400 tabular-nums">
                    {config.qualityPreference}
                  </span>
                  <span className="text-xs text-slate-400 font-mono"> / 10</span>
                </div>
              </div>

              {/* 10 Quick-Tap Level Buttons for Rapid Touch Input on Mobile */}
              <div className="grid grid-cols-10 gap-1 pt-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => {
                  const isActive = config.qualityPreference === level;
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => updateConfig({ qualityPreference: level })}
                      className={`min-h-[36px] rounded-lg font-mono text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                        isActive
                          ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30 scale-105'
                          : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      {level}
                    </button>
                  );
                })}
              </div>

              {/* Interactive One-Handed Slider */}
              <div className="relative py-2 px-1">
                <input
                  id="quality-slider"
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={config.qualityPreference}
                  onChange={e => updateConfig({ qualityPreference: parseInt(e.target.value, 10) })}
                  className="w-full h-3 bg-slate-950 border border-slate-800 rounded-lg cursor-pointer accent-cyan-400"
                />

                {/* Level ticks */}
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 px-1 mt-2">
                  <span>1 (Ultra Ringan)</span>
                  <span>5 (Seimbang)</span>
                  <span>10 (Grafis Maksimal)</span>
                </div>
              </div>

              {/* Crucial honesty notice */}
              <div className="p-3 bg-slate-950/90 border border-slate-800 rounded-xl flex items-start gap-2.5 text-xs text-slate-400">
                <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Pemberitahuan Rekomendasi:</strong> Skala Level 1–10 ini adalah preferensi dalam aplikasi pendamping untuk memandu slider internal Roblox, bukan modifikasi file langsung.
                </span>
              </div>
            </div>

            {/* 3. Performance Priority */}
            <div className="space-y-2 pt-4 border-t border-slate-800/80">
              <label className="text-xs font-semibold text-slate-200 block">
                3. Prioritas Performa (Performance Priority)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: 'performance', label: 'Performance', desc: 'Prioritas FPS lancar' },
                  { id: 'balanced', label: 'Balanced', desc: 'Keseimbangan optimal' },
                  { id: 'visual', label: 'Visual Quality', desc: 'Detail tekstur & bayangan' },
                ].map(item => {
                  const active = config.performancePriority === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => updateConfig({ performancePriority: item.id as PerformancePriority })}
                      className={`min-h-[48px] p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        active
                          ? 'bg-cyan-950/40 border-cyan-500 text-cyan-300 shadow-sm'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="text-xs font-bold text-white">{item.label}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{item.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Battery Priority */}
            <div className="space-y-2 pt-4 border-t border-slate-800/80">
              <label className="text-xs font-semibold text-slate-200 block">
                4. Rekomendasi Konsumsi Baterai (Battery Priority)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  {
                    id: 'standard',
                    label: 'Standard',
                    desc: 'Penggunaan normal tanpa pembatasan profil daya',
                    icon: Zap,
                  },
                  {
                    id: 'battery_saver',
                    label: 'Battery Saver',
                    desc: 'Mengarahkan kualitas hemat daya untuk sesi lama',
                    icon: Battery,
                  },
                ].map(item => {
                  const active = config.batteryPriority === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => updateConfig({ batteryPriority: item.id as BatteryPriority })}
                      className={`min-h-[48px] p-3 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                        active
                          ? 'bg-cyan-950/40 border-cyan-500 text-cyan-300 shadow-sm'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${active ? 'text-cyan-400' : 'text-slate-400'}`} />
                      <div>
                        <div className="text-xs font-bold text-white">{item.label}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{item.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. Companion Animations Toggle */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <label htmlFor="companion-anim-toggle" className="text-xs font-semibold text-slate-200 block">
                  5. Efek Animasi Aplikasi Pendamping (Companion Animations)
                </label>
                <p className="text-[11px] text-slate-400">
                  Mengurangi animasi antarmuka di aplikasi Bloxstrap Companion ini (tidak mengklaim memodifikasi shader in-game Roblox).
                </p>
              </div>
              <button
                id="companion-anim-toggle"
                type="button"
                role="switch"
                aria-checked={config.companionAnimations}
                onClick={() => updateConfig({ companionAnimations: !config.companionAnimations })}
                className={`w-12 h-6 rounded-full transition-colors relative shrink-0 p-0.5 min-h-[44px] flex items-center cursor-pointer ${
                  config.companionAnimations ? 'bg-cyan-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    config.companionAnimations ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Visualizer Preview, Summary, and Actions (5 cols on lg) */}
        <div className="lg:col-span-5 xl:col-span-5 space-y-5 lg:sticky lg:top-20">
          {/* Interactive Roblox Graphic Simulation Preview */}
          <RobloxVisualizerPreview
            qualityLevel={config.qualityPreference}
            mode={config.graphicsModePreference}
          />

          {/* 6. Configuration Summary Card */}
          <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 space-y-4 shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Ringkasan Konfigurasi
              </h3>
              {isDirty ? (
                <span className="text-xs font-semibold text-amber-400">
                  Perubahan Belum Disimpan
                </span>
              ) : (
                <span className="text-xs font-semibold text-emerald-400">
                  Tersinkronisasi
                </span>
              )}
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Nama Preset Aktif</span>
                <span className="font-semibold text-white font-mono">{activePreset?.name || 'Custom'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Prioritas Performa</span>
                <span className="font-semibold text-cyan-400 capitalize">{config.performancePriority}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Target Kualitas Slider</span>
                <span className="font-mono font-bold text-cyan-400 tabular-nums">
                  Level {config.qualityPreference} / 10
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Mode Grafik Roblox</span>
                <span className="font-semibold text-white capitalize">{config.graphicsModePreference}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Prioritas Baterai</span>
                <span className="font-semibold text-white capitalize">{(config.batteryPriority || 'standard').replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Terakhir Disimpan</span>
                <span className="text-slate-300 font-mono text-[11px]">
                  {lastSavedAt ? new Date(lastSavedAt).toLocaleTimeString() : 'Belum disimpan sesi ini'}
                </span>
              </div>
            </div>

            {/* Recommendations preview */}
            {activePreset?.recommendations && activePreset.recommendations.length > 0 && (
              <div className="pt-3 border-t border-slate-800 space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Panduan Preset:
                </span>
                <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                  {activePreset.recommendations.map((rec, idx) => (
                    <li key={idx} className="leading-snug text-slate-400">
                      <span className="text-slate-300">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Action Buttons: Simpan, Terapkan di Roblox, Reset */}
          <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 space-y-2.5 shadow-xl backdrop-blur-sm">
            {/* Primary Action 1: Terapkan di Roblox (Opens Manual Guide) */}
            <button
              type="button"
              onClick={handleApply}
              disabled={applyingState}
              className="w-full min-h-[48px] py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-transform active:scale-[0.98] shadow-lg shadow-cyan-500/25 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{applyingState ? 'Mempersiapkan Panduan...' : 'Terapkan di Roblox'}</span>
            </button>
            <p className="text-[11px] text-center text-slate-400 px-2">
              Menyimpan konfigurasi dan membuka panduan langkah mandiri di menu Roblox.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              {/* Action 2: Simpan Konfigurasi */}
              <button
                type="button"
                onClick={handleSave}
                disabled={savingState}
                className="min-h-[44px] py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-colors cursor-pointer shadow-sm"
              >
                <Save className="w-3.5 h-3.5 text-cyan-400" />
                <span>{savingState ? 'Menyimpan...' : 'Simpan'}</span>
              </button>

              {/* Action 3: Reset */}
              <button
                type="button"
                onClick={resetConfiguration}
                className="min-h-[44px] py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 font-medium text-xs flex items-center justify-center gap-1.5 border border-slate-800 transition-colors cursor-pointer shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span>Reset</span>
              </button>
            </div>

            {/* Direct Connect / Launch Roblox */}
            <button
              type="button"
              onClick={() => setIsRobloxConnectModalOpen(true)}
              className="w-full min-h-[44px] py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 text-cyan-400 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <Gamepad2 className="w-4 h-4 text-cyan-400" />
              <span>Buka / Sambung Roblox Langsung</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
