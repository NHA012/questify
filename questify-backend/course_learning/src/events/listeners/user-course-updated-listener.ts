import { Message } from 'node-nats-streaming';
import { Subjects, Listener, UserCourseUpdatedEvent } from '@datn242/questify-common';
import { queueGroupName } from './queue-group-name';
import { UserCourse } from '../../models/user-course';

export class UserCourseUpdatedListener extends Listener<UserCourseUpdatedEvent> {
  subject: Subjects.UserCourseUpdated = Subjects.UserCourseUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: UserCourseUpdatedEvent['data'], msg: Message) {
    const { studentId, courseId } = data;

    const userCourse = await UserCourse.findOne({
      where: {
        userId: studentId,
        courseId: courseId,
      },
    });

    if (!userCourse) {
      console.warn(`UserCourse not found for Student ID: ${studentId}, Course ID: ${courseId}`);
      msg.ack();
      return;
    }

    await userCourse.update(data);
    msg.ack();
  }
}
