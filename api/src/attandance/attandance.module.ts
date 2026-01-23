import { Module } from '@nestjs/common';
import { TimeSegmentModule } from './time-segment/time-segment.module';
import { ScheduleModule } from './schedule/schedule.module';

@Module({
  imports: [ScheduleModule, TimeSegmentModule],
})
export class AttandanceModule {}
