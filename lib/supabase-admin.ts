/**
 * Supabase Admin Client - używa Service Role Key
 * TYLKO dla operacji backendowych w API routes!
 * NIGDY nie używaj tego w komponentach klienckich!
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing Supabase environment variables');
}

/**
 * Tworzy nagłówki z Service Role Key dla pełnego dostępu do bazy
 * Bypasses RLS - używaj tylko w zaufanym kodzie backendowym!
 */
export function getSupabaseAdminHeaders() {
  return {
    'apikey': SUPABASE_SERVICE_ROLE_KEY,
    'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    'Content-Type': 'application/json',
  };
}

/**
 * Helper do wykonywania zapytań do Supabase jako admin
 */
export async function supabaseAdminFetch(
  path: string,
  options?: RequestInit
): Promise<Response> {
  const url = `${SUPABASE_URL}/rest/v1${path}`;
  
  return fetch(url, {
    ...options,
    headers: {
      ...getSupabaseAdminHeaders(),
      ...options?.headers,
    },
  });
}

/**
 * Wykonuje zapytanie SELECT z automatycznym parseowaniem JSON
 */
export async function supabaseAdminSelect<T = any>(
  table: string,
  query: string = '*'
): Promise<T[]> {
  const response = await supabaseAdminFetch(`/${table}?select=${query}`);
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Supabase query failed: ${error}`);
  }
  
  return response.json();
}

/**
 * Wykonuje zapytanie INSERT
 */
export async function supabaseAdminInsert<T = any>(
  table: string,
  data: any
): Promise<T> {
  const response = await supabaseAdminFetch(`/${table}`, {
    method: 'POST',
    headers: {
      'Prefer': 'return=representation',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Supabase insert failed: ${error}`);
  }
  
  const result = await response.json();
  return Array.isArray(result) ? result[0] : result;
}

/**
 * Wykonuje zapytanie UPDATE
 */
export async function supabaseAdminUpdate<T = any>(
  table: string,
  data: any,
  filter: string
): Promise<T> {
  const response = await supabaseAdminFetch(`/${table}?${filter}`, {
    method: 'PATCH',
    headers: {
      'Prefer': 'return=representation',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Supabase update failed: ${error}`);
  }
  
  const result = await response.json();
  return Array.isArray(result) ? result[0] : result;
}

/**
 * Wykonuje zapytanie DELETE
 */
export async function supabaseAdminDelete(
  table: string,
  filter: string
): Promise<void> {
  const response = await supabaseAdminFetch(`/${table}?${filter}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Supabase delete failed: ${error}`);
  }
}
