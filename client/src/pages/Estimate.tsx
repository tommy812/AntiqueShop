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
  Stepper,
  Step,
  StepLabel,
  useTheme,
  Alert,
  SelectChangeEvent,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

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

const periods = [
  'Renaissance',
  'Baroque',
  'Georgian',
  'Victorian',
  'Art Nouveau',
  'Art Deco',
  '20th Century',
  'Unknown',
];

const steps = ['Item Details', 'Your Information', 'Confirmation'];

interface FormData {
  itemName: string;
  category: string;
  period: string;
  description: string;
  condition: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  preferredContact: string;
  timeframe: string;
  additionalNotes: string;
}

interface FormErrors {
  [key: string]: string;
}

const Estimate: React.FC = () => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
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
    period: '',
    description: '',
    condition: 'good',

    // Contact information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    preferredContact: 'email',

    // Additional information
    timeframe: 'not_urgent',
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

    // Validate the form
    validateStepFields(activeStep);
  };

  // Validate fields for current step
  const validateStepFields = (step: number): boolean => {
    const newErrors: FormErrors = {};

    if (step === 0) {
      // Validate item details
      if (!formData.itemName.trim()) {
        newErrors.itemName = 'Item name is required';
      }

      if (!formData.category) {
        newErrors.category = 'Category is required';
      }

      if (!formData.description.trim()) {
        newErrors.description = 'Description is required';
      } else if (formData.description.trim().length < 10) {
        newErrors.description =
          'Please provide a more detailed description (at least 10 characters)';
      }
    }

    if (step === 1) {
      // Validate contact information
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required';
      }

      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required';
      }

      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
        newErrors.email = 'Invalid email address';
      }

      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    // Validate current step fields before proceeding
    if (!isStepValid()) {
      // Mark all fields in current step as touched
      const fieldsToValidate = getStepFields(activeStep);
      const newTouched = { ...touched };

      fieldsToValidate.forEach(field => {
        newTouched[field] = true;
      });

      setTouched(newTouched);

      // Force validation to update errors
      validateStepFields(activeStep);

      return;
    }

    if (activeStep === steps.length - 1) {
      // Submit form
      setLoading(true);

      estimateService
        .createEstimate(formData)
        .then(() => {
          setSubmitted(true);
          setLoading(false);
          setSnackbar({
            open: true,
            message: 'Your estimate request has been submitted successfully!',
            severity: 'success',
          });
        })
        .catch(error => {
          console.error('Error submitting estimate request:', error);
          setLoading(false);
          setSnackbar({
            open: true,
            message: 'There was an error submitting your request. Please try again.',
            severity: 'error',
          });
        });
    } else {
      setActiveStep(prevStep => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
  };

  // Get fields that belong to the current step
  const getStepFields = (step: number): string[] => {
    if (step === 0) {
      return ['itemName', 'category', 'period', 'description', 'condition'];
    }
    if (step === 1) {
      return ['firstName', 'lastName', 'email', 'phone', 'country', 'city', 'preferredContact'];
    }
    return ['timeframe', 'additionalNotes'];
  };

  // Check if current step has validation errors
  const isStepValid = (): boolean => {
    // Check if step is valid based on current errors
    const fieldsToValidate = getStepFields(activeStep);

    // Only count errors for fields in the current step
    const stepErrors = Object.keys(errors).filter(key => fieldsToValidate.includes(key));

    return stepErrors.length === 0;
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormField
                required
                name="itemName"
                label="Item Name"
                value={formData.itemName}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={errors}
                touched={touched}
                helperText="Enter a descriptive name"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormField
                required
                name="category"
                label="Category"
                options={categories.map(cat => ({ value: cat, label: cat }))}
                value={formData.category}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={errors}
                touched={touched}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormField
                name="period"
                label="Period/Style"
                options={periods.map(p => ({ value: p, label: p }))}
                value={formData.period}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={errors}
                touched={touched}
                helperText="Select if known"
              />
            </Grid>

            <Grid item xs={12}>
              <FormField
                required
                name="description"
                label="Description"
                type="textarea"
                value={formData.description}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={errors}
                touched={touched}
                helperText="Please include details about size, materials, and any markings or signatures"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Condition</FormLabel>
                <RadioGroup row name="condition" value={formData.condition} onChange={handleChange}>
                  <FormControlLabel value="excellent" control={<Radio />} label="Excellent" />
                  <FormControlLabel value="good" control={<Radio />} label="Good" />
                  <FormControlLabel value="fair" control={<Radio />} label="Fair" />
                  <FormControlLabel value="poor" control={<Radio />} label="Poor/Damaged" />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Photos
                </Typography>
                <Button variant="outlined" component="label" startIcon={<CloudUploadIcon />}>
                  Upload Images
                  <input type="file" hidden multiple accept="image/*" />
                </Button>
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  You can upload up to 5 images (max 5MB each)
                </Typography>
              </Box>
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormField
                required
                name="firstName"
                label="First Name"
                value={formData.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={errors}
                touched={touched}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormField
                required
                name="lastName"
                label="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={errors}
                touched={touched}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormField
                required
                name="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={errors}
                touched={touched}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormField
                required
                name="phone"
                label="Phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={errors}
                touched={touched}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormField
                name="country"
                label="Country"
                value={formData.country}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={errors}
                touched={touched}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormField
                name="city"
                label="City"
                value={formData.city}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={errors}
                touched={touched}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Preferred Contact Method</FormLabel>
                <RadioGroup
                  row
                  name="preferredContact"
                  value={formData.preferredContact}
                  onChange={handleChange}
                >
                  <FormControlLabel value="email" control={<Radio />} label="Email" />
                  <FormControlLabel value="phone" control={<Radio />} label="Phone" />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Timeframe</FormLabel>
                <RadioGroup name="timeframe" value={formData.timeframe} onChange={handleChange}>
                  <FormControlLabel
                    value="urgent"
                    control={<Radio />}
                    label="Urgent (within 1-2 days)"
                  />
                  <FormControlLabel
                    value="normal"
                    control={<Radio />}
                    label="Normal (within a week)"
                  />
                  <FormControlLabel
                    value="not_urgent"
                    control={<Radio />}
                    label="Not urgent (no specific timeframe)"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormField
                name="additionalNotes"
                label="Additional Notes or Questions"
                type="textarea"
                value={formData.additionalNotes}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={errors}
                touched={touched}
                helperText="Any other information you'd like to share"
              />
            </Grid>

            <Grid item xs={12}>
              <Alert severity="info" sx={{ mt: 2 }}>
                By submitting this form, you're requesting an appraisal of your item. Our experts
                will review your information and get back to you within the requested timeframe.
              </Alert>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Review your information:
                </Typography>
                <Typography variant="body2">
                  Please review all the information you've provided before submitting the form. Our
                  appraisal will be based on this information and the photos you've uploaded.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        );
      default:
        return 'Unknown step';
    }
  };

  // Handler for closing snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography
        variant="h3"
        gutterBottom
        sx={{ textAlign: 'center', mb: 2, fontFamily: 'Playfair Display' }}
      >
        Request an Estimate
      </Typography>
      <Typography
        variant="subtitle1"
        sx={{ textAlign: 'center', mb: 6, maxWidth: 700, mx: 'auto' }}
      >
        Fill out this form to request a free estimate for your antique or collectible item. Our
        experts will evaluate your item and provide you with an estimated value.
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
            Thank You!
          </Typography>
          <Typography variant="body1" paragraph>
            Your estimate request has been submitted successfully.
          </Typography>
          <Typography variant="body1" paragraph>
            One of our experts will review your information and get back to you within the specified
            timeframe. If you have any urgent questions, please don't hesitate to contact us
            directly.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => (window.location.href = '/')}
            sx={{ mt: 2 }}
          >
            Return to Homepage
          </Button>
        </Paper>
      ) : (
        <Paper
          elevation={0}
          sx={{ p: { xs: 3, md: 4 }, border: `1px solid ${theme.palette.divider}` }}
        >
          <Stepper activeStep={activeStep} sx={{ mb: 4 }} alternativeLabel>
            {steps.map(label => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box>
            {getStepContent(activeStep)}

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mt: 4,
                pt: 2,
                borderTop: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Button disabled={activeStep === 0} onClick={handleBack}>
                Back
              </Button>
              <Button variant="contained" color="primary" onClick={handleNext} disabled={loading}>
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : activeStep === steps.length - 1 ? (
                  'Submit Request'
                ) : (
                  'Next'
                )}
              </Button>
            </Box>
          </Box>
        </Paper>
      )}
    </Container>
  );
};

export default Estimate;
