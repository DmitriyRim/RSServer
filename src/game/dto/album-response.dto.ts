import { AlbumValue, PlayerAlbum } from '../domain/album.value';

export class AlbumResponseDto {
  readonly data: [string, PlayerAlbum][];

  constructor(album: AlbumValue) {
    this.data = Array.from(album.getAlbum());
  }
}
