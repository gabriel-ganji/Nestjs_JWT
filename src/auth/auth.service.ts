import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import { Repository } from "typeorm";
import { Person } from "src/person/entities/person.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { HashingService } from "./hashing/hashing.service";
import jwtConfig from "./config/jwt.config";
import { ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { RefreshTokenDto } from "./dto/refresh-token.dto";

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(Person)
        private readonly personRepository: Repository<Person>,
        private readonly hashingService: HashingService,
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
        private readonly jwtService: JwtService
    ) { }

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

        return this.createTokens(person);
    }

    private async createTokens(person: Person) {
        const accessToken = await this.signJwtAsync<Partial<Person>>(
            person.id,
            this.jwtConfiguration.ttl,
            { email: person.email }
        );

        const refreshToken = await this.signJwtAsync(
            person.id,
            this.jwtConfiguration.refreshTtl
        );

        return {
            accessToken,
            refreshToken,
        };

    }

    private async signJwtAsync<T>(sub: number, expiresIn: number, payload?: T) {
        return await this.jwtService.signAsync(
            {
                sub,
                ...payload,
            },
            {
                audience: this.jwtConfiguration.aud,
                issuer: this.jwtConfiguration.issuer,
                secret: this.jwtConfiguration.secret,
                expiresIn,
            }
        );
    }

    async refreshTokens(refreshTokenDto: RefreshTokenDto) {
        try {
            const { sub } = await this.jwtService.verifyAsync(
                refreshTokenDto.refreshToken,
                this.jwtConfiguration,
            );

            const user = await this.personRepository.findOneBy({ id: sub });
            
            if(!user) {
                throw new Error('Pessoa não encontrada');
            }

            return this.createTokens(user);

        } catch (error) {
            throw new UnauthorizedException(error.message);
        }
    }

}