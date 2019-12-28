import { Component, Input, OnInit } from '@angular/core';
import { Association } from '../../../core/models/association.model';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss'],
})
export class EventsListComponent implements OnInit {
  @Input() asso: Association;
  @Input() isRightful: boolean;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  // eslint-disable-next-line no-empty-function, @typescript-eslint/no-empty-function
  ngOnInit() {}
}
