import { Publisher, Subjects, LevelUpdatedEvent } from '@datn242/questify-common';

export class LevelUpdatedPublisher extends Publisher<LevelUpdatedEvent> {
  subject: Subjects.LevelUpdated = Subjects.LevelUpdated;
}
