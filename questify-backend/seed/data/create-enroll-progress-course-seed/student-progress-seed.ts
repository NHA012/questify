import apiService from '../../services/api-service';
import { CompletionStatus, ResourcePrefix } from '@datn242/questify-common';
import fs from 'fs';
import path from 'path';

const api = apiService.instance;

// Define interfaces for type safety
interface CourseData {
  courseId: string;
  studentId: string;
  islandIds: string[];
}

interface Island {
  id: string;
  name: string;
}

interface UserLevel {
  levelId: string;
  [key: string]: unknown;
}

interface LevelUpdateData {
  point: number;
  completion_status: CompletionStatus;
  finished_date?: string;
}

/**
 * Update student progress
 * - Reads course and student IDs from seed-data.json
 * - Updates level completion status to simulate course activity
 * - REST API Basics island: All levels completed
 * - Database Integration island: 2 levels completed, 1 in progress, others locked
 * - Authentication island: All levels locked (default)
 * - Deployment island: All levels locked (default)
 */
async function seedStudentProgress() {
  try {
    // Load course data
    const courseData = loadCourseData();
    if (!courseData || !courseData.courseId || !courseData.studentId || !courseData.islandIds) {
      console.error('Incomplete course data. Please run previous seed scripts first.');
      process.exit(1);
    }

    const { courseId, studentId } = courseData;
    // islandIds is validated above but not directly used in this function

    // Login as student
    console.log('Logging in as student...');
    await api.post(ResourcePrefix.Auth + '/signin', {
      email: 'student@example.com',
      password: '12345aB@',
    });
    console.log('Student login successful.');

    // Get island information to know which island is which
    console.log('\nFetching island information...');
    const islands = await getIslandInfo(courseId);

    if (!islands || islands.length === 0) {
      console.error('Failed to fetch island information');
      process.exit(1);
    }

    // Find REST API Basics island
    const restApiIsland = islands.find((island) => island.name.includes('REST API'));

    if (!restApiIsland) {
      console.error('REST API Basics island not found');
      process.exit(1);
    }

    console.log(`\nFound REST API Basics island: ${restApiIsland.id}`);

    // Find Database Integration island
    const dbIsland = islands.find((island) => island.name.includes('Database'));

    if (!dbIsland) {
      console.error('Database Integration island not found');
      process.exit(1);
    }

    console.log(`Found Database Integration island: ${dbIsland.id}`);

    // Get levels for REST API Basics island
    const restApiLevels = await getUserLevelsForIsland(restApiIsland.id);

    // Mark all REST API Basics levels as completed
    console.log('\nUpdating REST API Basics levels (All completed)...');
    for (let i = 0; i < restApiLevels.length; i++) {
      const points = 100 - i * 5; // Decreasing points for each level
      const finishedDate = new Date();
      finishedDate.setDate(finishedDate.getDate() - (restApiLevels.length - i));

      // Format date as 'YYYY-MM-DD'
      const year = finishedDate.getFullYear();
      const month = String(finishedDate.getMonth() + 1).padStart(2, '0');
      const day = String(finishedDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;

      await updateLevelStatus(
        studentId,
        restApiLevels[i].levelId,
        CompletionStatus.Completed,
        points,
        formattedDate,
      );
    }

    // Get levels for Database Integration island
    const dbLevels = await getUserLevelsForIsland(dbIsland.id);

    // Update Database Integration island levels (2 completed, 1 in progress, rest locked)
    console.log(
      '\nUpdating Database Integration levels (2 completed, 1 in progress, others locked)...',
    );

    if (dbLevels.length >= 3) {
      // First 2 levels completed
      for (let i = 0; i < 2; i++) {
        const points = 90 - i * 5; // Decreasing points
        const finishedDate = new Date();
        finishedDate.setDate(finishedDate.getDate() - (2 - i));

        // Format date as 'YYYY-MM-DD'
        const year = finishedDate.getFullYear();
        const month = String(finishedDate.getMonth() + 1).padStart(2, '0');
        const day = String(finishedDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        await updateLevelStatus(
          studentId,
          dbLevels[i].levelId,
          CompletionStatus.Completed,
          points,
          formattedDate,
        );
      }

      console.log(
        `Levels 1-2 completed, level 3 in progress, levels ${dbLevels.length > 3 ? '4-' + dbLevels.length : ''} remain locked`,
      );
    } else {
      console.warn(
        `Database Integration island has fewer than 3 levels (found ${dbLevels.length})`,
      );
    }

    // All other islands will maintain their default status:
    // - Authentication: all levels locked (default)
    // - Deployment: all levels locked (default)
    console.log('\nLeaving remaining islands with default status:');
    console.log('- Authentication: All levels locked (default)');
    console.log('- Deployment: All levels locked (default)');

    console.log('\nStudent progress updated successfully!');

    // Sign out
    await api.post(ResourcePrefix.Auth + '/signout', {});
    console.log('Student signed out successfully.');
  } catch (error) {
    console.error('Error updating student progress:', error.response?.data || error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    process.exit(1);
  }
}

// Helper function to load course data from JSON file
function loadCourseData(): CourseData | null {
  try {
    const filePath = path.join(__dirname, 'seed-data.json');
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data) as CourseData;
    }
    return null;
  } catch (error) {
    console.error('Error loading course data:', error);
    return null;
  }
}

// Helper function to get island information
async function getIslandInfo(courseId: string): Promise<Island[]> {
  try {
    const response = await api.get(ResourcePrefix.CourseManagement + `/${courseId}/islands`);
    return response.data;
  } catch (error) {
    console.error('Error fetching island information:', error.response?.data || error.message);
    return [];
  }
}

// Helper function to get user levels for an island
async function getUserLevelsForIsland(islandId: string): Promise<UserLevel[]> {
  try {
    const response = await api.get(ResourcePrefix.CourseLearning + `/roadmap/islands/${islandId}`);
    console.log(`Fetched ${response.data.userLevels.length} levels for island ${islandId}`);
    return response.data.userLevels;
  } catch (error) {
    console.error(
      `Error fetching levels for island ${islandId}:`,
      error.response?.data || error.message,
    );
    return [];
  }
}

// Helper function to update a single level's status
async function updateLevelStatus(
  studentId: string,
  levelId: string,
  status: CompletionStatus,
  points: number,
  finishedDate?: string,
): Promise<void> {
  try {
    const updateData: LevelUpdateData = {
      point: points,
      completion_status: status,
    };

    if (finishedDate) {
      updateData.finished_date = finishedDate;
    }

    await api.patch(
      ResourcePrefix.CourseLearning + `/progress/students/${studentId}/levels/${levelId}`,
      updateData,
    );

    console.log(
      `Updated level ${levelId} to ${status} with ${points} points${finishedDate ? ' and completion date' : ''}`,
    );

    // Small delay between requests
    await new Promise((resolve) => setTimeout(resolve, 300));
  } catch (error) {
    console.error(`Error updating level ${levelId}:`, error.response?.data || error.message);
  }
}

// Run if this script is executed directly
if (require.main === module) {
  seedStudentProgress();
}

export default seedStudentProgress;
