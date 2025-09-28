import { Publisher, Subjects, CourseItemTemplateCreatedEvent } from '@datn242/questify-common';

export class CourseItemTemplateCreatedPublisher extends Publisher<CourseItemTemplateCreatedEvent> {
  subject: Subjects.CourseItemTemplateCreated = Subjects.CourseItemTemplateCreated;
}
