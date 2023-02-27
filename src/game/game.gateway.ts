import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';

import { GameFacade } from './game.facade';
import { GameEntity } from './domain/game.entity';
import { SuccessResponseDto } from '../success-response.dto';
import { UpdateDataDto } from './dto/update-data.dto';

@WebSocketGateway()
export class GameGateway {
  private readonly logger: Logger;

  constructor(private readonly gameFacade: GameFacade) {
    this.logger = new Logger(GameGateway.name);
  }

  @SubscribeMessage('game:start')
  async start(client: Socket): Promise<SuccessResponseDto> {
    const game: GameEntity = await this.gameFacade.start(client.user);
    this.logger.debug(`Game ${game.getId()} has started`);
    return new SuccessResponseDto();
  }

  @SubscribeMessage('game:update-data')
  async update(client: Socket, [currentRound, data]: UpdateDataDto): Promise<SuccessResponseDto> {
    const game: GameEntity = await this.gameFacade.update(client.user, currentRound, data);
    this.logger.debug(`Game ${game.getId()} updated for user ${client.user.getId()} with ${JSON.stringify(data)}`);
    return new SuccessResponseDto();
  }
}
