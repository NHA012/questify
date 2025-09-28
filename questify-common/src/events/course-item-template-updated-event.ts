import { Subjects } from './subjects';

export interface CourseItemTemplateUpdatedEvent {
  subject: Subjects.CourseItemTemplateUpdated;
  data: {
    id: string;
    courseId: string;
    itemTemplateId: string;
    isDeleted: boolean;
  };
}
