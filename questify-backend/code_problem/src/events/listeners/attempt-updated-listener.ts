import { Message } from 'node-nats-streaming';
import { Subjects, Listener, AttemptUpdatedEvent } from '@datn242/questify-common';
import { queueGroupName } from './queue-group-name';
import { Level } from '../../models/level';
import { User } from '../../models/user';
import { Attempt } from '../../models/attempt';

export class AttemptUpdatedListener extends Listener<AttemptUpdatedEvent> {
  subject: Subjects.AttemptUpdated = Subjects.AttemptUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: AttemptUpdatedEvent['data'], msg: Message) {
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

    const existingAttempt = await Attempt.findByPk(id);
    if (!existingAttempt) {
      console.warn(`Attempt not found with ID: ${id}`);
      msg.ack();
      return;
    }
    await Attempt.update(
      {
        id,
        userId,
        levelId,
        answer,
        gold,
        exp,
        point,
        finishedAt,
        createdAt,
      },
      {
        where: { id },
      },
    );

    msg.ack();
  }
}
