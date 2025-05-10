import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from './contexts/ThemeContext';
import { SettingsProvider } from './contexts/SettingsContext';

// Components
import Navigation from './components/Navigation';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Catalogue from './pages/Catalogue';
import About from './pages/About';
import Estimate from './pages/Estimate';
import ProductDetail from './pages/ProductDetail';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Login from './pages/Login';

// Auth Context
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <CssBaseline />
      <SettingsProvider>
        <AuthProvider>
          <Router>
            <Navigation />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/catalogue" element={<Catalogue />} />
                <Route path="/about" element={<About />} />
                <Route path="/estimate" element={<Estimate />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route 
                  path="/admin/*" 
                  element={
                    <ProtectedRoute>
                      <Admin />
                    </ProtectedRoute>
                  } 
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </Router>
        </AuthProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
};

export default App;
