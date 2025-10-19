import { Controller, Get, Query } from '@nestjs/common';
import { GithubAuthService } from './github-auth.service';

@Controller('oauth/github')
export class GithubAuthController {
  constructor(private readonly githubAuthService: GithubAuthService) {}

  @Get()
  getGithubAuthUrl(@Query('uid') uid: string) {
    return this.githubAuthService.generateAuthUrl(uid);
  }

  @Get('verify')
  async githubAuthCallback(
    @Query('code') code: string,
    @Query('state') state: string,
  ) {
    const token = await this.githubAuthService.exchangeToken(code);
    await this.githubAuthService.create(state, token.access_token);
  }
}
