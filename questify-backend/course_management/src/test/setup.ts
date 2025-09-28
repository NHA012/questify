import { UserRole, EnvStage, UserStatus } from '@datn242/questify-common';
process.env.POSTGRES_URI = 'sqlite::memory:';
process.env.NODE_ENV = EnvStage.Test;
import '../models/associations';

import { sequelize } from '../config/db';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import '../models/associations';

jest.mock('../nats-wrapper');

/* eslint-disable no-var */
declare global {
  var getAuthCookie: (gmail?: string) => Promise<string[]>;
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

global.getAuthCookie = async () => {
  // Create a user in the database with this ID
  const user = await User.create({
    role: UserRole.Teacher,
    status: UserStatus.Active,
  });
  const payload = {
    id: user.id,
    role: user.role,
    status: user.status,
  };
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  const session = { jwt: token };
  const sessionJSON = JSON.stringify(session);
  const base64 = Buffer.from(sessionJSON).toString('base64');
  return [`session=${base64}`];
};
