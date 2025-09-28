import { sequelize } from '../config/db';
import { User } from '../models/user';
import { Course } from '../models/course';
import { UserRole, UserStatus, CourseCategory, CourseStatus } from '@datn242/questify-common';

async function seed() {
  try {
    await sequelize.authenticate();
    const teacher = await User.create({
      role: UserRole.Teacher,
      status: UserStatus.Active, // use correct status
    });

    console.log('Teacher user seeded successfully.');
    const course = await Course.create({
      name: 'Introduction to Backend Development',
      description:
        'Learn how to build robust backend systems using Node.js, Express, and PostgreSQL.',
      category: CourseCategory.ITSoftware,
      price: 49.99,
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
      teacherId: teacher.id,
      status: CourseStatus.Approved,
    });

    console.log('Course seeded successfully:', course.id);
  } catch (error) {
    console.error('Error seeding user:', error);
  }
}

seed();
