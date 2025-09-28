import { Subjects } from './subjects';

export interface IslandTemplateCreatedEvent {
  subject: Subjects.IslandTemplateCreated;
  data: {
    id: string;
    name: string;
    image_url: string;
  };
}
