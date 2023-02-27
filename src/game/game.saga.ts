import { Injectable } from '@nestjs/common';

import { EventBus } from '../event/event.bus';
import { NotificationPort } from '../notification/notification.port';
import { GameStartedEvent } from './domain/events/game-started.event';
import { GameDataUpdatedEvent } from './domain/events/game-data-updated.event';
import { UserEntity } from '../user/user.entity';
import { GameEntity } from './domain/game.entity';
import { GameRoundStartedEvent } from './domain/events/game-round-started.event';
import { GameService } from './game.service';
import { GameCompletedEvent } from './domain/events/game-completed.event';
import { GameResponseDto } from './dto/game-response.dto';
import { GameRoundResponseDto } from './dto/game-round-response.dto';
import { DataValue } from './domain/data.value';
import { AlbumResponseDto } from './dto/album-response.dto';

@Injectable()
export class GameSaga {
  constructor(
    private readonly eventBus: EventBus,
    private readonly notificationPort: NotificationPort,
    private readonly gameService: GameService,
  ) {
    this.onGameStarted();
    this.onGameDataUpdated();
    this.onRoundStarted();
    this.onGameCompleted();
  }

  private onGameStarted(): void {
    this.eventBus.on(GameStartedEvent).subscribe((event: GameStartedEvent) => {
      const game: GameEntity = event.getData()!;
      this.notificationPort.send(game.getLobby().getId(), event.getType(), new GameResponseDto(game));
    });
  }

  private onGameDataUpdated(): void {
    this.eventBus.on(GameDataUpdatedEvent).subscribe((event: GameDataUpdatedEvent) => {
      const [player, game]: [UserEntity, GameEntity] = event.getData()!;
      const data: unknown = game.getCurrentRound().getData().getForPlayer(player.getId());
      this.notificationPort.send(game.getLobby().getId(), event.getType(), player.getId(), game.getCurrentRoundIndex(), data);
    });
  }

  private onRoundStarted(): void {
    this.eventBus.on(GameRoundStartedEvent).subscribe((event: GameRoundStartedEvent) => {
      const [game, shuffledData]: [GameEntity, DataValue] = event.getData()!;
      this.gameService.startGameCountdown(game);
      const players: UserEntity[] = game.getLobby().getPlayers();

      players.forEach((player: UserEntity) => {
        const roundDto: GameRoundResponseDto = new GameRoundResponseDto(game.getCurrentRound());
        const data: unknown = shuffledData.getForPlayer(player.getId());
        this.notificationPort.send([player.getId()], event.getType(), roundDto, data, game.getId());
      });
    });
  }

  private onGameCompleted(): void {
    this.eventBus.on(GameCompletedEvent).subscribe((event: GameCompletedEvent) => {
      const game: GameEntity = event.getData()!;
      this.notificationPort.send(game.getLobby().getId(), event.getType(), new AlbumResponseDto(game.getAlbum()), game.getId());
    });
  }
}
