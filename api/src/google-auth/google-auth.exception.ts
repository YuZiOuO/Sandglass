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

export class LinkAlreadyExistException extends GoogleAuthException {
  constructor(cause?: Error) {
    super(
      { message: 'A link to google already exists.', code: 'GAuth#3' },
      400,
      cause,
    );
  }
}

export class LinkNotExistException extends GoogleAuthException {
  constructor(cause?: Error) {
    super(
      { message: 'Given uid is not linked to Google.', code: 'GAuth#4' },
      400,
      cause,
    );
  }
}

export class InvalidLink extends GoogleAuthException {
  constructor(cause?: Error) {
    super(
      {
        message:
          'Action to fetch new Access Token by the Link of the given uid is failed.May caused by expired RefreshToken.',
        code: 'GAuth#5',
      },
      400,
      cause,
    );
  }
}
