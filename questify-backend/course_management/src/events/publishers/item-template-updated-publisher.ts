import { Publisher, Subjects, ItemTemplateUpdatedEvent } from '@datn242/questify-common';

export class ItemTemplateUpdatedPublisher extends Publisher<ItemTemplateUpdatedEvent> {
  subject: Subjects.ItemTemplateUpdated = Subjects.ItemTemplateUpdated;
}
