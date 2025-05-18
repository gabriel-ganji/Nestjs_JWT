import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //Remove keys are not in dto
      forbidNonWhitelisted: true, //Throw error when key doesn't exist
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
