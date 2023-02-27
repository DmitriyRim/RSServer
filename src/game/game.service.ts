import { Injectable } from '@nestjs/common';
import { timer } from 'rxjs';

import { GameEntity } from './domain/game.entity';
import { EventBus } from '../event/event.bus';
import { GameRepository } from './game.repository';

@Injectable()
export class GameService {
  private readonly activeGames: Set<string> = new Set();

  constructor(private readonly evenBus: EventBus, private readonly gameRepository: GameRepository) {}

  startGameCountdown(game: GameEntity): void {
    if (!this.activeGames.has(game.getId())) {
      this.activeGames.add(game.getId());
      this.waitForRoundEnd(game);
    }
  }

  private waitForRoundEnd(game: GameEntity): void {
    const timeSpan: number = game.getCurrentRound().getEndTime() - Date.now();

    timer(timeSpan).subscribe(async () => {
      this.activeGames.delete(game.getId());
      game.nextRound();
      this.evenBus.emit(game.flushEvents());
      await this.gameRepository.save(game);
    });
  }
}
