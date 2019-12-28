import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
})
export class DatePickerComponent implements OnInit {
  @Input() currentDate: Date;
  @Output() dateChange: EventEmitter<Date> = new EventEmitter<Date>();

  static getThirdNextWeek(currentDate: Date = null): Date {
    // eslint-disable-next-line no-param-reassign
    currentDate = currentDate ? new Date(currentDate) : new Date();
    return new Date(currentDate.setDate(currentDate.getDate() + 21));
  }

  static getThirdLastWeek(currentDate: Date = null): Date {
    // eslint-disable-next-line no-param-reassign
    currentDate = currentDate ? new Date(currentDate) : new Date();
    return new Date(currentDate.setDate(currentDate.getDate() - 21));
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  // eslint-disable-next-line no-empty-function, @typescript-eslint/no-empty-function
  ngOnInit() {}

  next() {
    this.set(DatePickerComponent.getThirdNextWeek(this.currentDate));
  }

  last() {
    this.set(DatePickerComponent.getThirdLastWeek(this.currentDate));
  }

  set(date: Date) {
    this.dateChange.emit(date);
  }
}
