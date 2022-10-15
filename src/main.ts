import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v2');
  app.useGlobalPipes(
    new ValidationPipe({
    whitelist: true, //valida que sea solo propiedades del DTO
    forbidNonWhitelisted: true, //valida y muestra mensaje con http status code
    })
  );
  await app.listen(3000);
}
bootstrap();
