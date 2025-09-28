import { Subjects } from './subjects';

export interface IslandCreatedEvent {
  subject: Subjects.IslandCreated;
  data: {
    id: string;
    courseId: string;
    name: string;
    description?: string;
    position: number;
    backgroundImage?: string;
  };
}
