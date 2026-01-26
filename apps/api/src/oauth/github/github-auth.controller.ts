import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { GithubAuthService } from './github-auth.service';
import { AuthenticationGuard } from 'src/firebase/authentication/authentication.guard';
import { UserId } from 'src/firebase/authentication/authentication.decorator';

@Controller('oauth/github')
export class GithubAuthController {
  constructor(private readonly githubAuthService: GithubAuthService) {}

  @Get('/authUrl')
  @UseGuards(AuthenticationGuard)
  getGithubAuthUrl(@UserId() uid: string) {
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

  @Get()
  @UseGuards(AuthenticationGuard)
  async getGithubAuthStatus(@UserId() uid: string) {
    return this.githubAuthService.isLinked(uid);
  }
}
