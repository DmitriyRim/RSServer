import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { json } from 'express';

import { AppModule } from './app.module';
import { SocketAdapter } from './socket.adapter';

async function bootstrap(): Promise<void> {
  const app: INestApplication = await NestFactory.create(AppModule, { cors: { origin: '*' } });
  app.useWebSocketAdapter(new SocketAdapter(app));
  app.setGlobalPrefix('api');
  app.use(json({ limit: '50mb' }));

  const port: number = app.get(ConfigService).get<number>('app.port')!;
  await app.listen(port);
}

bootstrap();
