import { Event } from '../../../event/event.model';
import { UserEntity } from '../../../user/user.entity';
import { LobbyEntity } from '../lobby.entity';

export class PlayerWasExpelledEvent extends Event<[UserEntity, LobbyEntity]> {
  static type: string = 'PlayerWasExpelled';

  constructor(player: UserEntity, lobby: LobbyEntity) {
    super(PlayerWasExpelledEvent.type, [player, lobby]);
  }
}
