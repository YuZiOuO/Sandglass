import { HttpException } from '@nestjs/common';

type APIErrorDetail = { message: string; code: string };

export class APIException extends HttpException {
  constructor(detail: APIErrorDetail, status: number, cause?: Error) {
    super(detail, status, cause ? { cause: cause } : undefined);
  }
}
