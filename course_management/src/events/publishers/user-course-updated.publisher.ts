import { Publisher, Subjects, UserCourseUpdatedEvent } from '@datn242/questify-common';

export class UserCourseUpdatedPublisher extends Publisher<UserCourseUpdatedEvent> {
  subject: Subjects.UserCourseUpdated = Subjects.UserCourseUpdated;
}
