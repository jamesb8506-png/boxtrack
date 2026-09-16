import { useCallback, useEffect, useState } from 'react';
import type { Route, RouteName } from '../types/route';

const DEFAULT_ROUTE: Route = { name: 'home' };

function parseHash(hash: string): Route {
  const clean = hash.replace(/^#\/?/, '');
  if (!clean) return DEFAULT_ROUTE;

  const [name, ...params] = clean.split('/');
  const query = new URLSearchParams(params.join('/'));

  const validNames: RouteName[] = [
    'home',
    'boxers',
    'boxer-profile',
    'boxer-form',
    'skills',
    'skill-detail',
    'evaluate',
    'history',
    'settings',
  ];

  if (!validNames.includes(name as RouteName)) return DEFAULT_ROUTE;

  return {
    name: name as RouteName,
    boxerId: query.get('boxerId') ?? undefined,
    skillId: query.get('skillId') ?? undefined,
  };
}

function routeToHash(route: Route): string {
  const params = new URLSearchParams();
  if (route.boxerId) params.set('boxerId', route.boxerId);
  if (route.skillId) params.set('skillId', route.skillId);
  const qs = params.toString();
  return `#/${route.name}${qs ? `/${qs}` : ''}`;
}

/**
 * Routeur minimal basé sur le hash de l'URL. Permet le bouton retour
 * du navigateur/mobile et le deep-linking, sans dépendance externe.
 */
export function useRouter() {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));

  useEffect(() => {
    const onHashChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = useCallback((next: Route) => {
    window.location.hash = routeToHash(next);
  }, []);

  return { route, navigate };
}
