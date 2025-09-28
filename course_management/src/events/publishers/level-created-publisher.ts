import { Publisher, Subjects, LevelCreatedEvent } from '@datn242/questify-common';

export class LevelCreatedPublisher extends Publisher<LevelCreatedEvent> {
  subject: Subjects.LevelCreated = Subjects.LevelCreated;
}
