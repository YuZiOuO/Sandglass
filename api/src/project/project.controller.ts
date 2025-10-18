import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectDTO } from './dto/project.dto';
import { UserId } from 'src/firebase/authentication/authentication.decorator';
import { AuthenticationGuard } from 'src/firebase/authentication/authentication.guard';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  @UseGuards(AuthenticationGuard)
  async listProject(@UserId() uid: string) {
    const result = await this.projectService.list(uid);
    // Do not use Project Entity as return value,as it causes swagger to crash
    return result as ProjectDTO[];
  }

  @Post()
  async createProject(@Body() dto: ProjectDTO) {
    const { uid, calendarId, tasklistId } = dto;
    return await this.projectService.create(uid, calendarId, tasklistId);
  }

  @Get(':id')
  async getProject(@Param('id') id: string) {
    return (await this.projectService.get(id)) as ProjectDTO;
  }
}
