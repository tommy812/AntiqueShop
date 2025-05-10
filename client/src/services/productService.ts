import api from './api';

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

// Get all products with optional filters
export const getProducts = async (filters: ProductFilters = {}) => {
  const response = await api.get('/products', { params: filters });
  return response.data;
};

// Get featured products
export const getFeaturedProducts = async () => {
  const response = await api.get('/products/featured');
  return response.data;
};

// Get product by ID
export const getProductById = async (id: string) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

// Get products by category
export const getProductsByCategory = async (categoryId: string, filters: ProductFilters = {}) => {
  const response = await api.get(`/products/category/${categoryId}`, { params: filters });
  return response.data;
};

// Get products by period
export const getProductsByPeriod = async (periodId: string, filters: ProductFilters = {}) => {
  const response = await api.get(`/products/period/${periodId}`, { params: filters });
  return response.data;
};

// Create a new product (admin only)
export const createProduct = async (productData: FormData) => {
  const response = await api.post('/products', productData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Update a product (admin only)
export const updateProduct = async (id: string, productData: FormData) => {
  const response = await api.put(`/products/${id}`, productData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Delete a product (admin only)
export const deleteProduct = async (id: string) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

// Update product status (admin only)
export const updateProductStatus = async (id: string, status: string) => {
  const response = await api.patch(`/products/${id}/status`, { status });
  return response.data;
};

export default {
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