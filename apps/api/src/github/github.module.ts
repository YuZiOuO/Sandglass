import { Module } from '@nestjs/common';
import { GithubService } from './github.service';
import { GithubController } from './github.controller';
import { GithubAuthModule } from 'src/oauth/github/github-auth.module';

@Module({
  providers: [GithubService],
  controllers: [GithubController],
  imports: [GithubAuthModule],
})
export class GithubModule {}
