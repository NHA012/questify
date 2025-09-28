import { UserRole, EnvStage, UserStatus, CourseStatus } from '@datn242/questify-common';
import { AdminCourseActionType } from '../models/admin-course';
import { AdminIslandTemplateActionType } from '../models/admin-island-template';
import { AdminActionType } from '../models/admin-user';

process.env.POSTGRES_URI = 'sqlite::memory:';
process.env.NODE_ENV = EnvStage.Test;
import { sequelize } from '../config/db';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import { Course } from '../models/course';
import { IslandTemplate } from '../models/island-template';
import { AdminUser } from '../models/admin-user';
import { AdminCourse } from '../models/admin-course';
import { AdminIslandTemplate } from '../models/admin-island-template';
import '../models/associations';
import { v4 as uuidv4 } from 'uuid';

/* eslint-disable no-var */
declare global {
  var getAuthCookie: (
    id?: string,
    gmail?: string,
    userName?: string,
    role?: UserRole,
    status?: UserStatus,
  ) => Promise<string[]>;

  var createUser: (
    id?: string,
    gmail?: string,
    userName?: string,
    role?: UserRole,
    status?: UserStatus,
  ) => Promise<User>;

  var createCourse: (
    teacherId: string,
    name?: string,
    description?: string,
    status?: CourseStatus,
  ) => Promise<Course>;

  var createIslandTemplate: (name?: string, imageUrl?: string) => Promise<IslandTemplate>;

  var createAdminUserAction: (
    adminId: string,
    userId: string,
    actionType?: AdminActionType,
    reason?: string,
  ) => Promise<AdminUser>;

  var createAdminCourseAction: (
    adminId: string,
    courseId: string,
    actionType?: AdminCourseActionType,
    reason?: string,
  ) => Promise<AdminCourse>;

  var createAdminIslandTemplateAction: (
    adminId: string,
    islandTemplateId: string,
    actionType?: AdminIslandTemplateActionType,
    reason?: string,
  ) => Promise<AdminIslandTemplate>;
}

beforeAll(async () => {
  process.env.JWT_KEY = 'test-jwt-key';
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
  } catch (err) {
    console.error('Error initializing SQLite:', err);
    throw err;
  }
});

beforeEach(async () => {
  try {
    // Disable foreign key constraints
    await sequelize.query('PRAGMA foreign_keys = OFF;');
    // This will truncate tables but not drop/recreate them
    await Promise.all(
      Object.values(sequelize.models).map((model) =>
        model.destroy({ truncate: true, cascade: true }),
      ),
    );
    // Re-enable foreign key constraints
    await sequelize.query('PRAGMA foreign_keys = ON;');
  } catch (err) {
    console.error('Error clearing SQLite tables:', err);
    throw err;
  }
});

afterAll(async () => {
  await sequelize.close();
});

global.getAuthCookie = async (
  id: string = uuidv4(),
  gmail: string = 'admin@test.com',
  userName: string = 'admin',
  role: UserRole = UserRole.Admin,
  status: UserStatus = UserStatus.Active,
) => {
  // Create a user in the database with this ID
  const user = await User.create({
    id: id,
    gmail: gmail,
    role: role,
    userName: userName,
    status: status,
  });

  const payload = {
    id: user.id,
    gmail: user.gmail,
    role: user.role,
    userName: userName,
    status: status,
  };

  const token = jwt.sign(payload, process.env.JWT_KEY!);
  const session = { jwt: token };
  const sessionJSON = JSON.stringify(session);
  const base64 = Buffer.from(sessionJSON).toString('base64');

  return [`session=${base64}`];
};

global.createUser = async (
  id: string = uuidv4(),
  gmail: string = 'user@test.com',
  userName: string = 'testuser',
  role: UserRole = UserRole.Student,
  status: UserStatus = UserStatus.Active,
) => {
  const user = await User.create({
    id,
    gmail,
    role,
    userName,
    status,
  });

  return user;
};

global.createCourse = async (
  teacherId: string,
  name: string = 'Test Course',
  description: string = 'Test Course Description',
  status: CourseStatus = CourseStatus.Pending,
) => {
  const course = await Course.create({
    name,
    description,
    teacherId,
    status,
  });

  return course;
};

global.createIslandTemplate = async (
  name: string = 'Test Island Template',
  imageUrl: string = 'https://example.com/image.png',
) => {
  const islandTemplate = await IslandTemplate.create({
    name,
    imageUrl,
  });

  return islandTemplate;
};

global.createAdminUserAction = async (
  adminId: string,
  userId: string,
  actionType: AdminActionType = AdminActionType.Suspend,
  reason: string = 'Test reason',
) => {
  const adminUserAction = await AdminUser.create({
    adminId,
    userId,
    actionType,
    reason,
  });

  return adminUserAction;
};

global.createAdminCourseAction = async (
  adminId: string,
  courseId: string,
  actionType: AdminCourseActionType = AdminCourseActionType.Approve,
  reason: string = 'Test reason',
) => {
  const adminCourseAction = await AdminCourse.create({
    adminId,
    courseId,
    actionType,
    reason,
  });

  return adminCourseAction;
};

global.createAdminIslandTemplateAction = async (
  adminId: string,
  islandTemplateId: string,
  actionType: AdminIslandTemplateActionType = AdminIslandTemplateActionType.Add,
  reason: string = 'Test reason',
) => {
  const adminIslandTemplateAction = await AdminIslandTemplate.create({
    adminId,
    islandTemplateId,
    actionType,
    reason,
  });

  return adminIslandTemplateAction;
};
