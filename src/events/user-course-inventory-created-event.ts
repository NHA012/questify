import { Subjects } from './subjects';

export interface UserCourseInventoryCreationEvent {
  subject: Subjects.UserCourseInventoryCreation;
  data: {
    userId: string;
    courseId: string;
  };
}
