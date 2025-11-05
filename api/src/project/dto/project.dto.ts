import { Project } from '../entities/project.entity';

export class ProjectCreateDTO {
  uid: string;
  calendarId: string;
  tasklistId: string;
}
export class ProjectDTO extends ProjectCreateDTO {
  _id: string;
}

export function projectDTOMapper(project: Project): ProjectDTO {
  return {
    ...project,
    _id: project._id.toString(),
  };
}
