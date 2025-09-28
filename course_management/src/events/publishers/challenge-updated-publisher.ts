import { Publisher, Subjects, ChallengeUpdatedEvent } from '@datn242/questify-common';

export class ChallengeUpdatedPublisher extends Publisher<ChallengeUpdatedEvent> {
  subject: Subjects.ChallengeUpdated = Subjects.ChallengeUpdated;
}
