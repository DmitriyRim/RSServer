import { Event } from '../../../event/event.model';
import { GameEntity } from '../game.entity';
import { DataValue } from '../data.value';

export class GameRoundStartedEvent extends Event<[GameEntity, DataValue]> {
  static type: string = 'GameRoundStarted';

  constructor(game: GameEntity, data: DataValue) {
    super(GameRoundStartedEvent.type, [game, data]);
  }
}
