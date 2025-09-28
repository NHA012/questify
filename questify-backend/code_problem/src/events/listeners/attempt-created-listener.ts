import { Message } from 'node-nats-streaming';
import { Subjects, Listener, AttemptCreatedEvent } from '@datn242/questify-common';
import { queueGroupName } from './queue-group-name';
import { Level } from '../../models/level';
import { User } from '../../models/user';
import { Attempt } from '../../models/attempt';

export class AttemptCreatedListener extends Listener<AttemptCreatedEvent> {
  subject: Subjects.AttemptCreated = Subjects.AttemptCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: AttemptCreatedEvent['data'], msg: Message) {
    const { id, userId, levelId, answer, gold, exp, point, finishedAt, createdAt } = data;
    const existingLevel = await Level.findByPk(levelId);
    if (!existingLevel) {
      console.warn(`Level not found with ID: ${levelId}`);
      msg.ack();
      return;
    }

    const existingUser = await User.findByPk(userId);
    if (!existingUser) {
      console.warn(`User not found with ID: ${userId}`);
      msg.ack();
      return;
    }

    const attempt = Attempt.build({
      id,
      userId,
      levelId,
      answer,
      gold,
      exp,
      point,
      finishedAt,
      createdAt,
    });

    await attempt.save();

    msg.ack();
  }
}
