import { Injectable } from '@nestjs/common';

import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserFacade {
  constructor(private readonly userRepository: UserRepository) {}

  async create(name: string, avatar: string): Promise<UserEntity> {
    const user: UserEntity = new UserEntity(name, avatar);
    return this.userRepository.save(user);
  }

  async getById(id: string): Promise<UserEntity | null> {
    return this.userRepository.getById(id);
  }
}
