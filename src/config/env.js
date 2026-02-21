/**
 * Environment Configuration Loader
 * 
 * Loads configuration from environment variables with fallback to config files.
 * Supports both development and production environments.
 */

/**
 * Get Firebase configuration from environment variables
 * @returns {Object} Firebase configuration object
 */
export function getFirebaseConfig() {
  // Try to load from environment variables first (Vite uses VITE_ prefix)
  const envConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
  };

  // Check if environment variables are set
  const hasEnvConfig = envConfig.apiKey && envConfig.projectId;

  if (hasEnvConfig) {
    console.log('Using Firebase configuration from environment variables');
    return envConfig;
  }

  // Fallback to config file (for development)
  console.warn('Environment variables not found, attempting to load from config file');
  
  try {
    // Dynamic import of config file
    return import('./firebase.json').then(module => {
      const fileConfig = module.default;
      
      if (!fileConfig.apiKey || !fileConfig.projectId) {
        throw new Error('Firebase configuration is incomplete');
      }
      
      console.log('Using Firebase configuration from config file');
      return fileConfig;
    });
  } catch (error) {
    console.error('Failed to load Firebase configuration:', error);
    throw new Error('Firebase configuration not found. Please set environment variables or configure firebase.json');
  }
}

/**
 * Get environment mode
 * @returns {string} 'development' or 'production'
 */
export function getEnvironment() {
  return import.meta.env.MODE || 'development';
}

/**
 * Check if running in production mode
 * @returns {boolean}
 */
export function isProduction() {
  return getEnvironment() === 'production';
}

/**
 * Check if running in development mode
 * @returns {boolean}
 */
export function isDevelopment() {
  return getEnvironment() === 'development';
}

/**
 * Get all environment variables (for debugging)
 * Only available in development mode
 * @returns {Object|null}
 */
export function getEnvVars() {
  if (isDevelopment()) {
    return {
      mode: import.meta.env.MODE,
      dev: import.meta.env.DEV,
      prod: import.meta.env.PROD,
      // Don't expose sensitive values, just show if they're set
      firebaseConfigured: !!(import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_PROJECT_ID)
    };
  }
  return null;
}
