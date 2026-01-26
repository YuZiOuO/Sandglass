import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm';

@Entity()
export class GoogleAuth {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ unique: true })
  uid: string;

  @Column()
  googleRefreshToken: string;
}
