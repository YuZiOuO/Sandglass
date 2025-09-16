import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GoogleAuthModule } from './google-auth/google-auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(
      {
        useFactory: (configService: ConfigService) => ({ type: "mongodb", url: configService.get("DB_URI") }),
        inject: [ConfigService],
      }
    ),
    GoogleAuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
