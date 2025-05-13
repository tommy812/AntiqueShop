/**
 * Utility functions for handling images in the application
 */

// Base URL for the API (should match the one in api.ts)
const API_BASE_URL = 'http://localhost:5001';

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
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Make sure the image path starts with a slash
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
export const getThumbnailUrl = (imagePath?: string, size: 'small' | 'medium' | 'large' = 'medium'): string => {
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

// Create exportable utilities object
const imageUtils = {
  getImageUrl,
  getThumbnailUrl,
  getProductImageUrls,
  DEFAULT_FALLBACK_IMAGE
};

export default imageUtils; 