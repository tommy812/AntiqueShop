import React, { useState } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
  Chip,
  Stack,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SendIcon from '@mui/icons-material/Send';

const Contact = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formState.name || !formState.email || !formState.message) {
      setFormError(true);
      return;
    }
    
    // In a real application, you would send this data to your server
    console.log('Form submitted:', formState);
    
    // Reset form
    setFormState({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });
    
    // Show success message
    setFormSubmitted(true);
  };

  const handleCloseSnackbar = () => {
    setFormSubmitted(false);
    setFormError(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" gutterBottom sx={{ textAlign: 'center', mb: 2, fontFamily: 'Playfair Display' }}>
        Contact Us
      </Typography>
      <Typography variant="subtitle1" sx={{ textAlign: 'center', mb: 6, maxWidth: 700, mx: 'auto' }}>
        Do you have a question about a specific piece or need assistance with a purchase? Our team of antique experts is here to help.
      </Typography>

      {/* Contact Information and Form */}
      <Box sx={{ width: '100%' }}>
      <Grid container spacing={4} sx={{ mb: 6 }} alignItems="stretch">
        {/* Contact information */}
        <Grid item xs={12} md={5}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              height: '100%', 
              bgcolor: 'background.default', 
              border: `1px solid ${theme.palette.divider}`
            }}
          >
            <Typography variant="h5" gutterBottom sx={{ mb: 4, fontFamily: 'Playfair Display' }}>
              Get in Touch
            </Typography>
            
            <Stack spacing={3}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <LocationOnIcon sx={{ color: theme.palette.primary.main, mr: 2, mt: 0.5 }} />
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Our Location
                  </Typography>
                  <Typography variant="body2">
                    Via dei Fossi, 50<br />
                    50123 Florence, Italy
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <PhoneIcon sx={{ color: theme.palette.primary.main, mr: 2, mt: 0.5 }} />
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Phone
                  </Typography>
                  <Typography variant="body2">
                    +39 055 1234567
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <EmailIcon sx={{ color: theme.palette.primary.main, mr: 2, mt: 0.5 }} />
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Email
                  </Typography>
                  <Typography variant="body2">
                    info@pischetolaantiques.com
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <AccessTimeIcon sx={{ color: theme.palette.primary.main, mr: 2, mt: 0.5 }} />
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Opening Hours
                  </Typography>
                  <Typography variant="body2">
                    Monday to Saturday: 10:00 AM - 6:00 PM<br />
                    Sunday: Closed
                  </Typography>
                </Box>
              </Box>
            </Stack>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="subtitle2" gutterBottom>
              Follow Us
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <Chip label="Facebook" size="small" clickable />
              <Chip label="Instagram" size="small" clickable />
              <Chip label="Twitter" size="small" clickable />
            </Box>
          </Paper>
        </Grid>
        
        {/* Contact form */}
        <Grid item xs={12} md={7}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: { xs: 3, md: 4 }, 
              height: '100%', 
              bgcolor: 'background.paper'
            }}
          >
            <Typography variant="h5" gutterBottom sx={{ mb: 3, fontFamily: 'Playfair Display' }}>
              Send Us a Message
            </Typography>
            
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Your Name"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Email Address"
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    variant="outlined"
                    type="email"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={formState.phone}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Subject"
                    name="subject"
                    value={formState.subject}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    multiline
                    rows={6}
                    label="Your Message"
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary" 
                    size="large"
                    endIcon={<SendIcon />}
                    sx={{ mt: 1, px: 4 }}
                  >
                    Send Message
                  </Button>
                </Grid>
              </Grid>
            </form>
            
            <Snackbar open={formSubmitted} autoHideDuration={6000} onClose={handleCloseSnackbar}>
              <Alert onClose={handleCloseSnackbar} severity="success" variant="filled">
                Your message has been sent. We'll get back to you soon!
              </Alert>
            </Snackbar>
            
            <Snackbar open={formError} autoHideDuration={6000} onClose={handleCloseSnackbar}>
              <Alert onClose={handleCloseSnackbar} severity="error" variant="filled">
                Please fill in all required fields.
              </Alert>
            </Snackbar>
          </Paper>
        </Grid>
      </Grid>
      </Box>

      
      {/* Google Map */}
      <Box sx={{ height: 400, width: '100%', overflow: 'hidden' }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3, fontFamily: 'Playfair Display' }}>
          Our Location
        </Typography>
        <Box 
          sx={{ 
            width: '100%', 
            height: '100%', 
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
            overflow: 'hidden',
          }}
        >
          <iframe
            title="Pischetola Antiques Location"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2881.1846510186287!2d11.245177099999999!3d43.7738252!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x132a56a92fb7e775%3A0x7e0e11676eeae3c!2sVia%20dei%20Fossi%2C%2050%2C%2050123%20Firenze%20FI%2C%20Italy!5e0!3m2!1sen!2sus!4v1715273252837!5m2!1sen!2sus"
          ></iframe>
        </Box>
      </Box>
    </Container>
  );
};

export default Contact; 