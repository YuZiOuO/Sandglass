import { Controller, Get, Query } from '@nestjs/common';
import { GithubService } from './github.service';
import { GithubContributionDTO } from './dto/github-contribution.dto';

@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get('activities')
  async getGithubActivities(
    @Query('uid') uid: string,
  ): Promise<GithubContributionDTO[]> {
    return await this.githubService.getActivities(uid);
  }
}
