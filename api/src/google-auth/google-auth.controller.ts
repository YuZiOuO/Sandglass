import { Controller, Get, Param, Query } from '@nestjs/common';
import { GoogleAuthService } from './google-auth.service';
import { GoogleOAuth2CallbackDTO } from './dto/google-oauth-callback.dto';
import { generateApiResponse } from 'src/app.exception';
import {
  InvalidAuthorizationCodeException,
  LinkAlreadyExistException,
} from './google-auth.exception';
import { ApiBasicAuth } from '@nestjs/swagger';

@Controller('google-auth')
export class GoogleAuthController {
  constructor(private readonly googleAuthService: GoogleAuthService) {}

  @Get('authUrl/:uid')
  // @UseGuards(AuthenticationGuard) //TODO
  getAuthUrl(@Param('uid') uid: string) {
    return this.googleAuthService.generateAuthUrl(uid);
  }

  // Callback
  @Get('verify')
  @ApiBasicAuth()
  @generateApiResponse([
    InvalidAuthorizationCodeException,
    LinkAlreadyExistException,
  ])
  async create(
    @Query()
    dto: GoogleOAuth2CallbackDTO,
  ) {
    const token = await this.googleAuthService.retriveRefreshToken(dto.code);
    const r = await this.googleAuthService.create(dto.state, token);
    console.log(r);
  }

  @Get('/accessToken/:uid')
  async getAccessToken(@Param('uid') uid: string) {
    return await this.googleAuthService.getAccessToken(uid);
  }
}
