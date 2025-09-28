import { LevelContent } from '../types/level-contents';
import { Subjects } from './subjects';

export interface LevelCreatedEvent {
  subject: Subjects.LevelCreated;
  data: {
    id: string;
    teacherId: string;
    islandId: string;
    name: string;
    description?: string;
    position: number;
    contentType?: LevelContent;
  };
}
