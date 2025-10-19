import { ApiProperty, ApiResponse, ApiResponseOptions } from '@nestjs/swagger';
import { APIException } from './app.exception';
import { applyDecorators, INestApplication } from '@nestjs/common';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerDocumentOptions,
} from '@nestjs/swagger';

export class APIErrorDetailDTO {
  constructor(message: string, code: string) {
    this.message = message;
    this.code = code;
  }

  @ApiProperty()
  public readonly message: string;

  @ApiProperty()
  public readonly code: string;
}

type Constructor<T> = new (...args: any[]) => T;

export function generatedApiResponse(e: Array<Constructor<APIException>>) {
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

// for swagger plugin
const config = new DocumentBuilder()
  .setTitle('Sandglass example')
  .setDescription('The Sandglass API description')
  .setVersion('0.0')
  .addServer('http://localhost:5173/api', 'Vue dev proxy')
  .build();
const options: SwaggerDocumentOptions = {
  autoTagControllers: true,
  operationIdFactory: (controllerKey, methodKey, version) => methodKey,
};
export const documentFactory = (app: INestApplication) =>
  SwaggerModule.createDocument(app, config, options);
