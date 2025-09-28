import { initializeApp } from 'firebase/app';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Log configuration status for debugging
console.log('Checking Firebase configuration from environment variables...');

// Validate required environment variables for Firebase
const requiredEnvVars = [
  'NEXT_PUBLIC_IMG_FIREBASE_API_KEY',
  'NEXT_PUBLIC_IMG_FIREBASE_STORAGE_BUCKET',
];

const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);
if (missingVars.length > 0) {
  console.warn(`Missing required Firebase environment variables: ${missingVars.join(', ')}`);
}

// Use environment variables only - no hardcoded fallbacks
const imageFirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_IMG_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_IMG_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_IMG_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_IMG_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_IMG_FIREBASE_MESSAGE_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_IMG_FIREBASE_APP_ID,
};

// Initialize Firebase with proper error handling
let imageApp;
let imageStorage: FirebaseStorage | undefined;

// Only initialize if the required configuration is available
if (imageFirebaseConfig.apiKey && imageFirebaseConfig.storageBucket) {
  try {
    // Log non-sensitive configuration
    console.log('Initializing Firebase with storage bucket:', imageFirebaseConfig.storageBucket);

    // Initialize Firebase app
    imageApp = initializeApp(imageFirebaseConfig, 'imageStorage');

    // Get storage reference
    imageStorage = getStorage(imageApp);

    console.log('Firebase Storage initialized successfully');
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
} else {
  console.error(
    'Firebase initialization skipped due to missing configuration. ' +
      'Missing variables: ' +
      (imageFirebaseConfig.apiKey ? '' : 'NEXT_PUBLIC_IMG_FIREBASE_API_KEY, ') +
      (imageFirebaseConfig.storageBucket ? '' : 'NEXT_PUBLIC_IMG_FIREBASE_STORAGE_BUCKET') +
      '. Please check that the required environment variables are set in the Kubernetes deployment.',
  );
}

// Only export the storage reference - configuration should remain internal to this file
export { imageStorage };
