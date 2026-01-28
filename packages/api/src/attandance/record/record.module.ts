import { Module } from '@nestjs/common';
import { AttendanceRecordService } from './record.service';
import { RecordController } from './record.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RecordController],
  providers: [AttendanceRecordService],
})
export class RecordModule {}
