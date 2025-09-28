import { Message } from 'node-nats-streaming';
import { Subjects, Listener, ItemTemplateUpdatedEvent, EffectType } from '@datn242/questify-common';
import { queueGroupName } from './queue-group-name';
import { ItemTemplate } from '../../models/item-template';

export class ItemTemplateUpdatedListener extends Listener<ItemTemplateUpdatedEvent> {
  subject: Subjects.ItemTemplateUpdated = Subjects.ItemTemplateUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: ItemTemplateUpdatedEvent['data'], msg: Message) {
    const { id, gold, name, effect, effect_description, img, description } = data;

    try {
      const itemTemplate = await ItemTemplate.findByPk(id);

      if (!itemTemplate) {
        console.log(`ItemTemplate with ID: ${id} not found, creating instead`);

        const newItemTemplate = ItemTemplate.build({
          id,
          gold,
          name,
          effect: effect as EffectType,
          effect_description,
          img,
          description,
        });

        await newItemTemplate.save();
      } else {
        itemTemplate.gold = gold;
        itemTemplate.name = name;
        itemTemplate.effect = effect as EffectType;
        itemTemplate.effect_description = effect_description;
        itemTemplate.img = img;
        itemTemplate.description = description;

        await itemTemplate.save();
      }

      msg.ack();
    } catch (err) {
      console.error('Error processing ItemTemplateUpdated event:', err);
      msg.ack();
    }
  }
}
