import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

type AttandanceType = 'IN' | 'OUT';

@Entity()
export class Record {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: string;

  @Column()
  time: Date;

  @Column()
  type: AttandanceType;
}
