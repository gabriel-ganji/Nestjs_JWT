import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageService } from './message.service';
import { Messages } from './entities/message.entity';
import { MessageController } from './message.controller';
import { PersonModule } from 'src/person/person.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Messages]),
    PersonModule
  ],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule { }
