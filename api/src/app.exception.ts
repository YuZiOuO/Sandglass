import { applyDecorators, HttpException } from '@nestjs/common';
import { ApiResponse, ApiResponseOptions } from '@nestjs/swagger';

type APIErrorDetail = { message: string; code: string };

class APIErrorDetailDTO {
  constructor(
    public readonly message: string,
    public readonly code: string,
  ) {}
}

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

type Constructor<T> = new (...args: any[]) => T;

export function generateApiResponse(e: Array<Constructor<APIException>>) {
  if (e.length === 0) {
    throw new Error('Given exception array is empty.');
  }

  const example = new e[0]();

  const apiResponseOptions: ApiResponseOptions = {
    status: example._status,
    description: '',
    type: APIErrorDetailDTO,
    example: new APIErrorDetailDTO(
      example._detail.message,
      example._detail.code,
    ),
  };

  e.forEach((element) => {
    const instance = new element();

    if (instance._status !== example._status) {
      throw new Error('All given exception should have same status code.');
    }

    apiResponseOptions.description += instance._detail.message;
    apiResponseOptions.description += ' @ ';
    apiResponseOptions.description += instance._detail.code;
    apiResponseOptions.description += '  \n';
  });

  return applyDecorators(
    ApiResponse(apiResponseOptions, { overrideExisting: true }),
  );
}
