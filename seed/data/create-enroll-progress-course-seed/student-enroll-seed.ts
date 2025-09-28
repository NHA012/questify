import apiService from '../../services/api-service';
import { ResourcePrefix } from '@datn242/questify-common';
import fs from 'fs';
import path from 'path';

const api = apiService.instance;

// Define an interface for the course data
interface CourseData {
  courseId: string;
  islandIds?: string[];
  studentId?: string;
}

/**
 * Student enrolls in the course
 * - Reads course ID from seed-data.json
 * - Logs in as student
 * - Enrolls in the course (this automatically creates UserCourse, UserIslands, and UserLevels)
 */
async function seedStudentEnrollment() {
  try {
    // Load course data
    const courseData = loadCourseData();
    if (!courseData || !courseData.courseId) {
      console.error('No course data found. Please run teacher-course-seed.ts first.');
      process.exit(1);
    }

    const courseId = courseData.courseId;

    // Login as student
    console.log('Logging in as student...');
    await api.post(ResourcePrefix.Auth + '/signin', {
      email: 'student@example.com',
      password: '12345aB@',
    });
    console.log('Student login successful.');

    // Get current user ID
    const currentUserResponse = await api.get(ResourcePrefix.Auth + '/currentuser');
    const studentId = currentUserResponse.data.currentUser.id;
    console.log(`Student ID: ${studentId}`);

    // Enroll in course
    console.log(`\nEnrolling in course: ${courseId}...`);
    await api.post(ResourcePrefix.CourseManagement + `/${courseId}/enrollment`, {});
    console.log(`Enrollment successful in course ${courseId}`);

    // Save student ID to course data
    courseData.studentId = studentId;
    saveCourseData(courseData);

    // Sign out
    await api.post(ResourcePrefix.Auth + '/signout', {});
    console.log('Student signed out successfully.');
  } catch (error) {
    console.error('Error during student enrollment:', error.response?.data || error.message);
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

// Helper function to save course data to JSON file
function saveCourseData(data: CourseData): void {
  try {
    const filePath = path.join(__dirname, 'seed-data.json');
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Updated course data saved to ${filePath}`);
  } catch (error) {
    console.error('Error saving course data:', error);
  }
}

// Run if this script is executed directly
if (require.main === module) {
  seedStudentEnrollment();
}

export default seedStudentEnrollment;
