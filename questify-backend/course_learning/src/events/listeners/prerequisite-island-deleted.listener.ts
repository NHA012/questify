import { Message } from 'node-nats-streaming';
import { Subjects, Listener, PrerequisiteIslandDeletedEvent } from '@datn242/questify-common';
import { queueGroupName } from './queue-group-name';
import { PrerequisiteIsland } from '../../models/prerequisite-island';

export class PrerequisiteIslandDeletedListener extends Listener<PrerequisiteIslandDeletedEvent> {
  subject: Subjects.PrerequisiteIslandDeleted = Subjects.PrerequisiteIslandDeleted;
  queueGroupName = queueGroupName;

  async onMessage(data: PrerequisiteIslandDeletedEvent['data'], msg: Message) {
    const { islandId, prerequisiteIslandId } = data;

    if (prerequisiteIslandId) {
      await PrerequisiteIsland.destroy({
        where: {
          islandId,
          prerequisiteIslandId,
        },
      });
    } else {
      await PrerequisiteIsland.destroy({
        where: {
          islandId,
        },
      });
    }
    msg.ack();
  }
}
