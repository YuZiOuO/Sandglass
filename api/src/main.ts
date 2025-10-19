import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { documentFactory } from './app.swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  SwaggerModule.setup('api', app, () => documentFactory(app), {
    explorer: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
