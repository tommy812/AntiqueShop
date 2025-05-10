import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import settingsService, { SiteSettings } from '../services/settingsService';

interface SettingsContextType {
  settings: SiteSettings | null;
  loading: boolean;
  error: string | null;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
  resetSettings: () => Promise<void>;
  refreshSettings: () => Promise<void>;
}

const defaultSettings: SiteSettings = {
  title: 'Pischetola Antiques',
  address: {
    street: '123 Antique Street',
    city: 'Milan',
    postalCode: '20121',
    country: 'Italy'
  },
  contact: {
    phone: '+39 02 1234 5678',
    email: 'info@pischetola.com'
  },
  hours: [
    {
      days: 'Monday - Friday',
      hours: '10:00 - 18:00'
    },
    {
      days: 'Saturday',
      hours: '11:00 - 16:00'
    },
    {
      days: 'Sunday',
      hours: 'Closed'
    }
  ],
  social: {
    instagram: 'https://instagram.com/pischetola',
    facebook: 'https://facebook.com/pischetola',
    twitter: ''
  },
  footer: {
    copyright: '© 2024 Pischetola Antiques. All rights reserved.',
    shortDescription: 'Pischetola Antiques specializes in rare and unique antique furniture, art, and decorative items from various historical periods.'
  },
  lastUpdated: new Date()
};

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  loading: false,
  error: null,
  updateSettings: async () => {},
  resetSettings: async () => {},
  refreshSettings: async () => {}
});

export const useSettings = () => useContext(SettingsContext);

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await settingsService.getSettings();
      setSettings(data);
    } catch (err) {
      console.error('Failed to fetch settings:', err);
      setError('Failed to load site settings. Using default values.');
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    try {
      setLoading(true);
      setError(null);
      const updatedSettings = await settingsService.updateSettings(newSettings);
      setSettings(updatedSettings);
    } catch (err) {
      console.error('Failed to update settings:', err);
      setError('Failed to update settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const defaultSettings = await settingsService.resetSettings();
      setSettings(defaultSettings);
    } catch (err) {
      console.error('Failed to reset settings:', err);
      setError('Failed to reset settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const refreshSettings = async () => {
    return fetchSettings();
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        error,
        updateSettings,
        resetSettings,
        refreshSettings
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}; 