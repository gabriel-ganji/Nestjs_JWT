import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsEmail } from 'class-validator';
import { Messages } from 'src/message/entities/message.entity';

@Entity()
export class Person {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ length: 255 })
  passwordHash: string;

  @Column({ length: 100 })
  name: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  //A person can have sended many messages (like "from")
  //These messages are related to the field "from" in entity message
  @OneToMany(() => Messages, (message) => message.from)
  sendedMessages: Messages[];

  //A person can have received many messages (like "to")
  //These messages are related to the field "to" in entity message
  @OneToMany(() => Messages, (message) => message.to)
  receivedMessages: Messages[];

  @Column({ default: true })
  active: boolean;

}
