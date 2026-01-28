import { INestiaConfig } from '@nestia/sdk';
// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './src/app.module';
// import { FastifyAdapter } from '@nestjs/platform-fastify';

const NESTIA_CONFIG: INestiaConfig = {
  //   input: async () => {
  //     // const app = await NestFactory.create(AppModule);
  //     const app = await NestFactory.create(AppModule, new FastifyAdapter());
  //     app.setGlobalPrefix('api');
  //     app.enableVersioning({
  //       type: VersioningType.URI,
  //       prefix: 'v',
  //     });
  //     return app;
  //   },
  input: 'src/app.controller.ts',
  output: '../sdk/src',
  distribute: '../sdk',
};
export default NESTIA_CONFIG;
