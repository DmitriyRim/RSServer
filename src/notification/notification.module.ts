import { DynamicModule, Module } from '@nestjs/common';
import { NotificationPort } from './notification.port';

@Module({})
export class NotificationModule {
  static forRoot(): DynamicModule {
    return {
      module: NotificationModule,
      providers: [NotificationPort],
      exports: [NotificationPort],
      global: true,
    };
  }
}
