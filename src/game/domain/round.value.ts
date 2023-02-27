import { RoundType } from './round.type';
import { DataValue } from './data.value';

export class RoundValue {
  private readonly type: RoundType;
  private readonly time: number;
  private readonly data: DataValue;
  private start: number;
  private end: number;

  constructor(type: RoundType, time: number, data: DataValue = new DataValue(), start?: number, end?: number) {
    this.type = type;
    this.time = time;
    this.data = data;
    this.setTimeSpan(start, end);
  }

  isFinished(): boolean {
    return this.getEndTime() < Date.now();
  }

  updateData(playerId: string, data: unknown): RoundValue {
    const updatedData: DataValue = this.data.updateData(playerId, data);
    return new RoundValue(this.type, this.time, updatedData, this.start, this.end);
  }

  getEndTime(): number {
    return this.end;
  }

  getData(): DataValue {
    return this.data;
  }

  getType(): RoundType {
    return this.type;
  }

  private setTimeSpan(start?: number, end?: number): void {
    this.start = start ?? Date.now();
    this.end = end ?? this.start + this.time * 1000;
  }
}
