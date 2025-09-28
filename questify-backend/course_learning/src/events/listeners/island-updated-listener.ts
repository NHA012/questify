import { Message } from 'node-nats-streaming';
import { Subjects, Listener, IslandUpdatedEvent } from '@datn242/questify-common';
import { queueGroupName } from './queue-group-name';
import { Island } from '../../models/island';
import { Course } from '../../models/course';

export class IslandUpdatedListener extends Listener<IslandUpdatedEvent> {
  subject: Subjects.IslandUpdated = Subjects.IslandUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: IslandUpdatedEvent['data'], msg: Message) {
    const { id, courseId, name, description, position, backgroundImage, isDeleted } = data;
    const existingCourse = await Course.findByPk(courseId);
    if (!existingCourse) {
      console.warn(`Course not found with ID: ${courseId}`);
      msg.ack();
      return;
    }
    const existingIsland = await Island.findByPk(id);
    if (!existingIsland) {
      console.warn(`Island not found with ID: ${id}`);
      msg.ack();
      return;
    }
    await Island.update(
      {
        courseId,
        name,
        description,
        position,
        backgroundImage,
        isDeleted,
      },
      {
        where: { id },
      },
    );

    msg.ack();
  }
}
