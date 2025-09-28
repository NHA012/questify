import { Subjects } from './subjects';

export interface AttemptUpdatedEvent {
  subject: Subjects.AttemptUpdated;
  data: {
    id: string;
    userId: string;
    levelId: string;
    answer?: object;
    gold?: number;
    exp?: number;
    point?: number;
    finishedAt?: Date;
    createdAt: Date;
  };
}
