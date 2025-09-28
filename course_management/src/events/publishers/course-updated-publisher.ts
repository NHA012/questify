import { Publisher, Subjects, CourseUpdatedEvent } from '@datn242/questify-common';

export class CourseUpdatedPublisher extends Publisher<CourseUpdatedEvent> {
  subject: Subjects.CourseUpdated = Subjects.CourseUpdated;
}
