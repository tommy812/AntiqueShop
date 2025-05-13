import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  useTheme,
  useMediaQuery,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface ImageGalleryProps {
  images: string[];
  activeIndex: number;
  open: boolean;
  onClose: () => void;
  title?: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  activeIndex,
  open,
  onClose,
  title,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [currentIndex, setCurrentIndex] = useState(activeIndex);

  useEffect(() => {
    setCurrentIndex(activeIndex);
  }, [activeIndex, open]);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === 'ArrowRight') {
        setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, images.length, onClose]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullScreen
      sx={{
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
      }}
    >
      <IconButton
        edge="end"
        color="inherit"
        onClick={onClose}
        aria-label="close"
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 1,
          color: 'white',
        }}
      >
        <CloseIcon />
      </IconButton>

      {title && (
        <Typography
          variant="h6"
          component="h2"
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            color: 'white',
            zIndex: 1,
          }}
        >
          {title}
        </Typography>
      )}

      <DialogContent
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: 'transparent',
        }}
      >
        {/* Navigation buttons */}
        <IconButton
          onClick={handlePrev}
          sx={{
            position: 'absolute',
            left: isMobile ? 8 : 24,
            color: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            },
            zIndex: 2,
          }}
        >
          <ArrowBackIosNewIcon />
        </IconButton>

        <IconButton
          onClick={handleNext}
          sx={{
            position: 'absolute',
            right: isMobile ? 8 : 24,
            color: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            },
            zIndex: 2,
          }}
        >
          <ArrowForwardIosIcon />
        </IconButton>

        {/* Main image */}
        <Box
          component="img"
          src={images[currentIndex]}
          alt={`Gallery image ${currentIndex + 1}`}
          sx={{
            maxHeight: '90vh',
            maxWidth: '90vw',
            objectFit: 'contain',
          }}
        />

        {/* Image counter */}
        <Typography
          variant="body2"
          sx={{
            position: 'absolute',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: '4px 8px',
            borderRadius: 1,
          }}
        >
          {currentIndex + 1} / {images.length}
        </Typography>

        {/* Thumbnail navigation */}
        {images.length > 1 && (
          <Box
            sx={{
              position: 'absolute',
              bottom: isMobile ? 50 : 60,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 1,
              overflowX: 'auto',
              maxWidth: '80vw',
              padding: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              borderRadius: 1,
            }}
          >
            {images.map((img, idx) => (
              <Box
                key={idx}
                component="img"
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                onClick={() => setCurrentIndex(idx)}
                sx={{
                  width: 60,
                  height: 60,
                  objectFit: 'cover',
                  cursor: 'pointer',
                  border: idx === currentIndex ? `2px solid ${theme.palette.primary.main}` : 'none',
                  opacity: idx === currentIndex ? 1 : 0.6,
                  transition: 'all 0.2s',
                  '&:hover': {
                    opacity: 1,
                  },
                }}
              />
            ))}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ImageGallery;
