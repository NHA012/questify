import { Subjects } from './subjects';

export interface IslandTemplateUpdatedEvent {
  subject: Subjects.IslandTemplateUpdated;
  data: {
    id: string;
    name?: string;
    image_url?: string;
    isDeleted?: boolean;
    deletedAt?: Date;
  };
}
