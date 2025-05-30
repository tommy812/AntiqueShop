/**
 * Utility functions for handling images in the application
 */

// Base URL for the API (should match the one in api.ts)
const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://antique-shop.vercel.app'
    : 'http://localhost:5001');

// Default fallback image when an image is not available
export const DEFAULT_FALLBACK_IMAGE = 'https://via.placeholder.com/400x300?text=No+Image';

/**
 * Get the full URL for an image path from the API
 *
 * @param imagePath - The relative path of the image from the API
 * @returns The full URL to the image
 */
export const getImageUrl = (imagePath?: string): string => {
  if (!imagePath) return DEFAULT_FALLBACK_IMAGE;

  // If the image already has a full URL (starts with http), return it as is
  // This handles Vercel Blob URLs which are complete URLs
  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  // Special case for Vercel Blob filenames (they contain the pathname)
  if (imagePath.startsWith('products/')) {
    // This is a Vercel Blob path reference without the full URL
    // The client should request the full URL from the API
    return `${API_BASE_URL}/api/upload/product/${imagePath.split('/')[1]}`;
  }

  // Make sure the image path starts with a slash for traditional uploads
  const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

  return `${API_BASE_URL}${normalizedPath}`;
};

/**
 * Get a properly sized thumbnail URL
 *
 * @param imagePath - The relative path of the image from the API
 * @param size - The size of the thumbnail (small, medium, large)
 * @returns The full URL to the thumbnail
 */
export const getThumbnailUrl = (
  imagePath?: string,
  size: 'small' | 'medium' | 'large' = 'medium'
): string => {
  if (!imagePath) return DEFAULT_FALLBACK_IMAGE;

  // In a real app, you might append query parameters for different sizes
  // or use a different path structure for thumbnails
  return getImageUrl(imagePath);
};

/**
 * Get URLs for a product's images
 *
 * @param images - Array of image paths
 * @returns Array of full image URLs
 */
export const getProductImageUrls = (images?: string[]): string[] => {
  if (!images || images.length === 0) {
    return [DEFAULT_FALLBACK_IMAGE];
  }

  return images.map(img => getImageUrl(img));
};

/**
 * Determine if an image URL is a Vercel Blob URL
 *
 * @param url - The image URL to check
 * @returns Boolean indicating if it's a Vercel Blob URL
 */
export const isVercelBlobUrl = (url: string): boolean => {
  return url.includes('.public.blob.vercel-storage.com') || url.includes('vercel-blob.com');
};

// Create exportable utilities object
const imageUtils = {
  getImageUrl,
  getThumbnailUrl,
  getProductImageUrls,
  isVercelBlobUrl,
  DEFAULT_FALLBACK_IMAGE,
};

export default imageUtils;
