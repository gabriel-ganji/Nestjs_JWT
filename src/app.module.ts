import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { PersonModule } from './person/person.module';
import { MessageModule } from './message/message.module';
import { IsAdminGuard } from './common/guards/is-admin.guard';
import { SimpleMiddleware } from './common/middlewares/simple.middleware';
import { ErrorExceptionFilter } from './common/filters/error-exception.filter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from '@hapi/joi';
// import appConfig from './app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      // load: [appConfig],
      // validationSchema: Joi.object({
      //   DATABASE_TYPE: Joi.required(),
      //   DATABASE_HOST: Joi.required(),
      //   DATABASE_PORT: Joi.number().default(5432),
      //   DATABASE_USERNAME: Joi.required(),
      //   DATABASE_DATABASE: Joi.required(),
      //   DATABASE_PASSWORD: Joi.required(),
      //   DATABASE_AUTOLOADENTITIES: Joi.number().min(0).max(1).default(0),
      //   DATABASE_SYNCHRONIZE: Joi.number().min(0).max(1).default(0),
      // }),
    }),
    // TypeOrmModule.forRoot({
    //   type: process.env.DATABASE_TYPE as 'postgres',
    //   host: process.env.DATABASE_HOST,
    //   port: +process.env.DATABASE_PORT,
    //   username: process.env.DATABASE_USERNAME,
    //   database: process.env.DATABASE_DATABASE,
    //   password: process.env.DATABASE_PASSWORD,
    //   autoLoadEntities: Boolean(process.env.DATABASE_AUTOLOADENTITIES), // Carrega entidades sem precisar especifica-las
    //   synchronize: Boolean(process.env.DATABASE_SYNCHRONIZE), // Sincroniza com o BD. Não deve ser usado em produção
    // }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [],
      useFactory: async (ConfigService: ConfigService) => {
        return {
          type: ConfigService.get<'postgres'>('database.type'),
          host: ConfigService.get<string>('database.host'),
          port: ConfigService.get<number>('database.port'),
          username: ConfigService.get<string>('database.username'),
          database: ConfigService.get<string>('database.database'),
          password: ConfigService.get<string>('database.password'),
          autoLoadEntities: ConfigService.get<boolean>('database.autoLoadEntities'),
          synchronize: ConfigService.get<boolean>('database.synchronize'),
        }
      }
    }),
    MessageModule,
    PersonModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: ErrorExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: IsAdminGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SimpleMiddleware).forRoutes({
      path: '*', //It means that middleware 'SimpleMiddleware' is above all routes
      method: RequestMethod.ALL, //It means that middleware 'SimpleMiddleware' uses all methods
    });
  }
}
