import { Publisher, Subjects, ItemTemplateCreatedEvent } from '@datn242/questify-common';

export class ItemTemplateCreatedPublisher extends Publisher<ItemTemplateCreatedEvent> {
  subject: Subjects.ItemTemplateCreated = Subjects.ItemTemplateCreated;
}
