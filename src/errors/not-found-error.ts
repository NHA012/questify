import { CustomError } from './custom-error';

export class NotFoundError extends CustomError {
  static statusCode = 404;
  statusCode = 404;

  constructor() {
    super('Route not found');

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [{ message: 'Not Found' }];
  }
}
