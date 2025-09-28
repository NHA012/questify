import { Message } from 'node-nats-streaming';
import { UserCreatedEvent, UserRole, UserStatus } from '@datn242/questify-common';
import { UserCreatedListener } from '../user-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { User } from '../../../models/user';
import { v4 as uuidv4 } from 'uuid';

const setup = async () => {
  // Create an instance of the listener
  const listener = new UserCreatedListener(natsWrapper.client);

  // Create the fake data event
  const data: UserCreatedEvent['data'] = {
    id: uuidv4(),
    role: UserRole.Student,
    status: UserStatus.Active,
    gmail: 'test@gmail.com',
    userName: 'test',
  };

  // @ts-expect-error: mock Message only needs ack for this test
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('creates and saves a user', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const user = await User.findByPk(data.id);

  expect(user!.id).toEqual(data.id);
  expect(user!.role).toEqual(data.role);
  expect(user!.status).toEqual(data.status);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
