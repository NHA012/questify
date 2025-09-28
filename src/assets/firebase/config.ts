import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const imageFirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_IMG_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_IMG_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_IMG_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_IMG_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_IMG_FIREBASE_MESSAGE_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_IMG_FIREBASE_APP_ID,
};

if (!imageFirebaseConfig.storageBucket) {
  console.error('Firebase storage bucket is not defined in environment variables');
  console.log('Available env vars:', process.env.NEXT_PUBLIC_IMG_FIREBASE_STORAGE_BUCKET);
}

const imageApp = initializeApp(imageFirebaseConfig, 'imageStorage');
const imageStorage = getStorage(
  imageApp,
  process.env.NEXT_PUBLIC_IMG_FIREBASE_STORAGE_BUCKET || undefined,
);

export { imageStorage };
