import { Publisher, Subjects, SlideUpdatedEvent } from '@datn242/questify-common';

export class SlideUpdatedPublisher extends Publisher<SlideUpdatedEvent> {
  subject: Subjects.SlideUpdated = Subjects.SlideUpdated;
}
