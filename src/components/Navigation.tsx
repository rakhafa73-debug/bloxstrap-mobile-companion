import React from 'react';
import {
  Sliders,
  Layers,
  Activity,
  CheckCircle2,
  LayoutDashboard,
  User,
  ShieldCheck,
  Gamepad2,
} from 'lucide-react';
import { useGraphics, AVAILABLE_USERS } from '../context/GraphicsContext';

export type NavTab = 'dashboard' | 'graphics' | 'presets' | 'diagnostics' | 'tests';

interface NavigationProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentTab, onSelectTab }) => {
  const { currentUser, switchUser, robloxConnection, setIsRobloxConnectModalOpen } = useGraphics();

  return (
    <>
      {/* Top Bar - Strictly complies with 3-Zone Contract: Brand, Nav links, Primary action */}
      <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-6">
          {/* Zone 1: Single text element wordmark with emblem */}
          <div
            onClick={() => onSelectTab('dashboard')}
            className="flex items-center gap-2.5 shrink-0 cursor-pointer select-none group"
          >
            <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.35)] shrink-0 bg-slate-900">
              <img
                src="/src/assets/images/bloxstrap_emblem_1792642351934.jpg"
                alt="Bloxstrap Mobile"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-base sm:text-lg font-bold tracking-tight text-white group-hover:text-cyan-400 transition-colors font-display whitespace-nowrap">
              Bloxstrap Mobile
            </span>
            <span className="hidden sm:inline-block text-xs text-slate-400 font-normal">
              · Companion
            </span>
          </div>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-400">
            <button
              onClick={() => onSelectTab('dashboard')}
              className={`whitespace-nowrap transition-colors hover:text-white ${
                currentTab === 'dashboard' ? 'text-cyan-400 font-semibold' : ''
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => onSelectTab('graphics')}
              className={`whitespace-nowrap transition-colors hover:text-white ${
                currentTab === 'graphics' ? 'text-cyan-400 font-semibold' : ''
              }`}
            >
              Roblox Graphics
            </button>
            <button
              onClick={() => onSelectTab('presets')}
              className={`whitespace-nowrap transition-colors hover:text-white ${
                currentTab === 'presets' ? 'text-cyan-400 font-semibold' : ''
              }`}
            >
              Preset Manager
            </button>
            <button
              onClick={() => onSelectTab('diagnostics')}
              className={`whitespace-nowrap transition-colors hover:text-white ${
                currentTab === 'diagnostics' ? 'text-cyan-400 font-semibold' : ''
              }`}
            >
              Device Diagnostics
            </button>
            <button
              onClick={() => onSelectTab('tests')}
              className={`whitespace-nowrap transition-colors hover:text-white ${
                currentTab === 'tests' ? 'text-cyan-400 font-semibold' : ''
              }`}
            >
              Test Suite
            </button>
          </nav>

          {/* Zone 3: 1 primary action / User profile switch & Roblox Connect */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Direct Roblox Connection Trigger Button */}
            <button
              type="button"
              onClick={() => setIsRobloxConnectModalOpen(true)}
              className={`min-h-[36px] px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border cursor-pointer ${
                robloxConnection.isConnected
                  ? 'bg-slate-900 border-cyan-500/60 text-cyan-300 shadow-sm'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold border-cyan-400'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate max-w-[120px] sm:max-w-none">
                {robloxConnection.isConnected ? `@${robloxConnection.username}` : 'Sambung Roblox'}
              </span>
              {robloxConnection.isConnected && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              )}
            </button>

            {/* Profile Selector */}
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300">
              <User className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <select
                value={currentUser.id}
                onChange={e => switchUser(e.target.value)}
                aria-label="Pilih Profil Pengguna"
                className="bg-transparent text-slate-200 text-xs font-medium focus:outline-none cursor-pointer pr-1"
              >
                {AVAILABLE_USERS.map(u => (
                  <option key={u.id} value={u.id} className="bg-slate-900 text-slate-200">
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Fixed Bottom Tab Bar - Ergonomic Natural Thumb Zone */}
      <nav
        aria-label="Navigasi Bawah Ponsel"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 pb-safe"
      >
        <div className="grid grid-cols-5 items-center h-16 max-w-lg mx-auto px-1">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`min-h-[48px] flex flex-col items-center justify-center transition-colors ${
              currentTab === 'dashboard' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-tight mt-1 whitespace-nowrap">Home</span>
          </button>

          <button
            onClick={() => onSelectTab('graphics')}
            className={`min-h-[48px] flex flex-col items-center justify-center transition-colors ${
              currentTab === 'graphics' ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-tight mt-1 whitespace-nowrap">Graphics</span>
          </button>

          <button
            onClick={() => onSelectTab('presets')}
            className={`min-h-[48px] flex flex-col items-center justify-center transition-colors ${
              currentTab === 'presets' ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-tight mt-1 whitespace-nowrap">Presets</span>
          </button>

          <button
            onClick={() => onSelectTab('diagnostics')}
            className={`min-h-[48px] flex flex-col items-center justify-center transition-colors ${
              currentTab === 'diagnostics' ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-tight mt-1 whitespace-nowrap">Device</span>
          </button>

          <button
            onClick={() => onSelectTab('tests')}
            className={`min-h-[48px] flex flex-col items-center justify-center transition-colors ${
              currentTab === 'tests' ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-tight mt-1 whitespace-nowrap">Tests</span>
          </button>
        </div>
      </nav>
    </>
  );
};
