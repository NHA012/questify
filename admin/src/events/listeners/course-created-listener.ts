import { Message } from 'node-nats-streaming';
import { Subjects, Listener, CourseCreatedEvent } from '@datn242/questify-common';
import { queueGroupName } from './queue-group-name';
import { Course } from '../../models/course';
import { User } from '../../models/user';

export class CourseCreatedListener extends Listener<CourseCreatedEvent> {
  subject: Subjects.CourseCreated = Subjects.CourseCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: CourseCreatedEvent['data'], msg: Message) {
    const { id, name, shortDescription, category, price, thumbnail, status, teacherId } = data;

    const existingTeacher = await User.findByPk(teacherId);
    if (!existingTeacher) {
      console.warn(`Teacher not found with ID: ${teacherId}, skipping level creation`);
      msg.ack();
      return;
    }

    const course = Course.build({
      id,
      name,
      description: shortDescription,
      category,
      price,
      thumbnail,
      status,
      teacherId,
    });
    await course.save();

    msg.ack();
  }
}
