import apiService from '../services/api-service';
import { CourseCategory, ResourcePrefix } from '@datn242/questify-common';

const api = apiService.instance;

// blocker: need to run signup-teacher.ts and signup-student.ts first

async function seed() {
  try {
    await api.post(ResourcePrefix.Auth + '/signin', {
      email: 'teacher1@example.com',
      password: '12345aB@',
    });

    console.log('Teacher login successfully.');

    const courseResponse = await api.post(ResourcePrefix.CourseManagement, {
      name: 'Introduction to Backend Development',
      shortDescription: 'A comprehensive course on backend development using Node.js and Express.',
      description:
        'Learn how to build robust backend systems using Node.js, Express, and PostgreSQL. This course covers REST APIs, database management, and authentication techniques. You will also learn how to deploy your applications and manage server environments. By the end of this course, you will have a solid understanding of backend development and be able to create your own web applications.',
      category: CourseCategory.ITSoftware,
      price: 49.99,
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
    });

    const course = courseResponse.data;
    console.log('Course seeded successfully:', course.id);

    const island1Response = await api.post(
      ResourcePrefix.CourseManagement + `/${course.id}/islands`,
      {
        name: '1',
        description: 'First Island',
      },
    );

    await new Promise((resolve) => setTimeout(resolve, 3000));

    const island1 = island1Response.data;

    const island2Response = await api.post(
      ResourcePrefix.CourseManagement + `/${course.id}/islands`,
      {
        name: '2',
        description: 'Second Island',
      },
    );

    await new Promise((resolve) => setTimeout(resolve, 3000));

    const island2 = island2Response.data;

    await api.post(ResourcePrefix.CourseManagement + `/${course.id}/islands`, {
      name: '3',
      description: 'Third Island',
      prerequisiteIslandIds: [island1.id, island2.id],
    });

    await new Promise((resolve) => setTimeout(resolve, 3000));

    await api.post(ResourcePrefix.CourseManagement + `/${course.id}/islands`, {
      name: '4',
      description: 'Fourth Island',
      prerequisiteIslandIds: [island1.id],
    });

    await new Promise((resolve) => setTimeout(resolve, 3000));

    console.log('Islands seeded successfully.');

    apiService.clearCookies();
    await api.post(ResourcePrefix.Auth + '/signout', {});
    console.log('Signed out successfully');

    apiService.clearCookies();
    await api.post(ResourcePrefix.Auth + '/signin', {
      email: 'student@example.com',
      password: '12345aB@',
    });

    console.log('Student login successfully.');

    await api.post(ResourcePrefix.CourseManagement + `/${course.id}/enrollment`, {});
    console.log(`Enroll successfully in course ${course.id}`);

    await api.post(ResourcePrefix.Auth + '/signout', {});
    console.log('Student sign out successful');
  } catch (error) {
    console.error('Error seeding data:', error.response?.data || error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

seed();
