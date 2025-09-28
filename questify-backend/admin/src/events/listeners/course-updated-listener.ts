import { Message } from 'node-nats-streaming';
import { Subjects, Listener, CourseUpdatedEvent } from '@datn242/questify-common';
import { queueGroupName } from './queue-group-name';
import { Course } from '../../models/course';
import { User } from '../../models/user';

export class CourseUpdatedListener extends Listener<CourseUpdatedEvent> {
  subject: Subjects.CourseUpdated = Subjects.CourseUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: CourseUpdatedEvent['data'], msg: Message) {
    const { id, teacherId, status, name, description, thumbnail, isDeleted } = data;
    const existingTeacher = await User.findByPk(teacherId);
    if (!existingTeacher) {
      console.warn(`Teacher not found with ID: ${teacherId}`);
      msg.ack();
    }

    const existingCourse = await Course.findByPk(id);
    if (!existingCourse) {
      console.warn(`Course not found with ID: ${id}`);
      msg.ack();
      return;
    }
    await Course.update(
      {
        teacherId,
        name,
        description,
        status,
        thumbnail,
        isDeleted,
      },
      {
        where: { id },
      },
    );

    msg.ack();
  }
}
