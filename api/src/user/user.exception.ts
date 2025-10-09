import { HttpStatus } from '@nestjs/common';
import { APIException } from 'src/app.exception';

export class UserException extends APIException {}

export class UserNotFoundException extends APIException {
  constructor(cause?: Error) {
    super(
      { message: 'User Not Found', code: 'User#1' },
      HttpStatus.NOT_FOUND,
      cause,
    );
  }
}
