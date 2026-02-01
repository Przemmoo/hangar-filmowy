/**
 * Cloudflare R2 Storage Helper
 * Obsługa uploadów i zarządzania plikami mediów
 */

import { R2Bucket } from '@cloudflare/workers-types';

/**
 * Get R2 bucket instance from request context
 */
export function getMediaBucket(): R2Bucket {
  // @ts-ignore - Cloudflare Workers runtime binding
  return process.env.MEDIA_BUCKET as R2Bucket;
}

/**
 * Get public R2 URL for media files
 * Hardcoded because process.env doesn't work reliably in edge runtime
 */
export function getR2PublicURL(): string {
  return 'https://media.hangarfilmowy.pl';
}

/**
 * Upload file to R2
 * @param file File to upload
 * @param filename Optional custom filename (auto-generated if not provided)
 * @returns Object with key and public URL
 */
export async function uploadToR2(
  file: File,
  filename?: string
): Promise<{ key: string; url: string }> {
  const bucket = getMediaBucket();
  const publicURL = getR2PublicURL();
  
  // Generate unique filename if not provided
  const fileExt = file.name.split('.').pop();
  const key = filename || `${crypto.randomUUID()}.${fileExt}`;
  
  // Convert File to ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();
  
  // Upload to R2
  await bucket.put(key, arrayBuffer, {
    httpMetadata: {
      contentType: file.type,
    },
    customMetadata: {
      originalFilename: file.name,
      uploadedAt: new Date().toISOString(),
    },
  });
  
  // Return key and public URL
  return {
    key,
    url: `${publicURL}/${key}`,
  };
}

/**
 * Delete file from R2
 * @param key File key to delete
 */
export async function deleteFromR2(key: string): Promise<void> {
  const bucket = getMediaBucket();
  await bucket.delete(key);
}

/**
 * Get file metadata from R2
 * @param key File key
 */
export async function getR2FileMetadata(key: string) {
  const bucket = getMediaBucket();
  const object = await bucket.head(key);
  
  if (!object) {
    return null;
  }
  
  return {
    key,
    size: object.size,
    uploaded: object.uploaded,
    httpMetadata: object.httpMetadata,
    customMetadata: object.customMetadata,
  };
}

/**
 * List files in R2 bucket
 * @param options Listing options
 */
export async function listR2Files(options?: {
  prefix?: string;
  limit?: number;
  cursor?: string;
}) {
  const bucket = getMediaBucket();
  
  const result = await bucket.list({
    prefix: options?.prefix,
    limit: options?.limit || 1000,
    cursor: options?.cursor,
  });
  
  return {
    objects: result.objects.map((obj: any) => ({
      key: obj.key,
      size: obj.size,
      uploaded: obj.uploaded,
    })),
    truncated: result.truncated,
  };
}

/**
 * Extract filename from R2 URL
 */
export function extractR2Key(url: string): string | null {
  const publicURL = getR2PublicURL();
  
  if (!url.startsWith(publicURL)) {
    return null;
  }
  
  return url.replace(`${publicURL}/`, '');
}

/**
 * Validate file type for upload
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check if it's an image
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'Only image files are allowed' };
  }
  
  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 10MB' };
  }
  
  // Check allowed image types
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Allowed formats: JPEG, PNG, WebP, GIF, SVG' };
  }
  
  return { valid: true };
}
