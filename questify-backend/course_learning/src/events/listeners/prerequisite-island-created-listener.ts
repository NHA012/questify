import { Message } from 'node-nats-streaming';
import { Subjects, Listener, PrerequisiteIslandCreatedEvent } from '@datn242/questify-common';
import { queueGroupName } from './queue-group-name';
import { PrerequisiteIsland } from '../../models/prerequisite-island';
import { Island } from '../../models/island';
import { retryService } from '../../services/retry-service';

export class PrerequisiteIslandCreatedListener extends Listener<PrerequisiteIslandCreatedEvent> {
  subject: Subjects.PrerequisiteIslandCreated = Subjects.PrerequisiteIslandCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PrerequisiteIslandCreatedEvent['data'], msg: Message) {
    try {
      const { islandId, prerequisiteIslandId } = data;

      // Check if relationship already exists
      const existingPrerequisite = await PrerequisiteIsland.findOne({
        where: {
          islandId,
          prerequisiteIslandId,
        },
      });

      if (existingPrerequisite) {
        console.log(`Prerequisite relationship already exists`);
        msg.ack();
        return;
      }

      // Check if both islands exist
      const [island, prerequisiteIsland] = await Promise.all([
        Island.findByPk(islandId),
        Island.findByPk(prerequisiteIslandId),
      ]);

      if (!island || !prerequisiteIsland) {
        console.log(
          `One or both islands don't exist. islandId: ${islandId}, prerequisiteIslandId: ${prerequisiteIslandId}`,
        );
        // Add to retry queue
        await retryService.addEvent(this.subject, data);
        msg.ack();
        return;
      }

      // Both islands exist, create the relationship
      const prerequisite = PrerequisiteIsland.build({
        islandId,
        prerequisiteIslandId,
      });

      await prerequisite.save();
      console.log(`Created prerequisite relationship: ${islandId} -> ${prerequisiteIslandId}`);

      msg.ack();
    } catch (error) {
      console.error('Error processing PrerequisiteIslandCreated event:', error);
      await retryService.addEvent(this.subject, data);
      msg.ack();
    }
  }
}
