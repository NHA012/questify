import { sequelize } from '../config/db';
import { User } from '../models/user';
import { UserRole, UserStatus } from '@datn242/questify-common';

async function seed() {
  try {
    await sequelize.authenticate();
    await User.create({
      role: UserRole.Teacher,
      status: UserStatus.Active, // use correct status
    });

    console.log('Teacher user seeded successfully.');
  } catch (error) {
    console.error('Error seeding user:', error);
  }
}

seed();
