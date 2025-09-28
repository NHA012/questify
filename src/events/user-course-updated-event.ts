import { Subjects } from './subjects';
import { CompletionStatus } from '../types/completion-status';
import { EffectType } from '../types/effect-type';

export interface UserCourseUpdatedEvent {
  subject: Subjects.UserCourseUpdated;
  data: {
    id: string;
    studentId: string;
    courseId: string;
    point?: number;
    completionStatus?: CompletionStatus;
    nextLevelEffect?: EffectType;
  };
}
