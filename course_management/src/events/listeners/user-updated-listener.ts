import { Message } from 'node-nats-streaming';
import { Subjects, Listener, UserUpdatedEvent } from '@datn242/questify-common';
import { User } from '../../models/user';
import { queueGroupName } from './queue-group-name';

export class UserUpdatedListener extends Listener<UserUpdatedEvent> {
  subject: Subjects.UserUpdated = Subjects.UserUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: UserUpdatedEvent['data'], msg: Message) {
    const { id, role, status } = data;
    const existingUser = await User.findByPk(id);
    if (!existingUser) {
      console.warn(`User not found with ID: ${id}`);
      msg.ack();
      return;
    }
    await User.update(
      {
        role,
        status,
      },
      {
        where: { id },
      },
    );

    msg.ack();
  }
}
