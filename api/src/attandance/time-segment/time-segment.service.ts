import { Injectable } from '@nestjs/common';
import { CreateTimeSegmentDto } from './dto/create-time-segment.dto';
import { UpdateTimeSegmentDto } from './dto/update-time-segment.dto';

@Injectable()
export class TimeSegmentService {
  create(createTimeSegmentDto: CreateTimeSegmentDto) {
    return 'This action adds a new timeSegment';
  }

  find(id: number | number[]) {
    return `This action returns a #${id} timeSegment`;
  }

  update(id: number, updateTimeSegmentDto: UpdateTimeSegmentDto) {
    return `This action updates a #${id} timeSegment`;
  }

  remove(id: number | number[]) {
    return `This action removes a #${id} timeSegment`;
  }
}
