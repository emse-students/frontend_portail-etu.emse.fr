import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Event } from '../models/event.model';
import { EventSidenavService } from '../services/event-sidenav.service';
import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-event-sidenav',
  template: `
    <ng-container *ngIf="event && show">
      <mat-toolbar [ngStyle]="event.association | assoStyle: 'accent'" class="branding">
        <span class="w-100 text-center">
          {{ event.name }}
        </span>
      </mat-toolbar>
      <mat-card>
        <app-event-description [event]="event"></app-event-description>
        <div class="row justify-content-around">
          <a [routerLink]="'/events-settings/' + event.id" *ngIf="isRightful">
            <button
              mat-flat-button
              [ngStyle]="event.association | assoStyle: 'accent'"
              (click)="closeNav()"
            >
              Paramètres
            </button>
          </a>
          <a
            [routerLink]="'/events/' + event.id + '/book'"
            *ngIf="
              !allReadyBooked &&
              (!event.closingDate || event.closingDate > today) &&
              event.date > today &&
              (event.status != 'inactive' || isRightful) &&
              event.isBookable
            "
          >
            <button mat-flat-button [ngStyle]="event.association | assoStyle" (click)="closeNav()">
              S'inscrire
            </button>
          </a>
          <button mat-flat-button disabled *ngIf="allReadyBooked">Déjà inscrit</button>
          <button
            mat-flat-button
            disabled
            *ngIf="
              !allReadyBooked &&
              !(event.date < today) &&
              event.closingDate &&
              event.closingDate < today
            "
          >
            Deadline passée
          </button>
          <button mat-flat-button disabled *ngIf="!allReadyBooked && event.date < today">
            Événement passé
          </button>
        </div>
      </mat-card>
      <div class="d-flex justify-content-center footer">
        <button class="close-button" mat-button color="primary" (click)="closeNav()">Fermer</button>
      </div>
    </ng-container>
  `,
  styles: [
    `
      :host {
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      mat-toolbar {
        z-index: 2;
        flex: 0 0 auto;
      }

      mat-card {
        flex: 1 0 auto;
      }

      .footer {
        flex: 0 0 auto;
      }

      .close-button {
        padding: 10px;
        width: 100%;
      }

      .close-button:hover {
        background-color: #ececec;
      }
    `,
  ],
})
export class EventSidenavComponent implements OnInit {
  @Input() show: boolean;
  today = new Date();
  event: Event;
  imgPath = environment.imgUrl;
  allReadyBooked = false;
  isRightful = false;
  @Output() close = new EventEmitter<boolean>();

  constructor(
    private eventSidenavService: EventSidenavService,
    private userService: UserService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.eventSidenavService.event.subscribe((event: Event) => {
      this.event = event;
      this.allReadyBooked = this.userService.hasBooked(event.id);
      this.isRightful =
        this.authService.hasAssoRight(3, event.association.id) || this.authService.isAdmin();
    });
  }

  closeNav() {
    this.close.emit(true);
  }
}
