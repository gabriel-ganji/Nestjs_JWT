import { Person } from 'src/person/entities/person.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Messages {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  text: string;

  //Many messages can be send by only one person (sender)
  @ManyToOne(() => Person)
  //Specifies the 'from' column of who sent the message
  @JoinColumn({ name: 'from' })
  from: Person;

  //Many messages can be send by only one person (receiver)
  @ManyToOne(() => Person, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  //Specifies the 'from' column of who received the message
  @JoinColumn({ name: 'to' })
  to: Person;

  @Column({ default: false })
  read: boolean;

  @Column()
  date: Date; //created_at

  @CreateDateColumn()
  createdAt?: Date; //created_at

  @UpdateDateColumn()
  updatedAt?: Date; //updated _at
}
