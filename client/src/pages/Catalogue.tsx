import React, { useState, useEffect } from 'react';
import { 
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  TextField,
  InputAdornment,
  Divider,
  Paper,
  useTheme,
  Pagination,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useMediaQuery,
  IconButton,
  Drawer,
  CircularProgress,
  Alert
} from '@mui/material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';

// Import API services
import { getProducts, ProductFilters, Product } from '../services/productService';
import { getAllCategories, Category } from '../services/categoryService';
import { getAllPeriods, Period } from '../services/periodService';

// Price ranges
const PRICE_RANGES = [
  { label: 'Any Price', min: undefined, max: undefined },
  { label: 'Under €1,000', min: undefined, max: 1000 },
  { label: '€1,000 - €2,000', min: 1000, max: 2000 },
  { label: '€2,000 - €5,000', min: 2000, max: 5000 },
  { label: 'Over €5,000', min: 5000, max: undefined }
];

const Catalogue = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState(PRICE_RANGES[0].label);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  
  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });
  
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Fetch categories and periods on component mount
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [categoriesData, periodsData] = await Promise.all([
          getAllCategories(),
          getAllPeriods()
        ]);
        
        setCategories(categoriesData);
        setPeriods(periodsData);
      } catch (err) {
        console.error('Error fetching filter data:', err);
        setError('Failed to load filter options. Please refresh the page.');
      }
    };
    
    fetchFilters();
  }, []);
  
  // Check for URL parameters before fetching products
  // Ensure this runs before the product fetch effect
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    // Handle category filter from URL
    const categoryParam = params.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    
    // Handle period filter from URL
    const periodParam = params.get('period');
    if (periodParam) {
      setSelectedPeriod(periodParam);
    }
    
    // Handle search term from URL
    const searchParam = params.get('search');
    if (searchParam) {
      setSearchTerm(searchParam);
    }
    
    // Handle price range from URL
    const minPrice = params.get('minPrice');
    const maxPrice = params.get('maxPrice');
    if (minPrice || maxPrice) {
      // Find matching price range or default to custom
      const matchedRange = PRICE_RANGES.find(range => 
        (range.min === (minPrice ? Number(minPrice) : undefined) && 
         range.max === (maxPrice ? Number(maxPrice) : undefined))
      );
      
      if (matchedRange) {
        setSelectedPriceRange(matchedRange.label);
      }
    }

    // Handle page parameter
    const pageParam = params.get('page');
    if (pageParam) {
      const pageNumber = parseInt(pageParam, 10);
      if (!isNaN(pageNumber) && pageNumber > 0) {
        setPagination(prev => ({ ...prev, currentPage: pageNumber }));
      }
    }
    
    // Scroll to top on any filter change from URL
    window.scrollTo(0, 0);
  }, [location.search]);
  
  // Fetch products when filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Build filters object
        const filters: ProductFilters = {
          page: pagination.currentPage,
          limit: 12,
          sort: '-createdAt'
        };
        
        // Add search term if present
        if (searchTerm) {
          filters.search = searchTerm;
        }
        
        // Add category filter if selected
        if (selectedCategory) {
          filters.category = selectedCategory;
        }
        
        // Add period filter if selected
        if (selectedPeriod) {
          filters.period = selectedPeriod;
        }
        
        // Add price range filter if selected
        const priceRange = PRICE_RANGES.find(range => range.label === selectedPriceRange);
        if (priceRange) {
          filters.minPrice = priceRange.min;
          filters.maxPrice = priceRange.max;
        }
        
        const response = await getProducts(filters);
        setProducts(response.products);
        setPagination(response.pagination);
        
        // Scroll to top when new products are loaded
        window.scrollTo(0, 0);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [searchTerm, selectedCategory, selectedPeriod, selectedPriceRange, pagination.currentPage]);
  
  // Handle page change
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
    
    // Update URL to include page parameter
    const params = new URLSearchParams(location.search);
    params.set('page', page.toString());
    navigate(`/catalogue?${params.toString()}`, { replace: true });
    
    window.scrollTo(0, 0);
  };

  // Handle image load error
  const handleImageError = (productId: string) => {
    setImageErrors(prev => ({
      ...prev,
      [productId]: true
    }));
  };
  
  // Handle category filter change
  const handleCategoryChange = (categoryId: string) => {
    // If clicking the already selected category, do nothing (keep it selected)
    // Otherwise change to the new category
    if (selectedCategory !== categoryId) {
      setSelectedCategory(categoryId);
      // Reset to page 1 when changing filters
      setPagination(prev => ({ ...prev, currentPage: 1 }));
      window.scrollTo(0, 0);
    }
  };
  
  // Handle period filter change
  const handlePeriodChange = (periodId: string) => {
    // If clicking the already selected period, do nothing (keep it selected)
    // Otherwise change to the new period
    if (selectedPeriod !== periodId) {
      setSelectedPeriod(periodId);
      // Reset to page 1 when changing filters
      setPagination(prev => ({ ...prev, currentPage: 1 }));
      window.scrollTo(0, 0);
    }
  };
  
  // Handle price range filter change  
  const handlePriceRangeChange = (priceRange: string) => {
    // If clicking the already selected price range, do nothing (keep it selected)
    // Otherwise change to the new price range
    if (selectedPriceRange !== priceRange) {
      setSelectedPriceRange(priceRange);
      // Reset to page 1 when changing filters
      setPagination(prev => ({ ...prev, currentPage: 1 }));
      window.scrollTo(0, 0);
    }
  };
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // Reset to page 1 when searching
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    // Scroll to top when search changes
    window.scrollTo(0, 0);
  };
  
  // Function to update URL with current filter state
  const updateUrlWithFilters = () => {
    const params = new URLSearchParams();
    
    if (selectedCategory) {
      params.append('category', selectedCategory);
    }
    
    if (selectedPeriod) {
      params.append('period', selectedPeriod);
    }
    
    if (searchTerm) {
      params.append('search', searchTerm);
    }
    
    // Add price range
    const priceRange = PRICE_RANGES.find(range => range.label === selectedPriceRange);
    if (priceRange && priceRange.min) {
      params.append('minPrice', priceRange.min.toString());
    }
    if (priceRange && priceRange.max) {
      params.append('maxPrice', priceRange.max.toString());
    }
    
    // Add current page if not on first page
    if (pagination.currentPage > 1) {
      params.append('page', pagination.currentPage.toString());
    }
    
    // Update URL without reloading page
    navigate(`/catalogue?${params.toString()}`, { replace: true });
  };
  
  // Update URL when filters change
  useEffect(() => {
    // Skip the URL update on initial mount to avoid double URL change
    if (loading) return;
    
    updateUrlWithFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, selectedPeriod, selectedPriceRange, searchTerm]);

  const FilterSection = () => (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
        Filters
      </Typography>

      <Accordion defaultExpanded sx={{ mb: 2, boxShadow: 'none', '&:before': { display: 'none' } }}>
        <AccordionSummary 
          expandIcon={<ExpandMoreIcon />}
          sx={{ 
            px: 0,
            minHeight: 48,
            '& .MuiAccordionSummary-content': { 
              my: 0 
            }
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            Category
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <FormGroup>
            <FormControlLabel
              key="all-categories"
              control={
                <Checkbox 
                  checked={selectedCategory === ''}
                  onClick={() => handleCategoryChange('')}
                  size="small"
                  color="primary"
                />
              }
              label={
                <Typography variant="body2">
                  All Categories
                </Typography>
              }
            />
            {categories.map((category) => (
              <FormControlLabel
                key={category._id}
                control={
                  <Checkbox 
                    checked={selectedCategory === category._id}
                    onClick={() => handleCategoryChange(category._id || '')}
                    size="small"
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2">
                    {category.name}
                  </Typography>
                }
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded sx={{ mb: 2, boxShadow: 'none', '&:before': { display: 'none' } }}>
        <AccordionSummary 
          expandIcon={<ExpandMoreIcon />}
          sx={{ 
            px: 0,
            minHeight: 48,
            '& .MuiAccordionSummary-content': { 
              my: 0 
            }
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            Period
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <FormGroup>
            <FormControlLabel
              key="all-periods"
              control={
                <Checkbox 
                  checked={selectedPeriod === ''}
                  onClick={() => handlePeriodChange('')}
                  size="small"
                  color="primary"
                />
              }
              label={
                <Typography variant="body2">
                  All Periods
                </Typography>
              }
            />
            {periods.map((period) => (
              <FormControlLabel
                key={period._id}
                control={
                  <Checkbox 
                    checked={selectedPeriod === period._id}
                    onClick={() => handlePeriodChange(period._id || '')}
                    size="small"
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2">
                    {period.name}
                  </Typography>
                }
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded sx={{ mb: 2, boxShadow: 'none', '&:before': { display: 'none' } }}>
        <AccordionSummary 
          expandIcon={<ExpandMoreIcon />}
          sx={{ 
            px: 0,
            minHeight: 48,
            '& .MuiAccordionSummary-content': { 
              my: 0 
            }
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            Price Range
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <FormGroup>
            {PRICE_RANGES.map((range) => (
              <FormControlLabel
                key={range.label}
                control={
                  <Checkbox 
                    checked={selectedPriceRange === range.label}
                    onClick={() => handlePriceRangeChange(range.label)}
                    size="small"
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2">
                    {range.label}
                  </Typography>
                }
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>
    </Box>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Catalogue
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Explore our collection of fine antiques and collectibles. Each piece has been carefully selected for its quality, authenticity, and historical significance.
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex' }}>
        {/* Mobile filter toggle */}
        {isMobile && (
          <Box sx={{ width: '100%', mb: 2 }}>
            <Button 
              fullWidth 
              startIcon={<FilterListIcon />}
              onClick={() => setMobileFiltersOpen(true)}
              variant="outlined"
            >
              Show Filters
            </Button>
          </Box>
        )}
        
        {/* Mobile filter drawer */}
        <Drawer
          anchor="left"
          open={mobileFiltersOpen}
          onClose={() => setMobileFiltersOpen(false)}
          sx={{ 
            '& .MuiDrawer-paper': { 
              width: '80%', 
              maxWidth: 350,
              p: 3
            }
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Filters</Typography>
            <IconButton onClick={() => setMobileFiltersOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 3 }} />
          <FilterSection />
        </Drawer>
        
        {/* Sidebar filters (desktop) */}
        {!isMobile && (
          <Box sx={{ width: 280, flexShrink: 0, mr: 4 }}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                border: `1px solid ${theme.palette.divider}`,
                position: 'sticky',
                top: 24,
                maxHeight: 'calc(100vh - 48px)',
                overflowY: 'auto'
              }}
            >
              <FilterSection />
            </Paper>
          </Box>
        )}
        
        {/* Main content */}
        <Box sx={{ flexGrow: 1 }}>
          {/* Search bar */}
          <Box sx={{ mb: 4 }}>
            <TextField
              fullWidth
              placeholder="Search by name, description, or keywords..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
            />
          </Box>
          
          {/* Results count and sorting */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="body2" color="text.secondary">
              {loading ? 'Loading products...' : `Showing ${products.length} of ${pagination.total} items`}
            </Typography>
          </Box>
          
          {/* Error message */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          {/* Loading indicator */}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          )}
          
          {/* No results message */}
          {!loading && products.length === 0 && !error && (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="h6" gutterBottom>
                No products found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search or filter criteria
              </Typography>
            </Box>
          )}
          
          {/* Products grid */}
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={6} lg={4} key={product._id}>
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
                      image={
                        imageErrors[product._id || ''] 
                          ? 'https://via.placeholder.com/300x200?text=No+Image'
                          : product.images && product.images.length > 0 
                            ? `http://localhost:5001${product.images[0]}`
                            : 'https://via.placeholder.com/300x200?text=No+Image'
                      }
                      onError={() => handleImageError(product._id || '')}
                      alt={product.name}
                    />
                  </Box>
                  <CardContent sx={{ 
                    flexGrow: 1, 
                    p: 2, 
                    display: 'flex', 
                    flexDirection: 'column',
                    height: '180px' 
                  }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      {typeof product.category === 'object' ? product.category.name : 'Unknown Category'} • 
                      {typeof product.period === 'object' ? product.period.name : 'Unknown Period'}
                    </Typography>
                    <Typography 
                      variant="h6" 
                      component="h2" 
                      sx={{ 
                        fontWeight: 'medium', 
                        mb: 1,
                        height: '48px',
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
                      color="text.secondary" 
                      sx={{
                        mb: 1,
                        height: '40px',
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
                      sx={{ fontWeight: 'bold', mt: 'auto' }}
                    >
                      €{product.price.toLocaleString()}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0, height: '60px' }}>
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
            ))}
          </Grid>
          
          {/* Pagination */}
          {!loading && pagination.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
              <Pagination 
                count={pagination.totalPages} 
                page={pagination.currentPage} 
                onChange={handlePageChange}
                color="primary"
                size={isSmall ? "small" : "medium"}
              />
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default Catalogue; 