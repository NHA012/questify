import request from 'supertest';
import { app } from '../../../app';
import { BadRequestError, ResourcePrefix, UserRole } from '@datn242/questify-common';
import { User } from '../../../models/user';
import { Course } from '../../../models/course';
import { Island } from '../../../models/island';
import { UserCourse } from '../../../models/user-course';
import { v4 as uuidv4 } from 'uuid';
import { CompletionStatus } from '@datn242/questify-common';
import { UserIsland } from '../../../models/user-island';
import { UserLevel } from '../../../models/user-level';
import { Level } from '../../../models/level';

const resource = ResourcePrefix.CourseLearning + '/progress';

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

describe('Already have course, island, level; signin as student', () => {
  let cookie: string[] = undefined!;
  let course: Course = undefined!;
  let island: Island = undefined!;
  let level: Level = undefined!;

  beforeEach(async () => {
    const studentMail = 'test@student.com';
    cookie = await global.getAuthCookie(studentMail, UserRole.Student);

    const teacher = User.build({
      gmail: 'test@teacher.com',
      role: UserRole.Teacher,
      userName: 'test_teacher',
    });
    await teacher.save();

    course = await Course.create({
      name: 'test_course',
      teacherId: teacher!.id,
    });

    island = await Island.create({
      name: 'test_island',
      courseId: course.id,
      position: 1,
    });

    level = await Level.create({
      name: 'test_level',
      islandId: island.id,
      position: 1,
    });
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
      .query({ 'student-id': student!.id, 'course-id': course.id })
      .set('Cookie', cookie)
      .send({})
      .expect(200);
    expect(response.body.progress.userId).toEqual(student!.id);
    expect(response.body.progress.courseId).toEqual(course.id);
  });

  it('Return progress if user has started in the island', async () => {
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

    await UserIsland.create({
      userId: student!.id,
      islandId: island.id,
      point: 0,
      completionStatus: CompletionStatus.InProgress,
    });

    const response = await request(app)
      .get(resource)
      .query({ 'student-id': student!.id, 'island-id': island.id })
      .set('Cookie', cookie)
      .send({})
      .expect(200);
    expect(response.body.progress.userId).toEqual(student!.id);
    expect(response.body.progress.islandId).toEqual(island.id);
  });

  it('Return progress if user has started in the level', async () => {
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

    await UserLevel.create({
      userId: student!.id,
      levelId: level.id,
      point: 0,
      completionStatus: CompletionStatus.InProgress,
    });

    const response = await request(app)
      .get(resource)
      .query({ 'student-id': student!.id, 'level-id': level.id })
      .set('Cookie', cookie)
      .send({})
      .expect(200);
    expect(response.body.progress.userId).toEqual(student!.id);
    expect(response.body.progress.levelId).toEqual(level.id);
  });
});
