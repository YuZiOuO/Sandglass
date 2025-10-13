import { Injectable } from '@nestjs/common';
import { GithubAuthParamsDTO } from './dto/github-auth-params.dto';
import { ConfigService } from '@nestjs/config';
import { URLSearchParams } from 'url';
import { getGithubUserContribution } from '@snk/github-user-contribution';
import { GithubExchangeTokenDTO } from './dto/github-exchange-token-params.dto';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';
import { GithubExchangeTokenResponseDTO } from './dto/github-exchange-token-response.dto';

@Injectable()
export class GithubAuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  private generateParams(uid: string): GithubAuthParamsDTO {
    return {
      client_id: this.configService.getOrThrow<string>('GH_clientId'),
      redirect_uri: this.configService.getOrThrow<string>('GH_redirctURI'),
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

    const observable = this.httpService.post(endpoint, data).pipe(
      map((res) => {
        return res.data as GithubExchangeTokenResponseDTO;
      }),
    );

    const responseBody = await lastValueFrom(observable);

    return responseBody;
  }
}
