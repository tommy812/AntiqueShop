import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Skeleton } from '@mui/material';

interface LazyImageProps {
  src: string;
  alt: string;
  height?: string | number;
  width?: string | number;
  aspectRatio?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  className?: string;
  placeholderColor?: string;
  onError?: () => void;
  style?: React.CSSProperties;
  borderRadius?: number | string;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  height,
  width = '100%',
  aspectRatio = '4/3',
  objectFit = 'cover',
  className,
  placeholderColor = '#f0f0f0',
  onError,
  style,
  borderRadius = 1,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    // Reset states when src changes
    setIsLoading(true);
    setIsError(false);
    setImageSrc(null);

    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
    };
    
    img.onerror = () => {
      setIsError(true);
      setIsLoading(false);
      if (onError) onError();
    };
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, onError]);

  // Placeholder while loading
  if (isLoading) {
    return (
      <Box 
        className={`lazy-image-placeholder ${className || ''}`}
        sx={{
          width,
          height: height || 0,
          aspectRatio,
          backgroundColor: placeholderColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          borderRadius,
          ...style
        }}
      >
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          animation="wave"
        />
      </Box>
    );
  }

  // Error state
  if (isError) {
    return (
      <Box 
        className={`lazy-image-error ${className || ''}`}
        sx={{
          width,
          height: height || 0,
          aspectRatio,
          backgroundColor: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#666',
          fontSize: '0.875rem',
          borderRadius,
          ...style
        }}
      >
        Image not available
      </Box>
    );
  }

  // Loaded image
  return (
    <Box
      className={`lazy-image-container ${className || ''}`}
      sx={{
        width,
        height: height || 'auto',
        aspectRatio,
        overflow: 'hidden',
        borderRadius,
        ...style
      }}
    >
      <img
        src={imageSrc || ''}
        alt={alt}
        className="lazy-image"
        loading="lazy"
        style={{
          width: '100%',
          height: '100%',
          objectFit,
          display: 'block',
        }}
      />
    </Box>
  );
};

export default LazyImage; 