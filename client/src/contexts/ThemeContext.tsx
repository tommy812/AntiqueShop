import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import themeService, { ThemeSettings } from '../services/themeService';

interface ThemeColors {
  primary: string;
  secondary: string;
}

interface ThemeContextType {
  colors: ThemeColors;
  updateTheme: (primary: string, secondary: string) => void;
  loading: boolean;
}

const defaultThemeColors: ThemeColors = {
  primary: '#9c6644', // Default antique brown
  secondary: '#d4a373', // Default antique gold
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [colors, setColors] = useState<ThemeColors>(defaultThemeColors);
  const [loading, setLoading] = useState(true);

  // Load theme from API or localStorage
  useEffect(() => {
    const loadTheme = async () => {
      try {
        setLoading(true);
        // Try to get theme from localStorage first for immediate display
        const savedTheme = localStorage.getItem('pischetola-theme');
        if (savedTheme) {
          setColors(JSON.parse(savedTheme));
        }
        
        // Then try to get the latest theme from the server
        const serverTheme = await themeService.getThemeSettings();
        setColors(serverTheme);
        
        // Update localStorage with the server theme
        localStorage.setItem('pischetola-theme', JSON.stringify(serverTheme));
      } catch (error) {
        console.error('Error loading theme:', error);
        // If there's an error, use localStorage or default
        const savedTheme = localStorage.getItem('pischetola-theme');
        if (savedTheme) {
          setColors(JSON.parse(savedTheme));
        }
      } finally {
        setLoading(false);
      }
    };
    
    loadTheme();
  }, []);

  // Create MUI theme from colors
  const theme = createTheme({
    palette: {
      primary: {
        main: colors.primary,
      },
      secondary: {
        main: colors.secondary,
      },
    },
    typography: {
      fontFamily: '"Playfair Display", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontFamily: '"Playfair Display", serif',
      },
      h2: {
        fontFamily: '"Playfair Display", serif',
      },
      h3: {
        fontFamily: '"Playfair Display", serif',
      },
      h4: {
        fontFamily: '"Playfair Display", serif',
      },
      h5: {
        fontFamily: '"Playfair Display", serif',
      },
      h6: {
        fontFamily: '"Playfair Display", serif',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 2,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
    },
  });

  // Update theme colors and save to localStorage and API
  const updateTheme = async (primary: string, secondary: string) => {
    const newColors = { primary, secondary };
    
    // Update local state immediately for responsive UI
    setColors(newColors);
    
    // Save to localStorage for persistence
    localStorage.setItem('pischetola-theme', JSON.stringify(newColors));
    
    try {
      // Send to server if user is authenticated
      await themeService.updateThemeSettings(newColors);
    } catch (error) {
      console.error('Error saving theme to server:', error);
      // Continue using the updated theme even if server update fails
    }
  };

  return (
    <ThemeContext.Provider value={{ colors, updateTheme, loading }}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider; 