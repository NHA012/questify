import { Publisher, Subjects, UserCourseCreatedEvent } from '@datn242/questify-common';

export class UserCourseCreatedPublisher extends Publisher<UserCourseCreatedEvent> {
  subject: Subjects.UserCourseCreated = Subjects.UserCourseCreated;
}
