import { HttpException } from '@nestjs/common';
import { ApiResponseOptions } from '@nestjs/swagger';
import { APIErrorDetailDTO } from './app.swagger';

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
      type: APIErrorDetailDTO,
      example: new APIErrorDetailDTO(this._detail.message, this._detail.code),
    };
  }
}
