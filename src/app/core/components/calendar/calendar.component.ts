import { Component, Input, OnInit } from '@angular/core';
import { Day } from '../../models/calendar.model';
import { Event } from '../../models/event.model';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  constructor() {}
  _currentDate: Date;
  @Input()
  set currentDate(date: Date) {
    this._currentDate = date;
  }
  get currentDate() {
    return this._currentDate;
  }
  @Input() events: Event[];
  weeks: Day[][] = [];
  weekDays: string[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  static getLastMonday(currentDate: Date = null): Date {
    currentDate = currentDate ? new Date(currentDate) : new Date();
    const offsetDay = currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1;
    const lastmonday = new Date(currentDate.setDate(currentDate.getDate() - offsetDay));
    lastmonday.setHours(0);
    lastmonday.setMinutes(0);
    lastmonday.setSeconds(0);
    lastmonday.setMilliseconds(0);
    return lastmonday;
  }

  static getNextDay(currentDate: Date = null): Date {
    currentDate = currentDate ? new Date(currentDate) : new Date();
    return new Date(currentDate.setDate(currentDate.getDate() + 1));
  }

  ngOnInit() {
    this.buildCalendar();
  }

  buildCalendar() {
    let day = CalendarComponent.getLastMonday(this.currentDate);
    this.weeks = [];
    for (let i = 0; i < 4; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        const nextDay = CalendarComponent.getNextDay(day);
        week.push({
          date: day,
          events: this.events.filter(event => {
            return (
              (event.date > day && event.date < nextDay) ||
              (event.shotgunStartingDate > day && event.shotgunStartingDate < nextDay)
            );
          }),
        });
        day = nextDay;
      }
      this.weeks.push(week);
    }
  }
}
