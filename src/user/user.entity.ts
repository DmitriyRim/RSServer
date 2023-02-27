import { AggregateRoot } from '../aggregate.root';

export class UserEntity extends AggregateRoot {
  private readonly name: string;
  private readonly avatar: string;

  constructor(name: string, avatar: string) {
    super();
    this.name = this.validateName(name);
    this.avatar = this.validateAvatar(avatar);
  }

  getName(): string {
    return this.name;
  }

  getAvatar(): string {
    return this.avatar;
  }

  private validateName(name: string): string {
    if (!name) throw new Error('Name is not provided');
    return name;
  }

  private validateAvatar(avatar: string): string {
    if (!avatar) throw new Error();
    return avatar;
  }
}
