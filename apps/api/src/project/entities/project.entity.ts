import { ObjectId } from 'mongodb';
import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity()
export class Project {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  uid: string;

  @Column()
  calendarId: string;

  @Column()
  tasklistId: string;
}
