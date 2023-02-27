import { GameEntity } from '../domain/game.entity';
import { LobbyResponseDto } from '../../lobby/lobby-response.dto';

export class GameResponseDto {
  readonly id: string;
  readonly roundsCount: number;
  readonly lobby: LobbyResponseDto;

  constructor(game: GameEntity) {
    this.id = game.getId();
    this.roundsCount = game.getRoundsCount();
    this.lobby = new LobbyResponseDto(game.getLobby());
  }
}
