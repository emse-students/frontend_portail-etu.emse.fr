import { Component, Input } from '@angular/core';
import { Association } from '../../../core/models/association.model';
import { EventLight } from '../../../core/models/event.model';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss'],
})
export class EventsListComponent {
  events: EventLight[] = [];
  _asso: Association;
  moreThan10Events: boolean;
  @Input()
  set asso(asso: Association) {
    this._asso = asso;
    this.moreThan10Events = asso.events.length > 10;
    this.events = asso.events.slice(Math.max(asso.events.length - 10, 1));
  }
  get asso(): Association {
    return this._asso;
  }
  @Input() isRightful: boolean;

  displayAll(): void {
    this.events = this.asso.events;
  }
}
