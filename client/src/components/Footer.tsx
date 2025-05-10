import React from 'react';
import { 
  Box, 
  Container, 
  Typography,  
  Link, 
  Stack, 
  Divider,
  IconButton,
  useTheme,
  CircularProgress
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { Link as RouterLink } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useSettings } from '../contexts/SettingsContext';

const Footer: React.FC = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();
  const { settings, loading } = useSettings();

  if (loading) {
    return (
      <Box
        component="footer"
        sx={{
          py: 6,
          px: 2,
          mt: 'auto',
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <CircularProgress color="inherit" />
      </Box>
    );
  }

  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        px: 2,
        mt: 'auto',
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              {settings?.title || 'PISCHETOLA ANTIQUES'}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {settings?.footer?.shortDescription || 'Bringing you the finest antiques and historical treasures since 1985. Our curated collection features exceptional pieces from various periods and regions.'}
            </Typography>
            <Stack direction="row" spacing={1}>
              {settings?.social?.facebook && (
                <IconButton 
                  color="inherit" 
                  aria-label="Facebook" 
                  component="a" 
                  href={settings.social.facebook}
                  target="_blank"
                  rel="noopener"
                >
                  <FacebookIcon />
                </IconButton>
              )}
              {settings?.social?.instagram && (
                <IconButton 
                  color="inherit" 
                  aria-label="Instagram" 
                  component="a" 
                  href={settings.social.instagram}
                  target="_blank"
                  rel="noopener"
                >
                  <InstagramIcon />
                </IconButton>
              )}
              {settings?.social?.twitter && (
                <IconButton 
                  color="inherit" 
                  aria-label="Twitter" 
                  component="a" 
                  href={settings.social.twitter}
                  target="_blank"
                  rel="noopener"
                >
                  <TwitterIcon />
                </IconButton>
              )}
            </Stack>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Box component="nav">
              <Stack spacing={1}>
                <Link component={RouterLink} to="/" color="inherit" underline="hover">
                  Home
                </Link>
                <Link component={RouterLink} to="/catalogue" color="inherit" underline="hover">
                  Catalogue
                </Link>
                <Link component={RouterLink} to="/about" color="inherit" underline="hover">
                  About Us
                </Link>
                <Link component={RouterLink} to="/estimate" color="inherit" underline="hover">
                  Request Estimate
                </Link>
                <Link href="#" color="inherit" underline="hover">
                  Restoration Services
                </Link>
                <Link href="#" color="inherit" underline="hover">
                  Terms & Conditions
                </Link>
                <Link href="#" color="inherit" underline="hover">
                  Privacy Policy
                </Link>
              </Stack>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom>
              Contact Information
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationOnIcon sx={{ mr: 1 }} />
                <Typography variant="body2">
                  {settings?.address ? 
                    `${settings.address.street}, ${settings.address.postalCode} ${settings.address.city}, ${settings.address.country}` : 
                    'Via dei Fossi, 50, 50123 Florence, Italy'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PhoneIcon sx={{ mr: 1 }} />
                <Typography variant="body2">
                  {settings?.contact?.phone || '+39 055 1234567'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EmailIcon sx={{ mr: 1 }} />
                <Link href={`mailto:${settings?.contact?.email || 'info@pischetolaantiques.com'}`} color="inherit" underline="hover">
                  {settings?.contact?.email || 'info@pischetolaantiques.com'}
                </Link>
              </Box>
            </Stack>
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Opening Hours
              </Typography>
              {settings?.hours ? (
                settings.hours.map((item, index) => (
                  <Typography key={index} variant="body2">
                    {item.days}: {item.hours}
                    {index < settings.hours.length - 1 && <br />}
                  </Typography>
                ))
              ) : (
                <Typography variant="body2">
                  Monday to Saturday: 10:00 AM - 6:00 PM<br />
                  Sunday: Closed
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.2)' }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Typography variant="body2" sx={{ mb: { xs: 2, md: 0 } }}>
            {settings?.footer?.copyright || `© ${currentYear} Pischetola Antiques. All rights reserved.`}
          </Typography>
          <Typography variant="body2">
            Designed with passion for preserving history.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 