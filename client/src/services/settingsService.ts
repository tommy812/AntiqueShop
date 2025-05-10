import api from './api';

export interface SiteSettings {
  _id?: string;
  title: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  contact: {
    phone: string;
    email: string;
  };
  hours: Array<{
    days: string;
    hours: string;
  }>;
  social: {
    instagram: string;
    facebook: string;
    twitter: string;
  };
  footer: {
    copyright: string;
    shortDescription: string;
  };
  lastUpdated: Date;
}

// Get site settings
export const getSettings = async (): Promise<SiteSettings> => {
  try {
    const response = await api.get('/settings');
    return response.data;
  } catch (error) {
    console.error('Error fetching settings:', error);
    throw error;
  }
};

// Update site settings (admin only)
export const updateSettings = async (settings: Partial<SiteSettings>): Promise<SiteSettings> => {
  try {
    console.log('Sending settings update request with data:', settings);
    const response = await api.put('/settings', settings);
    console.log('Settings update response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating settings:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    throw error;
  }
};

// Reset settings to default (admin only)
export const resetSettings = async (): Promise<SiteSettings> => {
  try {
    const response = await api.post('/settings/reset');
    return response.data;
  } catch (error) {
    console.error('Error resetting settings:', error);
    throw error;
  }
};

export default {
  getSettings,
  updateSettings,
  resetSettings
}; 