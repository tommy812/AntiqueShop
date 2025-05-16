import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, CircularProgress, Box } from '@mui/material';
import { ThemeProvider } from './contexts/ThemeContext';
import { SettingsProvider } from './contexts/SettingsContext';

// Components
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';

// Auth Context
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home'));
const Catalogue = lazy(() => import('./pages/Catalogue'));
const About = lazy(() => import('./pages/About'));
const Estimate = lazy(() => import('./pages/Estimate'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Contact = lazy(() => import('./pages/Contact'));
const Admin = lazy(() => import('./pages/Admin'));
const Login = lazy(() => import('./pages/Login'));
const Unauthorized = lazy(() => import('./pages/Unauthorized'));
const TranslationTester = lazy(() => import('./components/TranslationTester'));

// Loading fallback
const LoadingFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
    <CircularProgress />
  </Box>
);

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <CssBaseline />
        <SettingsProvider>
          <AuthProvider>
            <Router>
              <Navigation />
              <main>
                <Suspense fallback={<LoadingFallback />}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/catalogue" element={<Catalogue />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/estimate" element={<Estimate />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/unauthorized" element={<Unauthorized />} />
                    <Route
                      path="/admin/*"
                      element={
                        <ProtectedRoute requiredRole="admin">
                          <Admin />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/test-translations" element={<TranslationTester />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Suspense>
              </main>
              <Footer />
            </Router>
          </AuthProvider>
        </SettingsProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
