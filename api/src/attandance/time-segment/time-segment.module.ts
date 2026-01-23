import { Module } from '@nestjs/common';
import { TimeSegmentService } from './time-segment.service';

@Module({
  providers: [TimeSegmentService],
})
export class TimeSegmentModule {}
