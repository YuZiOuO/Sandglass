import { ObjectId } from 'mongodb';
import { Column, Entity, ObjectIdColumn } from 'typeorm';

// TODO: 唯一索引
@Entity()
export class TimeSegment {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  scheduleId: ObjectId;

  @Column()
  name: string;

  /**
   * Seconds from 00:00:00. Must be an interger.
   */
  @Column()
  startTime: number;

  /**
   * Seconds from 00:00:00. Must be an interger.
   */
  @Column()
  endTime: number;
}
