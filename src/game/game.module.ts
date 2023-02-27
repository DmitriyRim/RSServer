import { Module } from '@nestjs/common';

import { GameRepository } from './game.repository';
import { GameFacade } from './game.facade';
import { GameGateway } from './game.gateway';
import { GameAcl } from './game.acl';
import { LobbyModule } from '../lobby/lobby.module';
import { GameService } from './game.service';
import { GameSaga } from './game.saga';

@Module({
  imports: [LobbyModule],
  providers: [GameRepository, GameFacade, GameGateway, GameAcl, GameService, GameSaga],
})
export class GameModule {}
