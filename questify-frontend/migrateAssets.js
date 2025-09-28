const path = require('path');
const fs = require('fs');
const { initializeApp } = require('firebase/app');
const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase/storage');
require('dotenv').config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_IMG_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_IMG_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_IMG_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_IMG_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_IMG_FIREBASE_MESSAGE_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_IMG_FIREBASE_APP_ID,
};

const imageApp = initializeApp(firebaseConfig, 'imageStorage');
const imageStorage = getStorage(imageApp);

// Create firebase directory if it doesn't exist
const createStorageDirectories = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Scan directory for files
const scanDirectory = (directoryPath) => {
  const allFiles = [];

  const scan = (currentPath) => {
    const files = fs.readdirSync(currentPath);

    files.forEach((file) => {
      const filePath = path.join(currentPath, file);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        if (file !== 'firebase' && file !== 'node_modules') {
          scan(filePath);
        }
      } else if (
        stats.isFile() &&
        !file.endsWith('.js') &&
        !file.endsWith('.ts') &&
        !file.includes('index')
      ) {
        allFiles.push(filePath);
      }
    });
  };

  scan(directoryPath);
  return allFiles;
};

// Upload a file to Firebase storage
const uploadFile = async (filePath, basePath) => {
  const fileContent = fs.readFileSync(filePath);
  const relativePath = path.relative(basePath, filePath);
  const storagePath = relativePath.replace(/\\/g, '/');
  const storageRef = ref(imageStorage, storagePath);

  await uploadBytes(storageRef, fileContent);
  const downloadURL = await getDownloadURL(storageRef);

  return downloadURL;
};

// Generate or update mapping file
const generateMappingFile = async (files, basePath) => {
  // Try to load existing mapping
  let mapping = {};
  const mappingPath = path.join('./src/assets/firebase', 'assetMapping.json');

  if (fs.existsSync(mappingPath)) {
    try {
      const existingMapping = fs.readFileSync(mappingPath, 'utf8');
      mapping = JSON.parse(existingMapping);
    } catch (error) {
      console.error('Error loading existing mapping file, creating new one');
    }
  }

  // Update mapping with new files
  for (const file of files) {
    const relativePath = path.relative(basePath, file);
    const normalizedPath = relativePath.replace(/\\/g, '/');

    // Only upload if the file doesn't exist in mapping
    if (!mapping[normalizedPath]) {
      console.log(`Uploading new file: ${normalizedPath}`);
      const url = await uploadFile(file, basePath);
      mapping[normalizedPath] = url;
    }
  }

  return mapping;
};

// Main migration function
const migrateAssets = async () => {
  try {
    // Path to the assets directory
    const assetsDir = path.resolve('./src/assets');
    const firebaseDir = path.join(assetsDir, 'firebase');

    // Create firebase directory if it doesn't exist
    createStorageDirectories(firebaseDir);

    // Scan for image files
    const imageFiles = scanDirectory(assetsDir);
    console.log(`Found ${imageFiles.length} files to process`);

    // Upload files and update mapping
    const mapping = await generateMappingFile(imageFiles, assetsDir);

    // Write mapping file
    fs.writeFileSync(path.join(firebaseDir, 'assetMapping.json'), JSON.stringify(mapping, null, 2));

    console.log(`Migration complete! ${Object.keys(mapping).length} assets mapped.`);
  } catch (error) {
    console.error('Migration failed:', error.message || error);
  }
};

migrateAssets();
