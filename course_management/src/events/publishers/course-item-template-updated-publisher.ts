import { Publisher, Subjects, CourseItemTemplateUpdatedEvent } from '@datn242/questify-common';

export class CourseItemTemplateUpdatedPublisher extends Publisher<CourseItemTemplateUpdatedEvent> {
  subject: Subjects.CourseItemTemplateUpdated = Subjects.CourseItemTemplateUpdated;
}
