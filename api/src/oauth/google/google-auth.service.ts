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
} from '../oauth.exception';

/**
 * @throws GoogleAuthException
 */
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

  private readonly scopes = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/tasks',
  ];

  /**
   * Generates a authorization url for given user;
   * @param uid assumed to be valid.
   */
  generateAuthUrl(uid: string) {
    return this.newCli().generateAuthUrl({
      access_type: 'offline',
      scope: this.scopes,
      state: uid,
      response_type: 'code',
      prompt: 'consent', // Force to retrive refresh token every time.
    });
  }

  /**
   * Retrive a refreshToken from google using given authorizationCode.
   * @param authorizationCode not assumed to be valid.
   * @returns a refreshToken.
   * @throws InvalidAuthorizationCodeException if fails.
   */
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

  /**
   * In DB,Records a new link of a given account to Google.
   * @param uid assumed to be valid.
   * @param refreshToken assumed to be valid.
   * @returns true iff the record is successfully saved.
   * @throws LinkAlreadyExistException if a link to given uid exists.
   */
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

  /**
   * In DB,Check if given uid is Linked to a google account.
   * @param uid not assumed to be valid.
   */
  async isLinked(uid: string) {
    return (await this.googleAuthRepo.findOne({ where: { uid } })) !== null;
  }

  /**
   * In DB, fetches refreshToken linked to given uid.
   * @param uid assumed to be valid.
   * @throws LinkNotExistException if given uid is not linked to any google account.
   */
  private async getRefreshToken(uid: string) {
    if (!(await this.isLinked(uid))) {
      throw new LinkNotExistException();
    }

    const record = await this.googleAuthRepo.findOne({ where: { uid } });
    if (record === null) {
      throw new Error('Assertion failed.Record should not be null.');
    }

    return record.googleRefreshToken;
  }

  /**
   * Fetch a accessToken to Google for given uid.
   * @param uid assumed to be valid.
   * @throws LinkNotExistException if given uid is not linked to any google account.
   * @throws InvalidLink if given uid's link is invalid.
   */
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
}
