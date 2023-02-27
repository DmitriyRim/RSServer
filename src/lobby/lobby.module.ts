import { Module } from '@nestjs/common';

import { LobbyRepository } from './lobby.repository';
import { LobbyGateway } from './lobby.gateway';
import { UserModule } from '../user/user.module';
import { LobbyFacade } from './lobby.facade';
import { LobbySaga } from './lobby.saga';
import { LobbyAcl } from './lobby.acl';

@Module({
  imports: [UserModule],
  providers: [LobbyRepository, LobbyFacade, LobbyGateway, LobbySaga, LobbyAcl],
  exports: [LobbyRepository],
})
export class LobbyModule {}
