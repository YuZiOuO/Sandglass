import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { GoogleAuthService } from './google-auth.service';
import { GoogleOAuth2CallbackDTO } from './dto/google-oauth-callback.dto';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { generatedApiResponse } from 'src/app.swagger';
import {
  InvalidAuthorizationCodeException,
  LinkAlreadyExistException,
  InvalidLink,
} from '../oauth.exception';
import { AuthenticationGuard } from 'src/authentication/authentication.guard';
import { UserId } from 'src/authentication/authentication.decorator';

@Controller('oauth/google')
export class GoogleAuthController {
  constructor(private readonly googleAuthService: GoogleAuthService) {}

  @Get()
  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth()
  getAuthUrl(@UserId() uid: string): string {
    return this.googleAuthService.generateAuthUrl(uid);
  }

  @Get('callback')
  @generatedApiResponse([
    InvalidAuthorizationCodeException,
    LinkAlreadyExistException,
  ])
  async create(
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
  async getAccessToken(@UserId() uid: string): Promise<string> {
    return (await this.googleAuthService.getAccessToken(uid)) as string;
  }
}
