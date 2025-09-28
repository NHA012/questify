import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@datn242/questify-common';

import { showLevelRouter } from './routes/level/show';
import { showHintRouter } from './routes/others/show-hints';
import { submitChallengeRouter } from './routes/challenge/submit';
import { showRewardsRouter } from './routes/others/show-rewards';
import { showLeaderboardRouter } from './routes/others/show-course-leaderboard';
import { showIslandLeaderboardRouter } from './routes/others/show-island-leaderboard';
import { showLevelLeaderboardRouter } from './routes/others/show-level-leaderboard';
import { createFeedbackRouter } from './routes/feedback/new';
import { showFeedbackRouter } from './routes/feedback/show';
import { showProgressRouter } from './routes/progress/show';
import { showAllProgressRouter } from './routes/progress/show-all';
import { showUserIslandRouter } from './routes/roadmap/show-user-island';
import { showUserLevelRouter } from './routes/roadmap/show-user-level';
import { initUserIslandRouter } from './routes/roadmap/init-user-island';
import { initUserLevelRouter } from './routes/roadmap/init-user-level';
import { updateProgressRouter } from './routes/progress/update';
import { showChallengeRouter } from './routes/challenge/show';
import { newAttemptRouter } from './routes/level/new-attempt';
import { indexAttemptRouter } from './routes/level/index-attempt';
import { showCourseProgressRouter } from './routes/progress/show-courses';
import { submitLevelRouter } from './routes/level/submit';
import { inventoryBuyRouter } from './routes/inventory/buy';
import { inventoryIndexRouter } from './routes/inventory/index';
import { inventoryUseRouter } from './routes/inventory/use';
import { getUserCourseRouter } from './routes/inventory/get-user-course';

import { deleteAllRouter } from './routes/dev-only/delete-all';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false, // disable encryption
    secure: false, // disable https
  }),
);
app.use(currentUser);

app.use(showLevelRouter);
app.use(submitLevelRouter);
app.use(showHintRouter);
app.use(submitChallengeRouter);
app.use(showRewardsRouter);
app.use(showLeaderboardRouter);
app.use(showIslandLeaderboardRouter);
app.use(showLevelLeaderboardRouter);
app.use(createFeedbackRouter);
app.use(showFeedbackRouter);
app.use(showProgressRouter);
app.use(showAllProgressRouter);
app.use(showUserIslandRouter);
app.use(showUserLevelRouter);
app.use(initUserIslandRouter);
app.use(initUserLevelRouter);
app.use(updateProgressRouter);
app.use(showChallengeRouter);
app.use(submitChallengeRouter);
app.use(newAttemptRouter);
app.use(indexAttemptRouter);
app.use(showCourseProgressRouter);
app.use(inventoryBuyRouter);
app.use(inventoryIndexRouter);
app.use(inventoryUseRouter);
app.use(getUserCourseRouter);

app.use(deleteAllRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

export { app };
