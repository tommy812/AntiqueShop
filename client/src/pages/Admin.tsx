import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Tabs,
  Tab,
  Divider,
  IconButton,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  InputAdornment,
  alpha,
  Switch,
  CircularProgress,
  Snackbar,
  Alert,
  FormControlLabel,
  useTheme as useMuiTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge,
  Tooltip,
  Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Upload as UploadIcon,
  Palette as PaletteIcon,
  Dashboard as DashboardIcon,
  Category as CategoryIcon,
  Message as MessageIcon,
  ShoppingBag as ShoppingBagIcon,
  Assessment as AssessmentIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Settings as SettingsIcon,
  ExpandMore as ExpandMoreIcon,
  MarkEmailRead as MarkEmailReadIcon,
  Reply as ReplyIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import categoryService, { Category } from '../services/categoryService';
import periodService, { Period } from '../services/periodService';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import productService, { Product } from '../services/productService';
import messageService, { Message } from '../services/messageService';
import { useSettings } from '../contexts/SettingsContext';
import settingsService, { SiteSettings } from '../services/settingsService';
import BlobImageManager from '../components/admin/BlobImageManager';
import CategoryBlobImageManager from '../components/admin/CategoryBlobImageManager';
import { isVercelBlobUrl } from '../utils/imageUtils';

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
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// Stats for the dashboard
const dashboardStats = [
  { title: 'Total Products', value: 78, icon: <ShoppingBagIcon fontSize="large" /> },
  { title: 'Categories', value: 12, icon: <CategoryIcon fontSize="large" /> },
  { title: 'Periods', value: 8, icon: <AssessmentIcon fontSize="large" /> },
  { title: 'Messages', value: 24, icon: <MessageIcon fontSize="large" /> },
];

// Near the top of the Admin component where the state is defined
// Define the Product with blobImages property
interface AdminProduct {
  name: string;
  description: string;
  price: string;
  category: string;
  period: string;
  images: File[];
  blobImages: string[];
  condition: string;
  origin: string;
  provenance: string;
  measures: {
    height: string;
    width: string;
    depth: string;
    unit: string;
  };
  history: string;
  delivery: string;
  featured: boolean;
}

