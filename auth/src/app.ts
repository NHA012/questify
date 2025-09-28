import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@datn242/questify-common';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signupRouter } from './routes/signup';
import { signoutRouter } from './routes/signout';
import { updateProfileRouter } from './routes/update';
import { deleteUserRouter } from './routes/dev-only/delete-all';
import { getUserRouter } from './routes/index';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false, // disable encryption
    secure: false, // disable https
  }),
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);
app.use(updateProfileRouter);
app.use(deleteUserRouter);
app.use(getUserRouter);
app.use(deleteUserRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

export { app };
