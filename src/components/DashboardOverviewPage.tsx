import React from 'react';
import {
  Sliders,
  Layers,
  Activity,
  CheckCircle2,
  Play,
  ArrowRight,
  ShieldCheck,
  Zap,
  Battery,
  Sparkles,
  Flame,
  Cpu,
  Monitor,
  Gamepad2,
} from 'lucide-react';
import { useGraphics } from '../context/GraphicsContext';
import { NavTab } from './Navigation';

interface DashboardOverviewPageProps {
  onNavigate: (tab: NavTab) => void;
}

export const DashboardOverviewPage: React.FC<DashboardOverviewPageProps> = ({ onNavigate }) => {
  const {
    config,
    activePreset,
    activePresetId,
    presets,
    selectPreset,
    executeApplyInRoblox,
    setIsRobloxConnectModalOpen,
    robloxConnection,
  } = useGraphics();

  return (
    <div className="space-y-6 pb-24 md:pb-12 max-w-7xl mx-auto">
      {/* Hero Welcome Banner with Emblem & Glow */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800/90 p-6 md:p-8 shadow-2xl">
        {/* Subtle background ambient glows */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-60 h-60 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            {/* Bloxstrap Metallic Emblem */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-cyan-500/60 shadow-[0_0_24px_rgba(6,182,212,0.4)] shrink-0 bg-slate-950">
              <img
                src="/src/assets/images/bloxstrap_emblem_1792642351934.jpg"
                alt="Bloxstrap Mobile Companion Emblem"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-cyan-400 bg-cyan-950/80 border border-cyan-800/80 px-2 py-0.5 rounded">
                  Roblox Mobile 2026
                </span>
                <span className="text-xs text-slate-400">· Companion Tool</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display">
                Bloxstrap Mobile Companion
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                Pusat preferensi grafik Roblox Mobile, preset performa cerdas, mitigasi thermal throttling, dan panduan in-game resmi.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigate('graphics')}
              className="min-h-[48px] px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-slate-950 font-bold text-xs flex items-center gap-2 transition-transform active:scale-[0.98] shadow-lg shadow-cyan-500/25 cursor-pointer"
            >
              <Sliders className="w-4 h-4" />
              <span>Buka Roblox Graphics</span>
            </button>
            <button
              onClick={() => setIsRobloxConnectModalOpen(true)}
              className="min-h-[48px] px-4 py-2.5 rounded-xl bg-slate-900 border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 hover:text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-md"
            >
              <Gamepad2 className="w-4 h-4 text-cyan-400" />
              <span>{robloxConnection.isConnected ? `@${robloxConnection.username}` : 'Sambung ke Roblox'}</span>
            </button>
            <button
              onClick={() => executeApplyInRoblox()}
              className="min-h-[48px] px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-slate-600 text-slate-200 hover:text-white font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-md"
            >
              <Play className="w-3.5 h-3.5 text-cyan-400 fill-current" />
              <span>Panduan Manual</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Configuration Spotlight Card */}
      <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-5 md:p-6 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Profil Grafik Aktif Saat Ini
            </h2>
          </div>
          <span className="text-xs font-mono text-cyan-400 font-bold bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
            {activePreset?.name || 'Custom'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4">
            <span className="text-xs text-slate-400 block">Kualitas Slider</span>
            <span className="text-2xl font-bold text-cyan-400 font-mono tabular-nums mt-1 block">
              Level {config.qualityPreference} <span className="text-xs text-slate-500 font-normal">/ 10</span>
            </span>
            <span className="text-[11px] text-slate-500 mt-1 block">Skala panduan Roblox</span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4">
            <span className="text-xs text-slate-400 block">Graphics Mode</span>
            <span className="text-lg font-bold text-white font-mono capitalize mt-1 block">
              {config.graphicsModePreference}
            </span>
            <span className="text-[11px] text-slate-500 mt-1 block">Menu in-game switch</span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4">
            <span className="text-xs text-slate-400 block">Prioritas Performa</span>
            <span className="text-lg font-bold text-indigo-400 font-mono capitalize mt-1 block">
              {config.performancePriority}
            </span>
            <span className="text-[11px] text-slate-500 mt-1 block">Target respons sentuh</span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4">
            <span className="text-xs text-slate-400 block">Prioritas Baterai</span>
            <span className="text-lg font-bold text-emerald-400 font-mono capitalize mt-1 block">
              {(config.batteryPriority || 'standard').replace('_', ' ')}
            </span>
            <span className="text-[11px] text-slate-500 mt-1 block">Manajemen daya Android</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <p className="text-slate-400">
            {activePreset?.description || 'Preferensi kustom yang disesuaikan pengguna.'}
          </p>
          <button
            onClick={() => onNavigate('graphics')}
            className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 self-start sm:self-auto shrink-0 transition-colors"
          >
            <span>Sesuaikan Slider & Kontrol</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Feature Navigation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Roblox Graphics */}
        <div
          onClick={() => onNavigate('graphics')}
          className="bg-slate-900/70 border border-slate-800/90 hover:border-cyan-500/60 rounded-2xl p-5 flex flex-col justify-between transition-all cursor-pointer group shadow-lg hover:shadow-cyan-950/40"
        >
          <div className="space-y-3">
            <div className="w-11 h-11 rounded-xl bg-cyan-950/60 border border-cyan-800 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
                Roblox Graphics
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mt-1">
                Atur slider kualitas 1–10, simulasi visual in-game, mode manual/otomatis, dan panduan Roblox.
              </p>
            </div>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-800/70 flex items-center justify-between text-xs text-slate-400 group-hover:text-cyan-400 font-medium">
            <span>Buka Pengaturan Grafik</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>

        {/* Card 2: Preset Manager */}
        <div
          onClick={() => onNavigate('presets')}
          className="bg-slate-900/70 border border-slate-800/90 hover:border-indigo-500/60 rounded-2xl p-5 flex flex-col justify-between transition-all cursor-pointer group shadow-lg hover:shadow-indigo-950/40"
        >
          <div className="space-y-3">
            <div className="w-11 h-11 rounded-xl bg-indigo-950/60 border border-indigo-800 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">
                Preset Manager
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mt-1">
                Simpan, gandakan, buat profil kustom, dan lakukan ekspor/impor konfigurasi tervalidasi Zod.
              </p>
            </div>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-800/70 flex items-center justify-between text-xs text-slate-400 group-hover:text-indigo-400 font-medium">
            <span>{presets.length} Preset Tersimpan</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>

        {/* Card 3: Diagnostics & Thermal */}
        <div
          onClick={() => onNavigate('diagnostics')}
          className="bg-slate-900/70 border border-slate-800/90 hover:border-amber-500/60 rounded-2xl p-5 flex flex-col justify-between transition-all cursor-pointer group shadow-lg hover:shadow-amber-950/40"
        >
          <div className="space-y-3">
            <div className="w-11 h-11 rounded-xl bg-amber-950/60 border border-amber-800 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                Device Diagnostics
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mt-1">
                Analisis RAM, CPU cores, rekomendasi termal Android, dan pencegahan thermal throttling baterai.
              </p>
            </div>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-800/70 flex items-center justify-between text-xs text-slate-400 group-hover:text-amber-400 font-medium">
            <span>Cek Kapabilitas Ponsel</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>

      {/* Quick Preset Switcher Strip */}
      <div className="bg-slate-900/60 border border-slate-800/90 rounded-2xl p-5 space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Peralihan Cepat Preset Companion:
          </h3>
          <button
            onClick={() => onNavigate('presets')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
          >
            Lihat Semua Preset
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {presets.slice(0, 4).map(p => {
            const isActive = activePresetId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => selectPreset(p.id)}
                className={`min-h-[48px] px-3.5 py-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                  isActive
                    ? 'bg-cyan-950/60 border-cyan-500 text-white font-bold ring-1 ring-cyan-500/50 shadow-md'
                    : 'bg-slate-950 border-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <span className="truncate">{p.name}</span>
                <span className="font-mono text-[11px] text-cyan-400 ml-1 shrink-0">Lv.{p.qualityPreference}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Anti-Slop / Security Transparency Statement */}
      <div className="p-4 bg-slate-950/90 border border-slate-800/80 rounded-2xl flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-400 space-y-1">
          <p className="font-semibold text-slate-200">
            Jaminan Integritas & Keselamatan Akun:
          </p>
          <p className="leading-relaxed">
            Bloxstrap Mobile Companion adalah alat bantu utilitas dan rekomendasi. Aplikasi ini tidak pernah mengklaim melakukan modifikasi berkas internal Roblox, memori runtime, atau bypass proteksi. Seluruh penyesuaian in-game dilakukan secara legal dan aman melalui antarmuka pengaturan resmi yang disediakan Roblox.
          </p>
        </div>
      </div>
    </div>
  );
};
