import { Subjects } from './subjects';

export interface CourseItemTemplateCreatedEvent {
  subject: Subjects.CourseItemTemplateCreated;
  data: {
    id: string;
    courseId: string;
    itemTemplateId: string;
    isDeleted: boolean;
  };
}
