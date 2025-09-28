import { Subjects } from './subjects';

export interface AttemptCreatedEvent {
  subject: Subjects.AttemptCreated;
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
