import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import {
  FailedToSaveProject,
  InvalidCalendarIdOrTasklistId,
  ProjectNotFoundException,
} from './project.exception';
import { ObjectId } from 'mongodb';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
  ) {}

  /**
   * Get all projects associated with given user.
   * @param uid assumed to be valid.
   * @returns a Project[] representes all projects.
   */
  async list(uid: string) {
    return await this.projectRepo.find({ where: { uid } });
  }

  /**
   * Get Project with given id.
   * @param id not assumed to be valid.
   * @throws ProjectNotFoundException if specfied project does not exist.
   */
  async get(id: string) {
    const doc = await this.projectRepo.findOneBy({ _id: new ObjectId(id) });
    if (doc === null) {
      throw new ProjectNotFoundException();
    }
    return doc;
  }

  /**
   * Creates a project. A project is defined by a calendar connected with a tasklist.
   * @param uid assumed to be valid.
   * @param calendarId assume not collide with any existing entry.
   * @param tasklistId assume not collide with any existing entry.
   * @returns a project id(string) if success
   * @throws InvalidCalendarIdOrTasklistId given parameters collides with existing entries.
   */
  async create(
    uid: string,
    calendarId: string,
    tasklistId: string,
  ): Promise<string> {
    if (
      (await this.projectRepo.findOneBy({ calendarId: calendarId })) ||
      (await this.projectRepo.findOneBy({ tasklistId: tasklistId }))
    ) {
      throw new InvalidCalendarIdOrTasklistId();
    }

    try {
      const doc = await this.projectRepo.save({
        uid: uid,
        calendarId: calendarId,
        tasklistId: tasklistId,
      });
      return doc._id.toString();
    } catch (e) {
      if (e instanceof Error) {
        throw new FailedToSaveProject(e);
      }
      throw e;
    }
  }

  /**
   * Overriding existing project.
   * @param _id assumed to be valid
   * @param uid assumed to be valid
   * @param calendarId assume not collide with any existing entry.
   * @param tasklistId assume not collide with any existing entry.
   * @return the project body after overriding
   * @throws ProjectNotFoundException if the document correspoding to _id is not found
   */
  async update(
    _id: string,
    uid: string,
    calendarId: string,
    tasklistId: string,
  ) {
    try {
      const doc = await this.projectRepo.findOneBy({ _id: new ObjectId(_id) });
      if (doc == null) {
        throw new ProjectNotFoundException();
      }
      doc.uid = uid;
      doc.calendarId = calendarId;
      doc.tasklistId = tasklistId;
      await this.projectRepo.save(doc);
    } catch (e) {
      if (e instanceof Error) {
        throw new FailedToSaveProject(e);
      }
    }
  }

  /**
   * Remove Project with given id.Do nothing if given id does not exist.
   * @param id not assumed to be valid.
   */
  async remove(id: string) {
    const doc = await this.projectRepo.findOneBy({ _id: new ObjectId(id) });
    if (doc !== null) {
      await this.projectRepo.delete(doc._id);
    }
  }
}
