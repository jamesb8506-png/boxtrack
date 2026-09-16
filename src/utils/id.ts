/**
 * Génère un identifiant unique. Utilise crypto.randomUUID si disponible
 * (tous navigateurs mobiles modernes), sinon un fallback simple.
 */
export function generateId(prefix = ''): string {
  const uuid =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
  return prefix ? `${prefix}_${uuid}` : uuid;
}
