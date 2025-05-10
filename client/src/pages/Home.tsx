import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  useTheme,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link as RouterLink } from 'react-router-dom';
import { categoryService, productService } from '../services';
import { Category } from '../services/categoryService';
import { Product } from '../services/productService';

// Placeholder hero image (replace with actual image later)
const heroImage = 'https://images.unsplash.com/photo-1574642344377-3ba2a7a5e822?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';

const HeroSection = styled(Box)(({ theme }) => ({
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

const Home = () => {
  const theme = useTheme();
  const [featuredCategories, setFeaturedCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchFeaturedData = async () => {
      try {
        setLoading(true);
        const [categoriesData, productsData] = await Promise.all([
          categoryService.getFeaturedCategories(),
          productService.getFeaturedProducts()
        ]);
        
        setFeaturedCategories(categoriesData);
        setFeaturedProducts(productsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching featured data:', err);
        setError('Failed to load featured content. Please try again later.');
        // Use placeholder data if API fails
        setFeaturedCategories([
          { 
            _id: '1', 
            name: 'Furniture', 
            description: 'Exquisite antique furniture pieces from various periods',
            image: 'https://images.unsplash.com/photo-1597696929736-6d13bed8e6a8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
          },
          { 
            _id: '2', 
            name: 'Paintings', 
            description: 'Beautiful paintings and artwork from renowned artists',
            image: 'https://images.unsplash.com/photo-1581404917879-53e19259fdda?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
          },
          { 
            _id: '3', 
            name: 'Decorative Arts', 
            description: 'Unique decorative pieces that add character to any space',
            image: 'https://images.unsplash.com/photo-1592837634593-87f4e0673db6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedData();
  }, []);

  // Handle image load error
  const handleImageError = (productId: string) => {
    setImageErrors(prev => ({
      ...prev,
      [productId]: true
    }));
  };

  // Get image URL with error handling
  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return 'https://via.placeholder.com/300x200?text=No+Image';
    if (imageErrors[imagePath]) {
      return 'https://via.placeholder.com/300x200?text=No+Image';
    }
    return `http://localhost:5001${imagePath}`;
  };

  return (
    <Box>
      <HeroSection>
        <Typography variant="h1" gutterBottom sx={{ 
          fontWeight: 700, 
          fontSize: {xs: '2.5rem', md: '4rem'}, 
          mb: 2,
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
        }}>
          Pischetola Antiques
        </Typography>
        <Typography variant="h4" sx={{ 
          maxWidth: '800px', 
          mb: 4,
          fontWeight: 400,
          textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
        }}>
          Discover timeless elegance and historical craftsmanship
        </Typography>
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button 
            variant="contained" 
            color="secondary" 
            size="large"
            component={RouterLink}
            to="/catalogue"
            endIcon={<ArrowForwardIcon />}
            sx={{ 
              fontWeight: 600, 
              fontSize: '1.1rem',
              px: 4,
              py: 1.5
            }}
          >
            Looking to Buy
          </Button>
          <Button 
            variant="outlined" 
            color="secondary" 
            size="large"
            component={RouterLink}
            to="/estimate"
            endIcon={<ArrowForwardIcon />}
            sx={{ 
              fontWeight: 600, 
              fontSize: '1.1rem',
              px: 4,
              py: 1.5,
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.25)',
              }
            }}
          >
            Looking to Sell
          </Button>
        </Box>
      </HeroSection>

      <Container maxWidth="lg">
        {/* Featured Products Section */}
        <Box sx={{ mb: { xs: 5, md: 8 } }}>
          <Typography variant="h2" gutterBottom sx={{ mb: { xs: 3, md: 4 }, textAlign: 'center', fontSize: { xs: '1.75rem', md: '2.5rem' } }}>
            Featured Products
          </Typography>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error" align="center">{error}</Typography>
          ) : (
            <Grid container spacing={{ xs: 2, md: 3 }}>
              {featuredProducts.map((product) => {
                // Extract category and period names
                const categoryName = typeof product.category === 'object' ? product.category.name : 'Unknown Category';
                const periodName = typeof product.period === 'object' ? product.period.name : 'Unknown Period';
                
                return (
                  <Grid item xs={12} sm={6} md={4} key={product._id}>
                    <Card 
                      sx={{ 
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        width: '100%',
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: theme.shadows[6],
                        },
                        borderRadius: 1,
                      }}
                    >
                      <Box 
                        sx={{ 
                          position: 'relative',
                          paddingTop: '66.67%', // 2:3 aspect ratio
                          width: '100%',
                          overflow: 'hidden'
                        }}
                      >
                        <CardMedia
                          component="img"
                          sx={{ 
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'center'
                          }}
                          image={product.images && product.images.length > 0 
                            ? getImageUrl(product.images[0])
                            : 'https://via.placeholder.com/300x200?text=No+Image'}
                          alt={product.name}
                          onError={() => handleImageError(product._id || '')}
                        />
                      </Box>
                      <CardContent sx={{ 
                        flexGrow: 1, 
                        p: { xs: 1.5, md: 2 }, 
                        display: 'flex', 
                        flexDirection: 'column',
                        height: { xs: 'auto', md: '180px' } 
                      }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          {categoryName} • {periodName}
                        </Typography>
                        <Typography 
                          variant="h6" 
                          component="h3" 
                          sx={{ 
                            fontWeight: 'medium', 
                            mb: 1,
                            height: { xs: 'auto', md: '48px' },
                            minHeight: { xs: '24px' },
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                          }}
                        >
                          {product.name}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{
                            mb: 1,
                            height: { xs: 'auto', md: '40px' },
                            minHeight: { xs: '20px' },
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {product.description}
                        </Typography>
                        <Typography 
                          variant="h6" 
                          color="primary" 
                          sx={{ fontWeight: 'bold', mt: { xs: 1, md: 'auto' } }}
                        >
                          €{product.price.toLocaleString()}
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ p: { xs: 1.5, md: 2 }, pt: 0, height: { xs: 'auto', md: '60px' } }}>
                        <Button 
                          variant="outlined" 
                          fullWidth
                          size="small"
                          component={RouterLink}
                          to={`/product/${product._id}`}
                        >
                          View Details
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Box>

        <Box sx={{ mb: { xs: 5, md: 8 } }}>
          <Typography variant="h2" gutterBottom sx={{ mb: { xs: 3, md: 4 }, textAlign: 'center', fontSize: { xs: '1.75rem', md: '2.5rem' } }}>
            Featured Categories
          </Typography>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error" align="center">{error}</Typography>
          ) : (
            <Grid container spacing={{ xs: 2, md: 4 }}>
              {featuredCategories.map((category) => (
                <Grid item key={category._id} xs={12} sm={6} md={4}>
                  <Card sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: theme.shadows[10],
                    },
                  }}>
                    <Box 
                      sx={{ 
                        position: 'relative',
                        paddingTop: '70%', // 10:7 aspect ratio
                        width: '100%',
                        overflow: 'hidden'
                      }}
                    >
                      <CardMedia
                        component="img"
                        sx={{ 
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'center'
                        }}
                        image={category.image || `https://via.placeholder.com/500x240?text=${category.name}`}
                        alt={category.name}
                      />
                    </Box>
                    <CardContent sx={{ 
                      flexGrow: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      p: { xs: 1.5, md: 2 },
                      height: { xs: 'auto', md: '180px' }
                    }}>
                      <Typography 
                        variant="h5" 
                        component="h3" 
                        sx={{ 
                          fontWeight: 'medium',
                          mb: 2,
                          height: { xs: 'auto', md: '60px' },
                          minHeight: { xs: '28px' },
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}
                      >
                        {category.name}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{
                          mb: 2,
                          height: { xs: 'auto', md: '60px' },
                          minHeight: { xs: '40px' },
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: { xs: 2, md: 3 },
                          WebkitBoxOrient: 'vertical'
                        }}
                      >
                        {category.description}
                      </Typography>
                      <Box sx={{ mt: { xs: 1, md: 'auto' } }}>
                        <Button 
                          component={RouterLink}
                          to={`/catalogue?category=${category._id}`}
                          color="primary"
                          endIcon={<ArrowForwardIcon />}
                          sx={{ pl: { xs: 0, md: 2 } }}
                        >
                          View Collection
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        <Paper elevation={0} sx={{ 
          p: 4, 
          mb: 8,
          backgroundColor: theme.palette.background.default,
          border: `1px solid ${theme.palette.divider}`
        }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" gutterBottom>
                About Pischetola Antiques
              </Typography>
              <Typography variant="body1" paragraph>
                Pischetola Antiques has been a trusted name in the industry for over 30 years. Our collection features carefully selected pieces that represent the finest craftsmanship from various historical periods.
              </Typography>
              <Typography variant="body1" paragraph>
                Each item in our inventory has been authenticated and restored by our team of experts, ensuring both historical accuracy and exceptional quality.
              </Typography>
              <Button 
                variant="outlined" 
                color="primary"
                component={RouterLink}
                to="/about"
                endIcon={<ArrowForwardIcon />}
                sx={{ mt: 2 }}
              >
                Learn More About Us
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                height: '300px', 
                backgroundImage: 'url(https://images.unsplash.com/photo-1551215717-05bc1a6a7ccb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: 2
              }} />
            </Grid>
          </Grid>
        </Paper>

        <Box sx={{ 
          mb: 8, 
          textAlign: 'center',
          py: 5,
          px: {xs: 2, md: 8},
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          borderRadius: 2
        }}>
          <Typography variant="h3" gutterBottom>
            Request an Estimate
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, maxWidth: '800px', mx: 'auto' }}>
            Have an antique item you'd like to sell or get appraised? Our team of experts can provide you with a detailed estimate of its value.
          </Typography>
          <Button 
            variant="contained" 
            color="secondary"
            component={RouterLink}
            to="/contact"
            size="large"
            sx={{ px: 4 }}
          >
            Request Estimate
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Home; 