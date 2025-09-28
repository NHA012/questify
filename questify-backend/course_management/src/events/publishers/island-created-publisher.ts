import { Publisher, Subjects, IslandCreatedEvent } from '@datn242/questify-common';

export class IslandCreatedPublisher extends Publisher<IslandCreatedEvent> {
  subject: Subjects.IslandCreated = Subjects.IslandCreated;
}
