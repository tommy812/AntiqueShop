import api from './api';
import cacheService from './cacheService';

// Define types
export interface Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string | { _id: string; name: string };
  period: string | { _id: string; name: string };
  dimensions?: {
    width: number;
    height: number;
    depth: number;
    unit: string;
  };
  measures?: {
    width: number;
    height: number;
    depth: number;
    unit: string;
  };
  condition?: string;
  provenance?: string;
  origin?: string;
  history?: string;
  delivery?: string;
  featured?: boolean;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  sort?: string;
  category?: string;
  period?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  search?: string;
}

export interface ProductsResponse {
  products: Product[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

// Cache TTLs (Time To Live)
const CACHE_TTL = {
  PRODUCT_LIST: 5 * 60 * 1000, // 5 minutes
  PRODUCT_DETAIL: 10 * 60 * 1000, // 10 minutes
  FEATURED_PRODUCTS: 15 * 60 * 1000 // 15 minutes
};

// Generate cache key for products with filters
const getProductsCacheKey = (filters: ProductFilters = {}): string => {
  return `products:${JSON.stringify(filters)}`;
};

// Get all products with optional filters
export const getProducts = async (filters: ProductFilters = {}): Promise<ProductsResponse> => {
  const cacheKey = getProductsCacheKey(filters);
  
  // Try to get from cache first
  const cachedData = cacheService.get<ProductsResponse>(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  
  // If not in cache, fetch from API
  const response = await api.get('/products', { params: filters });
  
  // Cache the response
  cacheService.set(cacheKey, response.data, CACHE_TTL.PRODUCT_LIST);
  
  return response.data;
};

// Get featured products
export const getFeaturedProducts = async (): Promise<Product[]> => {
  const cacheKey = 'products:featured';
  
  // Try to get from cache first
  const cachedData = cacheService.get<Product[]>(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  
  // If not in cache, fetch from API
  const response = await api.get('/products/featured');
  
  // Cache the response
  cacheService.set(cacheKey, response.data, CACHE_TTL.FEATURED_PRODUCTS);
  
  return response.data;
};

// Get product by ID
export const getProductById = async (id: string): Promise<Product> => {
  const cacheKey = `product:${id}`;
  
  // Try to get from cache first
  const cachedData = cacheService.get<Product>(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  
  // If not in cache, fetch from API
  const response = await api.get(`/products/${id}`);
  
  // Cache the response
  cacheService.set(cacheKey, response.data, CACHE_TTL.PRODUCT_DETAIL);
  
  return response.data;
};

// Get products by category
export const getProductsByCategory = async (categoryId: string, filters: ProductFilters = {}): Promise<ProductsResponse> => {
  const cacheKey = `products:category:${categoryId}:${JSON.stringify(filters)}`;
  
  // Try to get from cache first
  const cachedData = cacheService.get<ProductsResponse>(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  
  // If not in cache, fetch from API
  const response = await api.get(`/products/category/${categoryId}`, { params: filters });
  
  // Cache the response
  cacheService.set(cacheKey, response.data, CACHE_TTL.PRODUCT_LIST);
  
  return response.data;
};

// Get products by period
export const getProductsByPeriod = async (periodId: string, filters: ProductFilters = {}): Promise<ProductsResponse> => {
  const cacheKey = `products:period:${periodId}:${JSON.stringify(filters)}`;
  
  // Try to get from cache first
  const cachedData = cacheService.get<ProductsResponse>(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  
  // If not in cache, fetch from API
  const response = await api.get(`/products/period/${periodId}`, { params: filters });
  
  // Cache the response
  cacheService.set(cacheKey, response.data, CACHE_TTL.PRODUCT_LIST);
  
  return response.data;
};

// Create a new product (admin only)
export const createProduct = async (productData: FormData) => {
  const response = await api.post('/products', productData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  // Invalidate product list cache
  invalidateProductsCache();
  
  return response.data;
};

// Update a product (admin only)
export const updateProduct = async (id: string, productData: FormData) => {
  const response = await api.put(`/products/${id}`, productData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  // Invalidate related caches
  cacheService.remove(`product:${id}`);
  invalidateProductsCache();
  
  return response.data;
};

// Delete a product (admin only)
export const deleteProduct = async (id: string) => {
  const response = await api.delete(`/products/${id}`);
  
  // Invalidate related caches
  cacheService.remove(`product:${id}`);
  invalidateProductsCache();
  
  return response.data;
};

// Update product status (admin only)
export const updateProductStatus = async (id: string, status: string) => {
  const response = await api.patch(`/products/${id}/status`, { status });
  
  // Invalidate related caches
  cacheService.remove(`product:${id}`);
  invalidateProductsCache();
  
  return response.data;
};

// Helper to invalidate all product list related caches
const invalidateProductsCache = () => {
  const cacheKeys = cacheService.keys();
  
  cacheKeys.forEach(key => {
    if (
      key.startsWith('products:') || 
      key === 'products:featured'
    ) {
      cacheService.remove(key);
    }
  });
};

// Create exportable service object
const productService = {
  getProducts,
  getFeaturedProducts,
  getProductById,
  getProductsByCategory,
  getProductsByPeriod,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStatus
};

export default productService; 