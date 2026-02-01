import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { documentFactory, dumpApi } from './app.swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: [
        'https://sandglass.kanata.ink',
        'https://sandglass-ccce4.web.app',
      ],
    },
  });

  const api = documentFactory(app);
  SwaggerModule.setup('api', app, api, {
    explorer: true,
  });
  dumpApi(api);

  if (
    app
      .get(ConfigService)
      .get<string>('TERMINATE_AFTER_API_DOC_IS_GENERATED') !== undefined
  ) {
    process.exit(0);
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
