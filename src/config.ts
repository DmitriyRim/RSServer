import { ConfigFactoryKeyHost, registerAs } from '@nestjs/config';
import * as process from 'process';

export interface AppConfig {
  port: number;
}

type ConfigFactory<T> = (() => T) & ConfigFactoryKeyHost<T>;

export const appConfig: ConfigFactory<AppConfig> = registerAs('app', () => ({
  port: parseInt(process.env.PORT ?? '3001', 10),
}));
