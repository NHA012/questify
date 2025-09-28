import { Message } from 'node-nats-streaming';
import { Subjects, Listener, IslandTemplateUpdatedEvent } from '@datn242/questify-common';
import { IslandTemplate } from '../../models/island-template';
import { queueGroupName } from './queue-group-name';

export class IslandTemplateUpdatedListener extends Listener<IslandTemplateUpdatedEvent> {
  subject: Subjects.IslandTemplateUpdated = Subjects.IslandTemplateUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: IslandTemplateUpdatedEvent['data'], msg: Message) {
    const { id, name, image_url, isDeleted, deletedAt } = data;

    const existingTemplate = await IslandTemplate.findByPk(id);

    if (!existingTemplate) {
      console.warn(`Island template not found with ID: ${id}`);
      msg.ack();
      return;
    }

    await IslandTemplate.update(
      {
        name,
        imageUrl: image_url,
        isDeleted,
        deletedAt,
      },
      {
        where: { id },
      },
    );

    msg.ack();
  }
}
