import { Controller, Post, Body } from '@nestjs/common';
import { AttendanceRecordService } from './record.service';
import type { AttendanceRecord } from 'src/generated/prisma/client';

@Controller('record')
export class RecordController {
  constructor(private readonly recordService: AttendanceRecordService) {}

  @Post()
  create(@Body() createRecordDto: AttendanceRecord) {
    return this.recordService.create(createRecordDto);
  }

  // @Get()
  // findAll() {
  //   return this.recordService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.recordService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateRecordDto: UpdateRecordDto) {
  //   return this.recordService.update(+id, updateRecordDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.recordService.remove(+id);
  // }
}
