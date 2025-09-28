import { Subjects } from './subjects';

export interface PrerequisiteIslandDeletedEvent {
  subject: Subjects.PrerequisiteIslandDeleted;
  data: {
    islandId: string;
    prerequisiteIslandId?: string; // Optional - if not provided, all prerequisites for the island are deleted
  };
}
