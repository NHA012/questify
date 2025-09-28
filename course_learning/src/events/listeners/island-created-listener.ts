import { Message } from 'node-nats-streaming';
import { Subjects, Listener, IslandCreatedEvent } from '@datn242/questify-common';
import { queueGroupName } from './queue-group-name';
import { Island } from '../../models/island';
import { Course } from '../../models/course';
import { retryService } from '../../services/retry-service';

export class IslandCreatedListener extends Listener<IslandCreatedEvent> {
  subject: Subjects.IslandCreated = Subjects.IslandCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: IslandCreatedEvent['data'], msg: Message) {
    try {
      const { id, courseId, name, description, position, backgroundImage } = data;

      // Check if island already exists
      const existingIsland = await Island.findByPk(id);
      if (existingIsland) {
        console.log(`Island already exists with ID: ${id}`);
        msg.ack();
        return;
      }

      // Check if course exists
      const existingCourse = await Course.findByPk(courseId);
      if (!existingCourse) {
        console.log(`Course not found with ID: ${courseId}, queuing for retry`);
        await retryService.addEvent(this.subject, data);
        msg.ack();
        return;
      }

      // Course exists, proceed with island creation
      const island = Island.build({
        id,
        courseId,
        name,
        description,
        position,
        backgroundImage,
      });

      await island.save();
      console.log(`Island created: ${name} (${id})`);

      msg.ack();
    } catch (error) {
      console.error('Error processing island:created event:', error);
      await retryService.addEvent(this.subject, data);
      msg.ack();
      return;
    }
  }
}
