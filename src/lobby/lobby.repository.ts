import { Injectable } from '@nestjs/common';
import { LobbyEntity } from './domain/lobby.entity';
import { UserEntity } from '../user/user.entity';

@Injectable()
export class LobbyRepository {
  protected readonly lobbies: Map<string, LobbyEntity> = new Map();

  async save(lobby: LobbyEntity): Promise<LobbyEntity> {
    this.lobbies.set(lobby.getId(), lobby);
    return lobby;
  }

  async getById(id: string): Promise<LobbyEntity | null> {
    return this.lobbies.get(id) ?? null;
  }

  async getByIdOrFail(id: string): Promise<LobbyEntity> {
    const lobby: LobbyEntity | undefined = this.lobbies.get(id);
    if (!lobby) throw new Error();
    return lobby;
  }

  async getByPlayer(player: UserEntity): Promise<LobbyEntity | null> {
    let lobby: LobbyEntity | null = null;

    this.lobbies.forEach((item: LobbyEntity) => {
      if (item.has(player)) {
        lobby = item;
      }
    });

    return lobby;
  }

  async getByPlayerOfFail(player: UserEntity): Promise<LobbyEntity> {
    const lobby: LobbyEntity | null = await this.getByPlayer(player);
    if (!lobby) throw new Error();
    return lobby;
  }
}
