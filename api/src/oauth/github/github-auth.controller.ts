import { Controller, Get, Query } from '@nestjs/common';
import { GithubAuthService } from './github-auth.service';

@Controller('oauth/github')
export class GithubAuthController {
  constructor(private readonly githubAuthService: GithubAuthService) {}

  @Get()
  getAuthUrl(@Query('uid') uid: string) {
    return this.githubAuthService.generateAuthUrl(uid);
  }

  @Get('verify')
  async callback(@Query('code') code: string, @Query('state') state: string) {
    const token = await this.githubAuthService.exchangeToken(code);
    await this.githubAuthService.create(state, token.access_token);
  }
}
