import { Module } from '@nestjs/common';

import { UserRepository } from './user.repository';
import { UserController } from './user.controller';
import { UserFacade } from './user.facade';

@Module({
  controllers: [UserController],
  providers: [UserRepository, UserFacade],
  exports: [UserRepository],
})
export class UserModule {}
