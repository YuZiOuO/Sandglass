import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { GoogleAuthService } from './google-auth.service';
import { FirebaseService } from 'src/firebase/firebase.service';
import { error } from 'console';
import { AuthenticationGuard } from 'src/authentication/authentication.guard';

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
      code: string;
      error?: string;
      scope?: string;
      state: string;
    },
  ) {
    if (result.error || !result.code) {
      return error;
    } else {
      const token = await this.googleAuthService.retriveRefreshToken(
        result.code,
      );
      const r = await this.googleAuthService.create(result.state, token);
      console.log(r);
      return;
    }
  }
}
