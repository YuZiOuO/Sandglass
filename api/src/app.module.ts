import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserService } from './user/user.service';
import { FirebaseModule } from './firebase/firebase.module';
import { OauthModule } from './oauth/oauth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'mongodb',
        url: configService.get('DB_URI'),
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    FirebaseModule,
    OauthModule,
  ],
  controllers: [AppController],
  providers: [AppService, UserService],
})
export class AppModule {}
