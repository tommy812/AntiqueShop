import api from './api';

// Define types
export interface Period {
  _id?: string;
  name: string;
  description?: string;
  yearStart?: number;
  yearEnd?: number;
  image?: string;
  featured?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Get all periods
export const getAllPeriods = async (sort?: string) => {
  const response = await api.get('/periods', { params: { sort } });
  return response.data;
};

// Get featured periods
export const getFeaturedPeriods = async () => {
  const response = await api.get('/periods/featured');
  return response.data;
};

// Get period by ID
export const getPeriodById = async (id: string) => {
  const response = await api.get(`/periods/${id}`);
  return response.data;
};

// Create a new period (admin only)
export const createPeriod = async (periodData: Period) => {
  const response = await api.post('/periods', periodData);
  return response.data;
};

// Update a period (admin only)
export const updatePeriod = async (id: string, periodData: Period) => {
  const response = await api.put(`/periods/${id}`, periodData);
  return response.data;
};

// Delete a period (admin only)
export const deletePeriod = async (id: string) => {
  const response = await api.delete(`/periods/${id}`);
  return response.data;
};

// Toggle featured status (admin only)
export const toggleFeatured = async (id: string) => {
  const response = await api.patch(`/periods/${id}/toggle-featured`);
  return response.data;
};

// Create exportable service object
const periodService = {
  getAllPeriods,
  getFeaturedPeriods,
  getPeriodById,
  createPeriod,
  updatePeriod,
  deletePeriod,
  toggleFeatured
};

export default periodService; 