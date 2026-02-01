import { Injectable } from '@nestjs/common';
import { AttendanceRecord } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AttendanceRecordService {
  constructor(private prisma: PrismaService) {}

  async create(createRecordDto: AttendanceRecord) {
    return await this.prisma.attendanceRecord.create({ data: createRecordDto });
  }

  // findAll() {
  //   return `This action returns all record`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} record`;
  // }

  // update(id: number, updateRecordDto: UpdateRecordDto) {
  //   return `This action updates a #${id} record`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} record`;
  // }
}
