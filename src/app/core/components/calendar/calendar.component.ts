import { Component, Input, OnInit } from '@angular/core';
import { Day } from '../../models/calendar.model';
import { Event } from '../../models/event.model';
import { EventBand } from '../../models/event-band.model';
import { AssoStyle } from '../../../shared/pipes/asso-style.pipe';
import { getLastMonday, getNextDay } from '../../services/date.utils';

export interface EventBandSettings {
  eventBand: EventBand;
  offSet: number;
  verticalOffSet: number;
  length: number;
}
interface Week {
  days: Day[];
  eventBands: EventBandSettings[];
}
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
  @Input() eventBands: EventBand[];
  @Input() isAdmin: boolean;
  weeks: Week[] = [];
  weekDays: string[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  ngOnInit() {
    this.buildCalendar();
  }

  buildCalendar() {
    let day = getLastMonday(this.currentDate);
    this.weeks = [];
    for (let i = 0; i < 4; i++) {
      const week: Week = {
        days: [],
        eventBands: [],
      };
      for (let j = 0; j < 7; j++) {
        const nextDay = getNextDay(day);

        const dayPadding = this.buildEventBands(week, day, j);
        week.days.push({
          date: day,
          events: this.events.filter(event => {
            return (
              (event.date >= day && event.date < nextDay) ||
              (event.shotgunStartingDate >= day && event.shotgunStartingDate < nextDay)
            );
          }),
          dayPadding,
        });
        day = nextDay;
      }
      this.weeks.push(week);
    }
  }

  private buildEventBands(week: Week, day: Date, j: number) {
    const occupiedVerticalOffset = week.eventBands.reduce((occupiedVOffset, eventBandSettings) => {
      if (eventBandSettings.eventBand.endingDate >= day) {
        occupiedVOffset.push(eventBandSettings.verticalOffSet);
      }
      return occupiedVOffset;
    }, []);
    const eventBands = this.eventBands.filter(eventBand => {
      return eventBand.startingDate <= day && eventBand.endingDate >= day;
    });
    for (let k = 0; k < eventBands.length; k++) {
      const index = week.eventBands.findIndex(args => args.eventBand === eventBands[k]);
      if (index !== -1) {
        week.eventBands[index].length++;
      } else {
        let found = true;
        let verticalOffSet = 0;
        while (found) {
          if (occupiedVerticalOffset.findIndex(offset => offset === verticalOffSet) !== -1) {
            verticalOffSet++;
          } else {
            found = false;
          }
        }
        occupiedVerticalOffset.push(verticalOffSet);
        week.eventBands.push({
          eventBand: eventBands[k],
          offSet: j,
          length: 1,
          verticalOffSet,
        });
      }
    }
    return occupiedVerticalOffset.reduce((max, offset) => {
      if (max < offset + 1) {
        max = offset + 1;
      }
      return max;
    }, 0);
  }

  eventBandStyle(eventBandSettings: EventBandSettings): AssoStyle {
    return {
      backgroundColor: eventBandSettings.eventBand.color,
      color: eventBandSettings.eventBand.contrastColor,
      left: `calc(${eventBandSettings.offSet} * 100% / 7 + 4px)`,
      top: `calc(${eventBandSettings.verticalOffSet * 2}em + 4px)`,
      width: `calc(${eventBandSettings.length} * 100% / 7 - 8px)`,
    };
  }
}
