import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Box,
  Typography,
  Divider,
  Button,
  Paper,
  Breadcrumbs,
  Link,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Tabs,
  Tab,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import VerifiedIcon from '@mui/icons-material/Verified';
import StarIcon from '@mui/icons-material/Star';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InfoIcon from '@mui/icons-material/Info';

// Import API service
import { getProductById, Product as ProductType } from '../services/productService';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `product-tab-${index}`,
    'aria-controls': `product-tabpanel-${index}`,
  };
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<ProductType | null>(null);
  const [activeImage, setActiveImage] = useState<string>('');
  const [tabValue, setTabValue] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Fetch product data from API
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const productData = await getProductById(id);
        setProduct(productData);
        
        // Set active image to first image if available
        if (productData.images && productData.images.length > 0) {
          setActiveImage(`http://localhost:5001${productData.images[0]}`);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Handle image load error
  const handleImageError = (imageKey: string) => {
    setImageErrors(prev => ({
      ...prev,
      [imageKey]: true
    }));
  };

  // Get image URL with error handling
  const getImageUrl = (imagePath: string) => {
    if (imageErrors[imagePath]) {
      return 'https://via.placeholder.com/800x600?text=No+Image';
    }
    return `http://localhost:5001${imagePath}`;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading product information...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => navigate('/catalogue')}
        >
          Back to Catalogue
        </Button>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Product Not Found
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          We couldn't find the product you're looking for.
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => navigate('/catalogue')}
        >
          Back to Catalogue
        </Button>
      </Container>
    );
  }

  // Extract category and period names
  const categoryName = typeof product.category === 'object' ? product.category.name : 'Unknown Category';
  const periodName = typeof product.period === 'object' ? product.period.name : 'Unknown Period';

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link 
          underline="hover" 
          color="inherit" 
          href="#" 
          onClick={(e) => {
            e.preventDefault();
            navigate('/');
          }}
        >
          Home
        </Link>
        <Link 
          underline="hover" 
          color="inherit" 
          href="#" 
          onClick={(e) => {
            e.preventDefault();
            navigate('/catalogue');
          }}
        >
          Catalogue
        </Link>
        <Link 
          underline="hover" 
          color="inherit" 
          href="#" 
          onClick={(e) => {
            e.preventDefault();
            navigate(`/catalogue?category=${typeof product.category === 'object' ? product.category._id : ''}`);
          }}
        >
          {categoryName}
        </Link>
        <Typography color="text.primary">{product.name}</Typography>
      </Breadcrumbs>

      {/* Back button - mobile only */}
      {isMobile && (
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Back
        </Button>
      )}

      <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 4 }}>
        {/* Left side - Product images */}
        <Box sx={{ width: isMobile ? '100%' : '55%' }}>
          <Box
            component="img"
            src={activeImage}
            alt={product.name}
            onError={() => handleImageError('main')}
            sx={{
              width: '100%',
              height: 'auto',
              borderRadius: 2,
              boxShadow: theme.shadows[2],
              mb: 2,
              objectFit: 'cover',
              aspectRatio: '4/3',
            }}
          />
          
          <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', py: 1 }}>
            {product.images && product.images.map((img, index) => {
              const imageUrl = getImageUrl(img);
              return (
                <Box
                  key={index}
                  component="img"
                  src={imageUrl}
                  alt={`${product.name} - View ${index + 1}`}
                  onClick={() => setActiveImage(imageUrl)}
                  onError={() => handleImageError(img)}
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: 1,
                    objectFit: 'cover',
                    cursor: 'pointer',
                    border: activeImage === imageUrl ? `2px solid ${theme.palette.primary.main}` : 'none',
                    opacity: activeImage === imageUrl ? 1 : 0.7,
                  }}
                />
              );
            })}
          </Box>
        </Box>
        
        {/* Right side - Product details */}
        <Box sx={{ width: isMobile ? '100%' : '45%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="overline" color="text.secondary">
              {categoryName} • {periodName}
            </Typography>
            
            <Box>
              <IconButton size="small" aria-label="favorite">
                <FavoriteBorderIcon />
              </IconButton>
              <IconButton size="small" aria-label="share">
                <ShareIcon />
              </IconButton>
            </Box>
          </Box>
          
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontFamily: 'Playfair Display' }}>
            {product.name}
          </Typography>
          
          <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold', mb: 3 }}>
            €{product.price.toLocaleString()}
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 3 }}>
            {product.description}
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Chip 
              icon={<VerifiedIcon />} 
              label="Authenticity Guaranteed" 
              variant="outlined" 
              color="success"
              sx={{ mr: 1, mb: 1 }}
            />
            <Chip 
              icon={<LocalShippingIcon />} 
              label="Worldwide Shipping" 
              variant="outlined"
              sx={{ mb: 1 }}
            />
          </Box>
          
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            fullWidth
            sx={{ mb: 2, py: 1.5 }}
          >
            Enquire About This Item
          </Button>
          
          <Button 
            variant="outlined" 
            color="primary" 
            size="large"
            fullWidth
            sx={{ mb: 3 }}
          >
            Request Condition Report
          </Button>
          
          <Box sx={{ backgroundColor: 'rgba(0,0,0,0.03)', p: 2, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <InfoIcon color="primary" sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="body2" fontWeight="bold">
                Need help with this piece?
              </Typography>
            </Box>
            <Typography variant="body2">
              Our experts are available to answer any questions about this piece and help with delivery options.
            </Typography>
            <Button size="small" sx={{ mt: 1 }}>
              Contact Us
            </Button>
          </Box>
        </Box>
      </Box>
      
      {/* Product information tabs */}
      <Box sx={{ width: '100%', mt: 6 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="product information tabs"
            variant={isMobile ? "scrollable" : "standard"}
            scrollButtons={isMobile ? "auto" : undefined}
          >
            <Tab label="Details" {...a11yProps(0)} />
            <Tab label="History & Provenance" {...a11yProps(1)} />
            <Tab label="Delivery & Returns" {...a11yProps(2)} />
          </Tabs>
        </Box>
        
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            {/* Dimensions */}
            {product.measures && (
              <>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Dimensions
                  </Typography>
                  <Typography variant="body1">
                    {`${product.measures.width || 0} × ${product.measures.height || 0} × ${product.measures.depth || 0} ${product.measures.unit || 'cm'} (W × H × D)`}
                  </Typography>
                </Grid>
                
                {/* Condition */}
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Condition
                  </Typography>
                  <Typography variant="body1">
                    {product.condition || 'Not specified'}
                  </Typography>
                </Grid>
                
                {/* Origin */}
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Origin
                  </Typography>
                  <Typography variant="body1">
                    {product.origin || 'Not specified'}
                  </Typography>
                </Grid>
                
                {/* Period */}
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Period
                  </Typography>
                  <Typography variant="body1">
                    {periodName}
                  </Typography>
                </Grid>
              </>
            )}
          </Grid>
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Typography variant="body1" paragraph>
            {product.history || 'No history information available for this item.'}
          </Typography>
          {product.provenance && (
            <>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
                Provenance
              </Typography>
              <Typography variant="body1" paragraph>
                {product.provenance}
              </Typography>
            </>
          )}
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <Typography variant="body1" paragraph>
            {product.delivery || 'Please contact us for delivery options.'}
          </Typography>
          <Typography variant="body1" paragraph>
            Returns: We offer a 14-day return period for all items. Please contact us to arrange a return.
          </Typography>
        </TabPanel>
      </Box>
      
      {/* Related products section could be added here */}
    </Container>
  );
};

export default ProductDetail; 