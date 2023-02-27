export abstract class Event<Data = unknown> {
  static type: string;
  private readonly type: string;
  private readonly data?: Data;

  protected constructor(type: string, data?: Data) {
    this.type = type;
    this.data = data;
  }

  getType(): string {
    return this.type;
  }

  getData(): Data | undefined {
    return this.data;
  }
}
