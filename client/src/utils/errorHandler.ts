import { AxiosError } from 'axios';

/**
 * Error types to categorize API errors
 */
export enum ErrorType {
  NETWORK = 'network',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  VALIDATION = 'validation',
  NOT_FOUND = 'not_found',
  SERVER = 'server',
  UNKNOWN = 'unknown',
}

/**
 * Standard error structure returned by the application
 */
export interface AppError {
  type: ErrorType;
  message: string;
  status?: number;
  details?: Record<string, string[]>;
  originalError?: any;
}

/**
 * Parse API error response into a standardized AppError object
 */
export const parseApiError = (error: any): AppError => {
  if (error?.isAxiosError) {
    const axiosError = error as AxiosError<any>;

    // Network error (no response)
    if (!axiosError.response) {
      return {
        type: ErrorType.NETWORK,
        message: 'Unable to connect to the server. Please check your internet connection.',
        originalError: error,
      };
    }

    const status = axiosError.response.status;
    const data = axiosError.response.data;

    // Authentication errors
    if (status === 401) {
      return {
        type: ErrorType.AUTHENTICATION,
        message: data?.message || 'You must be logged in to access this resource.',
        status,
        originalError: error,
      };
    }

    // Authorization errors
    if (status === 403) {
      return {
        type: ErrorType.AUTHORIZATION,
        message: data?.message || 'You do not have permission to perform this action.',
        status,
        originalError: error,
      };
    }

    // Not found errors
    if (status === 404) {
      return {
        type: ErrorType.NOT_FOUND,
        message: data?.message || 'The requested resource was not found.',
        status,
        originalError: error,
      };
    }

    // Validation errors
    if (status === 400 || status === 422) {
      return {
        type: ErrorType.VALIDATION,
        message: data?.message || 'There was an error with your request.',
        status,
        details: data?.errors,
        originalError: error,
      };
    }

    // Server errors
    if (status >= 500) {
      return {
        type: ErrorType.SERVER,
        message: 'Something went wrong on our servers. Please try again later.',
        status,
        originalError: error,
      };
    }

    // Other API errors
    return {
      type: ErrorType.UNKNOWN,
      message: data?.message || 'An unexpected error occurred.',
      status,
      originalError: error,
    };
  }

  // Handle non-axios errors
  return {
    type: ErrorType.UNKNOWN,
    message: error?.message || 'An unexpected error occurred.',
    originalError: error,
  };
};

/**
 * Get form field errors from validation error details
 */
export const getFieldErrors = (error: AppError | null): Record<string, string> => {
  if (!error || error.type !== ErrorType.VALIDATION || !error.details) {
    return {};
  }

  const fieldErrors: Record<string, string> = {};

  Object.entries(error.details).forEach(([field, messages]) => {
    fieldErrors[field] = Array.isArray(messages) ? messages[0] : messages;
  });

  return fieldErrors;
};

/**
 * Log error to monitoring service (to be implemented)
 */
export const logError = (error: AppError): void => {
  // In a real app, send to monitoring service like Sentry
  console.error('Error:', error);
};

// Create exportable utilities object
const errorHandlerUtils = {
  parseApiError,
  getFieldErrors,
  logError,
};

export default errorHandlerUtils;
