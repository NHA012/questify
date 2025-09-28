import { Publisher, Subjects, UserCourseInventoryCreationEvent } from '@datn242/questify-common';

export class UserCourseInventoryCreationPublisher extends Publisher<UserCourseInventoryCreationEvent> {
  subject: Subjects.UserCourseInventoryCreation = Subjects.UserCourseInventoryCreation;
}
