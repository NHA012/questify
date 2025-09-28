import { Publisher, Subjects, UserCreatedEvent } from '@datn242/questify-common';

export class UserCreatedPublisher extends Publisher<UserCreatedEvent> {
  subject: Subjects.UserCreated = Subjects.UserCreated;
}
