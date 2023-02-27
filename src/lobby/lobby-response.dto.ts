import { UserResponseDto } from '../user/dto/user-response.dto';
import { LobbyEntity } from './domain/lobby.entity';
import { UserEntity } from '../user/user.entity';

export class LobbyResponseDto {
  readonly id: string;
  readonly playersLimit: number;
  readonly owner: UserResponseDto;
  readonly players: UserResponseDto[];

  constructor(lobby: LobbyEntity) {
    this.id = lobby.getId();
    this.playersLimit = lobby.getPlayersLimit();
    this.owner = new UserResponseDto(lobby.getOwner());
    this.players = lobby.getPlayers().map((player: UserEntity) => new UserResponseDto(player));
  }
}
