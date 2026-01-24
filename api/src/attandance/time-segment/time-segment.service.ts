import { Injectable } from '@nestjs/common';
import { CreateTimeSegmentDto } from './dto/create-time-segment.dto';
import { UpdateTimeSegmentDto } from './dto/update-time-segment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TimeSegment } from './entities/time-segment.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class TimeSegmentService {
  constructor(
    @InjectRepository(TimeSegment)
    private timeSegmentRepo: Repository<TimeSegment>,
  ) {}

  async create(createTimeSegmentDto: CreateTimeSegmentDto) {
    await this.timeSegmentRepo.insert(createTimeSegmentDto);
    return;
  }

  async find(id: number | number[]) {
    return await this.timeSegmentRepo.find({
      where: { _id: In(([] as number[]).concat(id)) },
    });
  }

  async update(id: number, updateTimeSegmentDto: UpdateTimeSegmentDto) {
    return await this.timeSegmentRepo.update(id, updateTimeSegmentDto);
  }

  async remove(id: number | number[]) {
    return await this.timeSegmentRepo.delete(id);
  }
}
