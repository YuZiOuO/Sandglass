import { APIException } from 'src/app.exception';

export class GoogleAuthException extends APIException {}

export class InvalidAuthorizationCodeException extends GoogleAuthException {
  constructor(cause?: Error) {
    super(
      { message: 'Invalid Authorization Code.', code: 'GAuth#1' },
      400,
      cause,
    );
  }
}

export class InvalidVerifyRequestException extends GoogleAuthException {
  constructor(cause?: Error) {
    super({ message: 'Invalid Verify Request.', code: 'GAuth#2' }, 400, cause);
  }
}

export class LinkAlreadyExistException extends GoogleAuthException {
  constructor(cause?: Error) {
    super(
      { message: 'A link to google already exists.', code: 'GAuth#3' },
      400,
      cause,
    );
  }
}
