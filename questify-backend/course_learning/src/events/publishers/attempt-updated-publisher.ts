import { Publisher, Subjects, AttemptUpdatedEvent } from '@datn242/questify-common';

export class AttemptUpdatedPublisher extends Publisher<AttemptUpdatedEvent> {
  subject: Subjects.AttemptUpdated = Subjects.AttemptUpdated;
}
