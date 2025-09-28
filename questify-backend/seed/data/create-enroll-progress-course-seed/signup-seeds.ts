import apiService from '../../services/api-service';
import { UserRole, ResourcePrefix } from '@datn242/questify-common';

const api = apiService.instance;

/**
 * Sign up teacher, student, and admin users
 * This script combines the three separate signup processes into one file
 */
async function signupUsers() {
  console.log('Starting user signup process...');

  try {
    // Sign up teacher
    console.log('\n--- Creating teacher user ---');
    let teacherResponse = await api.post(ResourcePrefix.Auth + '/validate-credentials', {
      email: 'teacher@example.com',
      userName: 'Teacher',
    });
    console.log('Teacher validate credentials successful');

    await new Promise((resolve) => setTimeout(resolve, 500));

    teacherResponse = await api.post(ResourcePrefix.Auth + '/complete-signup', {
      password: '12345aB@',
      confirmedPassword: '12345aB@',
    });
    console.log('Teacher complete signup successful');

    await api.patch(ResourcePrefix.Auth + `/${teacherResponse.data.id}`, {
      role: UserRole.Teacher,
    });
    console.log('Teacher role updated successfully');

    await api.post(ResourcePrefix.Auth + '/signout', {});
    console.log('Teacher signout successful');

    // Sign up student
    console.log('\n--- Creating student user ---');
    await api.post(ResourcePrefix.Auth + '/validate-credentials', {
      email: 'student@example.com',
      userName: 'Student',
    });
    console.log('Student validate credentials successful');

    await new Promise((resolve) => setTimeout(resolve, 500));

    await api.post(ResourcePrefix.Auth + '/complete-signup', {
      password: '12345aB@',
      confirmedPassword: '12345aB@',
    });
    console.log('Student complete signup successful');

    await api.post(ResourcePrefix.Auth + '/signout', {});
    console.log('Student signout successful');

    // Sign up admin
    console.log('\n--- Creating admin user ---');
    let adminResponse = await api.post(ResourcePrefix.Auth + '/validate-credentials', {
      email: 'admin@example.com',
      userName: 'Admin',
    });
    console.log('Admin validate credentials successful');

    await new Promise((resolve) => setTimeout(resolve, 500));

    adminResponse = await api.post(ResourcePrefix.Auth + '/complete-signup', {
      password: '12345aB@',
      confirmedPassword: '12345aB@',
    });
    console.log('Admin complete signup successful');

    await api.patch(ResourcePrefix.Auth + `/${adminResponse.data.id}`, {
      role: UserRole.Admin,
    });
    console.log('Admin role updated successfully');

    await api.post(ResourcePrefix.Auth + '/signout', {});
    console.log('Admin signout successful');

    console.log('\nAll users created successfully!');
  } catch (error) {
    console.error('Error during user signup:', error.response?.data || error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    process.exit(1);
  }
}

// Run if this script is executed directly
if (require.main === module) {
  signupUsers();
}

export default signupUsers;
