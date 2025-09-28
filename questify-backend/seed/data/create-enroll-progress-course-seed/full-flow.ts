/**
 * Full Flow Seed Script
 *
 * This script orchestrates the complete seeding process in the following order:
 * 1. Sign up teacher, student, and admin users
 * 2. Create item templates
 * 3. Create island templates (by admin)
 * 4. Create island background images (by admin)
 * 5. Teacher creates a course with islands and levels
 * 6. Student enrolls in the course
 * 7. Update student progress to simulate course activity
 *
 */
import { execSync } from 'child_process';
import path from 'path';

async function runFullFlowSeed() {
  try {
    console.log('=== QUESTIFY FULL SEEDING PROCESS ===');

    // Step 1: Sign up users
    console.log('\n[1/7] Creating users (teacher, student, admin)...');
    execSync('ts-node ' + path.join(__dirname, 'signup-seeds.ts'), { stdio: 'inherit' });

    // Step 2: Create item templates
    console.log('\n[2/7] Creating item templates...');
    execSync('ts-node ' + path.join(__dirname, 'item-templates-seed.ts'), { stdio: 'inherit' });

    // Step 3: Create island templates
    console.log('\n[3/7] Creating island templates...');
    execSync('ts-node ' + path.join(__dirname, 'island-templates-seed.ts'), { stdio: 'inherit' });

    // Step 4: Create island background images
    console.log('\n[4/7] Creating island background images...');
    execSync('ts-node ' + path.join(__dirname, 'island-background-images-seed.ts'), {
      stdio: 'inherit',
    });

    // Step 5: Teacher creates course, islands, and levels
    console.log('\n[5/7] Creating course with islands and levels...');
    execSync('ts-node ' + path.join(__dirname, 'teacher-course-seed.ts'), { stdio: 'inherit' });

    // Step 6: Student enrolls in course
    console.log('\n[6/7] Student enrolling in course...');
    execSync('ts-node ' + path.join(__dirname, 'student-enroll-seed.ts'), { stdio: 'inherit' });

    // Step 7: Update student progress
    console.log('\n[7/7] Updating student progress...');
    execSync('ts-node ' + path.join(__dirname, 'student-progress-seed.ts'), { stdio: 'inherit' });

    console.log('\n=== SEEDING COMPLETED SUCCESSFULLY ===');
  } catch (error) {
    console.error('Error during seeding process:', error);
    process.exit(1);
  }
}

runFullFlowSeed();
