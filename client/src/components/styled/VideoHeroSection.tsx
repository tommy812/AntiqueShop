import React, { useState, useEffect, useRef } from 'react';
import { Box, styled } from '@mui/material';

// The video URL from mixkit
const videoUrl = 'https://assets.mixkit.co/videos/50835/50835-720.mp4';

// Fallback image in case video doesn't load
const fallbackImage =
  'https://images.unsplash.com/photo-1574642344377-3ba2a7a5e822?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';

// Function to detect mobile devices
const isMobileDevice = (): boolean => {
  return !!(
    typeof window !== 'undefined' &&
    (navigator.userAgent.match(/Android/i) ||
      navigator.userAgent.match(/webOS/i) ||
      navigator.userAgent.match(/iPhone/i) ||
      navigator.userAgent.match(/iPad/i) ||
      navigator.userAgent.match(/iPod/i) ||
      navigator.userAgent.match(/BlackBerry/i) ||
      navigator.userAgent.match(/Windows Phone/i))
  );
};

const VideoContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: '80vh',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(2),
  color: '#fff',
  textAlign: 'center',
  marginBottom: theme.spacing(6),
  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${fallbackImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  [theme.breakpoints.down('sm')]: {
    height: '70vh',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Overlay to make text more readable
    zIndex: 1,
  },
}));

const VideoBackground = styled('video')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  zIndex: 0,
});

const ContentContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 2, // Make sure the content is above the overlay
  width: '100%',
  maxWidth: '1200px',
  padding: theme.spacing(0, 2),
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center', // Center children horizontally
  margin: '0 auto', // Center container itself
}));

interface VideoHeroSectionProps {
  children: React.ReactNode;
}

export const VideoHeroSection: React.FC<VideoHeroSectionProps> = ({ children }) => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Check if device is mobile on component mount
  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  // Preload the video when component mounts
  useEffect(() => {
    // Create a new HTMLVideoElement to preload the video
    const preloadVideo = new Image();
    preloadVideo.src = fallbackImage;

    // Create a new video element for preloading
    const videoPreload = document.createElement('video');
    videoPreload.src = videoUrl;
    videoPreload.preload = 'auto';
    videoPreload.load();

    // Return cleanup function
    return () => {
      // Clean up preloading resources
      videoPreload.src = '';
      preloadVideo.src = '';
    };
  }, []);

  // Handle video load success
  const handleVideoLoaded = () => {
    console.log('Video loaded successfully');
    setVideoLoaded(true);
  };

  // Handle video load error
  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error('Video load error:', e);
    setVideoError(true);
  };

  // Initialize video on mount
  useEffect(() => {
    if (videoRef.current) {
      // Set properties
      videoRef.current.muted = true;
      videoRef.current.playsInline = true;
      videoRef.current.autoplay = true;
      videoRef.current.loop = true;

      // Attempt to load and play the video
      const playPromise = videoRef.current.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Autoplay started successfully
            console.log('Video autoplay started successfully');
            setVideoLoaded(true);
          })
          .catch(error => {
            // Autoplay was prevented
            console.error('Autoplay prevented:', error);
            // Try playing again on user interaction
            document.addEventListener(
              'click',
              () => {
                if (videoRef.current) {
                  videoRef.current.play().catch(err => {
                    console.error('Play on click failed:', err);
                    setVideoError(true);
                  });
                }
              },
              { once: true }
            );
          });
      }
    }
  }, []);

  return (
    <VideoContainer>
      {!videoError && (
        <VideoBackground
          ref={videoRef}
          preload="auto"
          poster={fallbackImage}
          onLoadedData={handleVideoLoaded}
          onError={handleVideoError}
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </VideoBackground>
      )}
      <ContentContainer>{children}</ContentContainer>
    </VideoContainer>
  );
};

export default VideoHeroSection;
