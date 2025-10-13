import { Controller, Get, Param, Query } from '@nestjs/common';
import { GithubAuthService } from './github-auth.service';

@Controller('github-auth')
export class GithubAuthController {
  constructor(private readonly githubAuthService: GithubAuthService) {}

  @Get('authUrl/:uid')
  getAuthUrl(@Param('uid') uid: string) {
    return this.githubAuthService.generateAuthUrl(uid);
  }

  @Get('verify')
  async create(@Query('code') code: string) {
    return await this.githubAuthService.exchangeToken(code);
  }
}
