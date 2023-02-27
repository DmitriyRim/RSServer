import { Body, Controller, Logger, Post } from '@nestjs/common';

import { UserFacade } from './user.facade';
import { UserEntity } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Controller('users')
export class UserController {
  private readonly logger: Logger;

  constructor(private readonly userFacade: UserFacade) {
    this.logger = new Logger(UserController.name);
  }

  @Post()
  async createUser(@Body() { name, avatar }: CreateUserDto): Promise<UserResponseDto> {
    const user: UserEntity = await this.userFacade.create(name, avatar);
    this.logger.debug(`User ${user.getId()} created`);
    return new UserResponseDto(user);
  }
}
