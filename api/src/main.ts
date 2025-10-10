import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerDocumentOptions,
} from '@nestjs/swagger';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Sandglass example')
    .setDescription('The Sandglass API description')
    .setVersion('0.0')
    .build();
  const options: SwaggerDocumentOptions = {
    autoTagControllers: true,
  };
  const documentFactory = () =>
    SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api', app, documentFactory, { explorer: true });

  const outputPath = './openapi.json';
  fs.writeFileSync(outputPath, JSON.stringify(documentFactory(), null, 2));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
