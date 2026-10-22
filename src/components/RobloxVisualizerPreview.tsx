import React, { useState } from 'react';
import {
  Eye,
  Sun,
  Moon,
  Sparkles,
  Layers,
  Thermometer,
  ShieldAlert,
  Maximize2,
} from 'lucide-react';

interface RobloxVisualizerPreviewProps {
  qualityLevel: number; // 1 - 10
  mode: 'automatic' | 'manual';
}

export const RobloxVisualizerPreview: React.FC<RobloxVisualizerPreviewProps> = ({
  qualityLevel,
  mode,
}) => {
  const [activeScene, setActiveScene] = useState<'day' | 'night' | 'sunset'>('sunset');

  // Compute realistic technical characteristics based on Roblox graphic slider formula
  const drawDistanceStuds = qualityLevel * 240 + 100;
  const shadowType =
    qualityLevel <= 2
      ? 'None (Flat Shading)'
      : qualityLevel <= 5
      ? 'Voxel Lighting (Static)'
      : qualityLevel <= 7
      ? 'ShadowMap (Dynamic)'
      : 'Future Is Bright (Soft HDR)';

  const particleFidelity = `${qualityLevel * 10}%`;
  const waterReflections = qualityLevel >= 5 ? (qualityLevel >= 8 ? 'Specular + Refraction' : 'Planar Reflection') : 'Opaque Texture';
  
  const thermalLoad =
    qualityLevel <= 3
      ? { label: 'Rendah (Aman & Dingin)', color: 'text-emerald-400', bg: 'bg-emerald-500' }
      : qualityLevel <= 6
      ? { label: 'Sedang (Normal)', color: 'text-cyan-400', bg: 'bg-cyan-500' }
      : qualityLevel <= 8
      ? { label: 'Hangat (Beban GPU)', color: 'text-amber-400', bg: 'bg-amber-500' }
      : { label: 'Tinggi (Potensi Panas)', color: 'text-rose-400', bg: 'bg-rose-500' };

  // Calculate fog opacity inversely proportional to draw distance
  const fogOpacity = Math.max(0.08, 0.7 - (qualityLevel / 10) * 0.6);
  // Shadow depth
  const shadowOpacity = qualityLevel <= 2 ? 0 : Math.min(0.7, (qualityLevel / 10) * 0.75);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Top Header of the Preview Box */}
      <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-white">
            Simulasi Tampilan Visual Roblox
          </span>
        </div>

        {/* Scene Switcher buttons */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => setActiveScene('sunset')}
            className={`min-h-[28px] px-2 text-[10px] font-medium rounded transition-colors ${
              activeScene === 'sunset' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sunset
          </button>
          <button
            type="button"
            onClick={() => setActiveScene('night')}
            className={`min-h-[28px] px-2 text-[10px] font-medium rounded transition-colors ${
              activeScene === 'night' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Cyber Night
          </button>
          <button
            type="button"
            onClick={() => setActiveScene('day')}
            className={`min-h-[28px] px-2 text-[10px] font-medium rounded transition-colors ${
              activeScene === 'day' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Day
          </button>
        </div>
      </div>

      {/* Visual Canvas Simulation Container */}
      <div className="relative h-48 sm:h-56 w-full overflow-hidden select-none">
        {/* Dynamic Scene Background */}
        <div
          className={`absolute inset-0 transition-colors duration-500 ${
            activeScene === 'sunset'
              ? 'bg-gradient-to-b from-indigo-950 via-purple-900/80 to-amber-950/70'
              : activeScene === 'night'
              ? 'bg-gradient-to-b from-slate-950 via-slate-900 to-cyan-950/60'
              : 'bg-gradient-to-b from-sky-900 via-sky-800 to-indigo-950'
          }`}
        />

        {/* Sun / Moon celestial body */}
        <div
          className={`absolute rounded-full transition-all duration-300 ${
            activeScene === 'night'
              ? 'top-4 right-10 w-9 h-9 bg-slate-200 shadow-[0_0_24px_rgba(255,255,255,0.4)]'
              : activeScene === 'sunset'
              ? 'top-8 right-16 w-14 h-14 bg-amber-400 shadow-[0_0_40px_rgba(251,191,36,0.6)]'
              : 'top-4 right-12 w-12 h-12 bg-amber-100 shadow-[0_0_35px_rgba(254,240,138,0.8)]'
          }`}
        />

        {/* Distant Mountain Range (Rendered sharp or foggy depending on draw distance) */}
        <svg
          viewBox="0 0 500 150"
          className="absolute bottom-10 inset-x-0 w-full h-24 opacity-60 transition-opacity duration-300"
          preserveAspectRatio="none"
        >
          <polygon
            points="0,150 50,70 120,130 190,40 280,110 380,30 460,90 500,60 500,150"
            fill={activeScene === 'night' ? '#0f172a' : activeScene === 'sunset' ? '#4c1d95' : '#1e3a8a'}
          />
        </svg>

        {/* Mid-Ground Roblox Style Isometric Terrain & Towers */}
        <svg
          viewBox="0 0 500 150"
          className="absolute bottom-4 inset-x-0 w-full h-20 transition-all duration-300"
          preserveAspectRatio="none"
        >
          {/* Blocks */}
          <polygon
            points="0,150 90,80 180,120 270,75 360,110 450,70 500,100 500,150"
            fill={activeScene === 'night' ? '#1e293b' : activeScene === 'sunset' ? '#581c87' : '#0369a1'}
          />
        </svg>

        {/* Roblox Block Character & Fore-ground platform */}
        <div className="absolute bottom-4 left-8 sm:left-12 flex items-end gap-3 z-10">
          {/* Avatar representation (Classic blocky Roblox figure) */}
          <div className="relative flex flex-col items-center">
            {/* Head */}
            <div
              className={`w-5 h-5 rounded-sm border border-slate-900/60 transition-colors ${
                activeScene === 'night' ? 'bg-amber-300' : 'bg-amber-400'
              }`}
            />
            {/* Torso */}
            <div
              className={`w-8 h-8 rounded-sm -mt-0.5 border border-slate-900/60 flex items-center justify-center text-[8px] font-bold text-white ${
                activeScene === 'night' ? 'bg-cyan-600' : 'bg-blue-600'
              }`}
            >
              R
            </div>
            {/* Legs */}
            <div className="flex gap-0.5 -mt-0.5">
              <div className="w-3.5 h-6 bg-slate-800 rounded-b-sm" />
              <div className="w-3.5 h-6 bg-slate-800 rounded-b-sm" />
            </div>

            {/* Dynamic Shadow on the ground (Scales with quality preference) */}
            <div
              style={{
                opacity: shadowOpacity,
                filter: qualityLevel >= 7 ? 'blur(3px)' : 'none',
              }}
              className="absolute -bottom-1.5 w-12 h-2.5 bg-black rounded-full transition-all duration-200"
            />
          </div>

          {/* Blocky Tree / Landmark */}
          <div className="hidden xs:flex flex-col items-center ml-4">
            <div
              style={{
                boxShadow:
                  qualityLevel >= 8
                    ? '0 0 15px rgba(16, 185, 129, 0.4)'
                    : 'none',
              }}
              className="w-10 h-10 bg-emerald-600 rounded-sm border border-emerald-950/50"
            />
            <div className="w-3 h-5 bg-amber-900 -mt-0.5" />
          </div>
        </div>

        {/* Atmospheric Fog Overlay (Thicker on low level, clears up on high level) */}
        <div
          style={{ opacity: fogOpacity }}
          className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent pointer-events-none transition-opacity duration-300"
        />

        {/* Level 8+ Sun Rays / Bloom Effect Overlay */}
        {qualityLevel >= 8 && (
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-amber-300/10 to-amber-200/20 pointer-events-none mix-blend-screen" />
        )}

        {/* In-Game HUD overlay watermark */}
        <div className="absolute top-2.5 left-3 flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-950/80 border border-slate-800 text-[10px] font-mono text-cyan-300">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>SIMULATED QUALITY LEVEL: {qualityLevel}</span>
        </div>

        <div className="absolute top-2.5 right-3 text-right">
          <span className="text-[10px] font-mono font-bold text-slate-300 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
            {drawDistanceStuds} STUDS
          </span>
        </div>

        {/* Bottom ground line */}
        <div className="absolute bottom-0 inset-x-0 h-4 bg-slate-950/90 border-t border-slate-800" />
      </div>

      {/* Technical Breakdown Footer */}
      <div className="p-3.5 bg-slate-950/95 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div>
          <span className="text-[10px] text-slate-500 uppercase font-bold block">
            Jarak Pandang (Draw Distance)
          </span>
          <span className="font-mono font-semibold text-white mt-0.5 block">
            ~{drawDistanceStuds} Studs
          </span>
        </div>

        <div>
          <span className="text-[10px] text-slate-500 uppercase font-bold block">
            Pencahayaan & Bayangan
          </span>
          <span className="font-mono font-semibold text-cyan-400 mt-0.5 block truncate">
            {shadowType}
          </span>
        </div>

        <div>
          <span className="text-[10px] text-slate-500 uppercase font-bold block">
            Refleksi Air
          </span>
          <span className="font-mono font-semibold text-slate-300 mt-0.5 block truncate">
            {waterReflections}
          </span>
        </div>

        <div>
          <span className="text-[10px] text-slate-500 uppercase font-bold block">
            Beban Suhu Ponsel
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className={`w-2 h-2 rounded-full ${thermalLoad.bg}`} />
            <span className={`font-mono font-semibold ${thermalLoad.color} truncate`}>
              {thermalLoad.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
