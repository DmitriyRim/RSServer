import { Event } from '../../../event/event.model';
import { UserEntity } from '../../../user/user.entity';
import { LobbyEntity } from '../lobby.entity';

export class PlayerJoinedLobbyEvent extends Event<[UserEntity, LobbyEntity]> {
  static type: string = 'PlayerJoinedLobby';

  constructor(player: UserEntity, lobby: LobbyEntity) {
    super(PlayerJoinedLobbyEvent.type, [player, lobby]);
  }
}
