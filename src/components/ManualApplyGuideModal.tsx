import React from 'react';
import {
  X,
  Smartphone,
  Sliders,
  CheckCircle2,
  Info,
  ExternalLink,
  Flame,
  Battery,
  Play,
} from 'lucide-react';
import { useGraphics } from '../context/GraphicsContext';
import { robloxBridge } from '../lib/robloxBridge';

interface ManualApplyGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFinishReturnToDashboard: () => void;
}

export const ManualApplyGuideModal: React.FC<ManualApplyGuideModalProps> = ({
  isOpen,
  onClose,
  onFinishReturnToDashboard,
}) => {
  const { config, activePreset, applyResult } = useGraphics();

  if (!isOpen) return null;

  const qualityVal = config.qualityPreference;
  const modeVal = config.graphicsModePreference === 'automatic' ? 'Automatic' : 'Manual';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm transition-opacity"
    >
      {/* Container: Bottom sheet on mobile, rounded card on desktop */}
      <div className="w-full sm:max-w-2xl bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom duration-200">
        {/* Mobile Grab Handle */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center">
          <div className="w-10 h-1.5 bg-slate-700 rounded-full" />
        </div>

        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between gap-4">
          <div>
            <h2 id="modal-title" className="text-lg font-bold text-white font-display">
              Panduan Penerapan di Roblox Mobile
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Bloxstrap Companion · Penerapan Manual Mandiri
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup panduan"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="px-5 py-4 overflow-y-auto space-y-5 text-slate-300 text-sm">
          {/* Status Label Banner - Explicitly honest: NO fake "Berhasil diterapkan ke Roblox" */}
          <div className="bg-slate-950 border border-cyan-900/50 rounded-xl p-3.5 space-y-1.5">
            <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs">
              <Info className="w-4 h-4 shrink-0" />
              <span>Status: Preferensi Disimpan di Companion</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Karena Roblox Mobile beroperasi di sandbox Android tanpa API kontrol eksternal resmi, Bloxstrap Companion tidak menyuntikkan kode atau memodifikasi file game. Ikuti panduan langkah di bawah ini untuk mencocokkan pengaturan in-game Anda.
            </p>
          </div>

          {/* Quick Summary of Recommended Values */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
              <span className="text-[11px] text-slate-400 block">Graphics Mode</span>
              <span className="text-sm font-bold text-cyan-400 font-mono mt-0.5 block">{modeVal}</span>
            </div>
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
              <span className="text-[11px] text-slate-400 block">Kualitas Slider</span>
              <span className="text-sm font-bold text-cyan-400 font-mono mt-0.5 block">
                Level {qualityVal} <span className="text-slate-400 text-xs font-normal">/ 10</span>
              </span>
            </div>
            <div className="col-span-2 sm:col-span-1 bg-slate-950/70 border border-slate-800 rounded-xl p-3">
              <span className="text-[11px] text-slate-400 block">Preset Referensi</span>
              <span className="text-sm font-semibold text-white truncate mt-0.5 block">
                {activePreset?.name || 'Kustom'}
              </span>
            </div>
          </div>

          {/* Direct Launch Roblox App Button */}
          <div className="flex items-center justify-between gap-3 p-3 bg-gradient-to-r from-cyan-950/60 to-slate-900 border border-cyan-500/40 rounded-xl">
            <div>
              <span className="font-bold text-white text-xs block">
                Buka Roblox di Ponsel Anda Sekarang:
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Membuka aplikasi resmi Roblox via protokol <code className="text-cyan-400 font-mono">roblox://</code>
              </span>
            </div>
            <button
              type="button"
              onClick={() => robloxBridge.launchApp()}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-transform active:scale-[0.98] shrink-0 shadow-md shadow-cyan-500/20 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Buka Roblox</span>
            </button>
          </div>

          {/* In-game Visual Reference Mockup */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-300 block">
              Tampilan Menu Pengaturan Roblox:
            </span>
            <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
              <img
                src="/src/assets/images/roblox_graphics_guide_1792641591031.jpg"
                alt="Panduan Menu Pengaturan Grafik Roblox Mobile"
                referrerPolicy="no-referrer"
                className="w-full h-44 sm:h-52 object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex items-end p-3">
                <span className="text-xs text-slate-200">
                  Target slider Roblox in-game: <strong className="text-cyan-400">Level {qualityVal}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Step-by-Step Instructions */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Langkah Penerapan Manual di Roblox:
            </h3>

            <div className="space-y-2.5">
              <div className="flex gap-3 items-start bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
                <span className="w-6 h-6 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <h4 className="text-xs font-semibold text-white">Buka Aplikasi Roblox</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Luncurkan aplikasi Roblox di ponsel Anda dan masuki experience / game yang ingin Anda mainkan.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
                <span className="w-6 h-6 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <h4 className="text-xs font-semibold text-white">Buka Menu Pengaturan In-Game</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Ketuk ikon logo Roblox (atau menu hamburger tiga garis) di sudut kiri atas layar ponsel Anda, lalu pilih tab <strong className="text-slate-200">"Settings" (Pengaturan)</strong>.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
                <span className="w-6 h-6 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <h4 className="text-xs font-semibold text-white">
                    Ubah Graphics Mode ke {modeVal}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Cari baris <strong className="text-slate-200">"Graphics Mode"</strong>. Ubah nilainya ke <strong className="text-cyan-400">{modeVal}</strong> agar slider manual dapat diatur.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
                <span className="w-6 h-6 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  4
                </span>
                <div>
                  <h4 className="text-xs font-semibold text-white">
                    Geser Graphics Quality ke Level {qualityVal}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Tekan tombol panah atau geser slider baris <strong className="text-slate-200">"Graphics Quality"</strong> hingga mencapai <strong className="text-cyan-400">Level {qualityVal}</strong> dari total 10 segmen.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
                <span className="w-6 h-6 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  5
                </span>
                <div>
                  <h4 className="text-xs font-semibold text-white">Lanjutkan Bermain & Evaluasi</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Tekan <strong className="text-slate-200">"Resume"</strong> untuk menutup menu. Mainkan selama 2-3 menit untuk memastikan kelancaran kontrol dan suhu perangkat tetap stabil.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Device & Battery Safety Note */}
          <div className="p-3 bg-amber-950/30 border border-amber-900/50 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold">
              <Battery className="w-4 h-4 shrink-0" />
              <span>Rekomendasi Baterai & Suhu Android</span>
            </div>
            <p className="text-xs text-amber-200/80 leading-relaxed">
              Jika bodi ponsel terasa panas setelah 15 menit, kurangi slider Roblox sebesar 1–2 tingkat dan hindari bermain sambil mengisi daya menggunakan charger berdaya tinggi (fast charging).
            </p>
          </div>
        </div>

        {/* Modal Action Footer - Natural Thumb Zone with Full-width Selesai Button */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400 text-center sm:text-left">
            <span>Konfigurasi tersimpan di profil Companion.</span>
          </div>
          <div className="w-full sm:w-auto flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-1/2 sm:w-auto min-h-[44px] px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors whitespace-nowrap"
            >
              Tutup Panduan
            </button>
            <button
              onClick={onFinishReturnToDashboard}
              className="w-1/2 sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors whitespace-nowrap shadow-lg shadow-cyan-500/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Selesai & Ke Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
