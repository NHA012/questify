import { Subjects } from './subjects';

export interface IslandUpdatedEvent {
  subject: Subjects.IslandUpdated;
  data: {
    id: string;
    courseId: string;
    isDeleted: boolean;
    name?: string;
    description?: string;
    position: number;
    backgroundImage?: string;
  };
}
