import { Injectable } from '@nestjs/common';

import { LobbyRepository } from './lobby.repository';
import { UserEntity } from '../user/user.entity';
import { LobbyEntity } from './domain/lobby.entity';
import { EventBus } from '../event/event.bus';
import { LobbyAcl } from './lobby.acl';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class LobbyFacade {
  constructor(
    private readonly lobbyRepository: LobbyRepository,
    private readonly eventBus: EventBus,
    private readonly lobbyAcl: LobbyAcl,
    private readonly userRepository: UserRepository,
  ) {}

  async create(owner: UserEntity): Promise<LobbyEntity> {
    const lobby: LobbyEntity = new LobbyEntity(owner);
    return this.lobbyRepository.save(lobby);
  }

  async join(player: UserEntity, lobbyId: string): Promise<LobbyEntity> {
    const lobby: LobbyEntity = await this.lobbyRepository.getByIdOrFail(lobbyId);
    lobby.join(player);
    await this.lobbyRepository.save(lobby);
    this.eventBus.emit(lobby.flushEvents());
    return lobby;
  }

  async expelPlayer(currentUser: UserEntity, playerId: string): Promise<LobbyEntity> {
    const player: UserEntity = await this.userRepository.getByIdOrFail(playerId);
    const lobby: LobbyEntity = await this.lobbyRepository.getByPlayerOfFail(player);
    this.lobbyAcl.canExpel(currentUser, lobby, player);
    lobby.expelPlayer(player);
    this.eventBus.emit(lobby.flushEvents());
    return lobby;
  }

  async leave(player: UserEntity): Promise<void> {
    const lobby: LobbyEntity | null = await this.lobbyRepository.getByPlayer(player);
    lobby?.leave(player);
    this.eventBus.emit(lobby?.flushEvents() ?? []);
  }
}
