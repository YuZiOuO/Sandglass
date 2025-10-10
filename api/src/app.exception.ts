import { applyDecorators, HttpException } from '@nestjs/common';
import { ApiResponse, ApiResponseOptions } from '@nestjs/swagger';

type APIErrorDetail = { message: string; code: string };

export class APIException extends HttpException {
  _status: number;
  _detail: APIErrorDetail;

  constructor(detail: APIErrorDetail, status: number, cause?: Error) {
    super(detail, status, cause ? { cause: cause } : undefined);
    this._status = status;
    this._detail = detail;
  }

  get apiResponseOptions(): ApiResponseOptions {
    return {
      status: this._status,
      description: this._detail.message,
    };
  }
}

type Constructor<T> = new (...args: any[]) => T;

export function generateApiResponse(e: Constructor<APIException>) {
  const instance = new e();
  return applyDecorators(ApiResponse(instance.apiResponseOptions));
}
