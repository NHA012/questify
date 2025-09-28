import { CustomError } from './custom-error';

export class NotAuthorizedError extends CustomError {
  static statusCode = 401;
  statusCode = 401;

  constructor() {
    super('Not Authorized');

    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors() {
    return [{ message: 'Not authorized' }];
  }
}
