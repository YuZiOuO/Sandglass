import { Injectable } from '@nestjs/common';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Record } from './entities/record.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RecordService {
  constructor(
    @InjectRepository(Record) private recordRepo: Repository<Record>,
  ) {}

  create(createRecordDto: CreateRecordDto) {
    return this.recordRepo.insert(createRecordDto);
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
