import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@datn242/questify-common';
import { createCodeProblemRouter } from './routes/code_problem/new';
import { showCodeProblemRouter } from './routes/code_problem/show';
import { updateCodeProblemRouter } from './routes/code_problem/update';
import { deleteCodeProblemRouter } from './routes/code_problem/delete';
import { deleteTestcaseRouter } from './routes/testcases/delete';
import { createTestcaseRouter } from './routes/testcases/new';
import { showTestcaseRouter } from './routes/testcases/show';
import { updateTestcaseRouter } from './routes/testcases/update';
import { indexAttemptRouter } from './routes/attempts';
import { createAttemptRouter } from './routes/attempts/new';
import { showAttemptRouter } from './routes/attempts/show';
import { showCodeProblemByLevelRouter } from './routes/code_problem/index-level';
import { assessCodeProblemRouter } from './routes/code_problem/assess';
import { indexCodeProblemRouter } from './routes/code_problem';
import { indexTestcaseRouter } from './routes/testcases';

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

app.use(createCodeProblemRouter);
app.use(showCodeProblemRouter);
app.use(updateCodeProblemRouter);
app.use(deleteCodeProblemRouter);
app.use(deleteTestcaseRouter);
app.use(createTestcaseRouter);
app.use(showTestcaseRouter);
app.use(updateTestcaseRouter);
app.use(indexAttemptRouter);
app.use(createAttemptRouter);
app.use(showAttemptRouter);
app.use(showCodeProblemByLevelRouter);
app.use(assessCodeProblemRouter);
app.use(indexCodeProblemRouter);
app.use(indexTestcaseRouter);

app.use(deleteAllRouter);
app.all('*', async () => {
  throw new NotFoundError();
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

export { app };
