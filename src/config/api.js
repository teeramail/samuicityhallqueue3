// API Configuration
const isDevelopment = import.meta.env.DEV || process.env.NODE_ENV === 'development';

export const API_CONFIG = {
  // Use local server for development, Vercel API routes for production
  BASE_URL: isDevelopment ? 'http://localhost:50100' : '/api',
  
  // Available endpoints
  ENDPOINTS: {
    REGISSHOW: '/regisshow',
    ONBOARDSHOWS: '/onboardshows', 
    ONBOARDLANDS: '/onboardlands',
    ONBOARDLANDNUMS: '/onboardlandnums',
    COMBINE_RECORD: '/combine-record',
    OLDEST_RECORD: '/oldest-record',
    UPDATE_ATT: '/updateatt',
    INIT_DATA: '/init-data',
    VIEW_ALL_DATA: '/view-all-data'
  }
};

// Helper function to build full URL
export function getApiUrl(endpoint) {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}

// Pre-built URLs for common endpoints
export const API_URLS = {
  REGISSHOW: getApiUrl(API_CONFIG.ENDPOINTS.REGISSHOW),
  ONBOARDSHOWS: getApiUrl(API_CONFIG.ENDPOINTS.ONBOARDSHOWS),
  ONBOARDLANDS: getApiUrl(API_CONFIG.ENDPOINTS.ONBOARDLANDS), 
  ONBOARDLANDNUMS: getApiUrl(API_CONFIG.ENDPOINTS.ONBOARDLANDNUMS),
  COMBINE_RECORD: getApiUrl(API_CONFIG.ENDPOINTS.COMBINE_RECORD),
  OLDEST_RECORD: getApiUrl(API_CONFIG.ENDPOINTS.OLDEST_RECORD),
  UPDATE_ATT: getApiUrl(API_CONFIG.ENDPOINTS.UPDATE_ATT),
  VIEW_ALL_DATA: getApiUrl(API_CONFIG.ENDPOINTS.VIEW_ALL_DATA)
};

console.log('🔗 API Configuration:', {
  mode: isDevelopment ? 'Development' : 'Production',
  baseUrl: API_CONFIG.BASE_URL,
  endpoints: API_URLS
}); 