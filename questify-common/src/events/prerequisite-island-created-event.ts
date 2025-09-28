import { Subjects } from './subjects';

export interface PrerequisiteIslandCreatedEvent {
  subject: Subjects.PrerequisiteIslandCreated;
  data: {
    islandId: string;
    prerequisiteIslandId: string;
  };
}
