import { imageStorage } from './config';

const testFirebaseStorage = () => {
  try {
    console.log('Firebase Image Storage initialized:', imageStorage);
    console.log('Storage bucket:', imageStorage.app.options.storageBucket);
    return true;
  } catch (error) {
    console.error('Firebase Storage initialization error:', error);
    return false;
  }
};

export { testFirebaseStorage };
