import { Publisher, Subjects, IslandUpdatedEvent } from '@datn242/questify-common';

export class IslandUpdatedPublisher extends Publisher<IslandUpdatedEvent> {
  subject: Subjects.IslandUpdated = Subjects.IslandUpdated;
}
