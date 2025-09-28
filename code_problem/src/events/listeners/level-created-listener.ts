import { Message } from 'node-nats-streaming';
import { Subjects, Listener, LevelCreatedEvent } from '@datn242/questify-common';
import { queueGroupName } from './queue-group-name';
import { Level } from '../../models/level';
import { User } from '../../models/user';

export class LevelCreatedListener extends Listener<LevelCreatedEvent> {
  subject: Subjects.LevelCreated = Subjects.LevelCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: LevelCreatedEvent['data'], msg: Message) {
    const { id, teacherId } = data;
    const existingTeacher = await User.findByPk(teacherId);
    if (!existingTeacher) {
      console.warn(`Teacher not found with ID: ${teacherId}, skipping level creation`);
      msg.ack();
      return;
    }
    await Level.create({
      id,
      teacherId,
    });

    msg.ack();
  }
}
