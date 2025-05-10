import api from './api';

// Define types
export interface UploadedFile {
  filename: string;
  originalname: string;
  path: string;
  size: number;
  mimetype: string;
}

export interface UploadResponse {
  message: string;
  file?: UploadedFile;
  files?: UploadedFile[];
}

// Upload a single image
export const uploadSingleImage = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('image', file);
  
  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

// Upload multiple images
export const uploadMultipleImages = async (files: File[]): Promise<UploadResponse> => {
  const formData = new FormData();
  
  files.forEach((file) => {
    formData.append('images', file);
  });
  
  const response = await api.post('/upload/multiple', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

// Delete a file
export const deleteFile = async (filename: string): Promise<{ message: string }> => {
  const response = await api.delete(`/upload/${filename}`);
  return response.data;
};

export default {
  uploadSingleImage,
  uploadMultipleImages,
  deleteFile
}; 