import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getAppHello(): string {
    return 'Hello, World!';
  }
}
