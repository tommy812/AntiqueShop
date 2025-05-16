import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Typography,
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
  height: '200px',
  objectFit: 'cover',
  borderRadius: '4px',
});

interface CategoryBlobImageManagerProps {
  categoryId: string;
  existingImage?: string;
  onImageChange?: (image: string) => void;
}

const CategoryBlobImageManager: React.FC<CategoryBlobImageManagerProps> = ({
  categoryId,
  existingImage = '',
  onImageChange,
}) => {
  const [image, setImage] = useState<string>(existingImage);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Update image state when existingImage prop changes
  useEffect(() => {
    setImage(existingImage);
  }, [existingImage]);

  // Fetch category image if it exists
  useEffect(() => {
    if (categoryId && categoryId !== 'new' && existingImage && isVercelBlobUrl(existingImage)) {
      setImage(existingImage);
    }
  }, [categoryId, existingImage]);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) return;

      setLoading(true);
      setError(null);

      const formData = new FormData();

      // Add the category ID to the form data
      formData.append('categoryId', categoryId);

      // Append the file
      formData.append('image', event.target.files[0]);

      const response = await api.post('/upload/category', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Set the new image URL
      const newImageUrl = response.data.file.path;
      setImage(newImageUrl);

      // Notify parent component
      if (onImageChange) {
        onImageChange(newImageUrl);
      }

      setSuccess('Image uploaded successfully');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setLoading(false);
      // Reset the input
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);

      if (!image) {
        setError('No image to delete');
        return;
      }

      // For Vercel Blob URLs, we need to extract the filename for deletion
      let filename = image;

      if (isVercelBlobUrl(image)) {
        // Extract filename from Blob URL
        // The format is usually https://[store].public.blob.vercel-storage.com/categories/[categoryId]/[timestamp]-[filename]
        const url = new URL(image);
        const pathParts = url.pathname.split('/');
        filename = pathParts.slice(2).join('/'); // Skip the first two parts (empty and 'categories')
      }

      await api.delete(`/upload/${encodeURIComponent(filename)}`);

      // Remove the image
      setImage('');

      // Notify parent component
      if (onImageChange) {
        onImageChange('');
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
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1" fontWeight="medium">
          Category Image
        </Typography>
        <Tooltip title="Upload a single image for the category">
          <IconButton size="small" color="primary">
            <InfoIcon fontSize="small" />
          </IconButton>
        </Tooltip>
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

      {loading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '200px',
            border: '1px dashed #ccc',
            borderRadius: '4px',
          }}
        >
          <CircularProgress />
        </Box>
      ) : image ? (
        <Box sx={{ position: 'relative' }}>
          <Paper elevation={2} sx={{ overflow: 'hidden', mb: 2 }}>
            <ImagePreview src={image} alt="Category preview" />
          </Paper>
          <IconButton
            onClick={handleDelete}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
              },
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '200px',
            border: '1px dashed #ccc',
            borderRadius: '4px',
            mb: 2,
          }}
        >
          <Typography color="textSecondary">No image uploaded</Typography>
        </Box>
      )}

      <Button
        component="label"
        variant="outlined"
        startIcon={<CloudUploadIcon />}
        disabled={loading}
        fullWidth
      >
        {image ? 'Change Image' : 'Upload Image'}
        <VisuallyHiddenInput type="file" accept="image/*" onChange={handleUpload} />
      </Button>
    </Box>
  );
};

export default CategoryBlobImageManager;
