import { AggregateRoot } from '../../aggregate.root';
import { LobbyEntity } from '../../lobby/domain/lobby.entity';
import { UserEntity } from '../../user/user.entity';
import { GameDataUpdatedEvent } from './events/game-data-updated.event';
import { RoundValue } from './round.value';
import { RoundType } from './round.type';
import { GameRoundStartedEvent } from './events/game-round-started.event';
import { GameCompletedEvent } from './events/game-completed.event';
import { DataValue } from './data.value';
import { AlbumValue } from './album.value';

export class GameEntity extends AggregateRoot {
  private readonly lobby: LobbyEntity;
  private readonly rounds: RoundValue[];
  private readonly roundsCount: number;
  private currentRoundIndex: number;
  private album: AlbumValue;
  private completed: boolean;

  constructor(lobby: LobbyEntity) {
    super();
    this.lobby = lobby;
    this.rounds = [new RoundValue(RoundType.Writing, 15)];
    this.currentRoundIndex = 0;
    this.completed = false;
    this.roundsCount = this.lobby.getPlayers().length;
  }

  updateData(player: UserEntity, currentRound: number, data: unknown): void {
    if (this.lobby.has(player) && this.currentRoundIndex === currentRound) {
      const round: RoundValue = this.rounds[this.currentRoundIndex];
      this.rounds.splice(this.currentRoundIndex, 1, round.updateData(player.getId(), data));
      this.apply(new GameDataUpdatedEvent(player, this));
    }
  }

  nextRound(): void {
    if (!this.getCurrentRound().isFinished()) return;

    if (this.currentRoundIndex < this.roundsCount - 1) {
      this.startNextRound();
    } else {
      this.completeGame();
    }
  }

  isCompleted(): boolean {
    return this.completed;
  }

  getLobby(): LobbyEntity {
    return this.lobby;
  }

  getCurrentRoundIndex(): number {
    return this.currentRoundIndex;
  }

  getCurrentRound(): RoundValue {
    return this.rounds[this.currentRoundIndex];
  }

  getRoundsCount(): number {
    return this.roundsCount;
  }

  getRounds(): RoundValue[] {
    return this.rounds;
  }

  getAlbum(): AlbumValue {
    return this.album;
  }

  private startNextRound(): void {
    const shifted: DataValue = this.getCurrentRound().getData().shiftData();
    this.currentRoundIndex++;
    const [type, time]: [RoundType, number] = this.currentRoundIndex % 2 ? [RoundType.Drawing, 30] : [RoundType.Writing, 20];
    this.rounds.push(new RoundValue(type, time));
    this.apply(new GameRoundStartedEvent(this, shifted));
  }

  private completeGame(): void {
    this.completed = true;
    this.album = AlbumValue.createFrom(this);
    this.apply(new GameCompletedEvent(this));
  }
}
