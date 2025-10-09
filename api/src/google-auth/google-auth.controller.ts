import { Controller, Get, Param, UseGuards, Query } from '@nestjs/common';
import { GoogleAuthService } from './google-auth.service';
import { FirebaseService } from 'src/firebase/firebase.service';
import { AuthenticationGuard } from 'src/authentication/authentication.guard';
import {
  InvalidAuthorizationCodeException,
  InvalidVerifyRequestException,
} from './google-auth.exception';

@Controller('google-auth')
export class GoogleAuthController {
  constructor(
    private readonly googleAuthService: GoogleAuthService,
    private readonly firebaseService: FirebaseService,
  ) {}

  @Get('authUrl/:uid')
  // @UseGuards(AuthenticationGuard) //TODO
  getAuthUrl(@Param('uid') uid: string) {
    return this.googleAuthService.getAuthUrl(uid);
  }

  // Callback
  @Get('verify')
  async create(
    @Query()
    result: {
      error?: string;
      code?: string;
      state?: string;
    },
  ) {
    if (result.error) {
      throw new InvalidVerifyRequestException(new Error(result.error));
    }

    if (!result.code) {
      throw new InvalidAuthorizationCodeException(
        new Error('Authorization Code not found.'),
      );
    }

    if (!result.state) {
      throw new InvalidVerifyRequestException(
        new Error('State not set.Possible CSRF Attack.'),
      );
    }

    const token = await this.googleAuthService.retriveRefreshToken(result.code);
    const r = await this.googleAuthService.create(result.state, token);
    console.log(r);
  }

  @Get(':uid')
  async getRefreshToken(@Param('uid') uid: string) {
    return await this.googleAuthService.getRefreshToken(uid);
  }

  @Get('/accessToken/:uid')
  async getAccessToken(@Param('uid') uid: string) {
    return await this.googleAuthService.getAccessToken(uid);
  }
}
