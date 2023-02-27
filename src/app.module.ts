import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

import { appConfig } from './config';
import { UserModule } from './user/user.module';
import { LobbyModule } from './lobby/lobby.module';
import { EventModule } from './event/event.module';
import { NotificationModule } from './notification/notification.module';
import { GameModule } from './game/game.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
      load: [appConfig],
    }),
    EventModule.forRoot(),
    NotificationModule.forRoot(),
    UserModule,
    LobbyModule,
    GameModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
