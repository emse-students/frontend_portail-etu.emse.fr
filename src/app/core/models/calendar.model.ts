import { Event } from './event.model';

export interface Day {
  date: Date;
  events: Event[];
  dayPadding: number;
}
