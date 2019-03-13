import {Component, Input, OnInit} from '@angular/core';
import {EventLight} from '../../../core/models/event.model';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss']
})
export class EventsListComponent implements OnInit {
  @Input() assoId: number;
  @Input() events: EventLight[];
  @Input() isRightful: boolean;

  constructor() { }

  ngOnInit() {
  }

}
