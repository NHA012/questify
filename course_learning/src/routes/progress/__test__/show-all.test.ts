import request from 'supertest';
import { app } from '../../../app';
import { BadRequestError, ResourcePrefix, UserRole } from '@datn242/questify-common';
import { User } from '../../../models/user';
import { Course } from '../../../models/course';
import { UserCourse } from '../../../models/user-course';
import { v4 as uuidv4 } from 'uuid';
import { CompletionStatus } from '@datn242/questify-common';

const resource = ResourcePrefix.CourseLearning + '/progress/all';

it('returns a 400 if the student is not found', async () => {
  const studentId = uuidv4();
  const cookie = await global.getAuthCookie();

  await request(app)
    .get(resource)
    .query({ 'student-id': studentId })
    .set('Cookie', cookie)
    .send()
    .expect(BadRequestError.statusCode);
});

describe('Already have course; signin as student', () => {
  let cookie: string[] = undefined!;
  let course: Course = undefined!;

  beforeEach(async () => {
    const studentMail = 'test@student.com';
    cookie = await global.getAuthCookie(studentMail, UserRole.Student);

    const teacher = User.build({
      gmail: 'test@teacher.com',
      role: UserRole.Teacher,
      userName: 'test_teacher',
    });
    await teacher.save();

    course = Course.build({
      name: 'test_course',
      teacherId: teacher!.id,
    });
    await course.save();
  });

  it('Return empty if user has not enroll in the course', async () => {
    const student = await User.findOne({
      where: { gmail: 'test@student.com' },
    });
    const response = await request(app)
      .get(resource)
      .query({ 'student-id': student!.id })
      .set('Cookie', cookie)
      .send({})
      .expect(200);
    expect(response.body.progresses).toEqual([]);
  });

  it('Return progress if user has enrolled in the course', async () => {
    const student = await User.findOne({
      where: { gmail: 'test@student.com' },
    });

    //todo: add logic enroll in course later
    await UserCourse.create({
      userId: student!.id,
      courseId: course.id,
      point: 0,
      completionStatus: CompletionStatus.InProgress,
    });
    const response = await request(app)
      .get(resource)
      .query({ 'student-id': student!.id })
      .set('Cookie', cookie)
      .send({})
      .expect(200);
    expect(response.body.progresses.length).toEqual(1);
    expect(response.body.progresses[0].userId).toEqual(student!.id);
    expect(response.body.progresses[0].courseId).toEqual(course.id);
  });
});
