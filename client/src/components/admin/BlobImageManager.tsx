import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Grid,
  Paper,
  IconButton,
  Alert,
  Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InfoIcon from '@mui/icons-material/Info';
import { styled } from '@mui/material/styles';
import api from '../../services/api';
import { isVercelBlobUrl } from '../../utils/imageUtils';

// Custom styled components
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const ImagePreview = styled('img')({
  width: '100%',
  height: '150px',
  objectFit: 'cover',
  borderRadius: '4px',
});

interface BlobImageManagerProps {
  productId: string;
  existingImages?: string[];
  onImagesChange?: (images: string[]) => void;
  maxImages?: number;
}

const BlobImageManager: React.FC<BlobImageManagerProps> = ({
  productId,
  existingImages = [],
  onImagesChange,
  maxImages = 15,
}) => {
  const [images, setImages] = useState<string[]>(existingImages);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Update images state when existingImages prop changes
  useEffect(() => {
    setImages(existingImages);
  }, [existingImages]);

  useEffect(() => {
    // If we have an existing product, fetch its images from the blob storage
    if (productId && productId !== 'new') {
      fetchProductImages();
    }
  }, [productId]);

  const fetchProductImages = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/upload/product/${productId}`);

      // Extract image URLs from the response
      const imageUrls = response.data.files.map((file: any) => file.path);
      setImages(imageUrls);

      // Notify parent component if needed
      if (onImagesChange) {
        onImagesChange(imageUrls);
      }

      setError(null);
    } catch (err: any) {
      console.error('Error fetching product images:', err);
      setError('Failed to fetch product images');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) return;

      // Check if adding these files would exceed the limit
      if (images.length + event.target.files.length > maxImages) {
        setError(`You can only upload a maximum of ${maxImages} images per product`);
        return;
      }

      setLoading(true);
      setError(null);

      const formData = new FormData();

      // Add the product ID to the form data
      formData.append('productId', productId);

      // Append each file
      Array.from(event.target.files).forEach(file => {
        formData.append('images', file);
      });

      // Use the multiple upload endpoint if multiple files, otherwise use single upload
      const endpoint = event.target.files.length > 1 ? '/upload/multiple' : '/upload';
      const fieldName = event.target.files.length > 1 ? 'images' : 'image';

      if (event.target.files.length === 1) {
        formData.delete('images');
        formData.append('image', event.target.files[0]);
      }

      const response = await api.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Add the new image URLs to the existing ones
      let newImageUrls: string[] = [];

      if (event.target.files.length > 1) {
        newImageUrls = response.data.files.map((file: any) => file.path);
      } else {
        newImageUrls = [response.data.file.path];
      }

      const updatedImages = [...images, ...newImageUrls];
      setImages(updatedImages);

      // Notify parent component if needed
      if (onImagesChange) {
        onImagesChange(updatedImages);
      }

      setSuccess('Images uploaded successfully');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Failed to upload images');
    } finally {
      setLoading(false);
      // Reset the input
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handleDelete = async (imagePath: string) => {
    try {
      setLoading(true);

      // For Vercel Blob URLs, we need to extract the filename for deletion
      let filename = imagePath;

      if (isVercelBlobUrl(imagePath)) {
        // Extract filename from Blob URL
        // The format is usually https://[store].public.blob.vercel-storage.com/products/[productId]/[timestamp]-[filename]
        const url = new URL(imagePath);
        const pathParts = url.pathname.split('/');
        filename = pathParts.slice(2).join('/'); // Skip the first two parts (empty and 'products')
      }

      await api.delete(`/upload/${encodeURIComponent(filename)}`);

      // Remove the deleted image from state
      const updatedImages = images.filter(img => img !== imagePath);
      setImages(updatedImages);

      // Notify parent component if needed
      if (onImagesChange) {
        onImagesChange(updatedImages);
      }

      setSuccess('Image deleted successfully');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Delete error:', err);
      setError(err.response?.data?.message || 'Failed to delete image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Product Images
          <Tooltip title={`Maximum ${maxImages} images per product`}>
            <IconButton size="small">
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Typography>

        <Button
          component="label"
          variant="contained"
          startIcon={<CloudUploadIcon />}
          disabled={loading || images.length >= maxImages}
        >
          Upload {loading && <CircularProgress size={24} sx={{ ml: 1 }} />}
          <VisuallyHiddenInput type="file" multiple accept="image/*" onChange={handleUpload} />
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {images.length} of {maxImages} images used
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {images.map((image, index) => (
          <Grid item xs={6} sm={4} md={3} key={index}>
            <Paper
              elevation={1}
              sx={{
                p: 1,
                position: 'relative',
                '&:hover .delete-button': {
                  opacity: 1,
                },
              }}
            >
              <ImagePreview src={image} alt={`Product image ${index + 1}`} />
              <IconButton
                className="delete-button"
                size="small"
                color="error"
                onClick={() => handleDelete(image)}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  bgcolor: 'rgba(255, 255, 255, 0.8)',
                  opacity: 0,
                  transition: 'opacity 0.2s',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                  },
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Paper>
          </Grid>
        ))}

        {images.length === 0 && !loading && (
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                textAlign: 'center',
                border: '1px dashed',
                borderColor: 'divider',
              }}
            >
              <Typography variant="body1" color="text.secondary">
                No images uploaded yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Upload images to showcase your product
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default BlobImageManager;
