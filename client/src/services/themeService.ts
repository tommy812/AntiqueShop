import api from './api';

// Define types
export interface Theme {
  _id?: string;
  primaryColor: string;
  secondaryColor: string;
  fontPrimary: string;
  fontSecondary: string;
  logoUrl?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ThemeSettings {
  primary: string;
  secondary: string;
}

// Get active theme
export const getActiveTheme = async (): Promise<Theme> => {
  const response = await api.get('/theme');
  return response.data;
};

// Get all themes (admin only)
export const getAllThemes = async () => {
  const response = await api.get('/theme/all');
  return response.data;
};

// Create new theme (admin only)
export const createTheme = async (themeData: Theme) => {
  const response = await api.post('/theme', themeData);
  return response.data;
};

// Update theme (admin only)
export const updateTheme = async (id: string, themeData: Partial<Theme>) => {
  const response = await api.put(`/theme/${id}`, themeData);
  return response.data;
};

// Set active theme (admin only)
export const setActiveTheme = async (id: string) => {
  const response = await api.patch(`/theme/${id}/activate`);
  return response.data;
};

// Delete theme (admin only)
export const deleteTheme = async (id: string) => {
  const response = await api.delete(`/theme/${id}`);
  return response.data;
};

// Get current theme settings
export const getThemeSettings = async () => {
  try {
    const response = await api.get('/theme');
    return response.data;
  } catch (error) {
    console.error('Error fetching theme settings:', error);
    // Return default theme if API call fails
    return {
      primary: '#9c6644',
      secondary: '#d4a373',
    };
  }
};

// Update theme settings (admin only)
export const updateThemeSettings = async (settings: ThemeSettings) => {
  try {
    const response = await api.put('/theme', settings);
    return response.data;
  } catch (error) {
    console.error('Error updating theme settings:', error);
    throw error;
  }
};

// Create exportable service object
const themeService = {
  getActiveTheme,
  getAllThemes,
  createTheme,
  updateTheme,
  setActiveTheme,
  deleteTheme,
  getThemeSettings,
  updateThemeSettings,
};

export default themeService; 