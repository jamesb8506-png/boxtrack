import { useEffect, useRef, useState } from 'react';

type WakeLockSentinel = { release: () => Promise<void>; addEventListener: (type: string, listener: () => void) => void };
type NavigatorWithWakeLock = Navigator & { wakeLock?: { request: (type: 'screen') => Promise<WakeLockSentinel> } };

/**
 * Empêche l'écran de s'éteindre tant que `active` est vrai, via la Screen
 * Wake Lock API. Cette API n'est pas supportée par tous les navigateurs
 * (notamment certaines versions de Safari/iOS) : dans ce cas, le hook ne
 * fait rien plutôt que d'échouer — le timer continue de fonctionner
 * normalement, seul le maintien d'écran allumé n'est pas garanti.
 */
export function useWakeLock(active: boolean): { supported: boolean } {
  const sentinelRef = useRef<WakeLockSentinel | null>(null);
  const [supported] = useState(
    () => typeof navigator !== 'undefined' && 'wakeLock' in navigator
  );

  useEffect(() => {
    if (!active || !supported) return;

    let cancelled = false;

    async function requestLock() {
      try {
        const nav = navigator as NavigatorWithWakeLock;
        const sentinel = await nav.wakeLock?.request('screen');
        if (sentinel && !cancelled) {
          sentinelRef.current = sentinel;
        }
      } catch {
        // Refusé par le navigateur (ex : onglet en arrière-plan) : ignoré
      }
    }

    requestLock();

    // Le verrou est automatiquement relâché si l'app passe en arrière-plan ;
    // on le redemande quand elle redevient visible.
    function handleVisibilityChange() {
      if (document.visibilityState === 'visible' && active) {
        requestLock();
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      sentinelRef.current?.release().catch(() => {});
      sentinelRef.current = null;
    };
  }, [active, supported]);

  return { supported };
}
