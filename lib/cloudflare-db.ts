/**
 * Cloudflare D1 Database Helper
 * Zamiennik dla Supabase Admin Client
 * Używa D1 binding z wrangler.toml
 */

import { D1Database } from '@cloudflare/workers-types';

/**
 * Get D1 database instance from request context
 * W Next.js on Cloudflare Pages, DB binding jest dostępny przez process.env
 */
export function getDB(): D1Database {
  // @ts-ignore - Cloudflare Workers runtime binding
  return process.env.DB as D1Database;
}

/**
 * Helper type for D1 results
 */
export interface D1Result<T = any> {
  results?: T[];
  success: boolean;
  meta?: {
    duration: number;
    rows_read: number;
    rows_written: number;
  };
  error?: string;
}

/**
 * Execute SELECT query and return results
 * @param query SQL query with ? placeholders
 * @param params Parameters to bind to query
 */
export async function dbSelect<T = any>(
  query: string,
  params: any[] = []
): Promise<T[]> {
  const db = getDB();
  
  try {
    const stmt = db.prepare(query);
    const result = await stmt.bind(...params).all<T>();
    
    if (!result.success) {
      throw new Error(result.error || 'Database query failed');
    }
    
    return result.results || [];
  } catch (error) {
    console.error('D1 SELECT error:', error);
    throw error;
  }
}

/**
 * Execute SELECT query and return first result
 * @param query SQL query with ? placeholders
 * @param params Parameters to bind to query
 */
export async function dbSelectOne<T = any>(
  query: string,
  params: any[] = []
): Promise<T | null> {
  const db = getDB();
  
  try {
    const stmt = db.prepare(query);
    const result = await stmt.bind(...params).first<T>();
    
    return result || null;
  } catch (error) {
    console.error('D1 SELECT ONE error:', error);
    throw error;
  }
}

/**
 * Execute INSERT query
 * @param query SQL query with ? placeholders
 * @param params Parameters to bind to query
 */
export async function dbInsert(
  query: string,
  params: any[] = []
): Promise<D1Result> {
  const db = getDB();
  
  try {
    const stmt = db.prepare(query);
    const result = await stmt.bind(...params).run();
    
    if (!result.success) {
      throw new Error(result.error || 'Insert failed');
    }
    
    return result;
  } catch (error) {
    console.error('D1 INSERT error:', error);
    throw error;
  }
}

/**
 * Execute UPDATE query
 * @param query SQL query with ? placeholders
 * @param params Parameters to bind to query
 */
export async function dbUpdate(
  query: string,
  params: any[] = []
): Promise<D1Result> {
  const db = getDB();
  
  try {
    const stmt = db.prepare(query);
    const result = await stmt.bind(...params).run();
    
    if (!result.success) {
      throw new Error(result.error || 'Update failed');
    }
    
    return result;
  } catch (error) {
    console.error('D1 UPDATE error:', error);
    throw error;
  }
}

/**
 * Execute DELETE query
 * @param query SQL query with ? placeholders
 * @param params Parameters to bind to query
 */
export async function dbDelete(
  query: string,
  params: any[] = []
): Promise<D1Result> {
  const db = getDB();
  
  try {
    const stmt = db.prepare(query);
    const result = await stmt.bind(...params).run();
    
    if (!result.success) {
      throw new Error(result.error || 'Delete failed');
    }
    
    return result;
  } catch (error) {
    console.error('D1 DELETE error:', error);
    throw error;
  }
}

/**
 * Execute batch operations (transaction)
 * @param statements Array of prepared statements
 */
export async function dbBatch(
  statements: { query: string; params?: any[] }[]
): Promise<D1Result[]> {
  const db = getDB();
  
  try {
    const stmts = statements.map(({ query, params = [] }) =>
      db.prepare(query).bind(...params)
    );
    
    const results = await db.batch(stmts);
    
    return results;
  } catch (error) {
    console.error('D1 BATCH error:', error);
    throw error;
  }
}

/**
 * Helper to parse JSON columns from SQLite
 * SQLite stores JSON as TEXT, so we need to parse it
 */
export function parseJSON<T = any>(value: string | null): T | null {
  if (!value) return null;
  
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

/**
 * Helper to stringify JSON for SQLite
 */
export function stringifyJSON(value: any): string {
  return JSON.stringify(value);
}

/**
 * Get current ISO timestamp for SQLite
 */
export function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Helper functions for common queries
 */

// Users
export async function getUserByEmail(email: string) {
  return dbSelectOne<{
    id: string;
    email: string;
    password: string;
    name: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  }>(
    'SELECT * FROM users WHERE email = ? LIMIT 1',
    [email]
  );
}

// Content
export async function getContentBySection(section: string) {
  const result = await dbSelectOne<{
    id: string;
    section: string;
    data: string;
    updatedAt: string;
    updatedBy: string;
  }>(
    'SELECT * FROM content WHERE section = ? LIMIT 1',
    [section]
  );
  
  if (result) {
    return {
      ...result,
      data: parseJSON(result.data),
    };
  }
  
  return null;
}

export async function getAllContent() {
  const results = await dbSelect<{
    section: string;
    data: string;
  }>(
    'SELECT section, data FROM content'
  );
  
  return results.map(row => ({
    section: row.section,
    data: parseJSON(row.data),
  }));
}

// Settings
export async function getAllSettings() {
  const results = await dbSelect<{
    key: string;
    value: string;
  }>(
    'SELECT key, value FROM settings'
  );
  
  return results.map(row => ({
    key: row.key,
    value: parseJSON(row.value),
  }));
}

export async function getSetting(key: string) {
  const result = await dbSelectOne<{
    key: string;
    value: string;
  }>(
    'SELECT key, value FROM settings WHERE key = ? LIMIT 1',
    [key]
  );
  
  if (result) {
    return {
      key: result.key,
      value: parseJSON(result.value),
    };
  }
  
  return null;
}
