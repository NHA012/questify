import apiService from '../../services/api-service';
import { ResourcePrefix } from '@datn242/questify-common';
import fs from 'fs';
import path from 'path';

const api = apiService.instance;

// Data for island templates - keeping only 2 as per your note
const islandTemplates = [
  {
    name: 'Island 1',
    imageUrl:
      'https://firebasestorage.googleapis.com/v0/b/questify-a190e.firebasestorage.app/o/images%2Fislands%2Fisland_1.svg?alt=media&token=66e5e550-021a-48f3-9319-6aa41f5402e0',
  },
  {
    name: 'Island 2',
    imageUrl:
      'https://firebasestorage.googleapis.com/v0/b/questify-a190e.firebasestorage.app/o/images%2Fislands%2Fisland_2.svg?alt=media&token=5bc374af-fc6f-4db5-8613-140b40bfffce',
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

async function seedIslandTemplates() {
  const templateIds: string[] = [];

  try {
    // Login as admin
    console.log('Logging in as admin...');
    await api.post(ResourcePrefix.Auth + '/signin', {
      email: 'admin@example.com',
      password: '12345aB@',
    });
    console.log('Admin login successful.');

    // Create templates
    console.log('\nCreating island templates...');

    for (const template of islandTemplates) {
      try {
        const response = await api.post(`${ResourcePrefix.Admin}/island-templates`, template);

        const templateId = response.data.id;
        templateIds.push(templateId);
        console.log(`Created island template: "${template.name}" with ID: ${templateId}`);

        // Small delay between requests
        await new Promise((resolve) => setTimeout(resolve, 300));
      } catch (error) {
        console.error(
          `Error creating template ${template.name}:`,
          error.response?.data || error.message,
        );
      }
    }

    console.log('\nIsland templates created successfully!');

    // Save template data for other scripts to use
    saveTemplateData(templateIds);

    // Sign out
    await api.post(ResourcePrefix.Auth + '/signout', {});
    console.log('Admin signed out successfully.');

    return { templateIds };
  } catch (error) {
    console.error('Error seeding island templates:', error.response?.data || error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    process.exit(1);
  }
}

// Save template IDs to the seed-data.json file
function saveTemplateData(templateIds: string[]) {
  try {
    const filePath = path.join(__dirname, 'seed-data.json');
    let data: SeedData = {};

    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      data = JSON.parse(content) as SeedData;
    }

    data.templateIds = templateIds;

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Template data saved to ${filePath}`);
  } catch (error) {
    console.error('Error saving template data:', error);
  }
}

// Run if this script is executed directly
if (require.main === module) {
  seedIslandTemplates();
}

export default seedIslandTemplates;
