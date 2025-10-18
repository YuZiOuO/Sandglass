import { APIException } from 'src/app.exception';

export class ProjectException extends APIException {}

export class ProjectNotFoundException extends ProjectException {
  constructor(cause?: Error) {
    super(
      { message: 'Project with given id not found.', code: 'Proj#1' },
      404,
      cause,
    );
  }
}

export class InvalidCalendarIdOrTasklistId extends ProjectException {
  constructor(cause?: Error) {
    super(
      {
        message:
          'A Project with the same CalendarId or TasklistId already exists.',
        code: 'Proj#2',
      },
      400,
      cause,
    );
  }
}

export class FailedToSaveProject extends ProjectException {
  constructor(cause?: Error) {
    super(
      {
        message: 'Failed to save documents.This is a internal error.',
        code: 'Proj#3',
      },
      500,
      cause,
    );
  }
}
