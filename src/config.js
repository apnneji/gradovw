// Global configuration
export const isWeb = false; // Change to false for local development

// API URLs
export const LOCAL_API_BASE = 'http://localhost:5001/api/user';
export const WEB_API_BASE = 'http://apnneji-001-site1.ktempurl.com/api/User';

// Helper function to get the appropriate API URL
export const getApiUrl = (endpoint) => {
  const baseUrl = isWeb ? WEB_API_BASE : LOCAL_API_BASE;
  return `${baseUrl}/${endpoint}`;
}; 