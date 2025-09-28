import { Message } from 'node-nats-streaming';
import { Subjects, Listener, SlideUpdatedEvent } from '@datn242/questify-common';
import { queueGroupName } from './queue-group-name';
import { Challenge } from '../../models/challenge';
import { Slide } from '../../models/slide';

export class SlideUpdatedListener extends Listener<SlideUpdatedEvent> {
  subject: Subjects.SlideUpdated = Subjects.SlideUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: SlideUpdatedEvent['data'], msg: Message) {
    const {
      id,
      title,
      description,
      slideNumber,
      type,
      imageUrl,
      videoUrl,
      answers,
      challengeId,
      isDeleted,
    } = data;

    const existingChallenge = await Challenge.findByPk(challengeId);
    if (!existingChallenge) {
      console.warn(`Challenge not found with ID: ${challengeId}`);
      msg.ack();
      return;
    }

    const existingSlide = await Slide.findByPk(id);
    if (!existingSlide) {
      console.warn(`Slide not found with ID: ${id}`);
      msg.ack();
      return;
    }
    await Slide.update(
      {
        title,
        description,
        slideNumber,
        type,
        imageUrl,
        videoUrl,
        answers,
        challengeId,
        isDeleted,
      },
      {
        where: { id },
      },
    );

    msg.ack();
  }
}
