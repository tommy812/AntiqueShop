import api from './api';

// Define types
export interface Category {
  _id?: string;
  name: string;
  description?: string;
  image?: string;
  featured?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Get all categories
export const getAllCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};

// Get featured categories
export const getFeaturedCategories = async () => {
  const response = await api.get('/categories/featured');
  return response.data;
};

// Get category by ID
export const getCategoryById = async (id: string) => {
  const response = await api.get(`/categories/${id}`);
  return response.data;
};

// Create a new category (admin only)
export const createCategory = async (categoryData: Category) => {
  const response = await api.post('/categories', categoryData);
  return response.data;
};

// Update a category (admin only)
export const updateCategory = async (id: string, categoryData: Category) => {
  const response = await api.put(`/categories/${id}`, categoryData);
  return response.data;
};

// Delete a category (admin only)
export const deleteCategory = async (id: string) => {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
};

// Toggle featured status (admin only)
export const toggleFeatured = async (id: string) => {
  const response = await api.patch(`/categories/${id}/toggle-featured`);
  return response.data;
};

// Create exportable service object
const categoryService = {
  getAllCategories,
  getFeaturedCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleFeatured
};

export default categoryService; 