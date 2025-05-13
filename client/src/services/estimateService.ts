import api from './api';

// Define types
export interface Estimate {
  _id?: string;
  itemName: string;
  category: string;
  period?: string;
  description: string;
  condition: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  country?: string;
  city?: string;
  preferredContact: string;
  timeframe?: string;
  additionalNotes?: string;
  photos?: string[];
  status?: 'new' | 'in_progress' | 'completed' | 'declined';
  isRead?: boolean;
  adminNotes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface EstimateFilters {
  page?: number;
  limit?: number;
  sort?: string;
  status?: string;
  isRead?: boolean;
  search?: string;
}

// Get all estimates with filters (admin only)
export const getAllEstimates = async (filters: EstimateFilters = {}) => {
  const response = await api.get('/estimates', { params: filters });
  return response.data;
};

// Get estimate statistics (admin only)
export const getEstimateStats = async () => {
  const response = await api.get('/estimates/stats');
  return response.data;
};

// Get estimate by ID (admin only)
export const getEstimateById = async (id: string) => {
  const response = await api.get(`/estimates/${id}`);
  return response.data;
};

// Create a new estimate (public)
export const createEstimate = async (estimateData: Estimate) => {
  const response = await api.post('/estimates', estimateData);
  return response.data;
};

// Reply to an estimate request (admin only)
export const replyToEstimate = async (id: string, reply: string) => {
  const response = await api.post(`/estimates/${id}/reply`, { reply });
  return response.data;
};

// Update estimate status (admin only)
export const updateEstimateStatus = async (id: string, status: string) => {
  const response = await api.patch(`/estimates/${id}/status`, { status });
  return response.data;
};

// Toggle read status (admin only)
export const toggleReadStatus = async (id: string) => {
  const response = await api.patch(`/estimates/${id}/toggle-read`);
  return response.data;
};

// Add admin notes (admin only)
export const addAdminNotes = async (id: string, notes: string) => {
  const response = await api.patch(`/estimates/${id}/notes`, { notes });
  return response.data;
};

// Delete an estimate (admin only)
export const deleteEstimate = async (id: string) => {
  const response = await api.delete(`/estimates/${id}`);
  return response.data;
};

// Create exportable service object
const estimateService = {
  getAllEstimates,
  getEstimateStats,
  getEstimateById,
  createEstimate,
  replyToEstimate,
  updateEstimateStatus,
  toggleReadStatus,
  addAdminNotes,
  deleteEstimate
};

export default estimateService; 