/**
 * Interface abstraite de stockage.
 *
 * Toute la logique métier (services/boxerService, services/evaluationService)
 * passe par cette interface. Le reste de l'application ne connaît jamais
 * LocalStorage directement.
 *
 * Pour brancher Supabase/Firebase plus tard : créer une nouvelle classe
 * implémentant StorageProvider (ex: SupabaseStorageProvider) et la
 * substituer dans services/storage.ts. Aucun autre fichier n'a besoin
 * de changer.
 */
export interface StorageProvider {
  getItem<T>(key: string): T | null;
  setItem<T>(key: string, value: T): void;
  removeItem(key: string): void;
}

const isStorageAvailable = (() => {
  try {
    const testKey = '__boxtrack_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
})();

/**
 * Implémentation LocalStorage. Sérialise/désérialise en JSON.
 * Ne lève jamais d'exception vers l'appelant : en cas d'erreur
 * (storage plein, JSON invalide, navigation privée...), retourne
 * une valeur par défaut sûre et journalise l'erreur.
 */
export class LocalStorageProvider implements StorageProvider {
  getItem<T>(key: string): T | null {
    if (!isStorageAvailable) return null;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) return null;
      return JSON.parse(raw) as T;
    } catch (err) {
      console.error(`[storage] Lecture impossible pour la clé "${key}"`, err);
      return null;
    }
  }

  setItem<T>(key: string, value: T): void {
    if (!isStorageAvailable) {
      console.error('[storage] LocalStorage indisponible : sauvegarde impossible.');
      return;
    }
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(`[storage] Écriture impossible pour la clé "${key}"`, err);
    }
  }

  removeItem(key: string): void {
    if (!isStorageAvailable) return;
    try {
      window.localStorage.removeItem(key);
    } catch (err) {
      console.error(`[storage] Suppression impossible pour la clé "${key}"`, err);
    }
  }
}

export const storageAvailable = isStorageAvailable;
