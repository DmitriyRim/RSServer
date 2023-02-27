import { Event } from '../../../event/event.model';
import { UserEntity } from '../../../user/user.entity';
import { LobbyEntity } from '../lobby.entity';

export class PlayerLeftLobbyEvent extends Event<[UserEntity, LobbyEntity]> {
  static type: string = 'PlayerLeftLobby';

  constructor(player: UserEntity, lobby: LobbyEntity) {
    super(PlayerLeftLobbyEvent.type, [player, lobby]);
  }
}
