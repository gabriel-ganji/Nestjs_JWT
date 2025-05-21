import { ConfigType } from '@nestjs/config';
import appConfig from './app.config';
import { AppService } from './app.service';
import { Controller, Get, Inject } from '@nestjs/common';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(appConfig.KEY)
    private readonly appConfiguration: ConfigType<typeof appConfig>
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
