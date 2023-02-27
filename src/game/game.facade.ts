import { Injectable } from '@nestjs/common';

import { GameRepository } from './game.repository';
import { UserEntity } from '../user/user.entity';
import { LobbyEntity } from '../lobby/domain/lobby.entity';
import { LobbyRepository } from '../lobby/lobby.repository';
import { GameAcl } from './game.acl';
import { GameEntity } from './domain/game.entity';
import { EventBus } from '../event/event.bus';
import { GameStartedEvent } from './domain/events/game-started.event';
import { GameRoundStartedEvent } from './domain/events/game-round-started.event';
import { DataValue } from './domain/data.value';

@Injectable()
export class GameFacade {
  constructor(
    private readonly gameRepository: GameRepository,
    private readonly lobbyRepository: LobbyRepository,
    private readonly gameAcl: GameAcl,
    private readonly eventBus: EventBus,
  ) {}

  async start(player: UserEntity): Promise<GameEntity> {
    const lobby: LobbyEntity = await this.lobbyRepository.getByPlayerOfFail(player);
    this.gameAcl.canStart(player, lobby);
    const game: GameEntity = new GameEntity(lobby);
    await this.gameRepository.save(game);
    this.eventBus.emit([new GameStartedEvent(game), new GameRoundStartedEvent(game, new DataValue())]);
    return game;
  }

  async update(player: UserEntity, currentRound: number, data: unknown): Promise<GameEntity> {
    const game: GameEntity = await this.gameRepository.findByPlayerOrFail(player);
    this.gameAcl.canUpdate(player, game, currentRound);
    game.updateData(player, currentRound, data);
    this.eventBus.emit(game.flushEvents());
    await this.gameRepository.save(game);
    return game;
  }
}
