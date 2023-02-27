import { Injectable } from '@nestjs/common';

import { UserEntity } from '../user/user.entity';
import { LobbyEntity } from '../lobby/domain/lobby.entity';
import { GameEntity } from './domain/game.entity';

@Injectable()
export class GameAcl {
  canStart(player: UserEntity, lobby: LobbyEntity): void {
    if (!lobby.getOwner().equals(player)) {
      throw new Error('Player is not a lobby owner');
    }
  }

  canUpdate(player: UserEntity, game: GameEntity, currentRound: number): void {
    if (!game.getLobby().has(player) || game.getCurrentRoundIndex() !== currentRound) {
      throw new Error(`Player can't update the game`);
    }
  }
}
