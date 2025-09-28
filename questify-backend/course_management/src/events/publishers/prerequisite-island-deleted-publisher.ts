import { Publisher, PrerequisiteIslandDeletedEvent, Subjects } from '@datn242/questify-common';

export class PrerequisiteIslandDeletedPublisher extends Publisher<PrerequisiteIslandDeletedEvent> {
  subject: Subjects.PrerequisiteIslandDeleted = Subjects.PrerequisiteIslandDeleted;
}
