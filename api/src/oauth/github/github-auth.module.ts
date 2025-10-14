import { Module } from '@nestjs/common';
import { GithubAuthService } from './github-auth.service';
import { GithubAuthController } from './github-auth.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [GithubAuthService],
  controllers: [GithubAuthController],
  imports: [HttpModule],
})
export class GithubAuthModule {}
