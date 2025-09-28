import { Publisher, Subjects, IslandTemplateCreatedEvent } from '@datn242/questify-common';

export class IslandTemplateCreatedPublisher extends Publisher<IslandTemplateCreatedEvent> {
  subject: Subjects.IslandTemplateCreated = Subjects.IslandTemplateCreated;
}
