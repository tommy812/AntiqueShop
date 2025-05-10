import api from './api';

// Define types
export interface Message {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  product?: string;
  status?: 'new' | 'read' | 'replied' | 'closed';
  isRead?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MessageFilters {
  page?: number;
  limit?: number;
  sort?: string;
  status?: string;
  isRead?: boolean;
  search?: string;
}

// Get all messages with filters (admin only)
export const getAllMessages = async (filters: MessageFilters = {}) => {
  const response = await api.get('/messages', { params: filters });
  return response.data;
};

// Get message statistics (admin only)
export const getMessageStats = async () => {
  const response = await api.get('/messages/stats');
  return response.data;
};

// Get message by ID (admin only)
export const getMessageById = async (id: string) => {
  const response = await api.get(`/messages/${id}`);
  return response.data;
};

// Create a new message (public)
export const createMessage = async (messageData: Message) => {
  const response = await api.post('/messages', messageData);
  return response.data;
};

// Update message status (admin only)
export const updateMessageStatus = async (id: string, status: string) => {
  const response = await api.patch(`/messages/${id}/status`, { status });
  return response.data;
};

// Toggle read status (admin only)
export const toggleReadStatus = async (id: string) => {
  const response = await api.patch(`/messages/${id}/toggle-read`);
  return response.data;
};

// Delete a message (admin only)
export const deleteMessage = async (id: string) => {
  const response = await api.delete(`/messages/${id}`);
  return response.data;
};

export default {
  getAllMessages,
  getMessageStats,
  getMessageById,
  createMessage,
  updateMessageStatus,
  toggleReadStatus,
  deleteMessage
}; 