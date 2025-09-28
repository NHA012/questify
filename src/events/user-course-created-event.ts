import { Subjects } from './subjects';
import { CompletionStatus } from '../types/completion-status';

export interface UserCourseCreatedEvent {
  subject: Subjects.UserCourseCreated;
  data: {
    id: string;
    studentId: string;
    courseId: string;
    point: number;
    completionStatus: CompletionStatus;
  };
}
