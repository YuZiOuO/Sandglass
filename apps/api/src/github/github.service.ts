import { Injectable } from '@nestjs/common';
import { GithubAuthService } from 'src/oauth/github/github-auth.service';
import { Octokit } from 'octokit';
import { GithubException } from './github.exception';
import { getGithubUserContribution } from 'src/github/@snk/github-user-contribution';

@Injectable()
export class GithubService {
  constructor(private readonly githubAuthService: GithubAuthService) {}

  async getActivities(uid: string) {
    const username = await this.getGithubUsername(uid);
    const token = await this.githubAuthService.getAccessToken(uid);
    const contribution = await getGithubUserContribution(username, {
      githubToken: token,
    });
    return contribution;
  }

  /**
   * Fetch github username linked to the given uid.
   * @param uid not assumed to be valid.
   * @throw TODO
   */
  private async getGithubUsername(uid: string) {
    const token = await this.githubAuthService.getAccessToken(uid);
    const cli = new Octokit({ auth: token });
    try {
      const res = await cli.rest.users.getAuthenticated();
      const username = res.data.login; // login represents the unique username.
      if (username === null) {
        throw Error('Assertion Error.User name should not be null.');
      }
      return username;
    } catch (e) {
      if (e instanceof Error) {
        throw new GithubException(e);
      }
      throw e;
    }
  }
}
