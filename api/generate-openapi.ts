import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import * as fs from 'fs';
import { documentFactory } from 'src/app.swagger';

async function generateApiDoc() {
  const app = await NestFactory.create(AppModule, { preview: true });
  const outputPath = './openapi.json';
  fs.writeFileSync(outputPath, JSON.stringify(documentFactory(app), null, 2));
  await app.close();
}

generateApiDoc();
