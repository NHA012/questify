import { Message } from 'node-nats-streaming';
import { Subjects, Listener, ChallengeUpdatedEvent } from '@datn242/questify-common';
import { queueGroupName } from './queue-group-name';
import { Challenge } from '../../models/challenge';
import { Level } from '../../models/level';

export class ChallengeUpdatedListener extends Listener<ChallengeUpdatedEvent> {
  subject: Subjects.ChallengeUpdated = Subjects.ChallengeUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: ChallengeUpdatedEvent['data'], msg: Message) {
    const { id, levelId, isDeleted } = data;
    const existingLevel = await Level.findByPk(levelId);
    if (!existingLevel) {
      console.warn(`Level not found with ID: ${levelId}`);
      msg.ack();
      return;
    }

    const existingChallenge = await Challenge.findByPk(id);
    if (!existingChallenge) {
      console.warn(`Challenge not found with ID: ${id}`);
      msg.ack();
      return;
    }
    await Challenge.update(
      {
        levelId,
        isDeleted,
      },
      {
        where: { id },
      },
    );

    msg.ack();
  }
}
