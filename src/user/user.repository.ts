import { Injectable } from '@nestjs/common';

import { UserEntity } from './user.entity';

@Injectable()
export class UserRepository {
  private readonly users: Map<string, UserEntity> = new Map();

  async save(user: UserEntity): Promise<UserEntity> {
    this.users.set(user.getId(), user);
    return user;
  }

  async remove(user: UserEntity): Promise<void> {
    this.users.delete(user.getId());
  }

  async getById(id: string): Promise<UserEntity | null> {
    return this.users.get(id) ?? null;
  }

  async getByIdOrFail(id: string): Promise<UserEntity> {
    const user: UserEntity | undefined = this.users.get(id);
    if (!user) throw new Error();
    return user;
  }
}
