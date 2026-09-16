import { LocalStorageProvider, type StorageProvider } from './storageProvider';

export const STORAGE_KEYS = {
  BOXERS: 'boxtrack.boxers.v1',
  EVALUATIONS: 'boxtrack.evaluations.v1',
  SETTINGS: 'boxtrack.settings.v1',
} as const;

// Point d'entrée unique. Pour migrer vers Supabase/Firebase, remplacer
// cette instance par une implémentation asynchrone (voir StorageProvider).
export const storage: StorageProvider = new LocalStorageProvider();
