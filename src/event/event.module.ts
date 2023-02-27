import { DynamicModule, Module } from '@nestjs/common';
import { EventBus } from './event.bus';

@Module({})
export class EventModule {
  static forRoot(): DynamicModule {
    return {
      module: EventModule,
      providers: [EventBus],
      exports: [EventBus],
      global: true,
    };
  }
}
