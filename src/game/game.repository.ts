import { Injectable } from '@nestjs/common';

import { GameEntity } from './domain/game.entity';
import { UserEntity } from '../user/user.entity';
import { LobbyEntity } from '../lobby/domain/lobby.entity';

@Injectable()
export class GameRepository {
  private readonly games: Map<string, GameEntity> = new Map();

  async save(game: GameEntity): Promise<GameEntity> {
    this.games.set(game.getId(), game);
    return game;
  }

  async findByPlayer(player: UserEntity): Promise<GameEntity | null> {
    let game: GameEntity | null = null;

    this.games.forEach((g: GameEntity) => {
      const lobby: LobbyEntity = g.getLobby();
      if (lobby.has(player)) game = g;
    });

    return game;
  }

  async findByPlayerOrFail(player: UserEntity): Promise<GameEntity> {
    const game: GameEntity | null = await this.findByPlayer(player);
    if (!game) throw new Error();
    return game;
  }
}
