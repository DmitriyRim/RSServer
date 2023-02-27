import { Event } from '../../../event/event.model';
import { GameEntity } from '../game.entity';

export class GameCompletedEvent extends Event<GameEntity> {
  static type: string = 'GameCompleted';

  constructor(game: GameEntity) {
    super(GameCompletedEvent.type, game);
  }
}
