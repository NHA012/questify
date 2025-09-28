import { Message } from 'node-nats-streaming';
import { Subjects, Listener, LevelCreatedEvent, CompletionStatus } from '@datn242/questify-common';
import { queueGroupName } from './queue-group-name';
import { Level } from '../../models/level';
import { Island } from '../../models/island';
import { retryService } from '../../services/retry-service';
import { UserCourse } from '../../models/user-course';
import { UserLevel } from '../../models/user-level';

export class LevelCreatedListener extends Listener<LevelCreatedEvent> {
  subject: Subjects.LevelCreated = Subjects.LevelCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: LevelCreatedEvent['data'], msg: Message) {
    try {
      const { id, islandId, name, description, position, contentType } = data;

      // Check if level already exists
      const existingLevel = await Level.findByPk(id);
      if (existingLevel) {
        console.log(`Level already exists with ID: ${id}`);
        msg.ack();
        return;
      }

      // Check if island exists
      const existingIsland = await Island.findByPk(islandId);
      if (!existingIsland) {
        console.log(`Island not found with ID: ${islandId}, queuing for retry`);
        // Add to retry queue instead of immediately acking
        await retryService.addEvent(this.subject, data);
        msg.ack();
        return;
      }

      const level = Level.build({
        id,
        name,
        description,
        position,
        islandId,
        contentType,
      });

      await level.save();

      const user_course = await UserCourse.findAll({
        where: {
          courseId: existingIsland.courseId,
        },
        attributes: ['userId'],
      });

      const userIds = user_course.map((uc) => uc.userId);

      await UserLevel.bulkCreate(
        userIds.map((userId) => ({
          userId,
          levelId: level.id,
          completionStatus: CompletionStatus.InProgress,
          point: 0,
        })),
      );

      msg.ack();
    } catch (error) {
      console.error('Error processing level:created event:', error);
      await retryService.addEvent(this.subject, data);
      msg.ack();
      return;
    }
  }
}
