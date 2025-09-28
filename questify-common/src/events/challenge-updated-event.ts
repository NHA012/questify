import { Subjects } from './subjects';

export interface ChallengeUpdatedEvent {
  subject: Subjects.ChallengeUpdated;
  data: {
    id: string;
    levelId: string;
    isDeleted: boolean;
  };
}
