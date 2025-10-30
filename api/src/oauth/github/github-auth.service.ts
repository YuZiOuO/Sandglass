import { Injectable } from '@nestjs/common';
import { GithubAuthParamsDTO } from './dto/github-auth-params.dto';
import { ConfigService } from '@nestjs/config';
import { URLSearchParams } from 'url';
import { GithubExchangeTokenDTO } from './dto/github-exchange-token-params.dto';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';
import { GithubExchangeTokenResponseDTO } from './dto/github-exchange-token-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { GithubAuth } from './entity/github-auth.entity';
import { Repository } from 'typeorm';
import {
  LinkAlreadyExistException,
  LinkNotExistException,
} from '../oauth.exception';

@Injectable()
export class GithubAuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    @InjectRepository(GithubAuth)
    private readonly githubAuthRepo: Repository<GithubAuth>,
  ) {}

  private generateParams(uid: string): GithubAuthParamsDTO {
    return {
      client_id: this.configService.getOrThrow<string>('GH_clientId'),
      redirect_uri: this.configService.getOrThrow<string>('GH_RedirectURL'),
      scope: 'user repo:status',
      state: uid,
    };
  }

  generateAuthUrl(uid: string) {
    const params = this.generateParams(uid);

    // Construct searchParams
    const urlParams = new URLSearchParams();
    for (const key in params) {
      const value = params[key as keyof GithubAuthParamsDTO];
      if (value !== undefined) {
        urlParams.append(key, value.toString());
      }
    }

    const endpoint = 'https://github.com/login/oauth/authorize';

    return endpoint + '?' + urlParams.toString();
  }

  async exchangeToken(code: string) {
    const data: GithubExchangeTokenDTO = {
      client_id: this.configService.getOrThrow('GH_clientId'),
      client_secret: this.configService.getOrThrow('GH_clientSecret'),
      code: code,
    };

    const endpoint = 'https://github.com/login/oauth/access_token';

    const observable = this.httpService
      .post<GithubExchangeTokenResponseDTO>(endpoint, data, {
        headers: { Accept: 'application/json' },
      })
      .pipe(map((res) => res.data));

    const responseBody = await lastValueFrom(observable);

    return responseBody;
  }

  async isLinked(uid: string) {
    return (await this.githubAuthRepo.findOne({ where: { uid } })) !== null;
  }

  async create(uid: string, token: string) {
    if (await this.isLinked(uid)) {
      throw new LinkAlreadyExistException();
    }

    await this.githubAuthRepo.save({ uid: uid, accessToken: token });
  }

  async getAccessToken(uid: string) {
    if (!(await this.isLinked(uid))) {
      throw new LinkNotExistException();
    }

    const record = await this.githubAuthRepo.findOne({ where: { uid } });
    if (record === null) {
      throw new Error('Assertion failed.Record should not be null.');
    }

    return record.accessToken;
  }
}
