import { PartialType } from '@nestjs/swagger';
import { CreateTimeSegmentDto } from './create-time-segment.dto';

export class UpdateTimeSegmentDto extends PartialType(CreateTimeSegmentDto) {}
