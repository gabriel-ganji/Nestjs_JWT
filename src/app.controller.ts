import { AppService } from './app.service';
import { ConfigType } from '@nestjs/config';
import { Controller, Get, Inject } from '@nestjs/common';
import globalConfig from './global-config/global.config';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(globalConfig.KEY)
    private readonly globalConfiguration: ConfigType<typeof globalConfig>
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
