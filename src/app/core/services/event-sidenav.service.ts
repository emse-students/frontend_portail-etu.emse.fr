import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Event } from '../models/event.model';

@Injectable({
  providedIn: 'root',
})
export class EventSidenavService {
  isOpen: Subject<boolean>;
  event: Subject<Event>;
  constructor() {
    this.event = new Subject<Event>();
    this.isOpen = new Subject<boolean>();
  }

  open() {
    this.isOpen.next(true);
  }

  close() {
    this.isOpen.next(false);
  }

  setEvent(event: Event) {
    this.open();
    this.event.next(event);
  }
}
