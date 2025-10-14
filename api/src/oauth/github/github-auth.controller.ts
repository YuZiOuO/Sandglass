import { Controller, Get, Query, Redirect } from '@nestjs/common';
import { GithubAuthService } from './github-auth.service';
import { ConfigService } from '@nestjs/config';

@Controller('oauth/github')
export class GithubAuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly githubAuthService: GithubAuthService,
  ) {}

  @Get()
  getAuthUrl(@Query('uid') uid: string) {
    return Redirect(this.githubAuthService.generateAuthUrl(uid));
  }

  @Get('token')
  async callback(@Query('code') code: string) {
    await this.githubAuthService.exchangeToken(code);
    return Redirect(this.configService.getOrThrow('OAuth_SuccessRedirect'));
  }
}
