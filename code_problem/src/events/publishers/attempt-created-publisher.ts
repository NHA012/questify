import { Publisher, Subjects, AttemptCreatedEvent } from '@datn242/questify-common';

export class AttemptCreatedPublisher extends Publisher<AttemptCreatedEvent> {
  subject: Subjects.AttemptCreated = Subjects.AttemptCreated;
}
