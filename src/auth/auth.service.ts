import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import { Repository } from "typeorm";
import { Person } from "src/person/entities/person.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { HashingService } from "./hashing/hashing.service";
import jwtConfig from "./config/jwt.config";
import { ConfigType } from "@nestjs/config";

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(Person)
        private readonly personRepository: Repository<Person>,
        private readonly hashingService: HashingService,
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    ) {
        console.log(jwtConfiguration);
    }

    async login(loginDto: LoginDto) {

        let passwordIsValid = false;
        let throwError = true;

        const person = await this.personRepository.findOneBy({
            email: loginDto.email,
        });

        if (person) {
            passwordIsValid = await this.hashingService.compare(
                loginDto.password,
                person.passwordHash
            )
        }

        if (passwordIsValid) {
            throwError = false;
        }

        if (throwError) {
            throw new UnauthorizedException('Usuário ou senha inválida');
        }

        return {
            message: "Usuário logado"
        };

    }
}