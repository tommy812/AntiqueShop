import React, { useState, ChangeEvent } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Grid,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  useTheme,
  Alert,
  SelectChangeEvent,
  CircularProgress,
  Snackbar,
  Divider,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Link,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ChairIcon from '@mui/icons-material/Chair';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import BrushIcon from '@mui/icons-material/Brush';
import DiamondIcon from '@mui/icons-material/Diamond';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Import our custom form component
import FormField from '../components/forms/FormField';
import estimateService from '../services/estimateService';

const categories = [
  'Furniture',
  'Paintings',
  'Decorative Arts',
  'Silver',
  'Ceramics',
  'Textiles',
  'Other',
];

interface FormData {
  itemName: string;
  category: string;
  description: string;
  condition: string;
  name: string;
  email: string;
  phone: string;
  additionalNotes: string;
}

interface FormErrors {
  [key: string]: string;
}

const Estimate: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  // Form state
  const [formData, setFormData] = useState<FormData>({
    // Item details
    itemName: '',
    category: '',
    description: '',
    condition: 'good',

    // Contact information
    name: '',
    email: '',
    phone: '',
    additionalNotes: '',
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

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

    validateForm();
  };

  // Validate form fields
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate item details
    if (!formData.itemName.trim()) {
      newErrors.itemName = t('estimate.validation.item_name_required');
    }

    if (!formData.description.trim()) {
      newErrors.description = t('estimate.validation.description_required');
    } else if (formData.description.trim().length < 10) {
      newErrors.description = t('estimate.validation.description_short');
    }

    // Validate contact info
    if (!formData.name.trim()) {
      newErrors.name = t('estimate.validation.name_required');
    }

    // Require either email or phone
    if (!formData.email.trim() && !formData.phone.trim()) {
      newErrors.email = t('estimate.validation.contact_required');
      newErrors.phone = t('estimate.validation.contact_required');
    } else if (
      formData.email.trim() &&
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = t('estimate.validation.email_invalid');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    // Mark all fields as touched
    const fieldsToValidate = [
      'itemName',
      'category',
      'description',
      'condition',
      'name',
      'email',
      'phone',
    ];
    const newTouched = { ...touched };

    fieldsToValidate.forEach(field => {
      newTouched[field] = true;
    });

    setTouched(newTouched);

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Submit form
    setLoading(true);

    // Prepare data for backend (adjust based on your backend structure)
    const requestData = {
      itemName: formData.itemName,
      category: formData.category,
      description: formData.description,
      condition: formData.condition,
      firstName: formData.name.split(' ')[0],
      lastName: formData.name.split(' ').slice(1).join(' '),
      email: formData.email,
      phone: formData.phone,
      preferredContact: formData.email ? 'email' : 'phone', // Default to email if provided, otherwise phone
      additionalNotes: formData.additionalNotes,
    };

    estimateService
      .createEstimate(requestData)
      .then(() => {
        setSubmitted(true);
        setLoading(false);
        setSnackbar({
          open: true,
          message: t('estimate.thank_you.message1'),
          severity: 'success',
        });
      })
      .catch(error => {
        console.error('Error submitting estimate request:', error);
        setLoading(false);
        setSnackbar({
          open: true,
          message: t('common.error'),
          severity: 'error',
        });
      });
  };

  // Handler for closing snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleContactRedirect = () => {
    navigate('/contact');
  };

  const itemsWePurchase = [
    {
      icon: <ChairIcon />,
      title: t('estimate.items_section.furniture.title'),
      description: t('estimate.items_section.furniture.description'),
    },
    {
      icon: <ColorLensIcon />,
      title: t('estimate.items_section.paintings.title'),
      description: t('estimate.items_section.paintings.description'),
    },
    {
      icon: <AutoAwesomeIcon />,
      title: t('estimate.items_section.decorative.title'),
      description: t('estimate.items_section.decorative.description'),
    },
    {
      icon: <DiamondIcon />,
      title: t('estimate.items_section.silver.title'),
      description: t('estimate.items_section.silver.description'),
    },
    {
      icon: <BrushIcon />,
      title: t('estimate.items_section.ceramics.title'),
      description: t('estimate.items_section.ceramics.description'),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography
        variant="h3"
        gutterBottom
        sx={{ textAlign: 'center', mb: 2, fontFamily: 'Playfair Display' }}
      >
        {t('estimate.title')}
      </Typography>
      <Typography
        variant="subtitle1"
        sx={{ textAlign: 'center', mb: 6, maxWidth: 700, mx: 'auto' }}
      >
        {t('estimate.subtitle')}
      </Typography>

      {/* Success message on submission */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {submitted ? (
        <Paper
          elevation={0}
          sx={{ p: 4, textAlign: 'center', border: `1px solid ${theme.palette.divider}` }}
        >
          <CheckCircleOutlineIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            {t('estimate.thank_you.title')}
          </Typography>
          <Typography variant="body1" paragraph>
            {t('estimate.thank_you.message1')}
          </Typography>
          <Typography variant="body1" paragraph>
            {t('estimate.thank_you.message2')}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => (window.location.href = '/')}
            sx={{ mt: 2 }}
          >
            {t('estimate.thank_you.button')}
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={4}>
          {/* Items We Purchase Section */}
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{ p: { xs: 3, md: 4 }, border: `1px solid ${theme.palette.divider}`, mb: 4 }}
            >
              <Typography variant="h5" gutterBottom sx={{ fontFamily: 'Playfair Display' }}>
                {t('estimate.items_section.title')}
              </Typography>
              <Typography variant="body1" paragraph>
                {t('estimate.items_section.description')}
              </Typography>

              <Grid container spacing={3} sx={{ mt: 2 }}>
                {itemsWePurchase.map((item, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card
                      elevation={0}
                      sx={{ height: '100%', border: `1px solid ${theme.palette.divider}` }}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Box sx={{ color: 'primary.main', mr: 1 }}>{item.icon}</Box>
                          <Typography variant="h6" component="h3">
                            {item.title}
                          </Typography>
                        </Box>
                        <Typography variant="body2">{item.description}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>

          {/* Options Box */}
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{ p: { xs: 3, md: 4 }, border: `1px solid ${theme.palette.divider}`, mb: 4 }}
            >
              <Typography variant="h5" gutterBottom sx={{ fontFamily: 'Playfair Display' }}>
                {t('estimate.options_section.title')}
              </Typography>

              <Grid container spacing={4} sx={{ mt: 2 }}>
                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      p: 3,
                      border: `1px solid ${theme.palette.divider}`,
                      height: '100%',
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      {t('estimate.options_section.contact_option.title')}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {t('estimate.options_section.contact_option.description')}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleContactRedirect}
                      sx={{ mt: 2 }}
                    >
                      {t('estimate.options_section.contact_option.button')}
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      p: 3,
                      border: `1px solid ${theme.palette.divider}`,
                      height: '100%',
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      {t('estimate.options_section.form_option.title')}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {t('estimate.options_section.form_option.description')}
                    </Typography>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() =>
                        document
                          .getElementById('estimateForm')
                          ?.scrollIntoView({ behavior: 'smooth' })
                      }
                      sx={{ mt: 2 }}
                    >
                      {t('estimate.options_section.form_option.button')}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Estimate Form */}
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{ p: { xs: 3, md: 4 }, border: `1px solid ${theme.palette.divider}` }}
              id="estimateForm"
            >
              <Typography variant="h5" gutterBottom sx={{ fontFamily: 'Playfair Display', mb: 3 }}>
                {t('estimate.form.title')}
              </Typography>

              <Grid container spacing={3}>
                {/* Item Details */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    {t('estimate.form.item_details')}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormField
                    required
                    name="itemName"
                    label={t('estimate.form.item_name')}
                    value={formData.itemName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    errors={errors}
                    touched={touched}
                    helperText={t('estimate.form.item_name_helper')}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormField
                    name="category"
                    label={t('estimate.form.category')}
                    options={categories.map(cat => ({
                      value: cat,
                      label: t(`catalogue.filters.categories.${cat.toLowerCase()}`, cat),
                    }))}
                    value={formData.category}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    errors={errors}
                    touched={touched}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormField
                    required
                    name="description"
                    label={t('estimate.form.description')}
                    type="textarea"
                    value={formData.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    errors={errors}
                    touched={touched}
                    helperText={t('estimate.form.description_helper')}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">{t('estimate.form.condition')}</FormLabel>
                    <RadioGroup
                      row
                      name="condition"
                      value={formData.condition}
                      onChange={handleChange}
                    >
                      <FormControlLabel
                        value="excellent"
                        control={<Radio />}
                        label={t('estimate.form.condition_excellent')}
                      />
                      <FormControlLabel
                        value="good"
                        control={<Radio />}
                        label={t('estimate.form.condition_good')}
                      />
                      <FormControlLabel
                        value="fair"
                        control={<Radio />}
                        label={t('estimate.form.condition_fair')}
                      />
                      <FormControlLabel
                        value="poor"
                        control={<Radio />}
                        label={t('estimate.form.condition_poor')}
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      {t('estimate.form.photos')}
                    </Typography>
                    <Button variant="outlined" component="label" startIcon={<CloudUploadIcon />}>
                      {t('estimate.form.upload_images')}
                      <input type="file" hidden multiple accept="image/*" />
                    </Button>
                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                      {t('estimate.form.photos_helper')}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Divider />
                </Grid>

                {/* Contact Information */}
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    {t('estimate.form.contact_information')}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <FormField
                    required
                    name="name"
                    label={t('estimate.form.full_name')}
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    errors={errors}
                    touched={touched}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormField
                    name="email"
                    label={t('estimate.form.email')}
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    errors={errors}
                    touched={touched}
                    helperText={t('estimate.form.email_helper')}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormField
                    name="phone"
                    label={t('estimate.form.phone')}
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    errors={errors}
                    touched={touched}
                    helperText={t('estimate.form.phone_helper')}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormField
                    name="additionalNotes"
                    label={t('estimate.form.additional_notes')}
                    type="textarea"
                    value={formData.additionalNotes}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    errors={errors}
                    touched={touched}
                    helperText={t('estimate.form.additional_notes_helper')}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Alert severity="info" sx={{ mt: 2 }}>
                    {t('estimate.form.info_message')}
                  </Alert>
                </Grid>

                <Grid item xs={12} sx={{ mt: 2, textAlign: 'right' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={loading}
                    size="large"
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      t('estimate.form.submit')
                    )}
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default Estimate;
