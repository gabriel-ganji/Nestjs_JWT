import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Person } from './entities/person.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdatePersonDto } from './dto/update-person.dto';
import { CreatePersonDto } from './dto/create-person.dto';
import { HashingService } from 'src/auth/hashing/hashing.service';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
    private readonly hashingService: HashingService,
  ) {}

  async create(createPersonDto: CreatePersonDto) {

    const passwordHash = await this.hashingService.hash(
      createPersonDto.password,   
    );

    try {
      const personData = {
        name: createPersonDto.name,
        passwordHash,
        email: createPersonDto.email,
      };

      const newPerson = this.personRepository.create(personData);
      await this.personRepository.save(newPerson);

      return newPerson;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('E-mail já está cadastrado.');
      }
      throw error;
    }
  }

  async findAll() {
    const people = this.personRepository.find({
      order: {
        id: 'desc',
      },
    });
    return people;
  }

  async findOne(id: number) {
    const person = await this.personRepository.findOneBy({
      id,
    });

    if (!person) {
      throw new NotFoundException('Pessoa não encontrada.');
    }

    return person;
  }

  async update(id: number, updatePersonDto: UpdatePersonDto, tokenPayload: TokenPayloadDto) {

    const personData = {
      name: updatePersonDto.name,
    };

    if(updatePersonDto.password) {

      const passwordHash = await this.hashingService.hash(updatePersonDto.password);
      personData['passwordHash'] = passwordHash;
    
    }

    const person = await this.personRepository.preload({
      id,
      ...personData,
    });

    if (!person) {
      throw new NotFoundException('Pessoa não encontrada');
    }

    return this.personRepository.save(person);
  }

  async remove(id: number, tokenPayload: TokenPayloadDto) {
    const person = await this.personRepository.findOneBy({
      id,
    });

    if (!person) {
      throw new NotFoundException('Pessoa não encontrada.');
    }

    return this.personRepository.remove(person);
  }
}
