import { Event } from '../../../event/event.model';
import { GameEntity } from '../game.entity';

export class GameStartedEvent extends Event<GameEntity> {
  static type: string = 'GameStarted';

  constructor(game: GameEntity) {
    super(GameStartedEvent.type, game);
  }
}
