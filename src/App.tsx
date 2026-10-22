/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GraphicsProvider, useGraphics } from './context/GraphicsContext';
import { Navigation, NavTab } from './components/Navigation';
import { DashboardOverviewPage } from './components/DashboardOverviewPage';
import { GraphicsSettingsPage } from './components/GraphicsSettingsPage';
import { PresetManagerPage } from './components/PresetManagerPage';
import { DeviceDiagnosticsPage } from './components/DeviceDiagnosticsPage';
import { TestSuiteRunner } from './components/TestSuiteRunner';
import { ManualApplyGuideModal } from './components/ManualApplyGuideModal';
import { RobloxConnectModal } from './components/RobloxConnectModal';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

function AppContent() {
  // Support URL path parsing (e.g. /dashboard/graphics)
  const getInitialTab = (): NavTab => {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('/dashboard/graphics') || path.includes('/graphics')) return 'graphics';
    if (path.includes('/presets')) return 'presets';
    if (path.includes('/diagnostics')) return 'diagnostics';
    if (path.includes('/tests')) return 'tests';
    return 'graphics'; // Default directly to Graphics Settings page as requested
  };

  const [currentTab, setCurrentTab] = useState<NavTab>(getInitialTab);
  const {
    isApplyModalOpen,
    setIsApplyModalOpen,
    isRobloxConnectModalOpen,
    setIsRobloxConnectModalOpen,
    toast,
    dismissToast,
  } = useGraphics();

  const handleSelectTab = (tab: NavTab) => {
    setCurrentTab(tab);
    let targetPath = '/dashboard';
    if (tab === 'graphics') targetPath = '/dashboard/graphics';
    else if (tab === 'presets') targetPath = '/dashboard/presets';
    else if (tab === 'diagnostics') targetPath = '/dashboard/diagnostics';
    else if (tab === 'tests') targetPath = '/dashboard/tests';

    try {
      window.history.pushState({}, '', targetPath);
    } catch {
      // In sandbox environment
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentTab(getInitialTab());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Bar Navigation */}
      <Navigation currentTab={currentTab} onSelectTab={handleSelectTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentTab === 'dashboard' && (
          <DashboardOverviewPage onNavigate={handleSelectTab} />
        )}

        {currentTab === 'graphics' && (
          <GraphicsSettingsPage
            onOpenPresets={() => handleSelectTab('presets')}
            onOpenDiagnostics={() => handleSelectTab('diagnostics')}
          />
        )}

        {currentTab === 'presets' && (
          <PresetManagerPage onNavigateToGraphics={() => handleSelectTab('graphics')} />
        )}

        {currentTab === 'diagnostics' && (
          <DeviceDiagnosticsPage onNavigateToGraphics={() => handleSelectTab('graphics')} />
        )}

        {currentTab === 'tests' && <TestSuiteRunner />}
      </main>

      {/* Manual Apply In-Game Guide Modal / Bottom Sheet */}
      <ManualApplyGuideModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onFinishReturnToDashboard={() => {
          setIsApplyModalOpen(false);
          handleSelectTab('dashboard');
        }}
      />

      {/* Direct Roblox App & Experience Bridge Modal */}
      <RobloxConnectModal
        isOpen={isRobloxConnectModalOpen}
        onClose={() => setIsRobloxConnectModalOpen(false)}
      />

      {/* Global Toast Notification */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 max-w-md animate-in slide-in-from-bottom duration-200"
        >
          <div
            className={`p-3.5 rounded-xl border shadow-xl flex items-start gap-3 backdrop-blur-md ${
              toast.type === 'success'
                ? 'bg-slate-900/95 border-cyan-500/80 text-cyan-200'
                : toast.type === 'error'
                ? 'bg-slate-900/95 border-rose-500/80 text-rose-200'
                : 'bg-slate-900/95 border-slate-700 text-slate-200'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />}
            {toast.type === 'error' && <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />}
            <p className="text-xs font-medium leading-relaxed flex-1">{toast.message}</p>
            <button
              onClick={dismissToast}
              aria-label="Tutup pemberitahuan"
              className="text-slate-400 hover:text-white p-0.5 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <GraphicsProvider>
      <AppContent />
    </GraphicsProvider>
  );
}
