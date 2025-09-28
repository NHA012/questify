import apiService from '../../services/api-service';
import {
  CourseCategory,
  ResourcePrefix,
  IslandPathType,
  CourseStatus,
} from '@datn242/questify-common';
import fs from 'fs';
import path from 'path';

const api = apiService.instance;

// Define interface for seed data
interface SeedData {
  courseId?: string;
  islandIds?: string[];
  studentId?: string;
  templateIds?: string[];
  backgroundImageIds?: string[];
}

/**
 * Create a course with islands and levels as a teacher
 * - Creates 1 course
 * - Creates 4 islands
 * - Creates 5 levels for each island
 */
async function seedTeacherCourse() {
  // const courseId = '';
  const islandIds: string[] = [];

  try {
    // Load seed data with templates and background images
    const seedData = loadSeedData();
    if (!seedData) {
      console.error('No seed data found. Please run template and background image seeds first.');
      process.exit(1);
    }

    // Login as teacher
    console.log('Logging in as teacher...');
    await api.post(ResourcePrefix.Auth + '/signin', {
      email: 'teacher@example.com',
      password: '12345aB@',
    });
    console.log('Teacher login successful.');

    // Create a course
    console.log('\nCreating course...');
    const courseResponse = await api.post(ResourcePrefix.CourseManagement, {
      name: 'Introduction to Backend Development',
      shortDescription: 'A comprehensive course on backend development using Node.js and Express.',
      description:
        'Learn how to build robust backend systems using Node.js, Express, and PostgreSQL. This course covers REST APIs, database management, and authentication techniques. You will also learn how to deploy your applications and manage server environments. By the end of this course, you will have a solid understanding of backend development and be able to create your own web applications.',
      category: CourseCategory.ITSoftware,
      price: 49.99,
      thumbnail:
        'https://firebasestorage.googleapis.com/v0/b/questify-a190e.firebasestorage.app/o/images%2Flanding_page%2FCourse%20Images%20(1).png?alt=media&token=a43b06ef-e639-4ea8-aff7-537554e2ef45',
      backgroundImage:
        'https://firebasestorage.googleapis.com/v0/b/questify-a190e.firebasestorage.app/o/images%2Fislands%2Fbackground.png?alt=media&token=6881fef8-d3fd-4bcb-99c0-bad208f4ee70',
      learningObjectives: [
        'Understand REST APIs',
        'Work with databases',
        'Authentication & Authorization',
      ],
      requirements: ['Basic JavaScript knowledge', 'Git and terminal usage'],
      targetAudience: [
        'Aspiring backend developers',
        'Frontend developers looking to go fullstack',
      ],
      status: CourseStatus.Pending,
    });

    const course = courseResponse.data;
    const courseId = course.id;
    console.log('Course created successfully with ID:', courseId);

    // Create a course
    console.log('\nCreating course...');
    const courseResponse2 = await api.post(ResourcePrefix.CourseManagement, {
      name: 'Introduction to Frontend Development',
      shortDescription: 'A comprehensive course on backend development using Node.js and Express.',
      description:
        'Learn how to build robust backend systems using Node.js, Express, and PostgreSQL. This course covers REST APIs, database management, and authentication techniques. You will also learn how to deploy your applications and manage server environments. By the end of this course, you will have a solid understanding of backend development and be able to create your own web applications.',
      category: CourseCategory.ITSoftware,
      price: 49.99,
      thumbnail:
        'https://firebasestorage.googleapis.com/v0/b/questify-a190e.firebasestorage.app/o/images%2Flanding_page%2FCourse%20Images%20(2).png?alt=media&token=2f7217f9-3282-48c9-b238-256f9b953eda',
      backgroundImage:
        'https://cdn.builder.io/api/v1/image/assets/TEMP/dfb32da73c8310560baa7041ffee9d62e89ca8f3',
      learningObjectives: [
        'Understand REST APIs',
        'Work with databases',
        'Authentication & Authorization',
      ],
      requirements: ['Basic JavaScript knowledge', 'Git and terminal usage'],
      targetAudience: [
        'Aspiring backend developers',
        'Frontend developers looking to go fullstack',
      ],
      status: CourseStatus.Approved,
    });

    const course2 = courseResponse2.data;
    const courseId2 = course2.id;
    console.log('Course created successfully with ID:', courseId2);

    // Create a course
    console.log('\nCreating course...');
    const courseResponse3 = await api.post(ResourcePrefix.CourseManagement, {
      name: 'Introduction to Frontend Development',
      shortDescription: 'A comprehensive course on backend development using Node.js and Express.',
      description:
        'Learn how to build robust backend systems using Node.js, Express, and PostgreSQL. This course covers REST APIs, database management, and authentication techniques. You will also learn how to deploy your applications and manage server environments. By the end of this course, you will have a solid understanding of backend development and be able to create your own web applications.',
      category: CourseCategory.ITSoftware,
      price: 49.99,
      thumbnail:
        'https://firebasestorage.googleapis.com/v0/b/questify-a190e.firebasestorage.app/o/images%2Flanding_page%2FCourse%20Images%20(3).png?alt=media&token=294c21da-73ce-4678-83e1-351ac1947ed1',
      backgroundImage:
        'https://cdn.builder.io/api/v1/image/assets/TEMP/dfb32da73c8310560baa7041ffee9d62e89ca8f3',
      learningObjectives: [
        'Understand REST APIs',
        'Work with databases',
        'Authentication & Authorization',
      ],
      requirements: ['Basic JavaScript knowledge', 'Git and terminal usage'],
      targetAudience: [
        'Aspiring backend developers',
        'Frontend developers looking to go fullstack',
      ],
      status: CourseStatus.Rejected,
    });

    const course3 = courseResponse3.data;
    const courseId3 = course3.id;
    console.log('Course created successfully with ID:', courseId3);

    // Create a course
    console.log('\nCreating course...');
    const courseResponse4 = await api.post(ResourcePrefix.CourseManagement, {
      name: 'Introduction to Frontend Development',
      shortDescription: 'A comprehensive course on backend development using Node.js and Express.',
      description:
        'Learn how to build robust backend systems using Node.js, Express, and PostgreSQL. This course covers REST APIs, database management, and authentication techniques. You will also learn how to deploy your applications and manage server environments. By the end of this course, you will have a solid understanding of backend development and be able to create your own web applications.',
      category: CourseCategory.ITSoftware,
      price: 49.99,
      thumbnail:
        'https://firebasestorage.googleapis.com/v0/b/questify-a190e.firebasestorage.app/o/images%2Flanding_page%2FCourse%20Images%20(3).png?alt=media&token=294c21da-73ce-4678-83e1-351ac1947ed1',
      backgroundImage:
        'https://cdn.builder.io/api/v1/image/assets/TEMP/dfb32da73c8310560baa7041ffee9d62e89ca8f3',
      learningObjectives: [
        'Understand REST APIs',
        'Work with databases',
        'Authentication & Authorization',
      ],
      requirements: ['Basic JavaScript knowledge', 'Git and terminal usage'],
      targetAudience: [
        'Aspiring backend developers',
        'Frontend developers looking to go fullstack',
      ],
      status: CourseStatus.Pending,
    });

    const course4 = courseResponse4.data;
    const courseId4 = course4.id;
    console.log('Course created successfully with ID:', courseId4);

    // Create a course
    console.log('\nCreating course...');
    const courseResponse5 = await api.post(ResourcePrefix.CourseManagement, {
      name: 'Introduction to Frontend Development',
      shortDescription: 'A comprehensive course on backend development using Node.js and Express.',
      description:
        'Learn how to build robust backend systems using Node.js, Express, and PostgreSQL. This course covers REST APIs, database management, and authentication techniques. You will also learn how to deploy your applications and manage server environments. By the end of this course, you will have a solid understanding of backend development and be able to create your own web applications.',
      category: CourseCategory.ITSoftware,
      price: 49.99,
      thumbnail:
        'https://firebasestorage.googleapis.com/v0/b/questify-a190e.firebasestorage.app/o/images%2Flanding_page%2FCourse%20Images%20(3).png?alt=media&token=294c21da-73ce-4678-83e1-351ac1947ed1',
      backgroundImage:
        'https://cdn.builder.io/api/v1/image/assets/TEMP/dfb32da73c8310560baa7041ffee9d62e89ca8f3',
      learningObjectives: [
        'Understand REST APIs',
        'Work with databases',
        'Authentication & Authorization',
      ],
      requirements: ['Basic JavaScript knowledge', 'Git and terminal usage'],
      targetAudience: [
        'Aspiring backend developers',
        'Frontend developers looking to go fullstack',
      ],
      status: CourseStatus.Pending,
    });

    const course5 = courseResponse5.data;
    const courseId5 = course5.id;
    console.log('Course created successfully with ID:', courseId5);

    // Create islands
    console.log('\nCreating islands...');

    const islandNames = [
      {
        name: 'REST API Basics',
        description: 'Learn the fundamentals of RESTful APIs',
        pathType: IslandPathType.ForestPath,
      },
      {
        name: 'Database Integration',
        description: 'Connect your API to databases',
        pathType: IslandPathType.DesertPath,
      },
      {
        name: 'Authentication',
        description: 'Implement secure authentication',
        pathType: IslandPathType.IcePath,
      },
      {
        name: 'Deployment',
        description: 'Deploy your backend to production',
        pathType: IslandPathType.ForestPath,
      },
    ];

    for (let i = 0; i < islandNames.length; i++) {
      const { name, description, pathType } = islandNames[i];

      // Get random template ID - we only have 2 templates as per your note
      const templateIndex = i % 2; // Alternate between 0 and 1
      const islandTemplateId = seedData.templateIds ? seedData.templateIds[templateIndex] : null;

      // Map path types to specific background images (3 backgrounds available)
      let islandBackgroundImageId = null;
      if (seedData.backgroundImageIds && seedData.backgroundImageIds.length > 0) {
        if (pathType === IslandPathType.DesertPath) {
          // Desert path uses desert background (index 0)
          islandBackgroundImageId = seedData.backgroundImageIds[0];
        } else if (pathType === IslandPathType.ForestPath) {
          // Forest path uses forest background (index 1)
          islandBackgroundImageId = seedData.backgroundImageIds[1];
        } else if (pathType === IslandPathType.IcePath) {
          // Ice path uses mountain background (index 2) as requested
          islandBackgroundImageId = seedData.backgroundImageIds[2];
        }
      }

      // Determine prerequisites for this island
      const prerequisiteIslandIds = [];
      if (i === 2) {
        // Authentication island has first two islands as prerequisites
        prerequisiteIslandIds.push(islandIds[0], islandIds[1]);
      } else if (i === 3) {
        // Deployment island has first island as prerequisite
        prerequisiteIslandIds.push(islandIds[0]);
      }

      // Create island
      const islandResponse = await api.post(
        ResourcePrefix.CourseManagement + `/${courseId}/islands`,
        {
          name,
          description,
          pathType,
          islandTemplateId,
          islandBackgroundImageId,
          ...(prerequisiteIslandIds.length > 0 && { prerequisiteIslandIds }),
        },
      );

      const island = islandResponse.data;
      islandIds.push(island.id);
      console.log(`Island created: "${name}" with ID: ${island.id}`);
      console.log(`  Path type: ${pathType}`);
      console.log(`  Template ID: ${islandTemplateId || 'none'}`);
      console.log(`  Background Image ID: ${islandBackgroundImageId || 'none'}`);

      // Add a delay after creating each island to allow the event to be processed
      // This helps ensure islands exist before prerequisite relationships are created
      console.log(`Waiting for island creation event to be processed...`);
      await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 second delay

      // Add a delay after creating each island to allow the event to be processed
      // This helps ensure islands exist before prerequisite relationships are created
      console.log(`Waiting for island creation event to be processed...`);
      await new Promise((resolve) => setTimeout(resolve, 3000)); // 3 second delay

      // Create 5 levels for this island
      await createLevelsForIsland(island.id, name);
    }

    console.log('\nCourse, islands, and levels created successfully!');

    // Save course data for other scripts to use
    saveCourseData(courseId, islandIds, seedData);

    // Sign out
    await api.post(ResourcePrefix.Auth + '/signout', {});
    console.log('Teacher signed out successfully.');

    // Return the course and island IDs for use in other seed scripts
    return { courseId, islandIds };
  } catch (error) {
    console.error('Error seeding teacher course data:', error.response?.data || error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    process.exit(1);
  }
}

/**
 * Creates 5 levels for a specific island
 */
async function createLevelsForIsland(islandId: string, islandName: string) {
  // The existing implementation stays the same
  console.log(`\nCreating levels for island: ${islandName}...`);

  // Define level content based on island name/type
  let levelNames: string[] = [];
  let levelDescriptions: string[] = [];

  if (islandName.includes('REST API')) {
    levelNames = [
      'HTTP Fundamentals',
      'API Design Principles',
      'Building Your First Endpoint',
      'Request/Response Handling',
      'API Testing & Documentation',
    ];
    levelDescriptions = [
      'Learn about HTTP methods, status codes, and headers',
      'Best practices for designing RESTful APIs',
      'Create and implement your first API endpoint',
      'Process requests and format responses properly',
      'Test your API and create documentation',
    ];
  } else if (islandName.includes('Database')) {
    levelNames = [
      'Database Basics',
      'ORM Introduction',
      'Data Modeling',
      'CRUD Operations',
      'Advanced Queries',
    ];
    levelDescriptions = [
      'Understand different database types and when to use them',
      'Learn about Object-Relational Mapping libraries',
      'Design efficient data models for your application',
      'Implement Create, Read, Update, Delete operations',
      'Master complex queries and database optimizations',
    ];
  } else if (islandName.includes('Authentication')) {
    levelNames = [
      'Authentication vs Authorization',
      'User Registration & Login',
      'JWT Implementation',
      'Password Security',
      'OAuth Integration',
    ];
    levelDescriptions = [
      'Understand the difference between authentication and authorization',
      'Create secure user registration and login flows',
      'Implement JSON Web Tokens for stateless authentication',
      'Best practices for password hashing and security',
      'Integrate third-party OAuth providers',
    ];
  } else if (islandName.includes('Deployment')) {
    levelNames = [
      'Environment Setup',
      'Containerization with Docker',
      'CI/CD Pipelines',
      'Cloud Deployment',
      'Monitoring & Scaling',
    ];
    levelDescriptions = [
      'Set up development, testing, and production environments',
      'Package your application using Docker containers',
      'Implement continuous integration and deployment',
      'Deploy your application to cloud providers',
      'Monitor performance and scale your application',
    ];
  } else {
    // Default level names and descriptions
    levelNames = ['Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5'];
    levelDescriptions = [
      'Introduction to the basics',
      'Building on fundamentals',
      'Intermediate concepts',
      'Advanced techniques',
      'Mastery and application',
    ];
  }

  // Create the levels
  for (let i = 0; i < 5; i++) {
    try {
      await api.post(ResourcePrefix.CourseManagement + `/islands/${islandId}/level`, {
        name: levelNames[i],
        description: levelDescriptions[i],
        position: i,
      });
      console.log(`Created level: "${levelNames[i]}"`);

      // Small delay between requests
      await new Promise((resolve) => setTimeout(resolve, 300));
    } catch (error) {
      console.error(`Error creating level ${i + 1}:`, error.response?.data || error.message);
    }
  }
}

// Load seed data including templates and background images
function loadSeedData(): SeedData | null {
  try {
    const filePath = path.join(__dirname, 'seed-data.json');
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data) as SeedData;
    }
    return null;
  } catch (error) {
    console.error('Error loading seed data:', error);
    return null;
  }
}

// Save course data to a JSON file for use in other seed scripts
function saveCourseData(courseId: string, islandIds: string[], existingData: SeedData | null) {
  try {
    const filePath = path.join(__dirname, 'seed-data.json');
    const data: SeedData = existingData || {};

    data.courseId = courseId;
    data.islandIds = islandIds;

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Course data saved to ${filePath}`);
  } catch (error) {
    console.error('Error saving course data:', error);
  }
}

// Run if this script is executed directly
if (require.main === module) {
  seedTeacherCourse();
}

export default seedTeacherCourse;
