import React, { useState } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
  Chip,
  Stack,
  CircularProgress,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SendIcon from '@mui/icons-material/Send';
import { useTranslation } from 'react-i18next';

// Import our custom form components
import FormField from '../components/forms/FormField';
import messageService from '../services/messageService';
import { useSettings } from '../contexts/SettingsContext';

// Form validation
interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface FormErrors {
  [key: string]: string;
}

const Contact = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { settings } = useSettings();
  const { t } = useTranslation();
  const [formState, setFormState] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    'Please fix the errors in the form and try again.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate form fields
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formState.name.trim()) {
      newErrors.name = t('contact.validation.name_min');
    } else if (formState.name.trim().length < 2) {
      newErrors.name = t('contact.validation.name_min');
    }

    // Email validation
    if (!formState.email.trim()) {
      newErrors.email = t('contact.validation.email_valid');
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formState.email)) {
      newErrors.email = t('contact.validation.email_valid');
    }

    // Message validation
    if (!formState.message.trim()) {
      newErrors.message = t('contact.validation.message_min');
    } else if (formState.message.trim().length < 10) {
      newErrors.message = t('contact.validation.message_min');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value,
    }));

    // Mark field as touched when user types
    if (!touched[name]) {
      setTouched(prev => ({
        ...prev,
        [name]: true,
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;

    // Mark field as touched when user leaves the field
    setTouched(prev => ({
      ...prev,
      [name]: true,
    }));

    // Validate the form when a field loses focus
    validateForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    const touchedFields = Object.keys(formState).reduce(
      (acc, field) => {
        acc[field] = true;
        return acc;
      },
      {} as Record<string, boolean>
    );

    setTouched(touchedFields);

    // Validate form
    const isValid = validateForm();

    if (!isValid) {
      setFormError(true);
      setErrorMessage(t('contact.error'));
      return;
    }

    try {
      setIsSubmitting(true);

      // Send the message to the backend
      await messageService.createMessage({
        name: formState.name,
        email: formState.email,
        phone: formState.phone,
        subject: formState.subject || 'Website Contact Form',
        message: formState.message,
      });

      // Reset form
      setFormState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      setTouched({});
      setErrors({});

      // Show success message
      setFormSubmitted(true);
    } catch (error) {
      console.error('Error sending message:', error);
      setFormError(true);
      setErrorMessage(t('contact.error_alert'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setFormSubmitted(false);
    setFormError(false);
  };

  // Get contact information from settings
  const contactInfo = {
    address: settings?.address
      ? `${settings.address.street || ''}, ${settings.address.postalCode || ''} ${settings.address.city || ''}, ${settings.address.country || ''}`
      : 'Via dei Fossi, 50, 50123 Florence, Italy',
    phone: settings?.contact?.phone || '+39 055 1234567',
    email: settings?.contact?.email || 'info@pischetolaantiques.com',
    hours: settings?.hours || [
      { days: 'Monday to Saturday', hours: '10:00 AM - 6:00 PM' },
      { days: 'Sunday', hours: 'Closed' },
    ],
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography
        variant="h3"
        gutterBottom
        sx={{ textAlign: 'center', mb: 2, fontFamily: 'Playfair Display' }}
      >
        {t('contact.title')}
      </Typography>
      <Typography
        variant="subtitle1"
        sx={{ textAlign: 'center', mb: 6, maxWidth: 700, mx: 'auto' }}
      >
        {t('contact.subtitle')}
      </Typography>

      {/* Contact Information and Form */}
      <Box sx={{ width: '100%' }}>
        <Grid container spacing={isMobile ? 3 : 4} sx={{ mb: 6 }} alignItems="stretch">
          {/* Contact information */}
          <Grid item xs={12} md={5}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: '100%',
                bgcolor: 'background.default',
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography variant="h5" gutterBottom sx={{ mb: 4, fontFamily: 'Playfair Display' }}>
                {t('contact.get_in_touch')}
              </Typography>

              <Stack spacing={3}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <LocationOnIcon sx={{ color: theme.palette.primary.main, mr: 2, mt: 0.5 }} />
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      {t('contact.location')}
                    </Typography>
                    <Typography variant="body2">{contactInfo.address}</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <PhoneIcon sx={{ color: theme.palette.primary.main, mr: 2, mt: 0.5 }} />
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      {t('contact.phone')}
                    </Typography>
                    <Typography variant="body2">{contactInfo.phone}</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <EmailIcon sx={{ color: theme.palette.primary.main, mr: 2, mt: 0.5 }} />
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      {t('contact.email_label')}
                    </Typography>
                    <Typography variant="body2">{contactInfo.email}</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <AccessTimeIcon sx={{ color: theme.palette.primary.main, mr: 2, mt: 0.5 }} />
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      {t('contact.opening_hours')}
                    </Typography>
                    {contactInfo.hours.map((timeSlot, index) => (
                      <Typography key={index} variant="body2">
                        {timeSlot.days}: {timeSlot.hours}
                        {index < contactInfo.hours.length - 1 && <br />}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              </Stack>

              <Divider sx={{ my: 3 }} />

              <Typography variant="subtitle2" gutterBottom>
                {t('contact.follow_us')}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                {settings?.social?.facebook && (
                  <Chip
                    label="Facebook"
                    size="small"
                    clickable
                    component="a"
                    href={settings.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                )}
                {settings?.social?.instagram && (
                  <Chip
                    label="Instagram"
                    size="small"
                    clickable
                    component="a"
                    href={settings.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                )}
                {settings?.social?.twitter && (
                  <Chip
                    label="Twitter"
                    size="small"
                    clickable
                    component="a"
                    href={settings.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                )}
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
                bgcolor: 'background.paper',
              }}
            >
              <Typography variant="h5" gutterBottom sx={{ mb: 3, fontFamily: 'Playfair Display' }}>
                {t('contact.send_message')}
              </Typography>

              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <FormField
                      required
                      name="name"
                      label={t('contact.your_name')}
                      value={formState.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      errors={errors}
                      touched={touched}
                      validationRules={t('contact.validation.name_min')}
                      disabled={isSubmitting}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormField
                      required
                      name="email"
                      label={t('contact.email_address')}
                      type="email"
                      value={formState.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      errors={errors}
                      touched={touched}
                      validationRules={t('contact.validation.email_valid')}
                      disabled={isSubmitting}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormField
                      name="phone"
                      label={t('contact.phone_number')}
                      value={formState.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      errors={errors}
                      touched={touched}
                      helperText={t('contact.phone_helper')}
                      disabled={isSubmitting}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormField
                      name="subject"
                      label={t('contact.form.subject')}
                      value={formState.subject}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      errors={errors}
                      touched={touched}
                      disabled={isSubmitting}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormField
                      required
                      name="message"
                      label={t('contact.your_message')}
                      type="textarea"
                      value={formState.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      errors={errors}
                      touched={touched}
                      validationRules={t('contact.validation.message_min')}
                      disabled={isSubmitting}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      endIcon={
                        isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />
                      }
                      sx={{ mt: 1, px: 4 }}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? t('contact.sending') : t('contact.send')}
                    </Button>
                  </Grid>
                </Grid>
              </form>

              <Snackbar open={formSubmitted} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="success" variant="filled">
                  {t('contact.success_alert')}
                </Alert>
              </Snackbar>

              <Snackbar open={formError} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="error" variant="filled">
                  {errorMessage}
                </Alert>
              </Snackbar>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Google Map */}
      <Box sx={{ height: 400, width: '100%', overflow: 'hidden' }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3, fontFamily: 'Playfair Display' }}>
          {t('contact.location')}
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
