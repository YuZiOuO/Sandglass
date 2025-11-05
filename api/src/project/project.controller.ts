import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ProjectService } from './project.service';
import { UserId } from 'src/firebase/authentication/authentication.decorator';
import { AuthenticationGuard } from 'src/firebase/authentication/authentication.guard';
import { ProjectCreateDTO, projectDTOMapper } from './dto/project.dto';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  @UseGuards(AuthenticationGuard)
  async listProject(@UserId() uid: string) {
    const result = await this.projectService.list(uid);
    // Do not use Project Entity as return value,as it causes swagger to crash
    return result.map(projectDTOMapper);
  }

  @Post()
  async createProject(@Body() dto: ProjectCreateDTO) {
    const { uid, calendarId, tasklistId } = dto;
    return await this.projectService.create(uid, calendarId, tasklistId);
  }

  @Get(':id')
  async getProject(@Param('id') id: string) {
    const data = await this.projectService.get(id);
    return projectDTOMapper(data);
  }
}
