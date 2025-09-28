import { UserRole, EnvStage, UserStatus } from '@datn242/questify-common';
process.env.POSTGRES_URI = 'sqlite::memory:';
process.env.NODE_ENV = EnvStage.Test;
import '../models/associations';

import { sequelize } from '../config/db';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';

/* eslint-disable no-var */
declare global {
  var getAuthCookie: (gmail?: string, role?: UserRole) => Promise<string[]>;
}

beforeAll(async () => {
  process.env.JWT_KEY = 'asdfdsa';
});

beforeEach(async () => {
  await sequelize.drop();
  await sequelize.sync();
});

afterAll(async () => {
  await sequelize.close();
});

global.getAuthCookie = async (
  gmail: string = 'test@test.com',
  role: UserRole = UserRole.Teacher,
) => {
  // Create a user in the database with this ID
  const user = await User.create({
    gmail: gmail,
    role: role,
    userName: 'test',
    status: UserStatus.Active,
  });

  const payload = {
    id: user.id,
    gmail: user.gmail,
    role: user.role,
    userName: user.userName,
    status: user.status,
  };
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  const session = { jwt: token };
  const sessionJSON = JSON.stringify(session);
  const base64 = Buffer.from(sessionJSON).toString('base64');
  return [`session=${base64}`];
};
