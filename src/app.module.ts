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
import { ConfigModule, ConfigType } from '@nestjs/config';
import { GlobalConfigModule } from './global-config/global-config.module';
import globalConfig from './global-config/global.config';
// import appConfig from './app.config';

@Module({
  imports: [
    ConfigModule.forFeature(globalConfig),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(globalConfig)],
      inject: [globalConfig.KEY],
      useFactory: async (globalConfigurations: ConfigType<typeof globalConfig>) => {
        return {
          type: globalConfigurations.database.type,
          host: globalConfigurations.database.host,
          port: globalConfigurations.database.port,
          username: globalConfigurations.database.username,
          database: globalConfigurations.database.database,
          password: globalConfigurations.database.password,
          autoLoadEntities: globalConfigurations.database.autoLoadEntities,
          synchronize: globalConfigurations.database.synchronize,
        }
      }
    }),
    MessageModule,
    PersonModule,
    GlobalConfigModule,
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
