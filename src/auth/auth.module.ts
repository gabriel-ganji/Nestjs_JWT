import { Global, Module } from "@nestjs/common";
import { HashingService } from "./hashing/hashing.service";
import { BcryptService } from "./hashing/bcrypt.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Person } from "src/person/entities/person.entity";
import { ConfigModule } from "@nestjs/config";
import jwtConfig from "./config/jwt.config";

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([Person]),
        ConfigModule.forFeature(jwtConfig),
    ],
    controllers: [
        AuthController
    ],
    providers: [
        {
            provide: HashingService,
            useClass: BcryptService,
        },
        AuthService,
    ],
    exports: [HashingService],
})
export class AuthModule { }