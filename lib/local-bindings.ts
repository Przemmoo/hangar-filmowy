/**
 * Mock Cloudflare bindings dla lokalnego developmentu
 * Używa lokalnej bazy D1 przez wrangler
 */

import { getRequestContext } from '@cloudflare/next-on-pages';

export function getCloudflareContext() {
  try {
    // W środowisku Cloudflare Workers
    return getRequestContext();
  } catch {
    // Lokalnie - zwróć undefined, będziemy obsługiwać osobno
    return undefined;
  }
}

export function getDB() {
  const context = getCloudflareContext();
  return (context?.env as any)?.DB;
}

export function getR2Bucket() {
  const context = getCloudflareContext();
  return (context?.env as any)?.MEDIA_BUCKET;
}
