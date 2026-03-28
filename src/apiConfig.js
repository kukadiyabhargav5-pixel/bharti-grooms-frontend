// API Configuration
// This file centralizes the backend base URL for easy switching between local and production environments.

// Use the VITE_API_URL environment variable if it exists, otherwise fallback to localhost.
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Helper for image URLs
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '/placeholder.jpg';
  // If the path already has http, return it as is
  if (imagePath.startsWith('http')) return imagePath;
  // Otherwise, prefix with the API base URL
  return `${API_BASE_URL}${imagePath}`;
};
