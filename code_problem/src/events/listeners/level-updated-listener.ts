import { Message } from 'node-nats-streaming';
import { Subjects, Listener, LevelUpdatedEvent } from '@datn242/questify-common';
import { queueGroupName } from './queue-group-name';
import { Level } from '../../models/level';
import { User } from '../../models/user';

export class LevelUpdatedListener extends Listener<LevelUpdatedEvent> {
  subject: Subjects.LevelUpdated = Subjects.LevelUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: LevelUpdatedEvent['data'], msg: Message) {
    const { id, teacherId, isDeleted } = data;
    const existingTeacher = await User.findByPk(teacherId);
    if (!existingTeacher) {
      console.warn(`Teacher not found with ID: ${teacherId}`);
      msg.ack();
      return;
    }

    const existingLevel = await Level.findByPk(id);
    if (!existingLevel) {
      console.warn(`Level not found with ID: ${id}`);
      msg.ack();
      return;
    }
    await Level.update(
      {
        teacherId,
        isDeleted,
      },
      {
        where: { id },
      },
    );

    msg.ack();
  }
}
