import { Module } from '@nestjs/common';
import { GithubAuthService } from './github-auth.service';
import { GithubAuthController } from './github-auth.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GithubAuth } from './entity/github-auth.entity';
import { FirebaseModule } from 'src/firebase/firebase.module';

@Module({
  providers: [GithubAuthService],
  controllers: [GithubAuthController],
  imports: [HttpModule, FirebaseModule, TypeOrmModule.forFeature([GithubAuth])],
  exports: [GithubAuthService],
})
export class GithubAuthModule {}
