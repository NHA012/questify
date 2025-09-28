import apiService from '../../services/api-service';
import { ResourcePrefix } from '@datn242/questify-common';
import fs from 'fs';
import path from 'path';

const api = apiService.instance;

// Data for island background images - keeping your 3 URLs exactly the same
const backgroundImages = [
  {
    imageUrl:
      'https://firebasestorage.googleapis.com/v0/b/questify-a190e.firebasestorage.app/o/images%2Flevels%2Fdesert_map.jpg?alt=media&token=1b2bf88d-eafa-4a01-baf4-72f7d75ff266',
  },
  {
    imageUrl:
      'https://firebasestorage.googleapis.com/v0/b/questify-a190e.firebasestorage.app/o/images%2Flevels%2Fforest_map.jpg?alt=media&token=4a6f8b4c-4d84-4bd6-b543-e38641b09193',
  },
  {
    imageUrl:
      'https://firebasestorage.googleapis.com/v0/b/questify-a190e.firebasestorage.app/o/images%2Flevels%2Fmountain_map.jpg?alt=media&token=ffbf3b0e-3a88-4746-be69-0eb80c219edd',
  },
];

// Define interface for seed data
interface SeedData {
  courseId?: string;
  islandIds?: string[];
  studentId?: string;
  templateIds?: string[];
  backgroundImageIds?: string[];
}

async function seedBackgroundImages() {
  const backgroundImageIds: string[] = [];

  try {
    // Login as admin
    console.log('Logging in as admin...');
    await api.post(ResourcePrefix.Auth + '/signin', {
      email: 'admin@example.com',
      password: '12345aB@',
    });
    console.log('Admin login successful.');

    // Create background images
    console.log('\nCreating island background images...');

    for (const bgImage of backgroundImages) {
      try {
        const response = await api.post(
          `${ResourcePrefix.CourseManagement}/island-background-images`,
          bgImage,
        );

        const bgImageId = response.data.id;
        backgroundImageIds.push(bgImageId);
        console.log(`Created island background image with ID: ${bgImageId}`);

        // Small delay between requests
        await new Promise((resolve) => setTimeout(resolve, 300));
      } catch (error) {
        console.error(`Error creating background image:`, error.response?.data || error.message);
      }
    }

    console.log('\nIsland background images created successfully!');

    // Save background image data for other scripts to use
    saveBackgroundImageData(backgroundImageIds);

    // Sign out
    await api.post(ResourcePrefix.Auth + '/signout', {});
    console.log('Admin signed out successfully.');

    return { backgroundImageIds };
  } catch (error) {
    console.error('Error seeding island background images:', error.response?.data || error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    process.exit(1);
  }
}

// Save background image IDs to the seed-data.json file
function saveBackgroundImageData(backgroundImageIds: string[]) {
  try {
    const filePath = path.join(__dirname, 'seed-data.json');
    let data: SeedData = {};

    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      data = JSON.parse(content) as SeedData;
    }

    data.backgroundImageIds = backgroundImageIds;

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Background image data saved to ${filePath}`);
  } catch (error) {
    console.error('Error saving background image data:', error);
  }
}

// Run if this script is executed directly
if (require.main === module) {
  seedBackgroundImages();
}

export default seedBackgroundImages;
