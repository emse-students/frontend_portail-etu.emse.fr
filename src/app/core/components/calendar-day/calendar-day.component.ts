import { Component, Input, OnInit } from '@angular/core';
import { Day } from '../../models/calendar.model';
import { environment } from '../../../../environments/environment';
import { EventSidenavService } from '../../services/event-sidenav.service';
import { Event } from '../../models/event.model';
import { CalendarComponent } from '../calendar/calendar.component';

@Component({
  selector: 'app-calendar-day',
  templateUrl: './calendar-day.component.html',
  styleUrls: ['./calendar-day.component.scss'],
})
export class CalendarDayComponent implements OnInit {
  @Input() day: Day;
  imgPath = environment.img_url;

  constructor(private eventSidenavService: EventSidenavService) {}

  ngOnInit() {}

  selectEvent(event: Event) {
    this.eventSidenavService.setEvent(event);
  }

  nextDay(date: Date) {
    return CalendarComponent.getNextDay(date);
  }
}
