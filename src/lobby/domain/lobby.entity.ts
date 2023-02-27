import { AggregateRoot } from '../../aggregate.root';
import { UserEntity } from '../../user/user.entity';
import { PlayerJoinedLobbyEvent } from './events/player-joined-lobby.event';
import { PlayerLeftLobbyEvent } from './events/player-left-lobby.event';
import { PlayerWasExpelledEvent } from './events/player-was-expelled.event';

export class LobbyEntity extends AggregateRoot {
  private playersLimit: number = 10;
  private readonly owner: UserEntity;
  private readonly players: UserEntity[];
  private locked: boolean;

  constructor(owner: UserEntity, locked: boolean = false) {
    super();
    this.owner = owner;
    this.players = [this.owner];
    this.locked = locked;
  }

  expelPlayer(player: UserEntity): void {
    const index: number = this.players.findIndex((p: UserEntity) => player.equals(p));
    if (index !== -1 && !this.isLocked()) {
      this.players.splice(index, 1);
      this.apply(new PlayerWasExpelledEvent(player, this));
    }
  }

  leave(player: UserEntity): void {
    const index: number = this.players.findIndex((p: UserEntity) => player.equals(p));
    if (index !== -1) {
      this.players.splice(index, 1);
      this.apply(new PlayerLeftLobbyEvent(player, this));
    }
  }

  join(player: UserEntity): void {
    if (this.players.length < this.playersLimit && !this.isLocked()) {
      this.players.push(player);
      this.apply(new PlayerJoinedLobbyEvent(player, this));
    }
  }

  has(player: UserEntity): boolean {
    return this.players.some((p: UserEntity) => p.equals(player));
  }

  lock(): void {
    this.locked = true;
  }

  isLocked(): boolean {
    return this.locked;
  }

  getPlayers(): UserEntity[] {
    return this.players;
  }

  getPlayersLimit(): number {
    return this.playersLimit;
  }

  getOwner(): UserEntity {
    return this.owner;
  }
}
