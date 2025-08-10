import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExceptionsFilter } from './filters';
import { BigintInterceptor } from './interceptors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new ExceptionsFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 自动剥离无效字段
      forbidNonWhitelisted: true, // 出现非法字段直接抛错，提升安全性
      transform: true, // 自动转换类型
    }),
  );
  app.useGlobalInterceptors(new BigintInterceptor());
  await app.listen(3000);
}
bootstrap();
