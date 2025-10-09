import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GoogleAuth } from './entities/google-auth.entity';
import { Repository } from 'typeorm';
import * as googleapis from 'googleapis';
import { ConfigService } from '@nestjs/config';
import {
  InvalidAuthorizationCodeException,
  InvalidLink,
  LinkAlreadyExistException,
  LinkNotExistException,
} from './google-auth.exception';

@Injectable()
export class GoogleAuthService {
  private readonly newCli: () => googleapis.Common.OAuth2Client;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(GoogleAuth)
    private googleAuthRepo: Repository<GoogleAuth>,
  ) {
    this.newCli = () =>
      new googleapis.Auth.OAuth2Client({
        clientId: configService.getOrThrow('GApis_OAuth2CliId'),
        clientSecret: configService.getOrThrow('GApis_OAuth2CliSecret'),
        redirectUri: configService.getOrThrow('GApis_RedirctURI'),
      });
  }

  private readonly scopes = ['https://www.googleapis.com/auth/calendar'];

  getAuthUrl(uid: string) {
    return this.newCli().generateAuthUrl({
      access_type: 'offline',
      scope: this.scopes,
      state: uid,
      response_type: 'code',
      prompt: 'consent', // Force to retrive refresh token every time.
    });
  }

  async retriveRefreshToken(authorizationCode: string) {
    try {
      const { tokens } = await this.newCli().getToken(authorizationCode);
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

  async getRefreshToken(uid: string) {
    if (!(await this.isLinked(uid))) {
      throw new LinkNotExistException();
    }

    const record = await this.googleAuthRepo.findOne({ where: { uid } });
    if (record === null) {
      throw new Error('Assertion failed.Record should not be null.');
    }

    return record.googleRefreshToken;
  }

  async getAccessToken(uid: string) {
    const refreshToken = await this.getRefreshToken(uid);

    const cli = this.newCli();
    cli.setCredentials({ refresh_token: refreshToken });

    try {
      return (await cli.getAccessToken()).token;
    } catch (e) {
      if (e instanceof Error) {
        throw new InvalidLink(e);
      }
      throw e;
    }
  }

  async remove(uid: string) {}
}
