import { Publisher, Subjects, IslandTemplateUpdatedEvent } from '@datn242/questify-common';

export class IslandTemplateUpdatedPublisher extends Publisher<IslandTemplateUpdatedEvent> {
  subject: Subjects.IslandTemplateUpdated = Subjects.IslandTemplateUpdated;
}
