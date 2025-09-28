import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { imageStorage } from './config';

interface UploadOptions {
  folderPath: string;
  timeout?: number;
}

export const uploadImage = async (file: File, options: UploadOptions): Promise<string> => {
  const { folderPath, timeout } = options;

  // Create a unique filename
  const timestamp = new Date().getTime();
  const fileName = `${timestamp}_${file.name}`;

  // Full path in Firebase Storage
  const fullPath = `${folderPath}/${fileName}`;

  // Log upload attempt
  console.log(`Attempting to upload file to Firebase: ${fullPath}`);

  // Check if imageStorage is available
  if (!imageStorage) {
    console.error('Firebase Storage not initialized. Environment variables may be missing.');
    console.error(
      'Required env vars: NEXT_PUBLIC_IMG_FIREBASE_API_KEY, NEXT_PUBLIC_IMG_FIREBASE_STORAGE_BUCKET',
    );
    throw new Error('Firebase Storage not initialized. Check environment variables configuration.');
  }

  // Create a reference to the file location
  const storageRef = ref(imageStorage, fullPath);

  try {
    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);

    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Set timeout to delete the image if specified
    if (timeout) {
      setTimeout(async () => {
        try {
          // Check again if imageStorage is available
          if (!imageStorage) {
            console.error('Firebase Storage not initialized when attempting to delete file');
            return;
          }
          // Create reference to the same file
          const fileRef = ref(imageStorage, fullPath);
          // Delete the file
          await deleteObject(fileRef);
          console.log('File deleted due to timeout:', fullPath);
        } catch (error) {
          console.error('Error deleting file:', error);
        }
      }, timeout);
    }

    return downloadURL;
  } catch (error) {
    console.error('Error uploading file to Firebase Storage:', error);
    throw error;
  }
};
