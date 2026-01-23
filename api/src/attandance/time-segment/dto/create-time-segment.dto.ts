import { OmitType } from '@nestjs/swagger';
import { TimeSegment } from '../entities/time-segment.entity';

export class CreateTimeSegmentDto extends OmitType(TimeSegment, ['_id']) {}
