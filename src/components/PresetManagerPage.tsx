import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Copy,
  Trash2,
  Edit2,
  Download,
  Upload,
  CheckCircle,
  AlertTriangle,
  Search,
  Sliders,
  Check,
  X,
  FileJson,
} from 'lucide-react';
import { useGraphics } from '../context/GraphicsContext';
import { GraphicsPreset, GraphicsModePreference, PerformancePriority, BatteryPriority } from '../types/graphics';
import { GraphicsPresetSchema } from '../lib/schemas';

interface PresetManagerPageProps {
  onNavigateToGraphics: () => void;
}

export const PresetManagerPage: React.FC<PresetManagerPageProps> = ({ onNavigateToGraphics }) => {
  const {
    presets,
    activePresetId,
    selectPreset,
    createPreset,
    updatePreset,
    duplicatePreset,
    deletePreset,
    exportPresets,
    importPresets,
    showToast,
  } = useGraphics();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'builtin' | 'custom'>('all');

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPreset, setEditingPreset] = useState<GraphicsPreset | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);

  // Form state for Create / Edit
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formMode, setFormMode] = useState<GraphicsModePreference>('manual');
  const [formQuality, setFormQuality] = useState(5);
  const [formPerf, setFormPerf] = useState<PerformancePriority>('balanced');
  const [formBattery, setFormBattery] = useState<BatteryPriority>('standard');
  const [formCompanionAnim, setFormCompanionAnim] = useState(true);
  const [formRecommendations, setFormRecommendations] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const openCreateModal = () => {
    setFormName('Preset Kustom Saya');
    setFormDesc('Dioptimalkan untuk sesi permainan mobile.');
    setFormMode('manual');
    setFormQuality(5);
    setFormPerf('balanced');
    setFormBattery('standard');
    setFormCompanionAnim(true);
    setFormRecommendations('Atur kecerahan layar ponsel 60%.\nGunakan slider level 5 di Roblox in-game.');
    setFormError(null);
    setIsCreateModalOpen(true);
  };

  const openEditModal = (preset: GraphicsPreset) => {
    setEditingPreset(preset);
    setFormName(preset.name);
    setFormDesc(preset.description);
    setFormMode(preset.graphicsModePreference);
    setFormQuality(preset.qualityPreference);
    setFormPerf(preset.performancePriority);
    setFormBattery(preset.batteryPriority);
    setFormCompanionAnim(preset.companionAnimations);
    setFormRecommendations((preset.recommendations || []).join('\n'));
    setFormError(null);
  };

  const handleSaveCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const recs = formRecommendations
      .split('\n')
      .map(r => r.trim())
      .filter(r => r.length > 0);

    const res = createPreset({
      name: formName,
      description: formDesc,
      graphicsModePreference: formMode,
      qualityPreference: formQuality,
      performancePriority: formPerf,
      batteryPriority: formBattery,
      companionAnimations: formCompanionAnim,
      recommendations: recs,
    });

    if (res.success) {
      setIsCreateModalOpen(false);
    } else {
      setFormError(res.error || 'Gagal membuat preset');
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPreset) return;

    const recs = formRecommendations
      .split('\n')
      .map(r => r.trim())
      .filter(r => r.length > 0);

    const res = updatePreset(editingPreset.id, {
      name: formName,
      description: formDesc,
      graphicsModePreference: formMode,
      qualityPreference: formQuality,
      performancePriority: formPerf,
      batteryPriority: formBattery,
      companionAnimations: formCompanionAnim,
      recommendations: recs,
    });

    if (res.success) {
      setEditingPreset(null);
    } else {
      setFormError(res.error || 'Gagal menyimpan preset');
    }
  };

  const handleExportDownload = () => {
    const jsonStr = exportPresets();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bloxstrap-presets-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Berkas JSON preset berhasil diunduh.');
  };

  const handleImportSubmit = () => {
    if (!importJsonText.trim()) {
      setImportError('Mohon masukkan atau tempel konten JSON terlebih dahulu.');
      return;
    }
    const res = importPresets(importJsonText);
    if (res.success) {
      setIsImportModalOpen(false);
      setImportJsonText('');
      setImportError(null);
    } else {
      setImportError(res.error || 'Format JSON atau skema tidak valid');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      const content = evt.target?.result as string;
      setImportJsonText(content);
      setImportError(null);
    };
    reader.readAsText(file);
  };

  const filteredPresets = presets.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (filterType === 'builtin') return !!p.isBuiltIn;
    if (filterType === 'custom') return !p.isBuiltIn;
    return true;
  });

  return (
    <div className="space-y-6 pb-24 md:pb-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display">
            Preset Manager
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Kelola, buat, ekspor, dan impor profil konfigurasi preferensi grafik
          </p>
        </div>

        {/* Global Action Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={openCreateModal}
            className="min-h-[44px] px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Preset</span>
          </button>
          <button
            onClick={handleExportDownload}
            className="min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Ekspor JSON</span>
          </button>
          <button
            onClick={() => {
              setImportJsonText('');
              setImportError(null);
              setIsImportModalOpen(true);
            }}
            className="min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-emerald-400" />
            <span>Impor JSON</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari preset berdasarkan nama atau deskripsi..."
            className="w-full min-h-[44px] pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`min-h-[36px] px-3 text-xs font-medium rounded-lg transition-colors ${
              filterType === 'all' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Semua ({presets.length})
          </button>
          <button
            onClick={() => setFilterType('builtin')}
            className={`min-h-[36px] px-3 text-xs font-medium rounded-lg transition-colors ${
              filterType === 'builtin' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Bawaan Sistem
          </button>
          <button
            onClick={() => setFilterType('custom')}
            className={`min-h-[36px] px-3 text-xs font-medium rounded-lg transition-colors ${
              filterType === 'custom' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Kustom Pengguna
          </button>
        </div>
      </div>

      {/* Preset Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPresets.map(preset => {
          const isActive = activePresetId === preset.id;
          return (
            <div
              key={preset.id}
              className={`rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                isActive
                  ? 'bg-slate-900/95 border-cyan-500/80 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-500/40'
                  : 'bg-slate-900/60 border-slate-800/90 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="space-y-3">
                {/* Title & Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">{preset.name}</h3>
                      {isActive && (
                        <span className="text-[11px] font-semibold text-cyan-400">
                          (Aktif)
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                      <span>{preset.isBuiltIn ? 'Preset Sistem' : 'Kustom'}</span>
                      <span aria-hidden="true">·</span>
                      <span>Dibuat: {new Date(preset.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <span className="font-mono text-xs font-bold px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-cyan-400 tabular-nums">
                    Level {preset.qualityPreference}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed min-h-[36px]">
                  {preset.description}
                </p>

                {/* Specs List */}
                <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500 block">Graphics Mode</span>
                    <span className="font-mono text-slate-200 capitalize mt-0.5 block">
                      {preset.graphicsModePreference}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Prioritas Performa</span>
                    <span className="font-mono text-cyan-400 capitalize mt-0.5 block">
                      {preset.performancePriority}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Prioritas Baterai</span>
                    <span className="font-mono text-slate-200 capitalize mt-0.5 block">
                      {(preset.batteryPriority || 'standard').replace('_', ' ')}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Animasi Companion</span>
                    <span className="font-mono text-slate-200 mt-0.5 block">
                      {preset.companionAnimations ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </div>
                </div>

                {/* Recommendations list preview */}
                {preset.recommendations && preset.recommendations.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                      Rekomendasi Utama:
                    </span>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {preset.recommendations[0]}
                    </p>
                  </div>
                )}
              </div>

              {/* Card Actions */}
              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    selectPreset(preset.id);
                    onNavigateToGraphics();
                  }}
                  className={`min-h-[44px] flex-1 px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    isActive
                      ? 'bg-slate-800 text-cyan-400 border border-cyan-800'
                      : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isActive ? 'Aktif di Companion' : 'Gunakan Preset'}</span>
                </button>

                <button
                  onClick={() => duplicatePreset(preset.id)}
                  aria-label="Gandakan Preset"
                  title="Gandakan Preset"
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>

                <button
                  onClick={() => openEditModal(preset)}
                  aria-label="Edit Preset"
                  title="Edit Preset"
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                {!preset.isBuiltIn && (
                  <button
                    onClick={() => {
                      if (confirm(`Hapus preset "${preset.name}"?`)) {
                        deletePreset(preset.id);
                      }
                    }}
                    aria-label="Hapus Preset"
                    title="Hapus Preset"
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-slate-950 border border-slate-800 text-rose-400 hover:text-rose-300 hover:border-rose-900 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredPresets.length === 0 && (
        <div className="text-center py-12 bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
          <Layers className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-white">Tidak ada preset ditemukan</h3>
          <p className="text-xs text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian atau filter Anda.</p>
        </div>
      )}

      {/* Modal: Create Preset */}
      {isCreateModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl max-h-[90vh] overflow-y-auto p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white font-display">Buat Preset Grafik Baru</h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                aria-label="Tutup"
                className="text-slate-400 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCreate} className="space-y-4 pt-4 text-xs">
              {formError && (
                <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-xl text-rose-300">
                  {formError}
                </div>
              )}

              <div>
                <label className="font-semibold text-slate-200 block mb-1">Nama Preset</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  className="w-full min-h-[44px] px-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-200 block mb-1">Deskripsi</label>
                <textarea
                  rows={2}
                  value={formDesc}
                  onChange={e => setFormDesc(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-200 block mb-1">Graphics Mode</label>
                  <select
                    value={formMode}
                    onChange={e => setFormMode(e.target.value as GraphicsModePreference)}
                    className="w-full min-h-[44px] px-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                  >
                    <option value="manual">Manual (Disarankan)</option>
                    <option value="automatic">Automatic</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-200 block mb-1">
                    Quality Level ({formQuality}/10)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formQuality}
                    onChange={e => setFormQuality(parseInt(e.target.value, 10))}
                    className="w-full min-h-[44px] accent-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-200 block mb-1">Prioritas Performa</label>
                  <select
                    value={formPerf}
                    onChange={e => setFormPerf(e.target.value as PerformancePriority)}
                    className="w-full min-h-[44px] px-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                  >
                    <option value="performance">Performance</option>
                    <option value="balanced">Balanced</option>
                    <option value="visual">Visual Quality</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-200 block mb-1">Prioritas Baterai</label>
                  <select
                    value={formBattery}
                    onChange={e => setFormBattery(e.target.value as BatteryPriority)}
                    className="w-full min-h-[44px] px-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                  >
                    <option value="standard">Standard</option>
                    <option value="battery_saver">Battery Saver</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-200 block mb-1">
                  Rekomendasi Khusus (Satu per baris)
                </label>
                <textarea
                  rows={3}
                  value={formRecommendations}
                  onChange={e => setFormRecommendations(e.target.value)}
                  placeholder="Contoh: Kurangi kecerahan ponsel ke 50%"
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="min-h-[44px] px-4 rounded-xl border border-slate-700 text-slate-300 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
                >
                  Simpan Preset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Preset */}
      {editingPreset && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl max-h-[90vh] overflow-y-auto p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white font-display">
                Edit Preset: {editingPreset.name}
              </h2>
              <button
                onClick={() => setEditingPreset(null)}
                aria-label="Tutup"
                className="text-slate-400 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 pt-4 text-xs">
              {formError && (
                <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-xl text-rose-300">
                  {formError}
                </div>
              )}

              <div>
                <label className="font-semibold text-slate-200 block mb-1">Nama Preset</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  className="w-full min-h-[44px] px-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-200 block mb-1">Deskripsi</label>
                <textarea
                  rows={2}
                  value={formDesc}
                  onChange={e => setFormDesc(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-200 block mb-1">Graphics Mode</label>
                  <select
                    value={formMode}
                    onChange={e => setFormMode(e.target.value as GraphicsModePreference)}
                    className="w-full min-h-[44px] px-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                  >
                    <option value="manual">Manual (Disarankan)</option>
                    <option value="automatic">Automatic</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-200 block mb-1">
                    Quality Level ({formQuality}/10)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formQuality}
                    onChange={e => setFormQuality(parseInt(e.target.value, 10))}
                    className="w-full min-h-[44px] accent-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-200 block mb-1">Prioritas Performa</label>
                  <select
                    value={formPerf}
                    onChange={e => setFormPerf(e.target.value as PerformancePriority)}
                    className="w-full min-h-[44px] px-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                  >
                    <option value="performance">Performance</option>
                    <option value="balanced">Balanced</option>
                    <option value="visual">Visual Quality</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-200 block mb-1">Prioritas Baterai</label>
                  <select
                    value={formBattery}
                    onChange={e => setFormBattery(e.target.value as BatteryPriority)}
                    className="w-full min-h-[44px] px-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                  >
                    <option value="standard">Standard</option>
                    <option value="battery_saver">Battery Saver</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-200 block mb-1">
                  Rekomendasi Khusus (Satu per baris)
                </label>
                <textarea
                  rows={3}
                  value={formRecommendations}
                  onChange={e => setFormRecommendations(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPreset(null)}
                  className="min-h-[44px] px-4 rounded-xl border border-slate-700 text-slate-300 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
                >
                  Perbarui Preset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Import JSON with Zod Validation */}
      {isImportModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl max-h-[90vh] overflow-y-auto p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileJson className="w-5 h-5 text-emerald-400" />
                <h2 className="text-base font-bold text-white font-display">
                  Impor Konfigurasi Preset (Zod Validated)
                </h2>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                aria-label="Tutup"
                className="text-slate-400 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 pt-4 text-xs">
              <p className="text-slate-400">
                Pilih file JSON hasil ekspor atau tempel struktur JSON secara langsung. Sistem akan memvalidasi tipe data menggunakan skema Zod.
              </p>

              {importError && (
                <div className="p-3 bg-rose-950/70 border border-rose-800 rounded-xl text-rose-300 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Validasi Skema Gagal</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">{importError}</p>
                </div>
              )}

              <div>
                <label className="font-semibold text-slate-200 block mb-1.5">
                  Unggah Berkas .JSON:
                </label>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="w-full min-h-[44px] text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-slate-800 file:text-slate-200 file:font-semibold hover:file:bg-slate-700 cursor-pointer"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-200 block mb-1.5">
                  Atau Tempel Konten JSON:
                </label>
                <textarea
                  rows={6}
                  value={importJsonText}
                  onChange={e => {
                    setImportJsonText(e.target.value);
                    setImportError(null);
                  }}
                  placeholder='{"graphicsModePreference": "manual", "qualityPreference": 5, ...}'
                  className="w-full p-3 font-mono text-[11px] bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="min-h-[44px] px-4 rounded-xl border border-slate-700 text-slate-300 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleImportSubmit}
                  className="min-h-[44px] px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Validasi & Impor</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
