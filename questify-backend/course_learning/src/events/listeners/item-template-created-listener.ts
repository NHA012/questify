import { Message } from 'node-nats-streaming';
import { Subjects, Listener, ItemTemplateCreatedEvent, EffectType } from '@datn242/questify-common';
import { queueGroupName } from './queue-group-name';
import { ItemTemplate } from '../../models/item-template';

export class ItemTemplateCreatedListener extends Listener<ItemTemplateCreatedEvent> {
  subject: Subjects.ItemTemplateCreated = Subjects.ItemTemplateCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: ItemTemplateCreatedEvent['data'], msg: Message) {
    const { id, gold, name, effect, effect_description, img, description } = data;

    try {
      const existingItemTemplate = await ItemTemplate.findByPk(id);

      if (existingItemTemplate) {
        console.log(`ItemTemplate with ID: ${id} already exists, skipping creation`);
        msg.ack();
        return;
      }

      const itemTemplate = ItemTemplate.build({
        id,
        gold,
        name,
        effect: effect as EffectType,
        effect_description,
        img,
        description,
      });

      await itemTemplate.save();
      console.log(`ItemTemplate created with ID: ${id}`);

      msg.ack();
    } catch (err) {
      console.error('Error processing ItemTemplateCreated event:', err);
      msg.ack();
    }
  }
}
