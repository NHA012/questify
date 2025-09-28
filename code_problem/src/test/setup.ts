import { UserRole, EnvStage, UserStatus } from '@datn242/questify-common';
process.env.POSTGRES_URI = 'sqlite::memory:';
process.env.NODE_ENV = EnvStage.Test;

import { sequelize } from '../config/db';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import { Level } from '../models/level';
import '../models/associations';
import { v4 as uuidv4 } from 'uuid';

/* eslint-disable no-var */
declare global {
  var getAuthCookie: (
    id?: string,
    gmail?: string,
    userName?: string,
    role?: UserRole,
  ) => Promise<string[]>;
  var createLevel: (
    teacherId: string,
    name?: string,
    description?: string,
    position?: number,
  ) => Promise<Level>;
}

beforeAll(async () => {
  process.env.JWT_KEY = 'asdfdsa';

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
  gmail: string = 'test@test.com',
  userName: string = 'username',
  role: UserRole = UserRole.Teacher,
) => {
  // Create a user in the database with this ID
  const user = await User.create({
    id: id,
    gmail: gmail,
    role: role,
    userName: userName,
    status: UserStatus.Active,
  });
  const payload = {
    id: user.id,
    gmail: user.gmail,
    role: user.role,
    userName: userName,
    status: UserStatus.Active,
  };
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  const session = { jwt: token };
  const sessionJSON = JSON.stringify(session);
  const base64 = Buffer.from(sessionJSON).toString('base64');
  return [`session=${base64}`];
};

global.createLevel = async (teacherId: string) => {
  const level = await Level.create({
    teacherId: teacherId,
  });

  return level;
};
