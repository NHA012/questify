import apiService from '../services/api-service';
import { UserRole, ResourcePrefix } from '@datn242/questify-common';

const api = apiService.instance;

async function seed() {
  try {
    let teacherResponse = await api.post(ResourcePrefix.Auth + '/validate-credentials', {
      email: 'teacher1@example.com',
      userName: 'Teacher1',
    });
    console.log('Validate credentials successful');

    await new Promise((resolve) => setTimeout(resolve, 500));

    teacherResponse = await api.post(ResourcePrefix.Auth + '/complete-signup', {
      password: '12345aB@',
      confirmedPassword: '12345aB@',
    });
    console.log('Complete signup successful');

    await api.patch(ResourcePrefix.Auth + `/${teacherResponse.data.id}`, {
      role: UserRole.Teacher,
    });

    console.log('Teacher user seeded successfully.');

    await api.post(ResourcePrefix.Auth + '/signout', {});
    console.log('Signout successful');
  } catch (error) {
    console.error('Error seeding data:', error.response?.data || error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

seed();
