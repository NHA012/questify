import { Publisher, PrerequisiteIslandCreatedEvent, Subjects } from '@datn242/questify-common';

export class PrerequisiteIslandCreatedPublisher extends Publisher<PrerequisiteIslandCreatedEvent> {
  subject: Subjects.PrerequisiteIslandCreated = Subjects.PrerequisiteIslandCreated;
}
