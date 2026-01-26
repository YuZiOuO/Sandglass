import { Module } from '@nestjs/common';
import { RecordModule } from './record/record.module';

@Module({
  imports: [RecordModule],
})
export class AttandanceModule {}
