import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserService } from './user/user.service';
import { FirebaseModule } from './firebase/firebase.module';
import { GithubModule } from './github/github.module';
import { GithubAuthModule } from './oauth/github/github-auth.module';
import { GoogleAuthModule } from './oauth/google/google-auth.module';
import { ProjectModule } from './project/project.module';

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
    GithubAuthModule,
    GoogleAuthModule,
    GithubModule,
    ProjectModule,
  ],
  controllers: [AppController],
  providers: [UserService],
})
export class AppModule {}
