import { Publisher, Subjects, CourseCreatedEvent } from '@datn242/questify-common';

export class CourseCreatedPublisher extends Publisher<CourseCreatedEvent> {
  subject: Subjects.CourseCreated = Subjects.CourseCreated;
}
