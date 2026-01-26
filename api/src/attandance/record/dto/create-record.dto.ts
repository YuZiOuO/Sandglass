import { OmitType } from '@nestjs/swagger';
import { Record } from '../entities/record.entity';

export class CreateRecordDto extends OmitType(Record, ['id']) {}
