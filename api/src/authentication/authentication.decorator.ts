import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const UserId = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    if (data.length !== 0) {
      throw Error('UserId decorator accepts no arguments.');
    }
    const req = context.switchToHttp().getRequest<Request>();
    const uid = req['_uid'] as string;
    return uid;
  },
);
