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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      database: 'postgres',
      password: '123456',
      autoLoadEntities: true, //Charge entitites without specifications.
      synchronize: true, //Synchronize with DB(DONT USE ON PRODUTION!!!).
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
