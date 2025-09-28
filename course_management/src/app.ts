import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import fileUpload from 'express-fileupload';
import { errorHandler, NotFoundError, currentUser } from '@datn242/questify-common';

import { deleteAllRouter } from './routes/dev-only/delete-all';

import { indexCourseRouter } from './routes/course/index';
import { showCourseRouter } from './routes/course/show';
import { createCourseRouter } from './routes/course/new';
import { updateCourseRouter } from './routes/course/update';
import { deleteCourseRouter } from './routes/course/delete';
import { indexCourseIntructorRouter } from './routes/course/index-instructor';

import { createIslandRouter } from './routes/island/new';
import { showIslandRouter } from './routes/island/show';
import { updateIslandRouter } from './routes/island/update';
import { deleteIslandRouter } from './routes/island/delete';

import { createLevelRouter } from './routes/level/new';
import { indexIslandRouter } from './routes/island';
import { indexLevelRouter } from './routes/level';
import { updateLevelRouter } from './routes/level/update';
import { deleteLevelRouter } from './routes/level/delete';
import { showLevelChallengeRouter } from './routes/level/show-challenge';
import { uploadPdfLevelRouter } from './routes/level/upload-pdf';
import { indexCurriculumRouter } from './routes/island/curriculum';

import { createReviewRouter } from './routes/course/new-review';
import { showReviewRouter } from './routes/course/show-review';
import { updateReviewRouter } from './routes/course/update-review';
import { deleteReviewRouter } from './routes/course/delete-review';

import { enrollCourseRouter } from './routes/course/enroll';

import { indexItemTemplateRouter } from './routes/item-template/index';
import { indexCourseItemTemplateRouter } from './routes/item-template/course-index';
import { updateCourseItemTemplateRouter } from './routes/item-template/course-update';
import { createItemTemplateRouter } from './routes/item-template/new';
import { updateItemTemplateRouter } from './routes/item-template/update';

import { createChallengeRouter } from './routes/challenge/new';
import { showChallengeRouter } from './routes/challenge/show';

import { createSlideRouter } from './routes/slide/new';
import { updateSlideRouter } from './routes/slide/update';
import { deleteSlideRouter } from './routes/slide/delete';

import { newIslandBackgroundImageRouter } from './routes/island-background-image/new';
import { updateIslandBackgroundImageRouter } from './routes/island-background-image/update';
import { deleteIslandBackgroundImageRouter } from './routes/island-background-image/delete';
import { getIslandBackgroundImagesRouter } from './routes/island-background-image/index';

import { getIslandTemplatesRouter } from './routes/island-template/index';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false, // disable encryption
    secure: false, // disable https
  }),
);
app.use(
  fileUpload({
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB max file size
    abortOnLimit: true,
    useTempFiles: true,
    tempFileDir: '/tmp/',
    createParentPath: true,
  }),
);
app.use(currentUser);

app.use(deleteAllRouter);

app.use(indexCourseRouter);
app.use(indexCourseIntructorRouter);
app.use(showCourseRouter);
app.use(createCourseRouter);
app.use(updateCourseRouter);
app.use(deleteCourseRouter);

app.use(createIslandRouter);
app.use(showIslandRouter);
app.use(updateIslandRouter);
app.use(indexIslandRouter);
app.use(deleteIslandRouter);
app.use(indexCurriculumRouter);

app.use(createLevelRouter);
app.use(indexLevelRouter);
app.use(showLevelChallengeRouter);
app.use(updateLevelRouter);
app.use(deleteLevelRouter);
app.use(uploadPdfLevelRouter);

app.use(createReviewRouter);
app.use(showReviewRouter);
app.use(updateReviewRouter);
app.use(deleteReviewRouter);

app.use(enrollCourseRouter);

app.use(indexItemTemplateRouter);
app.use(indexCourseItemTemplateRouter);
app.use(updateCourseItemTemplateRouter);
app.use(createItemTemplateRouter);
app.use(updateItemTemplateRouter);

app.use(createChallengeRouter);
app.use(showChallengeRouter);

app.use(createSlideRouter);
app.use(updateSlideRouter);
app.use(deleteSlideRouter);

app.use(newIslandBackgroundImageRouter);
app.use(updateIslandBackgroundImageRouter);
app.use(deleteIslandBackgroundImageRouter);
app.use(getIslandBackgroundImagesRouter);

app.use(getIslandTemplatesRouter);

app.use(deleteAllRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

export { app };
