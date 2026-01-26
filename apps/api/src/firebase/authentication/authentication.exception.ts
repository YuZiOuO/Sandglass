import { HttpStatus } from '@nestjs/common';
import { APIException } from 'src/app.exception';

export class AuthenticationException extends APIException {}

export class InvalidTokenException extends AuthenticationException {
  constructor(cause?: Error) {
    super(
      { message: 'Invalid Access Token.', code: 'Auth#1' },
      HttpStatus.BAD_REQUEST,
      cause,
    );
  }
}
