import { Component, OnInit } from '@angular/core';
import { EventService } from '../services/event.service';
import { Event } from '../models/event.model';
import { EventBandService } from '../services/event-band.service';
import { EventBand } from '../models/event-band.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-calendar-container',
  template: `
    <mat-card class="pr-1 pl-1 pr-md-3 pl-md-3 position-relative">
      <ng-container *ngIf="!eventBandsPending && !eventsPending">
        <mat-card-title>Calendrier</mat-card-title>
        <app-date-picker
          [currentDate]="currentDate"
          (dateChange)="changeCurrentDate($event)"
        ></app-date-picker>
        <div
          class="row m-0 flex-nowrap justify-content-lg-center position-relative calendar-scrollable"
        >
          <app-calendar
            [currentDate]="currentDate"
            [events]="events"
            [eventBands]="eventBands"
            [isAdmin]="authService.isAdmin()"
          ></app-calendar>
        </div>
      </ng-container>
      <div class="centrer" *ngIf="eventsPending || eventBandsPending">
        <mat-spinner [diameter]="200" [strokeWidth]="5"></mat-spinner>
      </div>
    </mat-card>
  `,
  styles: [
    `
      :host {
        flex: 1;
        display: flex;
        flex-direction: column;
      }
      mat-card {
        flex: 1;
      }
      mat-card-title,
      mat-card-content,
      mat-card-footer {
        display: flex;
        justify-content: center;
      }
      app-calendar {
        overflow: unset;
        display: block;
      }
      .calendar-scrollable {
        overflow: auto;
      }
    `,
  ],
})
export class CalendarContainerComponent implements OnInit {
  events: Event[];
  eventBands: EventBand[];
  currentDate: Date = new Date();
  eventsPending = true;
  eventBandsPending = true;

  get authService() {
    return this._authService;
  }

  constructor(
    private eventService: EventService,
    private eventBandService: EventBandService,
    private _authService: AuthService,
  ) {}

  ngOnInit() {
    this.fetch();
  }

  changeCurrentDate(date: Date) {
    this.eventBandsPending = true;
    this.eventsPending = true;
    this.currentDate = date;
    this.fetch(date);
  }

  fetch(date: Date = null) {
    this.eventService.getCalendarEvents(date).subscribe(events => {
      this.events = events;
      this.eventsPending = false;
    });
    this.eventBandService.getCalendarEventBands(date).subscribe(eventBands => {
      this.eventBands = eventBands;
      this.eventBandsPending = false;
    });
  }
}
