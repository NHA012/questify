import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';

jest.mock('../nats-wrapper');
/* eslint-disable no-var */
declare global {
  var signin: () => Promise<string[]>;
}

jest.mock('../nats-wrapper');

let mongo: MongoMemoryServer;
beforeAll(async () => {
  process.env.JWT_KEY = 'asdfdsa';
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  if (mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();

    for (const collection of collections) {
      await collection.deleteMany({});
    }
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = async () => {
  const userName = 'test';
  const email = 'test@test.com';
  const password = 'password';

  const firstResponse = await request(app)
    .post('/api/users/validate-credentials')
    .send({
      userName: userName,
      email: email,
    })
    .expect(200);

  const cookies = firstResponse.get('Set-Cookie');

  const response = await request(app)
    .post('/api/users/complete-signup')
    .set('Cookie', cookies || [])
    .send({
      password: password,
      confirmedPassword: password,
    })
    .expect(201);

  const cookie = response.get('Set-Cookie');

  if (!cookie) {
    throw new Error('Failed to get cookie from response');
  }

  return cookie;
};
