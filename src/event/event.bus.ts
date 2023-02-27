import { Injectable, Type } from '@nestjs/common';
import { filter, from, Observable, Subject } from 'rxjs';

import { Event } from './event.model';

@Injectable()
export class EventBus {
  private readonly events$: Subject<Event> = new Subject();

  on<T extends Event>(eventType: Type<T>): Observable<T> {
    return this.events$.pipe(
      filter((event: Event): event is T => {
        return event.getType() === (eventType as any).type;
      }),
    );
  }

  emit(events: Event | Event[]): void {
    if (!Array.isArray(events)) events = [events];
    from(events).subscribe((event: Event) => {
      this.events$.next(event);
    });
  }
}
