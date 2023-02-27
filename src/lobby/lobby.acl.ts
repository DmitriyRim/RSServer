import { Injectable } from '@nestjs/common';

import { UserEntity } from '../user/user.entity';
import { LobbyEntity } from './domain/lobby.entity';

@Injectable()
export class LobbyAcl {
  canExpel(currentUser: UserEntity, lobby: LobbyEntity, player: UserEntity): void {
    if (!lobby.has(player) || !lobby.getOwner().equals(currentUser)) {
      throw new Error();
    }
  }
}
