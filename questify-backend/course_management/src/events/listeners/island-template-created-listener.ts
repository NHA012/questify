import { Message } from 'node-nats-streaming';
import { Subjects, Listener, IslandTemplateCreatedEvent } from '@datn242/questify-common';
import { IslandTemplate } from '../../models/island-template';
import { queueGroupName } from './queue-group-name';

export class IslandTemplateCreatedListener extends Listener<IslandTemplateCreatedEvent> {
  subject: Subjects.IslandTemplateCreated = Subjects.IslandTemplateCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: IslandTemplateCreatedEvent['data'], msg: Message) {
    const { id, name, image_url } = data;

    const islandTemplate = IslandTemplate.build({
      id,
      name,
      imageUrl: image_url,
      isDeleted: false,
    });

    await islandTemplate.save();

    msg.ack();
  }
}
