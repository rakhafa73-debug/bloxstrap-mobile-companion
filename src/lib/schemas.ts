import { z } from 'zod';

export const GraphicsModePreferenceSchema = z.enum(['automatic', 'manual'] as const);

export const PerformancePrioritySchema = z.enum(['performance', 'balanced', 'visual'] as const);

export const BatteryPrioritySchema = z.enum(['standard', 'battery_saver'] as const);

export const QualityPreferenceSchema = z
  .number()
  .int('Kualitas grafik harus berupa bilangan bulat')
  .min(1, 'Kualitas grafik minimal level 1')
  .max(10, 'Kualitas grafik maksimal level 10');

export const GraphicsConfigSchema = z.object({
  graphicsModePreference: GraphicsModePreferenceSchema,
  qualityPreference: QualityPreferenceSchema,
  performancePriority: PerformancePrioritySchema,
  batteryPriority: BatteryPrioritySchema,
  companionAnimations: z.boolean(),
});

export const GraphicsPresetSchema = GraphicsConfigSchema.extend({
  id: z.string().min(1, 'ID preset tidak boleh kosong'),
  name: z.string().min(1, 'Nama preset minimal 1 karakter').max(50, 'Nama preset maksimal 50 karakter'),
  description: z.string().max(250, 'Deskripsi maksimal 250 karakter').default(''),
  createdAt: z.string().min(1, 'Format tanggal createdAt tidak valid'),
  updatedAt: z.string().min(1, 'Format tanggal updatedAt tidak valid'),
  isBuiltIn: z.boolean().optional(),
  userId: z.string().min(1, 'User ID tidak boleh kosong'),
  recommendations: z.array(z.string()).default([]),
});

export const PresetExportPackageSchema = z.object({
  app: z.literal('Bloxstrap Mobile Companion'),
  schemaVersion: z.string(),
  exportedAt: z.string(),
  presets: z.array(GraphicsPresetSchema).min(1, 'Paket ekspor harus berisi setidaknya satu preset'),
});

// Single preset or array or package parser
export const PresetImportSchema = z.union([
  PresetExportPackageSchema,
  z.array(GraphicsPresetSchema).min(1, 'File harus berisi setidaknya satu preset'),
  GraphicsPresetSchema,
  GraphicsConfigSchema,
]);

export type ValidatedGraphicsConfig = z.infer<typeof GraphicsConfigSchema>;
export type ValidatedGraphicsPreset = z.infer<typeof GraphicsPresetSchema>;
export type ValidatedExportPackage = z.infer<typeof PresetExportPackageSchema>;
