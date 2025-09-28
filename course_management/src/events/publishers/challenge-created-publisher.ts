import { Publisher, Subjects, ChallengeCreatedEvent } from '@datn242/questify-common';

export class ChallengeCreatedPublisher extends Publisher<ChallengeCreatedEvent> {
  subject: Subjects.ChallengeCreated = Subjects.ChallengeCreated;
}
