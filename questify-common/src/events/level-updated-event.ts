import { LevelContent } from '../types/level-contents';
import { Subjects } from './subjects';

export interface LevelUpdatedEvent {
  subject: Subjects.LevelUpdated;
  data: {
    id: string;
    teacherId: string;
    islandId: string;
    isDeleted: boolean;
    name: string;
    description?: string;
    position: number;
    contentType?: LevelContent;
  };
}
