import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Paper, Container } from '@mui/material';
import { logError, ErrorType } from '../utils/errorHandler';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    logError({
      type: ErrorType.UNKNOWN,
      message: error.message,
      originalError: {
        error,
        errorInfo
      }
    });

    this.setState({
      error,
      errorInfo
    });
  }

  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Paper
            elevation={3}
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: 2,
              textAlign: 'center'
            }}
          >
            <Typography variant="h4" component="h2" color="error" gutterBottom>
              Something went wrong
            </Typography>
            
            <Typography variant="body1" paragraph sx={{ mb: 3 }}>
              We're sorry, but an error occurred while rendering this page.
            </Typography>
            
            <Box sx={{ mb: 4 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={this.resetError}
                sx={{ mr: 2 }}
              >
                Try Again
              </Button>
              
              <Button
                variant="outlined"
                onClick={() => window.location.href = '/'}
              >
                Go to Homepage
              </Button>
            </Box>

            {process.env.NODE_ENV === 'development' && (
              <Box sx={{ 
                textAlign: 'left', 
                backgroundColor: '#f5f5f5', 
                p: 2, 
                borderRadius: 1,
                overflow: 'auto',
                maxHeight: '400px',
                mt: 3
              }}>
                <Typography variant="body2" component="pre" sx={{ color: 'error.main', mb: 2 }}>
                  {this.state.error?.toString()}
                </Typography>
                
                <Typography variant="body2" component="pre" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                  {this.state.errorInfo?.componentStack}
                </Typography>
              </Box>
            )}
          </Paper>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 