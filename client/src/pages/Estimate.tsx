import React, { useState, ChangeEvent } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  Divider,
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
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

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

const Estimate: React.FC = () => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  
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
  
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      // Submit form
      setSubmitted(true);
      // In a real app, you would send the form data to your backend here
      console.log('Form submitted:', formData);
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };
  
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  const isStepValid = () => {
    if (activeStep === 0) {
      return formData.itemName && formData.category && formData.description;
    }
    if (activeStep === 1) {
      return (
        formData.firstName &&
        formData.lastName &&
        formData.email &&
        formData.phone
      );
    }
    return true;
  };
  
  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Tell us about your item
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Please provide as much detail as possible about the item you would like us to evaluate.
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Item Name"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleChange}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    label="Category"
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Period</InputLabel>
                  <Select
                    name="period"
                    value={formData.period}
                    onChange={handleChange}
                    label="Period"
                  >
                    {periods.map((period) => (
                      <MenuItem key={period} value={period}>
                        {period}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  multiline
                  rows={4}
                  label="Description"
                  placeholder="Please include details such as materials, dimensions, any markings or signatures, and history if known"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Condition</FormLabel>
                  <RadioGroup
                    row
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      value="excellent"
                      control={<Radio />}
                      label="Excellent"
                    />
                    <FormControlLabel
                      value="good"
                      control={<Radio />}
                      label="Good"
                    />
                    <FormControlLabel
                      value="fair"
                      control={<Radio />}
                      label="Fair"
                    />
                    <FormControlLabel
                      value="poor"
                      control={<Radio />}
                      label="Poor"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  sx={{ mt: 1 }}
                >
                  Upload Photos
                  <input
                    type="file"
                    hidden
                    multiple
                    accept="image/*"
                  />
                </Button>
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  You can upload up to 5 photos. Include different angles and any details of marks, signatures, or damage.
                </Typography>
              </Grid>
            </Grid>
          </Box>
        );
      
      case 1:
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Contact Information
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Please provide your contact details so we can get back to you with the estimate.
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
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
                    <FormControlLabel
                      value="email"
                      control={<Radio />}
                      label="Email"
                    />
                    <FormControlLabel
                      value="phone"
                      control={<Radio />}
                      label="Phone"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Timeframe</FormLabel>
                  <RadioGroup
                    row
                    name="timeframe"
                    value={formData.timeframe}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      value="urgent"
                      control={<Radio />}
                      label="Urgent (within 48 hours)"
                    />
                    <FormControlLabel
                      value="standard"
                      control={<Radio />}
                      label="Standard (1-2 weeks)"
                    />
                    <FormControlLabel
                      value="not_urgent"
                      control={<Radio />}
                      label="Not Urgent"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Additional Notes"
                  placeholder="Any other information you'd like to share"
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </Box>
        );
      
      case 2:
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Review Your Information
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Please review the information you've provided before submitting.
            </Typography>
            
            <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: 'background.default' }}>
              <Typography variant="h6" gutterBottom>
                Item Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Item Name:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body2">{formData.itemName}</Typography>
                </Grid>
                
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Category:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body2">{formData.category}</Typography>
                </Grid>
                
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Period:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body2">{formData.period || 'Not specified'}</Typography>
                </Grid>
                
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Condition:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                    {formData.condition}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Description:
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {formData.description}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
            
            <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.default' }}>
              <Typography variant="h6" gutterBottom>
                Contact Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Name:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body2">
                    {formData.firstName} {formData.lastName}
                  </Typography>
                </Grid>
                
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Email:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body2">{formData.email}</Typography>
                </Grid>
                
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Phone:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body2">{formData.phone}</Typography>
                </Grid>
                
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Location:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body2">
                    {formData.city && formData.country 
                      ? `${formData.city}, ${formData.country}`
                      : formData.city || formData.country || 'Not specified'}
                  </Typography>
                </Grid>
                
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Preferred Contact:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                    {formData.preferredContact}
                  </Typography>
                </Grid>
                
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Timeframe:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body2">
                    {formData.timeframe === 'urgent' && 'Urgent (within 48 hours)'}
                    {formData.timeframe === 'standard' && 'Standard (1-2 weeks)'}
                    {formData.timeframe === 'not_urgent' && 'Not Urgent'}
                  </Typography>
                </Grid>
                
                {formData.additionalNotes && (
                  <>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">
                        Additional Notes:
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body2">{formData.additionalNotes}</Typography>
                    </Grid>
                  </>
                )}
              </Grid>
            </Paper>
          </Box>
        );
      
      default:
        return 'Unknown step';
    }
  };
  
  if (submitted) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            textAlign: 'center',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2
          }}
        >
          <CheckCircleOutlineIcon 
            sx={{ 
              fontSize: 80, 
              color: 'success.main',
              mb: 2 
            }} 
          />
          <Typography variant="h4" gutterBottom>
            Thank You for Your Request
          </Typography>
          <Typography variant="body1" paragraph>
            We have received your estimate request for "{formData.itemName}".
          </Typography>
          <Typography variant="body1" paragraph>
            Our experts will review the details you've provided and contact you via {formData.preferredContact} within {formData.timeframe === 'urgent' ? '48 hours' : '3-5 business days'}.
          </Typography>
          <Typography variant="body1" paragraph>
            If you have any questions in the meantime, please don't hesitate to contact us at info@pischetolaantiques.com or +39 055 1234567.
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => {
              setActiveStep(0);
              setSubmitted(false);
              setFormData({
                itemName: '',
                category: '',
                period: '',
                description: '',
                condition: 'good',
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                country: '',
                city: '',
                preferredContact: 'email',
                timeframe: 'not_urgent',
                additionalNotes: '',
              });
            }}
            sx={{ mt: 2 }}
          >
            Submit Another Request
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h2" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        Request an Estimate
      </Typography>
      <Typography variant="body1" paragraph sx={{ textAlign: 'center', mb: 4, maxWidth: '800px', mx: 'auto' }}>
        Our team of experts is ready to evaluate your antique items. Please fill out the form below with as much detail as possible for an accurate assessment.
      </Typography>
      
      <Paper 
        elevation={0} 
        sx={{ 
          p: { xs: 2, sm: 4 }, 
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2
        }}
      >
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        <Divider sx={{ mb: 4 }} />
        
        <Box sx={{ mb: 4 }}>
          {getStepContent(activeStep)}
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="outlined"
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            disabled={!isStepValid()}
          >
            {activeStep === steps.length - 1 ? 'Submit Request' : 'Next'}
          </Button>
        </Box>
      </Paper>
      
      <Box sx={{ mt: 4, px: 2 }}>
        <Alert severity="info">
          Your privacy is important to us. The information you provide will only be used to process your estimate request and will not be shared with third parties.
        </Alert>
      </Box>
    </Container>
  );
};

export default Estimate; 