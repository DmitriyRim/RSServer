import { UserEntity } from '../user.entity';

export class UserResponseDto {
  readonly id: string;
  readonly name: string;
  readonly avatar: string;

  constructor(user: UserEntity) {
    this.id = user.getId();
    this.name = user.getName();
    this.avatar = user.getAvatar();
  }
}
