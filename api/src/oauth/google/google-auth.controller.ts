import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { GoogleAuthService } from './google-auth.service';
import { GoogleOAuth2CallbackDTO } from './dto/google-oauth-callback.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { generatedApiResponse } from 'src/app.swagger';
import {
  InvalidAuthorizationCodeException,
  LinkAlreadyExistException,
  InvalidLink,
} from '../oauth.exception';
import { AuthenticationGuard } from 'src/firebase/authentication/authentication.guard';
import { UserId } from 'src/firebase/authentication/authentication.decorator';

@Controller('oauth/google')
export class GoogleAuthController {
  constructor(private readonly googleAuthService: GoogleAuthService) {}

  @Get()
  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth()
  getGoogleAuthUrl(@UserId() uid: string): string {
    return this.googleAuthService.generateAuthUrl(uid);
  }

  @Get('callback')
  @generatedApiResponse([
    InvalidAuthorizationCodeException,
    LinkAlreadyExistException,
  ])
  async googleAuthCallback(
    @Query()
    dto: GoogleOAuth2CallbackDTO,
  ): Promise<void> {
    const token = await this.googleAuthService.retriveRefreshToken(dto.code);
    const r = await this.googleAuthService.create(dto.state, token);
    console.log(r);
  }

  @Get('/token')
  @UseGuards(AuthenticationGuard)
  @generatedApiResponse([InvalidLink])
  async getGoogleAccessToken(@UserId() uid: string): Promise<string> {
    return (await this.googleAuthService.getAccessToken(uid)) as string;
  }
}
