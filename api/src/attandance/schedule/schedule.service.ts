import { Injectable } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule) private scheduleRepo: Repository<Schedule>,
  ) {}

  async create(createScheduleDto: CreateScheduleDto) {
    return await this.scheduleRepo.insert(createScheduleDto);
  }

  async find(id: number | number[]) {
    return await this.scheduleRepo.find({
      where: { _id: In(([] as number[]).concat(id)) },
    });
  }

  update(id: number, updateScheduleDto: UpdateScheduleDto) {
    return this.scheduleRepo.update(id, updateScheduleDto);
  }

  remove(id: number | number[]) {
    return this.scheduleRepo.delete(id);
  }
}
