import { Injectable } from '@nestjs/common';
import { merge } from 'rxjs';

import { EventBus } from '../event/event.bus';
import { NotificationPort } from '../notification/notification.port';
import { PlayerJoinedLobbyEvent } from './domain/events/player-joined-lobby.event';
import { UserEntity } from '../user/user.entity';
import { LobbyEntity } from './domain/lobby.entity';
import { PlayerLeftLobbyEvent } from './domain/events/player-left-lobby.event';
import { PlayerWasExpelledEvent } from './domain/events/player-was-expelled.event';
import { GameStartedEvent } from '../game/domain/events/game-started.event';
import { LobbyRepository } from './lobby.repository';
import { UserResponseDto } from '../user/dto/user-response.dto';

@Injectable()
export class LobbySaga {
  constructor(
    private readonly eventBus: EventBus,
    private readonly notificationPort: NotificationPort,
    private readonly lobbyRepository: LobbyRepository,
  ) {
    this.onLobbyEvents();
    this.onGameStarted();
  }

  private onLobbyEvents(): void {
    merge(
      this.eventBus.on(PlayerJoinedLobbyEvent),
      this.eventBus.on(PlayerLeftLobbyEvent),
      this.eventBus.on(PlayerWasExpelledEvent),
    ).subscribe((event: PlayerJoinedLobbyEvent | PlayerLeftLobbyEvent | PlayerWasExpelledEvent) => {
      const [player, lobby]: [UserEntity, LobbyEntity] = event.getData()!;
      this.notificationPort.send(lobby.getId(), event.getType(), new UserResponseDto(player), lobby.getId());
    });
  }

  private onGameStarted(): void {
    this.eventBus.on(GameStartedEvent).subscribe(async (event: GameStartedEvent) => {
      const lobby: LobbyEntity = event.getData()!.getLobby();
      lobby.lock();
      await this.lobbyRepository.save(lobby);
    });
  }
}
