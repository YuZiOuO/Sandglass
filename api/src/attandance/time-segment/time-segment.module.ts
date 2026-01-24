import { Module } from '@nestjs/common';
import { TimeSegmentService } from './time-segment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeSegment } from './entities/time-segment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TimeSegment])],
  providers: [TimeSegmentService],
})
export class TimeSegmentModule {}
