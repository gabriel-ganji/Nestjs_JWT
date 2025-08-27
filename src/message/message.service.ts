import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Messages } from './entities/message.entity';
import { PersonService } from 'src/person/person.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ConfigService, ConfigType } from '@nestjs/config';
import messageConfig from './message.config';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { MESSAGES } from '@nestjs/core/constants';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Messages)
    private readonly messagesRepository: Repository<Messages>,
    private readonly personService: PersonService,
    @Inject(messageConfig.KEY)
    private readonly messageConfiguration: ConfigType<typeof messageConfig>,
  ) {
    console.log(messageConfiguration);
  }

  throwNotFoundError() {
    throw new NotFoundException('Message not found');
  }

  async findAll(pagination?: PaginationDto) {
    const { limit = 10, offset = 0 } = pagination;
    return await this.messagesRepository.find({
      take: limit, //How many registers will return (by page)
      skip: offset, // How many register need to be skipped (limit * actual page)
      relations: ['from', 'to'],
      order: {
        id: 'desc',
      },
      select: {
        from: {
          id: true,
          name: true,
        },
        to: {
          id: true,
          name: true,
        },
      },
    });
  }

  async findOne(id: number) {
    // const message = this.messages.find((item) => item.id === Number(id));

    const message = await this.messagesRepository.findOne({
      where: {
        id,
      },
      relations: ['from', 'to'],
      select: {
        from: {
          id: true,
          name: true,
        },
        to: {
          id: true,
          name: true,
        },
      },
    });

    if (message) return message;

    // throw new HttpException('Message not found.', HttpStatus.NOT_FOUND);
    this.throwNotFoundError();
  }

  async create(createMessageDto: CreateMessageDto, tokenPayload: TokenPayloadDto) {
    const { toId } = createMessageDto;
    //I need find the person that is creating the message
    const from = await this.personService.findOne(tokenPayload.sub);
    //I need find the person that will receive the message
    const to = await this.personService.findOne(toId);

    const newMessage = {
      text: createMessageDto.text,
      from,
      to,
      read: false,
      date: new Date(),
    };

    const message = await this.messagesRepository.create(newMessage);
    await this.messagesRepository.save(message);
    return {
      ...message,
      from: {
        id: message.from.id,
        name: message.from.name,
      },
      to: {
        id: message.to.id,
        name: message.to.name,
      },
    };
  }

  async update(
    id: number, updateMessageDto: UpdateMessageDto,
    tokenPayload: TokenPayloadDto,
  ) {

    const message = await this.findOne(id);

    if (message.from.id !== tokenPayload.sub) {
      throw new ForbiddenException("Este recado não é seu!");
    }

    message.text = updateMessageDto?.text ?? message.text;
    message.read = updateMessageDto?.read ?? message.read;

    await this.messagesRepository.save(message);

    return message;

  }

  async remove(id: number, tokenPayload: TokenPayloadDto) {

    const message = await this.findOne(id);

    if (message.from.id !== tokenPayload.sub) {
      throw new ForbiddenException("Este recado não é seu!");
    }

    if (!message) return this.throwNotFoundError();

    return this.messagesRepository.remove(message);
  }
}
