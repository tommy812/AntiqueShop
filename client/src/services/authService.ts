import api from './api';

// Define types
export interface User {
  _id?: string;
  username: string;
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  isActive?: boolean;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Login user
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await api.post('/users/login', credentials);

  // Store token in localStorage
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }

  return response.data;
};

// Register new user
export const register = async (userData: RegisterData): Promise<AuthResponse> => {
  const response = await api.post('/users/register', userData);

  // Store token in localStorage if registration includes automatic login
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }

  return response.data;
};

// Get current user profile
export const getProfile = async (): Promise<User> => {
  const response = await api.get('/users/profile');
  return response.data;
};

// Update user profile
export const updateProfile = async (userData: Partial<User>): Promise<User> => {
  const response = await api.put('/users/profile', userData);

  // Update stored user data
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const updatedUser = { ...currentUser, ...response.data };
  localStorage.setItem('user', JSON.stringify(updatedUser));

  return response.data;
};

// Change password
export const changePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<{ message: string }> => {
  const response = await api.put('/users/change-password', {
    currentPassword,
    newPassword,
  });
  return response.data;
};

// Logout user
export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Check if user is logged in
export const isLoggedIn = (): boolean => {
  return !!localStorage.getItem('token');
};

// Get current user
export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

// Check if user is admin
export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  return user?.role === 'admin';
};

// Create exportable service object
const authService = {
  login,
  register,
  logout,
  getCurrentUser,
  getProfile,
  updateProfile,
  changePassword,
  isAdmin,
};

export default authService;
