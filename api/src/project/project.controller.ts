import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ProjectService } from './project.service';
import { createProjectDTO } from './dto/project.dto';
import { UserId } from 'src/authentication/authentication.decorator';
import { AuthenticationGuard } from 'src/authentication/authentication.guard';

@Controller('project')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly authGuard: AuthenticationGuard,
  ) {}

  @Get()
  @UseGuards(this.authGuard.canActivate)
  listProject(@UserId() uid: string) {
    return this.projectService.list(uid);
  }

  @Post()
  async createProject(@Body() dto: createProjectDTO) {
    const { uid, calendarId, tasklistId } = dto;
    await this.projectService.create(uid, calendarId, tasklistId);
  }

  @Get(':id')
  async getProject(@Param('id') id: string) {
    return await this.projectService.get(id);
  }
}
