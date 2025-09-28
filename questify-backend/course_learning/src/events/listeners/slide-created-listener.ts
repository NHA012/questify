import { Message } from 'node-nats-streaming';
import { Subjects, Listener, SlideCreatedEvent } from '@datn242/questify-common';
import { queueGroupName } from './queue-group-name';
import { Challenge } from '../../models/challenge';
import { Slide } from '../../models/slide';

export class SlideCreatedListener extends Listener<SlideCreatedEvent> {
  subject: Subjects.SlideCreated = Subjects.SlideCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: SlideCreatedEvent['data'], msg: Message) {
    const { id, title, description, slideNumber, type, imageUrl, videoUrl, answers, challengeId } =
      data;
    const existingChallenge = await Challenge.findByPk(challengeId);
    if (!existingChallenge) {
      console.warn(`Challenge not found with ID: ${challengeId}`);
      msg.ack();
      return;
    }

    const slide = Slide.build({
      id,
      title,
      description,
      slideNumber,
      type,
      imageUrl,
      videoUrl,
      answers,
      challengeId,
    });
    await slide.save();

    msg.ack();
  }
}
