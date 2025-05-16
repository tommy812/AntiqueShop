import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

// Placeholder hero image (replace with actual image in production)
const heroImage =
  'https://images.unsplash.com/photo-1574642344377-3ba2a7a5e822?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';

export const HeroSection = styled(Box)(({ theme }) => ({
  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${heroImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  height: '70vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(2),
  color: '#fff',
  textAlign: 'center',
  marginBottom: theme.spacing(6),
}));

export default HeroSection;
