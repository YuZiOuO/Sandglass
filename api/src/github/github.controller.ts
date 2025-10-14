import { Controller, Get, Query } from '@nestjs/common';
import { GithubService } from './github.service';

@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get('activities')
  getActivities(@Query('uid') uid: string) {
    return this.githubService.getActivities(uid);
  }
}