const Admin = () => {
  const muiTheme = useMuiTheme();
  const { colors, updateTheme } = useTheme();
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  // Update the newProduct state with the new type
  const [newProduct, setNewProduct] = useState<AdminProduct>({
    name: '',
    description: '',
    price: '',
    category: '',
    period: '',
    images: [],
    blobImages: [],
    condition: 'Good',
    origin: '',
    provenance: '',
    measures: {
      height: '',
      width: '',
      depth: '',
      unit: 'cm',
    },
    history: '',
    delivery: '',
    featured: false,
  });
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    image: '',
    blobImage: '',
  });
  const [newPeriod, setNewPeriod] = useState({
    name: '',
    description: '',
    yearStart: '',
    yearEnd: '',
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [messageReply, setMessageReply] = useState('');
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [estimates, setEstimates] = useState<any[]>([]); // Will define proper type when we create estimateService
  const [openDialog, setOpenDialog] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState(colors.primary);
  const [secondaryColor, setSecondaryColor] = useState(colors.secondary);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });
  const [editProduct, setEditProduct] = useState<null | {
    _id: string;
    name: string;
    description: string;
    price: string;
    category: string;
    period: string;
    condition: string;
    origin: string;
    provenance: string;
    measures: {
      height: string;
      width: string;
      depth: string;
      unit: string;
    };
    history: string;
    delivery: string;
    featured: boolean;
    blobImages: string[];
  }>(null);

  // New state for dashboard stats
  const [dashboardStats, setDashboardStats] = useState([
    { title: 'Total Products', value: 0, icon: <ShoppingBagIcon fontSize="large" /> },
    { title: 'Categories', value: 0, icon: <CategoryIcon fontSize="large" /> },
    { title: 'Periods', value: 0, icon: <AssessmentIcon fontSize="large" /> },
    { title: 'Messages', value: 0, icon: <MessageIcon fontSize="large" /> },
  ]);

  // State for recent activity
  const [recentActivity, setRecentActivity] = useState<
    Array<{
      type: string;
      title: string;
      description: string;
      date: Date;
    }>
  >([]);

  const { settings, updateSettings, resetSettings, refreshSettings } = useSettings();

  // Helper function to convert any footer object to the expected type
  const getFooterObject = (footerObj: any): { copyright: string; shortDescription: string } => {
    return {
      copyright: footerObj?.copyright || '',
      shortDescription: footerObj?.shortDescription || '',
    };
  };

  // Settings form state
  const [siteSettings, setSiteSettings] = useState<{
    title: string;
    address: {
      street: string;
      city: string;
      postalCode: string;
      country: string;
    };
    contact: {
      phone: string;
      email: string;
    };
    hours: Array<{
      days: string;
      hours: string;
    }>;
    social: {
      instagram: string;
      facebook: string;
      twitter: string;
    };
    footer: {
      copyright: string;
      shortDescription: string;
    };
  }>({
    title: '',
    address: {
      street: '',
      city: '',
      postalCode: '',
      country: '',
    },
    contact: {
      phone: '',
      email: '',
    },
    hours: [
      { days: '', hours: '' },
      { days: '', hours: '' },
      { days: '', hours: '' },
    ],
    social: {
      instagram: '',
      facebook: '',
      twitter: '',
    },
    footer: {
      copyright: '',
      shortDescription: '',
    },
  });

  // Initialize settings form when settings are loaded
  useEffect(() => {
    if (settings) {
      // Use any type to bypass TypeScript checking
      const settingsValue: any = {
        title: settings.title || '',
        address: {
          street: settings.address?.street || '',
          city: settings.address?.city || '',
          postalCode: settings.address?.postalCode || '',
          country: settings.address?.country || '',
        },
        contact: {
          phone: settings.contact?.phone || '',
          email: settings.contact?.email || '',
        },
        hours: settings.hours?.length
          ? [...settings.hours]
          : [
              { days: '', hours: '' },
              { days: '', hours: '' },
              { days: '', hours: '' },
            ],
        social: {
          instagram: settings.social?.instagram || '',
          facebook: settings.social?.facebook || '',
          twitter: settings.social?.twitter || '',
        },
        footer: {
          copyright: settings.footer?.copyright || '',
          shortDescription: settings.footer?.shortDescription || '',
        },
      };

      setSiteSettings(settingsValue);
    }
  }, [settings]);

  // Handle settings input changes
  const handleSettingsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    section?: string,
    field?: string
  ) => {
    const { name, value } = e.target;

    if (section && field) {
      // For nested fields like address.street
      setSiteSettings(prev => {
        if (
          !prev[section as keyof typeof prev] ||
          typeof prev[section as keyof typeof prev] !== 'object'
        ) {
          return prev; // Return unchanged if section doesn't exist or isn't an object
        }

        return {
          ...prev,
          [section]: {
            ...(prev[section as keyof typeof prev] as Record<string, unknown>),
            [field]: value,
          },
        };
      });
    } else {
      // For top-level fields like title
      setSiteSettings(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle changes to hours (array of objects)
  const handleHoursChange = (index: number, field: 'days' | 'hours', value: string) => {
    setSiteSettings(prev => {
      const newHours = [...prev.hours];
      newHours[index] = { ...newHours[index], [field]: value };
      return { ...prev, hours: newHours };
    });
  };

  // Save settings
  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      await updateSettings(siteSettings);
      setSnackbar({
        open: true,
        message: 'Settings updated successfully',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update settings',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // Reset settings to default
  const handleResetSettings = async () => {
    try {
      setLoading(true);
      await resetSettings();
      await refreshSettings();
      setSnackbar({
        open: true,
        message: 'Settings reset to default values',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error resetting settings:', error);
      setSnackbar({
        open: true,
        message: 'Failed to reset settings',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await categoryService.getAllCategories();
        setCategories(data);
        // Update dashboard stats
        setDashboardStats(prev => {
          const newStats = [...prev];
          newStats[1].value = data.length; // Categories count
          return newStats;
        });
      } catch (error) {
        console.error('Error fetching categories:', error);
        setSnackbar({
          open: true,
          message: 'Failed to fetch categories',
          severity: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    const fetchPeriods = async () => {
      try {
        setLoading(true);
        const data = await periodService.getAllPeriods();
        setPeriods(data);
        // Update dashboard stats
        setDashboardStats(prev => {
          const newStats = [...prev];
          newStats[2].value = data.length; // Periods count
          return newStats;
        });
      } catch (error) {
        console.error('Error fetching periods:', error);
        setSnackbar({
          open: true,
          message: 'Failed to fetch periods',
          severity: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productService.getProducts();
        setProducts(data.products);
        // Update dashboard stats
        setDashboardStats(prev => {
          const newStats = [...prev];
          newStats[0].value = data.products.length; // Products count
          return newStats;
        });
      } catch (error) {
        console.error('Error fetching products:', error);
        setSnackbar({
          open: true,
          message: 'Failed to fetch products',
          severity: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    const fetchMessages = async () => {
      try {
        setLoading(true);
        const data = await messageService.getAllMessages();
        setMessages(data.messages || []); // Extract messages array from response
        // Update dashboard stats
        setDashboardStats(prev => {
          const newStats = [...prev];
          newStats[3].value = data.messages?.length || 0; // Messages count
          return newStats;
        });
      } catch (error) {
        console.error('Error fetching messages:', error);
        setSnackbar({
          open: true,
          message: 'Failed to fetch messages',
          severity: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
    fetchPeriods();
    fetchProducts();
    fetchMessages();

    // Fetch settings from context
    refreshSettings();
    setSiteSettings({
      title: settings.title || '',
      address: {
        street: settings.address?.street || '',
        city: settings.address?.city || '',
        postalCode: settings.address?.postalCode || '',
        country: settings.address?.country || '',
      },
      contact: {
        phone: settings.contact?.phone || '',
        email: settings.contact?.email || '',
      },
      hours: settings.hours || [
        { days: '', hours: '' },
        { days: '', hours: '' },
        { days: '', hours: '' },
      ],
      social: {
        facebook: settings.social?.facebook || '',
        instagram: settings.social?.instagram || '',
        twitter: settings.social?.twitter || '',
      },
      footer: settings.footer || {
        copyright: '',
        shortDescription: '',
      },
    });
  }, []);

  // Update recent activity when data changes
  useEffect(() => {
    const activity = [];

    // Add recent products (up to 3)
    const sortedProducts = [...products].sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );

    for (let i = 0; i < Math.min(sortedProducts.length, 3); i++) {
      const product = sortedProducts[i];
      activity.push({
        type: 'product',
        title: `New product added: ${product.name}`,
        description: `Added on ${new Date(product.createdAt || Date.now()).toLocaleDateString()}`,
        date: new Date(product.createdAt || Date.now()),
      });
    }

    // Add recent categories (up to 2)
    const sortedCategories = [...categories].sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );

    for (let i = 0; i < Math.min(sortedCategories.length, 2); i++) {
      const category = sortedCategories[i];
      activity.push({
        type: 'category',
        title: `New category added: ${category.name}`,
        description: `Added on ${new Date(category.createdAt || Date.now()).toLocaleDateString()}`,
        date: new Date(category.createdAt || Date.now()),
      });
    }

    // Add recent periods (up to 2)
    const sortedPeriods = [...periods].sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );

    for (let i = 0; i < Math.min(sortedPeriods.length, 2); i++) {
      const period = sortedPeriods[i];
      activity.push({
        type: 'period',
        title: `New period added: ${period.name}`,
        description: `Added on ${new Date(period.createdAt || Date.now()).toLocaleDateString()}`,
        date: new Date(period.createdAt || Date.now()),
      });
    }

    // Sort all activity by date
    activity.sort((a, b) => b.date.getTime() - a.date.getTime());

    // Take only the 5 most recent activities
    setRecentActivity(activity.slice(0, 5));
  }, [products, categories, periods]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleProductChange = (
    e: React.ChangeEvent<HTMLInputElement> | { target: { name?: string; value: unknown } }
  ) => {
    const { name, value } = e.target;

    if (!name) return;

    // Handle nested measures object
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      if (parent === 'measures') {
        setNewProduct(prev => ({
          ...prev,
          measures: {
            ...prev.measures,
            [child]: value,
          },
        }));
      }
    } else {
      setNewProduct(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewProduct({
        ...newProduct,
        images: [...Array.from(e.target.files)],
      });
    }
  };

  const handleBlobImagesChange = (images: string[]) => {
    setNewProduct(prev => ({
      ...prev,
      blobImages: images, // Store blob URLs separately
    }));
  };

  const handleEditBlobImagesChange = (images: string[]) => {
    if (editProduct) {
      setEditProduct(prev => ({
        ...prev!,
        blobImages: images, // Store blob URLs separately for edit form
      }));
    }
  };

  const handleAddProduct = async () => {
    try {
      setLoading(true);

      // Debug the values being sent
      console.log('Sending product data:', {
        name: newProduct.name,
        description: newProduct.description,
        price: newProduct.price,
        category: newProduct.category,
        period: newProduct.period,
      });

      // Make sure we have required fields
      if (
        !newProduct.name ||
        !newProduct.description ||
        !newProduct.price ||
        !newProduct.category ||
        !newProduct.period
      ) {
        setSnackbar({
          open: true,
          message:
            'Please fill in all required fields: name, description, price, category, and period',
          severity: 'error',
        });
        setLoading(false);
        return;
      }

      // Create FormData object for file uploads
      const formData = new FormData();

      formData.append('name', newProduct.name);
      formData.append('description', newProduct.description);
      formData.append('price', newProduct.price);

      // Log the category ID for debugging
      console.log('Category ID being sent:', newProduct.category);
      console.log('Available categories:', categories);

      formData.append('category', newProduct.category);
      formData.append('period', newProduct.period);
      formData.append('condition', newProduct.condition);
      formData.append('origin', newProduct.origin || '');
      formData.append('provenance', newProduct.provenance || '');
      formData.append('measures.height', newProduct.measures.height || '0');
      formData.append('measures.width', newProduct.measures.width || '0');
      formData.append('measures.depth', newProduct.measures.depth || '0');
      formData.append('measures.unit', newProduct.measures.unit);
      formData.append('history', newProduct.history || '');
      formData.append('delivery', newProduct.delivery || '');
      formData.append('featured', String(newProduct.featured));

      // If we have Blob image URLs, include them directly
      if (newProduct.blobImages && newProduct.blobImages.length > 0) {
        newProduct.blobImages.forEach((imageUrl, index) => {
          formData.append(`blobImages[${index}]`, imageUrl);
        });
      }

      // Append file images (if any)
      if (newProduct.images && newProduct.images.length > 0) {
        newProduct.images.forEach((image, index) => {
          formData.append('images', image);
        });
      }

      // Log the FormData contents for debugging
      // Using Array.from to convert the iterator to an array for TypeScript compatibility
      Array.from(formData.entries()).forEach(pair => {
        console.log(pair[0] + ': ' + pair[1]);
      });

      const result = await productService.createProduct(formData);
      setProducts([...products, result]);

      // Reset form
      setNewProduct({
        name: '',
        description: '',
        price: '',
        category: '',
        period: '',
        images: [],
        blobImages: [],
        condition: 'Good',
        origin: '',
        provenance: '',
        measures: {
          height: '',
          width: '',
          depth: '',
          unit: 'cm',
        },
        history: '',
        delivery: '',
        featured: false,
      });

      // Close the dialog
      setOpenDialog(null);

      setSnackbar({
        open: true,
        message: 'Product added successfully',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error adding product:', error);
      // Log more detailed error information
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);

        // Show more specific error message
        setSnackbar({
          open: true,
          message: `Failed to add product: ${error.response.data.message || error.message}`,
          severity: 'error',
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Failed to add product',
          severity: 'error',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (newCategory.name) {
      try {
        setLoading(true);
        const newCategoryData = {
          name: newCategory.name,
          description: newCategory.description,
          featured: false,
          image: newCategory.blobImage || newCategory.image, // Use blob image if available
        };

        const result = await categoryService.createCategory(newCategoryData);
        setCategories([...categories, result]);
        setNewCategory({
          name: '',
          description: '',
          image: '',
          blobImage: '',
        });
        setOpenDialog(null);
        setSnackbar({
          open: true,
          message: 'Category added successfully',
          severity: 'success',
        });
      } catch (error) {
        console.error('Error adding category:', error);
        setSnackbar({
          open: true,
          message: 'Failed to add category',
          severity: 'error',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCategory(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryBlobImageChange = (image: string) => {
    setNewCategory(prev => ({
      ...prev,
      blobImage: image, // Store blob URL
      image: '', // Clear old URL-based image if any
    }));
  };

  const handlePeriodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPeriod(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddPeriod = async () => {
    if (newPeriod.name) {
      try {
        setLoading(true);
        const periodData = {
          name: newPeriod.name,
          description: newPeriod.description,
          yearStart: newPeriod.yearStart ? parseInt(newPeriod.yearStart) : undefined,
          yearEnd: newPeriod.yearEnd ? parseInt(newPeriod.yearEnd) : undefined,
          featured: false,
        };

        const result = await periodService.createPeriod(periodData);
        setPeriods([...periods, result]);
        setNewPeriod({
          name: '',
          description: '',
          yearStart: '',
          yearEnd: '',
        });
        setOpenDialog(null);
        setSnackbar({
          open: true,
          message: 'Period added successfully',
          severity: 'success',
        });
      } catch (error) {
        console.error('Error adding period:', error);
        setSnackbar({
          open: true,
          message: 'Failed to add period',
          severity: 'error',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      setLoading(true);
      await categoryService.deleteCategory(id);
      setCategories(categories.filter(c => c._id !== id));
      setSnackbar({
        open: true,
        message: 'Category deleted successfully',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete category',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePeriod = async (id: string) => {
    try {
      setLoading(true);
      await periodService.deletePeriod(id);
      setPeriods(periods.filter(p => p._id !== id));
      setSnackbar({
        open: true,
        message: 'Period deleted successfully',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error deleting period:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete period',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      setLoading(true);
      await productService.deleteProduct(id);
      setProducts(products.filter(p => p._id !== id));
      setSnackbar({
        open: true,
        message: 'Product deleted successfully',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete product',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleColorChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    type: 'primary' | 'secondary'
  ) => {
    const color = e.target.value;
    if (type === 'primary') {
      setPrimaryColor(color);
    } else {
      setSecondaryColor(color);
    }
  };

  const handleApplyTheme = () => {
    updateTheme(primaryColor, secondaryColor);
    setSnackbar({
      open: true,
      message: 'Theme updated successfully',
      severity: 'success',
    });
  };

  const handleToggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      setLoading(true);
      await categoryService.toggleFeatured(id);

      // Update the local state
      setCategories(
        categories.map(category =>
          category._id === id ? { ...category, featured: !currentStatus } : category
        )
      );

      setSnackbar({
        open: true,
        message: `Category ${!currentStatus ? 'marked as featured' : 'removed from featured'}`,
        severity: 'success',
      });
    } catch (error) {
      console.error('Error toggling featured status:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update featured status',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFeaturedPeriod = async (id: string, currentStatus: boolean) => {
    try {
      setLoading(true);
      await periodService.toggleFeatured(id);

      // Update the local state
      setPeriods(
        periods.map(period =>
          period._id === id ? { ...period, featured: !currentStatus } : period
        )
      );

      setSnackbar({
        open: true,
        message: `Period ${!currentStatus ? 'marked as featured' : 'removed from featured'}`,
        severity: 'success',
      });
    } catch (error) {
      console.error('Error toggling featured status:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update featured status',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Helper function to get category name from ID
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c._id === categoryId);
    return category ? category.name : categoryId;
  };

  const handleOpenEditDialog = (product: Product) => {
    // Debug the product object
    console.log('Opening edit dialog for product:', product);
    console.log('Product images:', product.images);

    // Determine category ID
    let categoryId = '';
    if (typeof product.category === 'object' && product.category && '_id' in product.category) {
      categoryId = product.category._id as string;
    } else if (typeof product.category === 'string') {
      categoryId = product.category;
    }

    // Determine period ID
    let periodId = '';
    if (typeof product.period === 'object' && product.period && '_id' in product.period) {
      periodId = product.period._id as string;
    } else if (typeof product.period === 'string') {
      periodId = product.period;
    }

    // Get product images (all images are considered "blob images" in the edit form)
    const productImages = product.images || [];

    setEditProduct({
      _id: product._id!,
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: categoryId,
      period: periodId,
      condition: product.condition || 'Good',
      origin: product.origin || '',
      provenance: product.provenance || '',
      measures: {
        height: product.measures?.height?.toString() || '',
        width: product.measures?.width?.toString() || '',
        depth: product.measures?.depth?.toString() || '',
        unit: product.measures?.unit || 'cm',
      },
      history: product.history || '',
      delivery: product.delivery || '',
      featured: product.featured || false,
      blobImages: productImages,
    });
    setOpenDialog('edit-product');
  };

  const handleEditProductChange = (
    e: React.ChangeEvent<HTMLInputElement> | { target: { name?: string; value: unknown } }
  ) => {
    if (!editProduct) return;

    const { name, value } = e.target;

    if (!name) return;

    // Handle nested measures object
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      if (parent === 'measures') {
        setEditProduct({
          ...editProduct,
          measures: {
            ...editProduct.measures,
            [child]: value,
          },
        });
      }
    } else {
      setEditProduct({
        ...editProduct,
        [name]: value,
      });
    }
  };

  const handleSaveProduct = async () => {
    if (!editProduct) return;

    // Check required fields
    if (
      !editProduct.name ||
      !editProduct.description ||
      !editProduct.price ||
      !editProduct.category ||
      !editProduct.period
    ) {
      setSnackbar({
        open: true,
        message:
          'Please fill in all required fields: name, description, price, category, and period',
        severity: 'error',
      });
      return;
    }

    try {
      setLoading(true);

      // Create FormData object for file uploads
      const formData = new FormData();
      formData.append('name', editProduct.name);
      formData.append('description', editProduct.description);
      formData.append('price', editProduct.price);
      formData.append('category', editProduct.category);
      formData.append('period', editProduct.period);
      formData.append('condition', editProduct.condition);
      formData.append('origin', editProduct.origin);
      formData.append('provenance', editProduct.provenance);
      formData.append('measures.height', editProduct.measures.height);
      formData.append('measures.width', editProduct.measures.width);
      formData.append('measures.depth', editProduct.measures.depth);
      formData.append('measures.unit', editProduct.measures.unit);
      formData.append('history', editProduct.history);
      formData.append('delivery', editProduct.delivery);
      formData.append('featured', String(editProduct.featured));

      // If we have Blob image URLs, include them directly
      console.log('Blob images to save:', editProduct.blobImages);
      if (editProduct.blobImages && editProduct.blobImages.length > 0) {
        editProduct.blobImages.forEach((imageUrl, index) => {
          console.log(`Adding blobImages[${index}]:`, imageUrl);
          formData.append(`blobImages[${index}]`, imageUrl);
        });
      }

      // Log the FormData contents for debugging
      console.log('Form data to be sent:');
      Array.from(formData.entries()).forEach(pair => {
        console.log(pair[0] + ': ' + pair[1]);
      });

      const result = await productService.updateProduct(editProduct._id, formData);

      // Update products list with edited product
      setProducts(products.map(p => (p._id === editProduct._id ? result : p)));

      setOpenDialog(null);
      setEditProduct(null);

      setSnackbar({
        open: true,
        message: 'Product updated successfully',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error updating product:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update product',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // New state for editing categories and periods
  const [editCategory, setEditCategory] = useState<null | {
    _id: string;
    name: string;
    description: string;
    image: string;
    blobImage: string;
    featured: boolean;
  }>(null);

  const [editPeriod, setEditPeriod] = useState<null | {
    _id: string;
    name: string;
    description: string;
    yearStart: string;
    yearEnd: string;
  }>(null);

  // Handle opening edit category dialog
  const handleOpenEditCategoryDialog = (category: Category) => {
    setEditCategory({
      _id: category._id || '',
      name: category.name,
      description: category.description || '',
      image: category.image || '',
      blobImage: isVercelBlobUrl(category.image || '') ? category.image || '' : '',
      featured: category.featured || false,
    });
    setOpenDialog('edit-category');
  };

  // Handle edit category changes
  const handleEditCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editCategory) return;

    const { name, value } = e.target;
    setEditCategory({
      ...editCategory,
      [name]: value,
    });
  };

  // Save edited category
  const handleSaveCategory = async () => {
    if (!editCategory || !editCategory.name) return;

    try {
      setLoading(true);
      const updatedCategoryData = {
        name: editCategory.name,
        description: editCategory.description,
        featured: editCategory.featured,
        image: editCategory.blobImage || editCategory.image, // Use blob image if available
      };

      const result = await categoryService.updateCategory(editCategory._id!, updatedCategoryData);

      // Update categories state
      setCategories(
        categories.map(category => (category._id === editCategory._id ? result : category))
      );

      setOpenDialog(null);
      setSnackbar({
        open: true,
        message: 'Category updated successfully',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error updating category:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update category',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle opening edit period dialog
  const handleOpenEditPeriodDialog = (period: Period) => {
    setEditPeriod({
      _id: period._id!,
      name: period.name,
      description: period.description || '',
      yearStart: period.yearStart ? period.yearStart.toString() : '',
      yearEnd: period.yearEnd ? period.yearEnd.toString() : '',
    });
    setOpenDialog('edit-period');
  };

  // Handle edit period changes
  const handleEditPeriodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editPeriod) return;

    const { name, value } = e.target;
    setEditPeriod({
      ...editPeriod,
      [name]: value,
    });
  };

  // Save edited period
  const handleSavePeriod = async () => {
    if (!editPeriod) return;

    try {
      setLoading(true);
      const updatedPeriod = await periodService.updatePeriod(editPeriod._id, {
        name: editPeriod.name,
        description: editPeriod.description,
        yearStart: editPeriod.yearStart ? parseInt(editPeriod.yearStart) : undefined,
        yearEnd: editPeriod.yearEnd ? parseInt(editPeriod.yearEnd) : undefined,
      });

      // Update periods list with edited period
      setPeriods(periods.map(p => (p._id === editPeriod._id ? updatedPeriod : p)));

      setOpenDialog(null);
      setEditPeriod(null);

      setSnackbar({
        open: true,
        message: 'Period updated successfully',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error updating period:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update period',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategoryBlobImageChange = (image: string) => {
    if (editCategory) {
      setEditCategory(prev => ({
        ...prev!,
        blobImage: image,
        image: '',
      }));
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      <Paper sx={{ width: '100%', mt: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<DashboardIcon />} label="Dashboard" />
          <Tab icon={<ShoppingBagIcon />} label="Products" />
          <Tab icon={<CategoryIcon />} label="Categories" />
          <Tab icon={<AssessmentIcon />} label="Periods" />
          <Tab icon={<MessageIcon />} label="Messages" />
          <Tab icon={<PaletteIcon />} label="Theme" />
          <Tab icon={<SettingsIcon />} label="Settings" />
        </Tabs>

        {/* Dashboard Tab Panel */}
        <TabPanel value={tabValue} index={0}>
          <Box>
            <Typography variant="h5" gutterBottom>
              Dashboard Overview
            </Typography>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {dashboardStats.map((stat, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Paper
                    sx={{
                      p: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      height: '100%',
                      borderRadius: 2,
                      boxShadow: 2,
                    }}
                  >
                    <Box sx={{ color: 'primary.main', mb: 1 }}>{stat.icon}</Box>
                    <Typography variant="h4" component="div">
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            {/* Recent Activity */}
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              {recentActivity.length > 0 ? (
                <List>
                  {recentActivity.map((activity, index) => (
                    <ListItem key={index} divider={index < recentActivity.length - 1}>
                      <ListItemText primary={activity.title} secondary={activity.description} />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography color="text.secondary">No recent activity found.</Typography>
              )}
            </Paper>
          </Box>
        </TabPanel>

        {/* Products Tab Panel */}
        <TabPanel value={tabValue} index={1}>
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h5">Products Management</Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => setOpenDialog('new-product')}
              >
                Add Product
              </Button>
            </Box>

            <Grid container spacing={3}>
              {products.map(product => (
                <Grid item xs={12} sm={6} md={4} key={product._id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Price: €{product.price}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {product.description.substring(0, 100)}...
                      </Typography>

                      {product.featured && (
                        <Chip label="Featured" color="primary" size="small" sx={{ mt: 1 }} />
                      )}
                    </CardContent>
                    <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
                      <Button
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleOpenEditDialog(product)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteProduct(product._id!)}
                      >
                        Delete
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {products.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  No products found. Add your first product to get started.
                </Typography>
              </Box>
            )}
          </Box>
        </TabPanel>

        {/* Categories Tab Panel */}
        <TabPanel value={tabValue} index={2}>
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h5">Categories Management</Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => setOpenDialog('new-category')}
              >
                Add Category
              </Button>
            </Box>

            <List>
              {categories.map(category => (
                <Paper key={category._id} sx={{ mb: 2, p: 0, borderRadius: 1 }}>
                  <ListItem
                    secondaryAction={
                      <Box>
                        <IconButton
                          edge="end"
                          aria-label="edit"
                          onClick={() => handleOpenEditCategoryDialog(category)}
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="toggle featured"
                          onClick={() => handleToggleFeatured(category._id!, category.featured)}
                          sx={{ mr: 1 }}
                        >
                          {category.featured ? <StarIcon color="primary" /> : <StarBorderIcon />}
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleDeleteCategory(category._id!)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemText primary={category.name} secondary={category.description} />
                  </ListItem>
                </Paper>
              ))}
            </List>

            {categories.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  No categories found. Add your first category to get started.
                </Typography>
              </Box>
            )}
          </Box>
        </TabPanel>

        {/* Periods Tab Panel */}
        <TabPanel value={tabValue} index={3}>
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h5">Periods Management</Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => setOpenDialog('new-period')}
              >
                Add Period
              </Button>
            </Box>

            <List>
              {periods.map(period => (
                <Paper key={period._id} sx={{ mb: 2, p: 0, borderRadius: 1 }}>
                  <ListItem
                    secondaryAction={
                      <Box>
                        <IconButton
                          edge="end"
                          aria-label="edit"
                          onClick={() => handleOpenEditPeriodDialog(period)}
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="toggle featured"
                          onClick={() => handleToggleFeaturedPeriod(period._id!, period.featured)}
                          sx={{ mr: 1 }}
                        >
                          {period.featured ? <StarIcon color="primary" /> : <StarBorderIcon />}
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleDeletePeriod(period._id!)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemText
                      primary={period.name}
                      secondary={`${period.yearStart || '?'} - ${period.yearEnd || '?'}: ${period.description || 'No description'}`}
                    />
                  </ListItem>
                </Paper>
              ))}
            </List>

            {periods.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  No periods found. Add your first period to get started.
                </Typography>
              </Box>
            )}
          </Box>
        </TabPanel>

        {/* Messages Tab Panel */}
        <TabPanel value={tabValue} index={4}>
          <Box>
            <Typography variant="h5" gutterBottom>
              Messages & Inquiries
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2, height: '70vh', overflow: 'auto' }}>
                  <Typography variant="h6" gutterBottom>
                    All Messages
                  </Typography>

                  <List>
                    {messages.length > 0 ? (
                      messages.map(message => (
                        <ListItem
                          key={message._id}
                          onClick={() => setSelectedMessage(message)}
                          className={selectedMessage?._id === message._id ? 'Mui-selected' : ''}
                          sx={{
                            mb: 1,
                            borderRadius: 1,
                            bgcolor: message.isRead
                              ? 'transparent'
                              : alpha(muiTheme.palette.primary.main, 0.1),
                            '&.Mui-selected': {
                              bgcolor: alpha(muiTheme.palette.primary.main, 0.2),
                            },
                            cursor: 'pointer',
                          }}
                        >
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography
                                  variant="body1"
                                  component="span"
                                  sx={{
                                    fontWeight: message.isRead ? 'normal' : 'bold',
                                    mr: 1,
                                  }}
                                >
                                  {message.name}
                                </Typography>
                                {!message.isRead && (
                                  <Chip size="small" color="primary" label="New" />
                                )}
                              </Box>
                            }
                            secondary={
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {message.subject}
                              </Typography>
                            }
                          />
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ ml: 2, minWidth: '80px', textAlign: 'right' }}
                          >
                            {message.createdAt
                              ? new Date(message.createdAt).toLocaleDateString()
                              : ''}
                          </Typography>
                        </ListItem>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                        No messages found.
                      </Typography>
                    )}
                  </List>
                </Paper>
              </Grid>

              <Grid item xs={12} md={8}>
                {selectedMessage ? (
                  <Paper sx={{ p: 3, height: '70vh', display: 'flex', flexDirection: 'column' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2,
                      }}
                    >
                      <Typography variant="h6">{selectedMessage.subject}</Typography>
                      <Box>
                        <Tooltip title="Mark as read">
                          <IconButton
                            color="primary"
                            onClick={() => {
                              if (selectedMessage._id) {
                                messageService
                                  .toggleReadStatus(selectedMessage._id)
                                  .then(() => {
                                    // Update the message in the messages array
                                    setMessages(prevMessages =>
                                      prevMessages.map(msg =>
                                        msg._id === selectedMessage._id
                                          ? { ...msg, isRead: true }
                                          : msg
                                      )
                                    );
                                    setSelectedMessage(prev =>
                                      prev ? { ...prev, isRead: true } : prev
                                    );
                                  })
                                  .catch(err => {
                                    console.error('Error marking message as read:', err);
                                    setSnackbar({
                                      open: true,
                                      message: 'Failed to mark message as read',
                                      severity: 'error',
                                    });
                                  });
                              }
                            }}
                          >
                            <MarkEmailReadIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Reply">
                          <IconButton color="primary" onClick={() => setReplyDialogOpen(true)}>
                            <ReplyIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            color="error"
                            onClick={() => {
                              if (selectedMessage._id) {
                                messageService
                                  .deleteMessage(selectedMessage._id)
                                  .then(() => {
                                    setMessages(prevMessages =>
                                      prevMessages.filter(msg => msg._id !== selectedMessage._id)
                                    );
                                    setSelectedMessage(null);
                                    setSnackbar({
                                      open: true,
                                      message: 'Message deleted successfully',
                                      severity: 'success',
                                    });
                                  })
                                  .catch(err => {
                                    console.error('Error deleting message:', err);
                                    setSnackbar({
                                      open: true,
                                      message: 'Failed to delete message',
                                      severity: 'error',
                                    });
                                  });
                              }
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        From: {selectedMessage.name} ({selectedMessage.email})
                        {selectedMessage.phone && ` • ${selectedMessage.phone}`}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Received:{' '}
                        {selectedMessage.createdAt
                          ? new Date(selectedMessage.createdAt).toLocaleString()
                          : ''}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        flex: 1,
                        overflow: 'auto',
                        bgcolor: alpha(muiTheme.palette.background.paper, 0.5),
                        p: 2,
                        borderRadius: 1,
                        mb: 2,
                      }}
                    >
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                        {selectedMessage.message}
                      </Typography>
                    </Box>

                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<ReplyIcon />}
                      onClick={() => setReplyDialogOpen(true)}
                    >
                      Reply to Message
                    </Button>
                  </Paper>
                ) : (
                  <Paper
                    sx={{
                      p: 3,
                      height: '70vh',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Box sx={{ textAlign: 'center' }}>
                      <EmailIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary">
                        Select a message to view
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        No message selected
                      </Typography>
                    </Box>
                  </Paper>
                )}
              </Grid>
            </Grid>

            {/* Reply Dialog */}
            <Dialog
              open={replyDialogOpen}
              onClose={() => setReplyDialogOpen(false)}
              maxWidth="md"
              fullWidth
            >
              <DialogTitle>Reply to {selectedMessage?.name}</DialogTitle>
              <DialogContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Replying to message: {selectedMessage?.subject}
                </Typography>
                <TextField
                  fullWidth
                  label="Your Reply"
                  multiline
                  rows={8}
                  value={messageReply}
                  onChange={e => setMessageReply(e.target.value)}
                  margin="normal"
                  placeholder="Type your reply here..."
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setReplyDialogOpen(false)}>Cancel</Button>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={!messageReply.trim() || loading}
                  onClick={() => {
                    if (selectedMessage && selectedMessage._id) {
                      setLoading(true);

                      messageService
                        .replyToMessage(selectedMessage._id, messageReply)
                        .then(() => {
                          // Update message status in the list
                          setMessages(prevMessages =>
                            prevMessages.map(msg =>
                              msg._id === selectedMessage._id
                                ? { ...msg, isRead: true, status: 'replied' }
                                : msg
                            )
                          );

                          // Update selected message
                          setSelectedMessage(prev =>
                            prev ? { ...prev, isRead: true, status: 'replied' } : prev
                          );

                          setLoading(false);
                          setReplyDialogOpen(false);
                          setMessageReply('');
                          setSnackbar({
                            open: true,
                            message: 'Reply sent successfully',
                            severity: 'success',
                          });
                        })
                        .catch(err => {
                          console.error('Error sending reply:', err);
                          setLoading(false);
                          setSnackbar({
                            open: true,
                            message: 'Failed to send reply',
                            severity: 'error',
                          });
                        });
                    }
                  }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Send Reply'}
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </TabPanel>

        {/* Theme Tab Panel */}
        <TabPanel value={tabValue} index={5}>
          <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            <Typography variant="h5" gutterBottom>
              Theme Customization
            </Typography>
            <Typography variant="body2" sx={{ mb: 3 }}>
              Customize the colors and appearance of your website.
            </Typography>

            <Grid container spacing={4}>
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" gutterBottom>
                    Primary Color
                  </Typography>
                  <Box
                    sx={{
                      width: '100%',
                      height: 100,
                      bgcolor: primaryColor,
                      borderRadius: 1,
                      mb: 2,
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Primary Color"
                    type="color"
                    value={primaryColor}
                    onChange={e => handleColorChange(e, 'primary')}
                    sx={{ mt: 2 }}
                  />
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" gutterBottom>
                    Secondary Color
                  </Typography>
                  <Box
                    sx={{
                      width: '100%',
                      height: 100,
                      bgcolor: secondaryColor,
                      borderRadius: 1,
                      mb: 2,
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Secondary Color"
                    type="color"
                    value={secondaryColor}
                    onChange={e => handleColorChange(e, 'secondary')}
                    sx={{ mt: 2 }}
                  />
                </Paper>
              </Grid>
            </Grid>

            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleApplyTheme}
                disabled={loading}
              >
                Apply Theme
              </Button>
            </Box>
          </Box>
        </TabPanel>

        {/* Settings Tab Panel */}
        <TabPanel value={tabValue} index={6}>
          <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            <Typography variant="h5" gutterBottom>
              Site Settings
            </Typography>
            <Typography variant="body2" sx={{ mb: 3 }}>
              Configure global site settings including title, contact information, and opening
              hours.
            </Typography>

            <Box component="form" noValidate autoComplete="off">
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">General Information</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TextField
                    label="Site Title"
                    name="title"
                    value={siteSettings.title}
                    onChange={e => handleSettingsChange(e)}
                    fullWidth
                    margin="normal"
                    helperText="The name of your site that appears in the header and footer"
                  />

                  <TextField
                    label="Footer Short Description"
                    name="shortDescription"
                    value={siteSettings.footer.shortDescription}
                    onChange={e => handleSettingsChange(e, 'footer', 'shortDescription')}
                    fullWidth
                    margin="normal"
                    multiline
                    rows={3}
                    helperText="Brief description that appears in the footer"
                  />

                  <TextField
                    label="Copyright Text"
                    name="copyright"
                    value={siteSettings.footer.copyright}
                    onChange={e => handleSettingsChange(e, 'footer', 'copyright')}
                    fullWidth
                    margin="normal"
                    helperText="Copyright text that appears at the bottom of the page"
                  />
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">Address & Contact</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        label="Street Address"
                        name="street"
                        value={siteSettings.address.street}
                        onChange={e => handleSettingsChange(e, 'address', 'street')}
                        fullWidth
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="City"
                        name="city"
                        value={siteSettings.address.city}
                        onChange={e => handleSettingsChange(e, 'address', 'city')}
                        fullWidth
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Postal Code"
                        name="postalCode"
                        value={siteSettings.address.postalCode}
                        onChange={e => handleSettingsChange(e, 'address', 'postalCode')}
                        fullWidth
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Country"
                        name="country"
                        value={siteSettings.address.country}
                        onChange={e => handleSettingsChange(e, 'address', 'country')}
                        fullWidth
                        margin="normal"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Phone Number"
                        name="phone"
                        value={siteSettings.contact.phone}
                        onChange={e => handleSettingsChange(e, 'contact', 'phone')}
                        fullWidth
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Email Address"
                        name="email"
                        value={siteSettings.contact.email}
                        onChange={e => handleSettingsChange(e, 'contact', 'email')}
                        fullWidth
                        margin="normal"
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">Opening Hours</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {siteSettings.hours.map((hour, index) => (
                    <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label={`Day(s) ${index + 1}`}
                          value={hour.days}
                          onChange={e => handleHoursChange(index, 'days', e.target.value)}
                          fullWidth
                          placeholder="e.g., Monday - Friday"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label={`Hours ${index + 1}`}
                          value={hour.hours}
                          onChange={e => handleHoursChange(index, 'hours', e.target.value)}
                          fullWidth
                          placeholder="e.g., 9:00 - 17:00"
                        />
                      </Grid>
                    </Grid>
                  ))}
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">Social Media</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TextField
                    label="Instagram URL"
                    name="instagram"
                    value={siteSettings.social.instagram}
                    onChange={e => handleSettingsChange(e, 'social', 'instagram')}
                    fullWidth
                    margin="normal"
                    placeholder="https://instagram.com/youraccount"
                  />

                  <TextField
                    label="Facebook URL"
                    name="facebook"
                    value={siteSettings.social.facebook}
                    onChange={e => handleSettingsChange(e, 'social', 'facebook')}
                    fullWidth
                    margin="normal"
                    placeholder="https://facebook.com/yourpage"
                  />

                  <TextField
                    label="Twitter URL"
                    name="twitter"
                    value={siteSettings.social.twitter}
                    onChange={e => handleSettingsChange(e, 'social', 'twitter')}
                    fullWidth
                    margin="normal"
                    placeholder="https://twitter.com/youraccount"
                  />
                </AccordionDetails>
              </Accordion>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleResetSettings}
                  disabled={loading}
                >
                  Reset to Default
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSaveSettings}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={24} /> : null}
                >
                  Save Settings
                </Button>
              </Box>
            </Box>
          </Box>
        </TabPanel>
      </Paper>

      {/* Dialogs */}
      {/* Add Category Dialog */}
      <Dialog
        open={openDialog === 'new-category'}
        onClose={() => setOpenDialog(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Category</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Category Name"
            name="name"
            value={newCategory.name}
            onChange={handleCategoryChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={newCategory.description}
            onChange={handleCategoryChange}
            margin="normal"
            multiline
            rows={3}
          />
          <TextField
            fullWidth
            label="Image URL"
            name="image"
            value={newCategory.image}
            onChange={handleCategoryChange}
            margin="normal"
            helperText="Link to a representative image"
          />
          <CategoryBlobImageManager
            categoryId="general"
            existingImage={newCategory.blobImage}
            onImageChange={handleCategoryBlobImageChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(null)}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddCategory}
            disabled={!newCategory.name || loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Add Category'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Period Dialog */}
      <Dialog
        open={openDialog === 'new-period'}
        onClose={() => setOpenDialog(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Period</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Period Name"
            name="name"
            value={newPeriod.name}
            onChange={handlePeriodChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={newPeriod.description}
            onChange={handlePeriodChange}
            margin="normal"
            multiline
            rows={3}
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Start Year"
                name="yearStart"
                type="number"
                value={newPeriod.yearStart}
                onChange={handlePeriodChange}
                margin="normal"
                InputProps={{ inputProps: { min: -3000, max: 2100 } }}
                helperText="Use negative values for BC/BCE"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="End Year"
                name="yearEnd"
                type="number"
                value={newPeriod.yearEnd}
                onChange={handlePeriodChange}
                margin="normal"
                InputProps={{ inputProps: { min: -3000, max: 2100 } }}
                helperText="Use negative values for BC/BCE"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(null)}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddPeriod}
            disabled={!newPeriod.name || loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Add Period'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Product Dialog */}
      <Dialog
        open={openDialog === 'new-product'}
        onClose={() => setOpenDialog(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Product Name"
                name="name"
                value={newProduct.name}
                onChange={handleProductChange}
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price (€)"
                name="price"
                type="number"
                value={newProduct.price}
                onChange={handleProductChange}
                margin="normal"
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start">€</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={newProduct.description}
                onChange={handleProductChange}
                margin="normal"
                multiline
                rows={3}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal" sx={{ minWidth: 200 }} required>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={newProduct.category}
                  onChange={handleProductChange}
                  required
                >
                  <MenuItem value="">
                    <em>Select a category</em>
                  </MenuItem>
                  {categories.map(category => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal" sx={{ minWidth: 200 }} required>
                <InputLabel>Period</InputLabel>
                <Select
                  name="period"
                  value={newProduct.period}
                  onChange={handleProductChange}
                  required
                >
                  <MenuItem value="">
                    <em>Select a period</em>
                  </MenuItem>
                  {periods.map(period => (
                    <MenuItem key={period._id} value={period._id}>
                      {period.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              {/* Replace regular file upload with BlobImageManager */}
              <Typography variant="subtitle2" gutterBottom>
                Product Images
              </Typography>
              <BlobImageManager
                productId="general"
                existingImages={newProduct.blobImages}
                onImagesChange={handleBlobImagesChange}
                maxImages={15}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal" sx={{ minWidth: 200 }}>
                <InputLabel>Condition</InputLabel>
                <Select
                  name="condition"
                  value={newProduct.condition}
                  onChange={handleProductChange}
                >
                  <MenuItem value="Excellent">Excellent</MenuItem>
                  <MenuItem value="Very Good">Very Good</MenuItem>
                  <MenuItem value="Good">Good</MenuItem>
                  <MenuItem value="Fair">Fair</MenuItem>
                  <MenuItem value="Poor">Poor</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Origin"
                name="origin"
                value={newProduct.origin}
                onChange={handleProductChange}
                margin="normal"
                placeholder="e.g., France, 19th Century"
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                fullWidth
                label="Provenance"
                name="provenance"
                value={newProduct.provenance}
                onChange={handleProductChange}
                margin="normal"
                multiline
                rows={2}
                placeholder="History of ownership"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                Dimensions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    label="Height"
                    name="measures.height"
                    type="number"
                    value={newProduct.measures.height}
                    onChange={handleProductChange}
                    margin="normal"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">{newProduct.measures.unit}</InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    label="Width"
                    name="measures.width"
                    type="number"
                    value={newProduct.measures.width}
                    onChange={handleProductChange}
                    margin="normal"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">{newProduct.measures.unit}</InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    label="Depth"
                    name="measures.depth"
                    type="number"
                    value={newProduct.measures.depth}
                    onChange={handleProductChange}
                    margin="normal"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">{newProduct.measures.unit}</InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={3}>
                  <FormControl fullWidth margin="normal" sx={{ minWidth: 120 }}>
                    <InputLabel>Unit</InputLabel>
                    <Select
                      name="measures.unit"
                      value={newProduct.measures.unit}
                      onChange={handleProductChange}
                    >
                      <MenuItem value="cm">cm</MenuItem>
                      <MenuItem value="in">in</MenuItem>
                      <MenuItem value="ft">ft</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Historical Context"
                name="history"
                value={newProduct.history}
                onChange={handleProductChange}
                margin="normal"
                multiline
                rows={3}
                placeholder="Historical information about this piece"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Delivery Information"
                name="delivery"
                value={newProduct.delivery}
                onChange={handleProductChange}
                margin="normal"
                multiline
                rows={2}
                placeholder="Shipping and delivery details"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={newProduct.featured}
                    onChange={e => setNewProduct({ ...newProduct, featured: e.target.checked })}
                    name="featured"
                    color="primary"
                  />
                }
                label="Featured Product"
                sx={{ mt: 3 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(null)}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddProduct}
            disabled={
              !newProduct.name ||
              !newProduct.price ||
              !newProduct.description ||
              !newProduct.category ||
              !newProduct.period ||
              loading
            }
          >
            {loading ? <CircularProgress size={24} /> : 'Add Product'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog
        open={openDialog === 'edit-product'}
        onClose={() => setOpenDialog(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          {editProduct && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Product Name"
                  name="name"
                  value={editProduct.name}
                  onChange={handleEditProductChange}
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Price (€)"
                  name="price"
                  type="number"
                  value={editProduct.price}
                  onChange={handleEditProductChange}
                  margin="normal"
                  required
                  InputProps={{
                    startAdornment: <InputAdornment position="start">€</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={editProduct.description}
                  onChange={handleEditProductChange}
                  margin="normal"
                  multiline
                  rows={3}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal" sx={{ minWidth: 200 }} required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={editProduct.category}
                    onChange={handleEditProductChange}
                    required
                  >
                    <MenuItem value="">
                      <em>Select a category</em>
                    </MenuItem>
                    {categories.map(category => (
                      <MenuItem key={category._id} value={category._id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal" sx={{ minWidth: 200 }} required>
                  <InputLabel>Period</InputLabel>
                  <Select
                    name="period"
                    value={editProduct.period}
                    onChange={handleEditProductChange}
                    required
                  >
                    <MenuItem value="">
                      <em>Select a period</em>
                    </MenuItem>
                    {periods.map(period => (
                      <MenuItem key={period._id} value={period._id}>
                        {period.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal" sx={{ minWidth: 200 }}>
                  <InputLabel>Condition</InputLabel>
                  <Select
                    name="condition"
                    value={editProduct.condition}
                    onChange={handleEditProductChange}
                  >
                    <MenuItem value="Excellent">Excellent</MenuItem>
                    <MenuItem value="Very Good">Very Good</MenuItem>
                    <MenuItem value="Good">Good</MenuItem>
                    <MenuItem value="Fair">Fair</MenuItem>
                    <MenuItem value="Poor">Poor</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Origin"
                  name="origin"
                  value={editProduct.origin}
                  onChange={handleEditProductChange}
                  margin="normal"
                  placeholder="e.g., France, 19th Century"
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  fullWidth
                  label="Provenance"
                  name="provenance"
                  value={editProduct.provenance}
                  onChange={handleEditProductChange}
                  margin="normal"
                  multiline
                  rows={2}
                  placeholder="History of ownership"
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Product Images
                </Typography>
                <BlobImageManager
                  productId={editProduct._id}
                  existingImages={editProduct.blobImages}
                  onImagesChange={handleEditBlobImagesChange}
                  maxImages={15}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                  Dimensions
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={3}>
                    <TextField
                      fullWidth
                      label="Height"
                      name="measures.height"
                      type="number"
                      value={editProduct.measures.height}
                      onChange={handleEditProductChange}
                      margin="normal"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            {editProduct.measures.unit}
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      fullWidth
                      label="Width"
                      name="measures.width"
                      type="number"
                      value={editProduct.measures.width}
                      onChange={handleEditProductChange}
                      margin="normal"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            {editProduct.measures.unit}
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      fullWidth
                      label="Depth"
                      name="measures.depth"
                      type="number"
                      value={editProduct.measures.depth}
                      onChange={handleEditProductChange}
                      margin="normal"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            {editProduct.measures.unit}
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <FormControl fullWidth margin="normal" sx={{ minWidth: 120 }}>
                      <InputLabel>Unit</InputLabel>
                      <Select
                        name="measures.unit"
                        value={editProduct.measures.unit}
                        onChange={handleEditProductChange}
                      >
                        <MenuItem value="cm">cm</MenuItem>
                        <MenuItem value="in">in</MenuItem>
                        <MenuItem value="ft">ft</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Historical Context"
                  name="history"
                  value={editProduct.history}
                  onChange={handleEditProductChange}
                  margin="normal"
                  multiline
                  rows={3}
                  placeholder="Historical information about this piece"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Delivery Information"
                  name="delivery"
                  value={editProduct.delivery}
                  onChange={handleEditProductChange}
                  margin="normal"
                  multiline
                  rows={2}
                  placeholder="Shipping and delivery details"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={editProduct.featured}
                      onChange={e => setEditProduct({ ...editProduct, featured: e.target.checked })}
                      name="featured"
                      color="primary"
                    />
                  }
                  label="Featured Product"
                  sx={{ mt: 3 }}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(null)}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveProduct}
            disabled={
              !editProduct ||
              !editProduct.name ||
              !editProduct.price ||
              !editProduct.description ||
              !editProduct.category ||
              !editProduct.period ||
              loading
            }
          >
            {loading ? <CircularProgress size={24} /> : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog
        open={openDialog === 'edit-category'}
        onClose={() => setOpenDialog(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Category</DialogTitle>
        <DialogContent>
          {editCategory && (
            <>
              <TextField
                fullWidth
                label="Category Name"
                name="name"
                value={editCategory.name}
                onChange={handleEditCategoryChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={editCategory.description}
                onChange={handleEditCategoryChange}
                margin="normal"
                multiline
                rows={3}
              />
              <TextField
                fullWidth
                label="Image URL"
                name="image"
                value={editCategory.image}
                onChange={handleEditCategoryChange}
                margin="normal"
                helperText="Link to a representative image"
              />
              <CategoryBlobImageManager
                categoryId={editCategory._id}
                existingImage={editCategory.blobImage}
                onImageChange={handleEditCategoryBlobImageChange}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(null)}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveCategory}
            disabled={!editCategory || !editCategory.name || loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Period Dialog */}
      <Dialog
        open={openDialog === 'edit-period'}
        onClose={() => setOpenDialog(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Period</DialogTitle>
        <DialogContent>
          {editPeriod && (
            <>
              <TextField
                fullWidth
                label="Period Name"
                name="name"
                value={editPeriod.name}
                onChange={handleEditPeriodChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={editPeriod.description}
                onChange={handleEditPeriodChange}
                margin="normal"
                multiline
                rows={3}
              />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Start Year"
                    name="yearStart"
                    type="number"
                    value={editPeriod.yearStart}
                    onChange={handleEditPeriodChange}
                    margin="normal"
                    InputProps={{ inputProps: { min: -3000, max: 2100 } }}
                    helperText="Use negative values for BC/BCE"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="End Year"
                    name="yearEnd"
                    type="number"
                    value={editPeriod.yearEnd}
                    onChange={handleEditPeriodChange}
                    margin="normal"
                    InputProps={{ inputProps: { min: -3000, max: 2100 } }}
                    helperText="Use negative values for BC/BCE"
                  />
                </Grid>
              </Grid>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(null)}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSavePeriod}
            disabled={!editPeriod || !editPeriod.name || loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Admin;
