import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { imageStorage } from './config';

interface UploadOptions {
  folderPath: string;
}

export const uploadImage = async (file: File, options: UploadOptions): Promise<string> => {
  const { folderPath } = options;
  const timestamp = new Date().getTime();
  const fileName = `${timestamp}_${file.name}`;
  const fullPath = `${folderPath}/${fileName}`;
  const storageRef = ref(imageStorage, fullPath);

  try {
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};
