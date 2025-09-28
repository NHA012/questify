import { Publisher, Subjects, UserUpdatedEvent } from '@datn242/questify-common';

export class UserUpdatedPublisher extends Publisher<UserUpdatedEvent> {
  subject: Subjects.UserUpdated = Subjects.UserUpdated;
}
