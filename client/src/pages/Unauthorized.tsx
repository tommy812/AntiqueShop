import React from 'react';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Unauthorized = () => {
  const { t } = useTranslation();
  
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: { xs: 4, md: 6 }, 
          textAlign: 'center',
          borderRadius: 2
        }}
      >
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom
          sx={{ color: 'error.main', fontWeight: 'bold' }}
        >
          401
        </Typography>
        
        <Typography variant="h4" gutterBottom>
          {t('error.unauthorized.title', 'Access Denied')}
        </Typography>
        
        <Typography variant="body1" paragraph sx={{ mb: 4 }}>
          {t('error.unauthorized.message', 'You don\'t have permission to access this page. If you believe this is an error, please contact the administrator.')}
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Button 
            variant="contained" 
            color="primary" 
            component={RouterLink} 
            to="/"
          >
            {t('common.backToHome', 'Back to Home')}
          </Button>
          
          <Button 
            variant="outlined" 
            color="primary" 
            component={RouterLink} 
            to="/contact"
          >
            {t('common.contactSupport', 'Contact Support')}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Unauthorized; 