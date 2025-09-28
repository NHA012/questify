import { CourseStatus } from '../types/course-status';
import { Subjects } from './subjects';

export interface CourseUpdatedEvent {
  subject: Subjects.CourseUpdated;
  data: {
    id: string;
    teacherId: string;
    status: CourseStatus;
    isDeleted: boolean;
    name?: string;
    description?: string;
    backgroundImage?: string;
    thumbnail?: string;
  };
}
