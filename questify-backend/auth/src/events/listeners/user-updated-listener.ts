import { Message } from 'node-nats-streaming';
import { Subjects, Listener, UserUpdatedEvent } from '@datn242/questify-common';
import { User } from '../../models/user';
import { queueGroupName } from './queue-group-name';

export class UserUpdatedListener extends Listener<UserUpdatedEvent> {
  subject: Subjects.UserUpdated = Subjects.UserUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: UserUpdatedEvent['data'], msg: Message) {
    const { id, role, status, gmail, userName, exp } = data;

    const existingUser = await User.findById(id);
    if (!existingUser) {
      console.warn(`User not found with ID: ${id}`);
      msg.ack();
      return;
    }

    existingUser!.set({
      role,
      status,
      email: gmail,
      userName,
      exp,
    });

    await existingUser!.save();

    msg.ack();
  }
}
