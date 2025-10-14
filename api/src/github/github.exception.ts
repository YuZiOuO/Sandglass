import { APIException } from 'src/app.exception';

export class GithubException extends APIException {
  constructor(cause: Error) {
    super(
      { message: 'Failed to fetch data from Github API.', code: 'Github#0' },
      500,
      cause,
    );
  }
}
