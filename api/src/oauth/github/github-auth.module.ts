import { Module } from '@nestjs/common';
import { GithubAuthService } from './github-auth.service';
import { GithubAuthController } from './github-auth.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GithubAuth } from './entity/github-auth.entity';

@Module({
  providers: [GithubAuthService],
  controllers: [GithubAuthController],
  imports: [HttpModule, TypeOrmModule.forFeature([GithubAuth])],
  exports: [GithubAuthService],
})
export class GithubAuthModule {}
