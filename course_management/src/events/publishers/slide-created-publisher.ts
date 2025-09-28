import { Publisher, Subjects, SlideCreatedEvent } from '@datn242/questify-common';

export class SlideCreatedPublisher extends Publisher<SlideCreatedEvent> {
  subject: Subjects.SlideCreated = Subjects.SlideCreated;
}
