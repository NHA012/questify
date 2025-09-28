import { CourseStatus } from '../types/course-status';
import { Subjects } from './subjects';

export interface CourseCreatedEvent {
  subject: Subjects.CourseCreated;
  data: {
    id: string;
    name: string;
    description?: string;
    shortDescription?: string;
    category?: string;
    price?: number;
    thumbnail?: string;
    status: CourseStatus;
    teacherId: string;
    backgroundImage?: string;
  };
}
