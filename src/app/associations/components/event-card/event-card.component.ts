import {Component, Input, OnInit} from '@angular/core';
import {EventLight} from '../../../core/models/event.model';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss']
})
export class EventCardComponent implements OnInit {
  _event: EventLight;
  @Input()
  set event(event: EventLight) {
    this._event = event;
    this._event.date = new Date(this._event.date);
    if (this._event.closingDate) {
      this._event.closingDate = new Date(this._event.closingDate);
    }
    if (this._event.shotgunStartingDate) {
      this._event.shotgunStartingDate = new Date(this._event.shotgunStartingDate);
    }
  }
  get event() { return this._event; }

  @Input() isRightful: boolean;

  constructor() { }

  ngOnInit() {
  }

}
