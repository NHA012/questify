import { Message } from 'node-nats-streaming';
import { Subjects, Listener, UserCreatedEvent } from '@datn242/questify-common';
import { User } from '../../models/user';
import { queueGroupName } from './queue-group-name';

export class UserCreatedListener extends Listener<UserCreatedEvent> {
  subject: Subjects.UserCreated = Subjects.UserCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: UserCreatedEvent['data'], msg: Message) {
    const { id, role, status } = data;

    const user = User.build({
      id,
      role,
      status,
    });
    await user.save();

    msg.ack();
  }
}
