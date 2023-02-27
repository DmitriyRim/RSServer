type GameData = Map<string, unknown>;

export class DataValue {
  private readonly data: GameData;

  constructor(data: GameData = new Map()) {
    this.data = data;
  }

  shiftData(): DataValue {
    type Record = [string, unknown];
    const list: Record[] = Array.from(this.data);
    if (list.length <= 1) return this;
    const last: Record = list.pop()!;
    const shifted: Record[] = [last, ...list];
    const shiftedData: Record[] = Array.from(this.data).map(([userId]: Record, index: number) => [userId, shifted[index][1]]);
    const data: GameData = new Map(shiftedData);
    return new DataValue(data);
  }

  updateData(playerId: string, data: unknown): DataValue {
    const copy: GameData = new Map(this.data);
    copy.set(playerId, data);
    return new DataValue(copy);
  }

  getForPlayer(playerId: string): unknown {
    return this.data.get(playerId) ?? null;
  }
}
