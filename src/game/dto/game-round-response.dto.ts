import { RoundType } from '../domain/round.type';
import { RoundValue } from '../domain/round.value';

export class GameRoundResponseDto {
  readonly type: RoundType;
  readonly end: number;

  constructor(round: RoundValue) {
    this.type = round.getType();
    this.end = round.getEndTime();
  }
}
