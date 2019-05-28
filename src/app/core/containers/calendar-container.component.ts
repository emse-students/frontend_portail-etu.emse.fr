import { Component, OnInit } from '@angular/core';
import { EventService } from '../services/event.service';
import { Event } from '../models/event.model';

@Component({
  selector: 'app-calendar-container',
  template: `
    <mat-card class="pr-1 pl-1 pr-md-3 pl-md-3 position-relative" *ngIf="!pending">
      <mat-card-title>Calendrier</mat-card-title>
      <app-date-picker
        [currentDate]="currentDate"
        (dateChange)="changeCurrentDate($event)"
      ></app-date-picker>
      <app-calendar [currentDate]="currentDate" [events]="events"></app-calendar>
    </mat-card>

    <div class="centrer" style="height: 250px" *ngIf="pending">
      <mat-spinner [diameter]="200" [strokeWidth]="5"></mat-spinner>
    </div>
  `,
  styles: [
    `
      mat-card-title,
      mat-card-content,
      mat-card-footer {
        display: flex;
        justify-content: center;
      }
      app-calendar {
        overflow: auto;
        display: block;
      }
    `,
  ],
})
export class CalendarContainerComponent implements OnInit {
  events: Event[];
  currentDate: Date = new Date();
  pending = true;

  constructor(private eventService: EventService) {}

  ngOnInit() {
    this.eventService.getCalendarEvents().subscribe(events => {
      this.events = events;
      this.pending = false;
    });
  }

  changeCurrentDate(date: Date) {
    this.pending = true;
    this.currentDate = date;
    this.eventService.getCalendarEvents(date).subscribe(events => {
      this.events = events;
      this.pending = false;
    });
  }
}
