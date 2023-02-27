import { v4 as uuidv4 } from 'uuid';
import { Event } from './event/event.model';

export abstract class AggregateRoot {
  private readonly id: string;
  private readonly createdAt: Date;
  private events: Event[];

  protected constructor() {
    this.id = uuidv4();
    this.createdAt = new Date();
    this.events = [];
  }

  equals(entity: AggregateRoot): boolean {
    return this.getId() === entity.getId();
  }

  flushEvents(): Event[] {
    const events: Event[] = this.events;
    this.events = [];
    return events;
  }

  getId(): string {
    return this.id;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  protected apply(event: Event): void {
    this.events.push(event);
  }
}
