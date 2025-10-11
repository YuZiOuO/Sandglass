import { Controller, Get, Param, Query } from '@nestjs/common';
import { GoogleAuthService } from './google-auth.service';
import { GoogleOAuth2CallbackDTO } from './dto/google-oauth-callback.dto';
import {
  InvalidAuthorizationCodeException,
  InvalidLink,
  LinkAlreadyExistException,
} from './google-auth.exception';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiResponseProperty,
} from '@nestjs/swagger';
import { generatedApiResponse } from 'src/app.swagger';

@Controller('google-auth')
export class GoogleAuthController {
  constructor(private readonly googleAuthService: GoogleAuthService) {}

  @Get('authUrl/:uid')
  // @UseGuards(AuthenticationGuard) //TODO
  @ApiBearerAuth()
  @ApiResponseProperty()
  getAuthUrl(@Param('uid') uid: string) {
    return this.googleAuthService.generateAuthUrl(uid);
  }

  // Callback
  @Get('verify')
  @generatedApiResponse([
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
  @ApiOkResponse({ type: String })
  @generatedApiResponse([InvalidLink])
  async getAccessToken(@Param('uid') uid: string) {
    return await this.googleAuthService.getAccessToken(uid);
  }
}
