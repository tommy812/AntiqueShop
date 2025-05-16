import React, { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
  Avatar,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import CollectionsIcon from '@mui/icons-material/Collections';
import InfoIcon from '@mui/icons-material/Info';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const Navigation = () => {
  const location = useLocation();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { settings } = useSettings();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { t } = useTranslation();

  // Pages links configuration with translations and icons
  const pages = [
    { name: t('navigation.home'), path: '/', icon: <HomeIcon fontSize="small" /> },
    {
      name: t('navigation.catalogue'),
      path: '/catalogue',
      icon: <CollectionsIcon fontSize="small" />,
    },
    { name: t('navigation.about'), path: '/about', icon: <InfoIcon fontSize="small" /> },
    {
      name: t('navigation.estimate'),
      path: '/estimate',
      icon: <MonetizationOnIcon fontSize="small" />,
    },
    { name: t('navigation.contact'), path: '/contact', icon: <ContactMailIcon fontSize="small" /> },
  ];

  const handleOpenNavMenu = () => {
    setDrawerOpen(true);
  };

  const handleCloseNavMenu = () => {
    setDrawerOpen(false);
  };

  const handleLogout = () => {
    logout();
  };

  // Get site title from settings or use default
  const siteTitle = settings?.title || 'PISCHETOLA ANTIQUES';
  // For mobile, use shortened title if the original is too long
  const shortTitle = siteTitle.length > 15 ? siteTitle.split(' ')[0] : siteTitle;

  return (
    <AppBar position="static" color="primary" elevation={0}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo/brand for larger screens */}
          <HomeIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'Playfair Display',
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            {siteTitle}
          </Typography>

          {/* Mobile menu icon */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>

            {/* Mobile drawer */}
            <Drawer anchor="left" open={drawerOpen} onClose={handleCloseNavMenu}>
              <Box sx={{ width: 250 }} role="presentation" onClick={handleCloseNavMenu}>
                <List>
                  <ListItem>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: 'Playfair Display',
                        fontWeight: 700,
                        pb: 1,
                      }}
                    >
                      {siteTitle}
                    </Typography>
                  </ListItem>
                  <Divider />
                  {pages.map(page => (
                    <ListItem key={page.name} disablePadding>
                      <ListItemButton
                        component={RouterLink}
                        to={page.path}
                        selected={location.pathname === page.path}
                      >
                        {page.icon}
                        <ListItemText primary={page.name} sx={{ ml: 1 }} />
                      </ListItemButton>
                    </ListItem>
                  ))}

                  {/* Admin link for mobile */}
                  {isAuthenticated && isAdmin && (
                    <ListItem disablePadding>
                      <ListItemButton
                        component={RouterLink}
                        to="/admin"
                        selected={location.pathname.startsWith('/admin')}
                      >
                        <AdminPanelSettingsIcon sx={{ mr: 1 }} />
                        <ListItemText primary="Admin" />
                      </ListItemButton>
                    </ListItem>
                  )}

                  {/* Login/Logout for mobile */}
                  <ListItem disablePadding>
                    {isAuthenticated ? (
                      <ListItemButton onClick={handleLogout}>
                        <LogoutIcon sx={{ mr: 1 }} />
                        <ListItemText primary="Logout" />
                      </ListItemButton>
                    ) : (
                      <ListItemButton
                        component={RouterLink}
                        to="/login"
                        selected={location.pathname === '/login'}
                      >
                        <LoginIcon sx={{ mr: 1 }} />
                        <ListItemText primary="Login" />
                      </ListItemButton>
                    )}
                  </ListItem>
                  <Divider />
                  {/* Language switcher for mobile */}
                  <ListItem>
                    <LanguageSwitcher />
                  </ListItem>
                </List>
              </Box>
            </Drawer>
          </Box>

          {/* Logo/brand for mobile */}
          <HomeIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'Playfair Display',
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            {shortTitle}
          </Typography>

          {/* Desktop navigation links */}
          <Box
            sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end' }}
          >
            {pages.map(page => (
              <Button
                key={page.name}
                component={RouterLink}
                to={page.path}
                startIcon={page.icon}
                sx={{
                  my: 2,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  mx: 1,
                  fontWeight: location.pathname === page.path ? 'bold' : 'normal',
                  borderBottom: location.pathname === page.path ? '2px solid white' : 'none',
                  borderRadius: 0,
                  '&:hover': {
                    backgroundColor: 'transparent',
                    borderBottom: '2px solid white',
                  },
                }}
              >
                {page.name}
              </Button>
            ))}

            {/* Admin link for desktop */}
            {isAuthenticated && isAdmin && (
              <Button
                component={RouterLink}
                to="/admin"
                startIcon={<AdminPanelSettingsIcon />}
                sx={{
                  my: 2,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  mx: 1,
                  fontWeight: location.pathname.startsWith('/admin') ? 'bold' : 'normal',
                  borderBottom: location.pathname.startsWith('/admin') ? '2px solid white' : 'none',
                  borderRadius: 0,
                  '&:hover': {
                    backgroundColor: 'transparent',
                    borderBottom: '2px solid white',
                  },
                }}
              >
                Admin
              </Button>
            )}

            {/* Login/Logout for desktop */}
            {isAuthenticated ? (
              <Button
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
                sx={{
                  my: 2,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  mx: 1,
                  borderRadius: 0,
                  '&:hover': {
                    backgroundColor: 'transparent',
                    borderBottom: '2px solid white',
                  },
                }}
              >
                Logout
              </Button>
            ) : (
              <Button
                component={RouterLink}
                to="/login"
                startIcon={<LoginIcon />}
                sx={{
                  my: 2,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  mx: 1,
                  fontWeight: location.pathname === '/login' ? 'bold' : 'normal',
                  borderBottom: location.pathname === '/login' ? '2px solid white' : 'none',
                  borderRadius: 0,
                  '&:hover': {
                    backgroundColor: 'transparent',
                    borderBottom: '2px solid white',
                  },
                }}
              >
                Login
              </Button>
            )}

            {/* Desktop language switcher */}
            <LanguageSwitcher />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navigation;
