import { createTheme } from '@mui/material/styles';

// Custom theme for an antiques commerce website
const theme = createTheme({
  palette: {
    primary: {
      main: '#8b4513', // Saddle Brown - an elegant color for antiques
      light: '#a0522d', // Sienna
      dark: '#654321', // Dark Brown
      contrastText: '#fff',
    },
    secondary: {
      main: '#daa520', // Goldenrod - for accents
      light: '#ffd700', // Gold
      dark: '#b8860b', // Dark Goldenrod
      contrastText: '#000',
    },
    background: {
      default: '#f5f5f5', // Light grey background
      paper: '#fff', // White paper
    },
    text: {
      primary: '#333333',
      secondary: '#555555',
    },
  },
  typography: {
    fontFamily: '"Playfair Display", "Times New Roman", serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
    },
    body1: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
    body2: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: 'none',
          padding: '8px 16px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(0,0,0,0.2)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0px 3px 15px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

export default theme; 