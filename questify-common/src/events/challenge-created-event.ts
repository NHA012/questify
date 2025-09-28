import { Subjects } from './subjects';

export interface ChallengeCreatedEvent {
  subject: Subjects.ChallengeCreated;
  data: {
    id: string;
    levelId: string;
  };
}
