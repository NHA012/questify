import { Message } from 'node-nats-streaming';
import { Subjects, Listener, LevelUpdatedEvent } from '@datn242/questify-common';
import { queueGroupName } from './queue-group-name';
import { Level } from '../../models/level';
import { Island } from '../../models/island';

export class LevelUpdatedListener extends Listener<LevelUpdatedEvent> {
  subject: Subjects.LevelUpdated = Subjects.LevelUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: LevelUpdatedEvent['data'], msg: Message) {
    const { id, islandId, name, description, position, contentType } = data;
    const existingIsland = await Island.findByPk(islandId);
    if (!existingIsland) {
      console.warn(`Island not found with ID: ${islandId}, skipping course creation`);
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
        name,
        description,
        position,
        islandId,
        contentType,
      },
      {
        where: { id },
      },
    );

    msg.ack();
  }
}
