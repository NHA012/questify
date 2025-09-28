import { Message } from 'node-nats-streaming';
import { Subjects, Listener, ChallengeCreatedEvent } from '@datn242/questify-common';
import { queueGroupName } from './queue-group-name';
import { Level } from '../../models/level';
import { Challenge } from '../../models/challenge';

export class ChallengeCreatedListener extends Listener<ChallengeCreatedEvent> {
  subject: Subjects.ChallengeCreated = Subjects.ChallengeCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: ChallengeCreatedEvent['data'], msg: Message) {
    const { id, levelId } = data;
    const existingLevel = await Level.findByPk(levelId);
    if (!existingLevel) {
      console.warn(`Level not found with ID: ${levelId}`);
      msg.ack();
      return;
    }
    const challenge = Challenge.build({
      id,
      levelId,
    });
    await challenge.save();

    msg.ack();
  }
}
