import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GoogleAuth } from './entities/google-auth.entity';
import { Repository } from 'typeorm';
import * as googleapis from 'googleapis';
import { ConfigService } from '@nestjs/config';
import {
  InvalidAuthorizationCodeException,
  LinkAlreadyExistException,
} from './google-auth.exception';

@Injectable()
export class GoogleAuthService {
  private readonly cli: googleapis.Common.OAuth2Client;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(GoogleAuth)
    private googleAuthRepo: Repository<GoogleAuth>,
  ) {
    this.cli = new googleapis.Auth.OAuth2Client({
      clientId: configService.getOrThrow('GApis_OAuth2CliId'),
      clientSecret: configService.getOrThrow('GApis_OAuth2CliSecret'),
      redirectUri: configService.getOrThrow('GApis_RedirctURI'),
    });
  }

  private readonly scopes = ['https://www.googleapis.com/auth/calendar'];

  getAuthUrl(uid: string) {
    return this.cli.generateAuthUrl({
      access_type: 'offline',
      scope: this.scopes,
      state: uid,
      response_type: 'code',
      prompt: 'consent', // Force to retrive refresh token every time.
    });
  }

  async retriveRefreshToken(authorizationCode: string) {
    try {
      const { tokens } = await this.cli.getToken(authorizationCode);
      if (tokens.refresh_token) {
        console.log(tokens.refresh_token);
        return tokens.refresh_token;
      }
      throw new InvalidAuthorizationCodeException(
        new Error(
          "Refresh Token not found. May caused by a authorization code of type 'online'",
        ),
      );
    } catch (e) {
      if (e instanceof Error) {
        throw new InvalidAuthorizationCodeException(e);
      }
      throw e;
    }
  }

  async create(uid: string, refreshToken: string) {
    if (await this.isLinked(uid)) {
      throw new LinkAlreadyExistException();
    }

    await this.googleAuthRepo.save({
      uid: uid,
      googleRefreshToken: refreshToken,
    });
    return true;
  }

  async isLinked(uid: string) {
    return (await this.googleAuthRepo.findOne({ where: { uid } })) !== null;
  }

  async getRefreshToken(uid: string) {}

  async remove(uid: string) {}
}
