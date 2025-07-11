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
    QUEUE_STATUS: '/queue-status',      // Fast queue status for counters
    QUEUE_HISTORY: '/queue-history',    // Global queue history for OnTV
    RESET_DAILY: '/reset-daily',        // Daily queue reset at 7 PM
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
  QUEUE_STATUS: getApiUrl(API_CONFIG.ENDPOINTS.QUEUE_STATUS),
  QUEUE_HISTORY: getApiUrl(API_CONFIG.ENDPOINTS.QUEUE_HISTORY),
  RESET_DAILY: getApiUrl(API_CONFIG.ENDPOINTS.RESET_DAILY),
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