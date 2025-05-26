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
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  const expertiseServices = [
    {
      title: t('about.expertise.authentication.title'),
      description: t('about.expertise.authentication.description'),
      icon: <VerifiedIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.primary.main,
    },
    {
      title: t('about.expertise.restoration.title'),
      description: t('about.expertise.restoration.description'),
      icon: <HandymanIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.secondary.main,
    },
    {
      title: t('about.expertise.documentation.title'),
      description: t('about.expertise.documentation.description'),
      icon: <HistoryEduIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.primary.main,
    },
    {
      title: t('about.expertise.shipping.title'),
      description: t('about.expertise.shipping.description'),
      icon: <LocalShippingIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.secondary.main,
    },
  ];

  const teamMembers = [
    {
      name: t('about.team.members.marco.name'),
      role: t('about.team.members.marco.role'),
      bio: t('about.team.members.marco.bio'),
      image:
        'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    },
    {
      name: t('about.team.members.davide.name'),
      role: t('about.team.members.davide.role'),
      bio: t('about.team.members.davide.bio'),
      image:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    },
    {
      name: t('about.team.members.stefano.name'),
      role: t('about.team.members.stefano.role'),
      bio: t('about.team.members.stefano.bio'),
      image:
        'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h2" gutterBottom>
          {t('about.title')}
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto' }}>
          {t('about.subtitle')}
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
              {t('about.our_story.title')}
            </Typography>
            <Typography variant="body1" paragraph>
              {t('about.our_story.paragraph1')}
            </Typography>
            <Typography variant="body1" paragraph>
              {t('about.our_story.paragraph2')}
            </Typography>
            <Typography variant="body1">{t('about.our_story.paragraph3')}</Typography>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          {t('about.expertise.title')}
        </Typography>

        <Grid container spacing={4} component="div">
          {expertiseServices.map((service, index) => (
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
          {t('about.team.title')}
        </Typography>

        <Grid container spacing={4} component="div">
          {teamMembers.map((member, index) => (
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
          {t('about.visit.title')}
        </Typography>
        <Typography variant="body1" paragraph>
          {t('about.visit.description')}
        </Typography>
        <Typography variant="body1">
          {t('about.visit.address')}
          <br />
          {t('about.visit.hours')}
          <br />
          {t('about.visit.contact')}
        </Typography>
      </Paper>
    </Container>
  );
};

export default About;
