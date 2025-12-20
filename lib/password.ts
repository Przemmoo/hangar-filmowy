/**
 * Password hashing utilities compatible with Edge Runtime
 * Uses Web Crypto API instead of bcryptjs for Cloudflare compatibility
 */

/**
 * Hash a password using SHA-256 (compatible with Edge Runtime)
 * Note: For production, consider using a more secure KDF like PBKDF2
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

/**
 * For compatibility with existing bcrypt hashes, we need a different approach
 * This function checks if the hash is bcrypt format and uses a different verification
 */
export async function verifyPasswordCompat(password: string, hash: string): Promise<boolean> {
  // Check if it's a bcrypt hash (starts with $2a$, $2b$, or $2y$)
  if (hash.startsWith('$2a$') || hash.startsWith('$2b$') || hash.startsWith('$2y$')) {
    // For bcrypt hashes, we need to use a server-side verification
    // This won't work in Edge Runtime, so we'll need to migrate passwords
    throw new Error('Bcrypt hashes are not supported in Edge Runtime. Please migrate to SHA-256.');
  }
  
  return verifyPassword(password, hash);
}
