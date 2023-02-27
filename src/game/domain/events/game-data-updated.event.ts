import { Event } from '../../../event/event.model';
import { UserEntity } from '../../../user/user.entity';
import { GameEntity } from '../game.entity';

export class GameDataUpdatedEvent extends Event<[UserEntity, GameEntity]> {
  static type: string = 'GameDataUpdated';

  constructor(player: UserEntity, game: GameEntity) {
    super(GameDataUpdatedEvent.type, [player, game]);
  }
}
