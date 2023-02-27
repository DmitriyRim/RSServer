import { GameEntity } from './game.entity';
import { UserEntity } from '../../user/user.entity';
import { RoundValue } from './round.value';

export type RoundData = [string, unknown];
export type PlayerAlbum = RoundData[];
export type AlbumData = Map<string, PlayerAlbum>;

export class AlbumValue {
  private readonly data: AlbumData;

  private constructor(data: AlbumData) {
    this.data = data;
  }

  static createFrom(game: GameEntity): AlbumValue {
    if (!game.isCompleted()) throw new Error('Game is not completed yet.');

    const album: AlbumData = new Map();
    const players: UserEntity[] = game.getLobby().getPlayers();

    players.forEach((player: UserEntity) => {
      album.set(player.getId(), this.createPlayerAlbum(player, game));
    });

    return new AlbumValue(album);
  }

  private static createPlayerAlbum(player: UserEntity, game: GameEntity): PlayerAlbum {
    const album: PlayerAlbum = [];
    const players: UserEntity[] = game.getLobby().getPlayers();
    const playersChain: string[] = this.getPlayersChain(player, players);

    game.getRounds().forEach((round: RoundValue, index: number) => {
      const playerId: string = playersChain[index];
      const data: unknown = round.getData().getForPlayer(playerId);
      album.push([playerId, data]);
    });

    return album;
  }

  private static getPlayersChain(player: UserEntity, players: UserEntity[]): string[] {
    const playerIndex: number = players.findIndex((p: UserEntity) => p.equals(player));

    return Array.from({ length: players.length }, (_: unknown, index: number) => {
      const nextPlayerIndex: number = (playerIndex + index) % players.length;
      return players[nextPlayerIndex].getId();
    });
  }

  getAlbum(): AlbumData {
    return this.data;
  }
}
