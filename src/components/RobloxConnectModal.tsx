import React, { useState } from 'react';
import {
  X,
  Smartphone,
  ExternalLink,
  Play,
  CheckCircle2,
  Copy,
  Link,
  Unlink,
  Sparkles,
  Gamepad2,
  ShieldCheck,
  Search,
  Check,
} from 'lucide-react';
import { useGraphics } from '../context/GraphicsContext';
import { POPULAR_EXPERIENCES, robloxBridge } from '../lib/robloxBridge';

interface RobloxConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RobloxConnectModal: React.FC<RobloxConnectModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    config,
    activePreset,
    robloxConnection,
    connectRoblox,
    disconnectRoblox,
    launchRobloxApp,
    launchRobloxExperience,
    showToast,
  } = useGraphics();

  const [inputUsername, setInputUsername] = useState('');
  const [customPlaceId, setCustomPlaceId] = useState('');
  const [copiedQuick, setCopiedQuick] = useState(false);

  if (!isOpen) return null;

  const handleConnectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUsername.trim()) return;
    connectRoblox(inputUsername.trim());
    setInputUsername('');
  };

  const handleCopyAndLaunch = async () => {
    await robloxBridge.copyConfigForRoblox({
      mode: config.graphicsModePreference,
      quality: config.qualityPreference,
      priority: config.performancePriority,
    });
    setCopiedQuick(true);
    setTimeout(() => setCopiedQuick(false), 2000);
    showToast('Rekomendasi disalin ke clipboard! Membuka Roblox...', 'info');
    robloxBridge.launchApp();
  };

  const handleLaunchCustomExperience = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPlaceId.trim()) return;
    launchRobloxExperience(customPlaceId.trim(), `Game (Place ID: ${customPlaceId.trim()})`);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="roblox-connect-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm transition-opacity"
    >
      <div className="w-full sm:max-w-xl bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom duration-200">
        {/* Mobile Grab Handle */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center">
          <div className="w-10 h-1.5 bg-slate-700 rounded-full" />
        </div>

        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-800 flex items-center justify-center text-cyan-400 shrink-0">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <h2 id="roblox-connect-title" className="text-base sm:text-lg font-bold text-white font-display">
                Sambung Langsung ke Roblox
              </h2>
              <p className="text-xs text-slate-400">
                Roblox Mobile Deep-Link Protocol & Profile Bridge
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Tutup"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="px-5 py-4 overflow-y-auto space-y-5 text-slate-300 text-xs">
          {/* Main Direct Launch Action Box */}
          <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/30 border border-cyan-500/40 rounded-2xl p-4.5 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white uppercase tracking-wider block">
                  Buka Aplikasi Roblox di Ponsel Ini
                </span>
                <span className="text-[11px] text-slate-400 block">
                  Protokol resmi <code className="text-cyan-400 font-mono">roblox://</code>
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-md border border-cyan-800">
                Level {config.qualityPreference} / 10
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {/* Button 1: Direct Open */}
              <button
                type="button"
                onClick={launchRobloxApp}
                className="min-h-[48px] px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-transform active:scale-[0.98] shadow-lg shadow-cyan-500/20 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Buka Aplikasi Roblox</span>
              </button>

              {/* Button 2: Copy & Launch */}
              <button
                type="button"
                onClick={handleCopyAndLaunch}
                className="min-h-[48px] px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors cursor-pointer"
              >
                {copiedQuick ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
                <span>{copiedQuick ? 'Tersalin! Membuka...' : 'Salin Nilai & Luncurkan'}</span>
              </button>
            </div>
          </div>

          {/* Player Profile Connection Section */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                Profil Pemain Roblox Terhubung
              </span>
              {robloxConnection.isConnected && (
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Tersambung</span>
                </span>
              )}
            </div>

            {robloxConnection.isConnected ? (
              <div className="flex items-center justify-between gap-3 p-3 bg-slate-900 border border-slate-800 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden border border-cyan-500/50 shrink-0">
                    <img
                      src={robloxConnection.avatarUrl}
                      alt={robloxConnection.username}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="font-bold text-white text-xs block">
                      @{robloxConnection.username}
                    </span>
                    <span className="text-[11px] text-slate-400 block font-mono">
                      ID: {robloxConnection.userId}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={disconnectRoblox}
                  className="min-h-[38px] px-3 rounded-lg border border-rose-900/60 text-rose-400 hover:bg-rose-950/40 text-xs font-medium flex items-center gap-1 transition-colors"
                >
                  <Unlink className="w-3.5 h-3.5" />
                  <span>Putuskan</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleConnectSubmit} className="space-y-2">
                <p className="text-slate-400 text-[11px]">
                  Masukkan username Roblox Anda untuk menautkan profil ke Bloxstrap Companion:
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputUsername}
                    onChange={e => setInputUsername(e.target.value)}
                    placeholder="Contoh: GamerBlox2026"
                    className="flex-1 min-h-[44px] px-3 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="submit"
                    className="min-h-[44px] px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0"
                  >
                    <Link className="w-3.5 h-3.5" />
                    <span>Sambungkan</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Quick Launch into Popular Experiences */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                Luncurkan Experience Roblox Populer:
              </span>
              <span className="text-slate-500 text-[11px]">Direct Launch</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {POPULAR_EXPERIENCES.map(exp => (
                <button
                  key={exp.placeId}
                  type="button"
                  onClick={() => launchRobloxExperience(exp.placeId, exp.name)}
                  className="min-h-[52px] p-2.5 rounded-xl bg-slate-950/90 border border-slate-800/90 hover:border-cyan-500/60 hover:bg-slate-900 text-left transition-all flex flex-col justify-between group cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-1 w-full">
                    <span className="font-bold text-white text-xs group-hover:text-cyan-400 transition-colors truncate">
                      {exp.name}
                    </span>
                    <Play className="w-3 h-3 text-cyan-400 opacity-60 group-hover:opacity-100 shrink-0 mt-0.5" />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 w-full mt-1">
                    <span>{exp.category}</span>
                    <span className="font-mono text-cyan-400">Lv.{exp.recommendedQuality}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Place ID Launcher */}
          <form onSubmit={handleLaunchCustomExperience} className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
            <span className="font-semibold text-slate-300 block text-[11px]">
              Luncurkan Experience Berdasarkan Place ID Kustom:
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                value={customPlaceId}
                onChange={e => setCustomPlaceId(e.target.value)}
                placeholder="Masukkan Place ID (misal: 2753915549)"
                className="flex-1 min-h-[40px] px-3 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-500 font-mono"
              />
              <button
                type="submit"
                className="min-h-[40px] px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-semibold text-xs flex items-center gap-1.5 transition-colors shrink-0"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Buka Game</span>
              </button>
            </div>
          </form>

          {/* Security & Sandbox Transparency */}
          <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl flex items-start gap-2.5 text-slate-400 text-[11px] leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              Protokol tautan langsung menggunakan skema URI resmi (<code className="text-slate-300">roblox://</code>). Bloxstrap Companion tidak menggunakan injeksi runtime atau modifikasi APK tidak sah.
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
