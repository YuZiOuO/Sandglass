import { APIException } from 'src/app.exception';

class OAuthException extends APIException {}

export class InvalidAuthorizationCodeException extends OAuthException {
  constructor(cause?: Error) {
    super(
      { message: 'Invalid Authorization Code.', code: 'OAuth#1' },
      400,
      cause,
    );
  }
}

export class LinkAlreadyExistException extends OAuthException {
  constructor(cause?: Error) {
    super(
      { message: 'A link to google already exists.', code: 'OAuth#3' },
      400,
      cause,
    );
  }
}

export class LinkNotExistException extends OAuthException {
  constructor(cause?: Error) {
    super(
      { message: 'Given uid is not linked to Google.', code: 'OAuth#4' },
      400,
      cause,
    );
  }
}

export class InvalidLink extends OAuthException {
  constructor(cause?: Error) {
    super(
      {
        message:
          'Action to fetch new Access Token by the Link of the given uid is failed.May caused by expired RefreshToken.',
        code: 'OAuth#5',
      },
      400,
      cause,
    );
  }
}
