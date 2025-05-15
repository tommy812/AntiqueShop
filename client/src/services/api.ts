import axios, { AxiosError } from 'axios';
import { ErrorType, parseApiError } from '../utils/errorHandler';

// API base URL - use environment variable or fallback to mock API for initial client-only deployment
const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://antique-shop.vercel.app' // Updated backend URL without /api suffix
    : 'http://localhost:5001'); // In development, use localhost

// Configuration constants
const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes before expiry
const REQUEST_TIMEOUT = 30000; // 30 seconds

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Allow cookies to be sent and received
  timeout: REQUEST_TIMEOUT,
});

// Add request interceptor to prepend /api to URLs if needed
api.interceptors.request.use(
  async config => {
    // Add /api prefix to URLs that don't already have it and aren't absolute URLs
    if (!config.url) return config;

    if (
      !config.url.startsWith('/api') &&
      !config.url.startsWith('http://') &&
      !config.url.startsWith('https://')
    ) {
      config.url = `/api${config.url}`;
    }

    const token = localStorage.getItem('token');

    // Add authorization token if available
    if (token) {
      // Check if token is about to expire and refresh if needed
      const tokenData = parseJwt(token);
      if (tokenData && shouldRefreshToken(tokenData.exp)) {
        try {
          const newToken = await refreshToken();
          if (newToken) {
            config.headers.Authorization = `Bearer ${newToken}`;
          }
        } catch (error) {
          // If refresh fails, we'll continue with current token
          console.error('Token refresh failed:', error);
          config.headers.Authorization = `Bearer ${token}`;
        }
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Add CSRF token if available (set by the server in a cookie)
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }

    // Add request ID for tracing/debugging
    config.headers['X-Request-ID'] = generateRequestId();

    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor for handling errors
api.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    // Parse and standardize error
    const parsedError = parseApiError(error);

    // Handle different error types
    switch (parsedError.type) {
      case ErrorType.AUTHENTICATION:
        // Clear authentication data
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Only redirect if we're not already on the login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        break;

      case ErrorType.AUTHORIZATION:
        const errorData = error.response?.data as any;

        // Handle token expiration specifically
        if (errorData?.message === 'Token expired') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login?expired=true';
        } else {
          // For other authorization errors, redirect to unauthorized page
          window.location.href = '/unauthorized';
        }
        break;

      case ErrorType.NETWORK:
        // Could implement offline detection and retry logic here
        console.error('Network error detected:', parsedError.message);
        break;

      case ErrorType.SERVER:
        // Log server errors for monitoring
        console.error('Server error:', parsedError);
        break;
    }

    return Promise.reject(parsedError);
  }
);

// Helper function to get CSRF token from cookies
function getCsrfToken(): string | null {
  const tokenRegex = /XSRF-TOKEN=([^;]+)/;
  const match = document.cookie.match(tokenRegex);
  return match ? match[1] : null;
}

// Helper function to parse JWT token
function parseJwt(token: string) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

// Helper function to determine if token should be refreshed
function shouldRefreshToken(expiryTimestamp: number): boolean {
  if (!expiryTimestamp) return false;

  const expiryTime = expiryTimestamp * 1000; // Convert to milliseconds
  const currentTime = Date.now();

  return expiryTime - currentTime < TOKEN_REFRESH_THRESHOLD;
}

// Function to refresh token
async function refreshToken(): Promise<string | null> {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/refresh`,
      {},
      {
        withCredentials: true, // Needed for refresh token in cookie
      }
    );

    const newToken = response.data.token;
    localStorage.setItem('token', newToken);
    return newToken;
  } catch (error) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return null;
  }
}

// Generate request ID for tracing
function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Expose method for handling request retries
export async function withRetry<T>(
  apiFn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  let lastError: any;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await apiFn();
    } catch (error) {
      lastError = error;

      // Only retry network errors and 5xx (server) errors
      const parsedError = parseApiError(error);
      if (parsedError.type !== ErrorType.NETWORK && parsedError.type !== ErrorType.SERVER) {
        throw error;
      }

      // Exponential backoff
      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

export default api;
