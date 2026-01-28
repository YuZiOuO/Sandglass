import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm';

@Entity()
export class GithubAuth {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ unique: true })
  uid: string;

  @Column()
  accessToken: string;
}
