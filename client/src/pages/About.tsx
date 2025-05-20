import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Divider,
  useTheme,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
} from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import HandymanIcon from '@mui/icons-material/Handyman';
import { styled } from '@mui/material/styles';

const ImageContainer = styled(Paper)(({ theme }) => ({
  position: 'relative',
  height: '400px',
  overflow: 'hidden',
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
}));

const About = () => {
  const theme = useTheme();

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h2" gutterBottom>
          About Pischetola Antiques
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto' }}>
          A legacy of excellence in antique collection and restoration since 1985
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          mb: 6,
          backgroundColor: theme.palette.background.default,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Grid container spacing={4} alignItems="center" component="div">
          <Grid item xs={12} md={6} component="div">
            <Box
              component="img"
              src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/17/22/fe/dd/castello-di-fossano-palio.jpg?w=1400&h=1400&s=1"
              alt="Castello di Fossano Palio"
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              }}
            />
          </Grid>
          <Grid item xs={12} md={6} component="div">
            <Typography variant="h3" gutterBottom component="h2">
              Our Story
            </Typography>
            <Typography variant="body1" paragraph>
              Pischetola Antiques was founded in 1985 by Antonio Pischetola, a passionate collector
              with a keen eye for historical craftsmanship and authenticity. What began as a small
              collection in a modest shop in Florence, Italy, has evolved into a respected
              establishment in the world of fine antiques.
            </Typography>
            <Typography variant="body1" paragraph>
              For over three decades, we have dedicated ourselves to preserving the beauty and
              history of exceptional pieces from various periods and regions. Our commitment to
              quality, authenticity, and customer satisfaction has made us a trusted name among
              collectors, interior designers, and antique enthusiasts worldwide.
            </Typography>
            <Typography variant="body1">
              Today, Pischetola Antiques continues to be a family-owned business, carrying forward
              Antonio's legacy of passion and expertise into the digital age, making our curated
              collection accessible to a global audience.
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          Our Expertise
        </Typography>

        <Grid container spacing={4} component="div">
          {[
            {
              title: 'Authentication',
              description:
                'Every piece in our collection undergoes rigorous authentication by our team of experts to ensure its provenance and historical accuracy.',
              icon: <VerifiedIcon sx={{ fontSize: 40 }} />,
              color: theme.palette.primary.main,
            },
            {
              title: 'Restoration',
              description:
                'Our skilled craftsmen carefully restore each piece using traditional techniques and materials that honor the original craftsmanship.',
              icon: <HandymanIcon sx={{ fontSize: 40 }} />,
              color: theme.palette.secondary.main,
            },
            {
              title: 'Documentation',
              description:
                'We provide detailed documentation for each item, including its history, origin, period, and any restoration work performed.',
              icon: <HistoryEduIcon sx={{ fontSize: 40 }} />,
              color: theme.palette.primary.main,
            },
            {
              title: 'Worldwide Shipping',
              description:
                'We offer secure, insured shipping services to ensure your treasured purchases arrive safely at your doorstep, anywhere in the world.',
              icon: <LocalShippingIcon sx={{ fontSize: 40 }} />,
              color: theme.palette.secondary.main,
            },
          ].map((service, index) => (
            <Grid item xs={12} sm={6} key={index} component="div">
              <Paper elevation={0} sx={{ p: 3, height: '100%', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: service.color,
                      mr: 2,
                      width: 56,
                      height: 56,
                    }}
                  >
                    {service.icon}
                  </Avatar>
                  <Typography variant="h5" component="h3">
                    {service.title}
                  </Typography>
                </Box>
                <Typography variant="body1">{service.description}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Divider sx={{ mb: 6 }} />

      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          Meet Our Team
        </Typography>

        <Grid container spacing={4} component="div">
          {[
            {
              name: 'Marco Pischetola',
              role: 'Owner & Chief Curator',
              bio: 'Son of founder Antonio Pischetola, Marco has been immersed in the world of antiques since childhood and has developed an extraordinary eye for exceptional pieces.',
              image:
                'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
            },
            {
              name: 'Davide Pischetola',
              role: 'Master Restorer',
              bio: 'With over 20 years of experience in antique restoration, Davide brings traditional craftsmanship techniques to preserve and restore our finest pieces.',
              image:
                'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
            },
            {
              name: 'Stefano Pischetola',
              role: 'Authentication Specialist',
              bio: 'Stefano combines his deep knowledge of art history with modern authentication techniques to ensure the authenticity and provenance of every piece in our collection.',
              image:
                'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
            },
          ].map((member, index) => (
            <Grid item xs={12} sm={6} md={4} key={index} component="div">
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  height: '100%',
                  borderRadius: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <Avatar
                  src={member.image}
                  alt={member.name}
                  sx={{
                    width: 120,
                    height: 120,
                    mb: 2,
                    border: `3px solid ${theme.palette.primary.main}`,
                  }}
                />
                <Typography variant="h5" component="h3" gutterBottom>
                  {member.name}
                </Typography>
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  {member.role}
                </Typography>
                <Typography variant="body2">{member.bio}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 6,
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          borderRadius: 2,
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Visit Our Showroom
        </Typography>
        <Typography variant="body1" paragraph>
          We invite you to experience our collection in person at our showroom in the heart of
          Florence.
        </Typography>
        <Typography variant="body1">
          Via dei Fossi, 50, 50123 Florence, Italy
          <br />
          Monday to Saturday: 10:00 AM - 6:00 PM
          <br />
          +39 055 1234567 | info@pischetolaantiques.com
        </Typography>
      </Paper>
    </Container>
  );
};

export default About;
