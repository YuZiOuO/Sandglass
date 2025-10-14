import { Module } from '@nestjs/common';
import { GoogleAuthModule } from './google/google-auth.module';
import { GithubAuthModule } from './github/github-auth.module';

@Module({ imports: [GoogleAuthModule, GithubAuthModule] })
export class OauthModule {}
