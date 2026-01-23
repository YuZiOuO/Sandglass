import { ObjectId } from 'mongodb';
import { Column, ObjectIdColumn } from 'typeorm';

type DaysOfWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export class Schedule {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  userId: ObjectId;

  @Column()
  name: string;

  @Column()
  daysOfWeek: DaysOfWeek[];
}
