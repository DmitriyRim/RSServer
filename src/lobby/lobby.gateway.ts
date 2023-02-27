import { OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

import { LobbyFacade } from './lobby.facade';
import { LobbyEntity } from './domain/lobby.entity';
import { LobbyResponseDto } from './lobby-response.dto';

@WebSocketGateway()
export class LobbyGateway implements OnGatewayDisconnect {
  private readonly logger: Logger;

  @WebSocketServer()
  private server: Server;

  constructor(private readonly lobbyFacade: LobbyFacade) {
    this.logger = new Logger(LobbyGateway.name);
  }

  async handleDisconnect(client: Socket): Promise<void> {
    await this.lobbyFacade.leave(client.user);
    this.logger.debug(`User ${client.user.getId()} disconnected`);
  }

  @SubscribeMessage('lobby:create')
  async create(client: Socket): Promise<LobbyResponseDto> {
    const lobby: LobbyEntity = await this.lobbyFacade.create(client.user);
    client.join(lobby.getId());
    this.logger.debug(`Lobby ${lobby.getId()} created with owner ${lobby.getOwner().getId()}`);
    return new LobbyResponseDto(lobby);
  }

  @SubscribeMessage('lobby:join')
  async join(client: Socket, lobbyId: string): Promise<LobbyResponseDto> {
    const lobby: LobbyEntity = await this.lobbyFacade.join(client.user, lobbyId);
    client.join(lobby.getId());
    this.logger.debug(`Player ${client.user.getId()} joined lobby ${lobbyId}`);
    return new LobbyResponseDto(lobby);
  }

  @SubscribeMessage('lobby:expel')
  async expel(client: Socket, playerId: string): Promise<void> {
    const lobby: LobbyEntity = await this.lobbyFacade.expelPlayer(client.user, playerId);
    await this.leaveRoom(lobby.getId(), playerId);
    this.logger.debug(`Player ${playerId} has been expelled from lobby ${lobby.getId()}`);
  }

  private async leaveRoom(roomId: string, playerId: string): Promise<void> {
    const sockets: Socket[] = (await this.server.in(roomId).fetchSockets()) as any as Socket[];

    for (const socket of sockets) {
      if (socket.user.getId() === playerId) {
        socket.leave(roomId);
      }
    }
  }
}
