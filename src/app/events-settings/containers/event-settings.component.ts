import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../core/services/event.service';
import { Event, EventBooking } from '../../core/models/event.model';
import { PaymentMeans } from '../../core/models/payment-means.model';
import { AuthService } from '../../core/services/auth.service';
import { PaymentMeansService } from '../../core/services/payment-means.service';
import { EventSummaryComponent } from '../components/event-summary/event-summary.component';
import { InfoService } from '../../core/services/info.service';
import { EventUser, UserLight } from '../../core/models/auth.model';
import { UserService } from '../../core/services/user.service';
import { arrayFindById } from '../../core/services/utils';
import { EventListComponent } from './event-list.component';

@Component({
  selector: 'app-event-settings',
  template: `
    <div class="container">
      <mat-card *ngIf="loaded && paymentMeansLoaded && !unauthorized">
        <mat-card-title>{{ event.name }}</mat-card-title>
        <mat-tab-group [dynamicHeight]="true" [selectedIndex]="selectedEventSetting">
          <mat-tab *ngIf="event.isBookable">
            <ng-template mat-tab-label>
              <span class="mat-tab-label" (click)="goTo('summary')">Résumé</span>
            </ng-template>
            <mat-card>
              <mat-card-title>Résumé</mat-card-title>

              <app-event-summary #summary [event]="event"></app-event-summary>
            </mat-card>
          </mat-tab>

          <mat-tab *ngIf="event.isBookable">
            <ng-template mat-tab-label>
              <span class="mat-tab-label" (click)="goTo('checking')">Checking</span>
            </ng-template>

            <mat-card>
              <mat-card-title>Checking</mat-card-title>

              <app-event-checking
                [event]="event"
                [selectedUser]="selectedUser"
                [users]="users"
                (newBooking)="selectUserToAddBooking($event)"
              ></app-event-checking>
            </mat-card>
          </mat-tab>

          <mat-tab *ngIf="event.isBookable">
            <ng-template mat-tab-label>
              <span class="mat-tab-label" (click)="goTo('list')">Liste</span>
            </ng-template>

            <mat-card>
              <mat-card-title>Liste</mat-card-title>

              <app-event-list
                #list
                [event]="event"
                [paymentMeans]="event.paymentMeans"
                (selectUser)="selectUser($event)"
                (deleteBooking)="delete($event)"
              ></app-event-list>
            </mat-card>
          </mat-tab>

          <mat-tab>
            <ng-template mat-tab-label>
              <span class="mat-tab-label" (click)="goTo('modify')">Modifier</span>
            </ng-template>

            <mat-card>
              <mat-card-title>Modifier</mat-card-title>

              <app-event-modify
                [event]="event"
                [isAdmin]="authService.isAdmin()"
                [paymentMeans]="paymentMeans"
                (refreshEvent)="refreshEvent($event)"
              ></app-event-modify>
            </mat-card>
          </mat-tab>

          <mat-tab *ngIf="event.isBookable">
            <ng-template mat-tab-label>
              <span class="mat-tab-label" (click)="goTo('add-booking')">Nouvelle réservation</span>
            </ng-template>

            <mat-card>
              <mat-card-title>Nouvelle réservation</mat-card-title>

              <app-event-add-booking
                [event]="event"
                [users]="users"
                (addBooking)="addBooking($event)"
                [selectedUser]="selectedUserToAddBooking"
              ></app-event-add-booking>
            </mat-card>
          </mat-tab>

          <mat-tab *ngIf="event.isBookable">
            <ng-template mat-tab-label>
              <span class="mat-tab-label" (click)="goTo('excel')">Excel</span>
            </ng-template>

            <mat-card>
              <mat-card-title>Excel</mat-card-title>

              <app-event-excel [event]="event"></app-event-excel>
            </mat-card>
          </mat-tab>
        </mat-tab-group>
      </mat-card>
      <mat-card *ngIf="loaded && unauthorized">
        <mat-card-title>Accès non autorisé</mat-card-title>
        <p class="text-center">
          Vous n'avez pas les droits necessaires pour modifier l'Événement {{ event.name }}
        </p>
      </mat-card>
    </div>
    <div class="centrer" *ngIf="!loaded">
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
    `,
  ],
})
export class EventSettingsComponent implements OnInit {
  get authService() {
    return this._authService;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private _authService: AuthService,
    private paymentMeansService: PaymentMeansService,
    private infoService: InfoService,
    private userService: UserService,
  ) {}
  selectedUser = null;
  selectedUserToAddBooking = null;
  unauthorized = false;
  loaded;
  paymentMeansLoaded = false;
  event: Event;
  users: EventUser[];
  selectedEventSetting: number;
  paymentMeans: PaymentMeans[];
  @ViewChild('summary') summary: EventSummaryComponent;
  @ViewChild('list') list: EventListComponent;

  ngOnInit() {
    this.authService.authenticatedUser.subscribe(authenticatedUser => {
      if (!authenticatedUser) {
        setTimeout(() => {
          this.router.navigate(['/home']);
        });
      }
    });
    this.paymentMeansService.gets().subscribe((paymentMeans: PaymentMeans[]) => {
      this.paymentMeansLoaded = true;
      this.paymentMeans = paymentMeans;
    });
    this.route.paramMap.subscribe(params => {
      if (!this.event || this.event.id !== Number(params.get('id'))) {
        this.loaded = false;
      }
      this.selectedEventSetting = this.strIdToTabId(params.get('setting'));
      if (!this.loaded) {
        this.eventService.get(Number(params.get('id'))).subscribe((event: Event) => {
          this.event = event;
          this.eventService.getBookings(event.id).subscribe((eventWithBookings: Event) => {
            this.event.bookings = eventWithBookings.bookings;
            // console.log(this.event.bookings);
            this.unauthorized =
              !this.authService.hasAssoRight(3, event.association.id) &&
              !this.authService.isAdmin();

            this.userService.getAllUsers().subscribe((users: UserLight[]) => {
              this.userService
                .getMultipleCercleInfos(users.map(user => user.login))
                .subscribe(cercleUsers => {
                  this.users = users.map(user => {
                    if (cercleUsers[user.login]) {
                      // eslint-disable-next-line no-param-reassign
                      user.cercleBalance = cercleUsers[user.login].balance;
                      // eslint-disable-next-line no-param-reassign
                      user.contributeCercle = cercleUsers[user.login].contribute;
                    }
                    return user;
                  });
                  for (let i = 0; i < this.event.bookings.length; i++) {
                    if (!this.event.bookings[i].user) {
                      this.users.unshift({
                        username: this.event.bookings[i].userName,
                        bookingIndex: i,
                      });
                    }
                  }
                  this.loaded = true;
                });
            });
          });
        });
      }
    });
  }

  // eslint-disable-next-line consistent-return
  strIdToTabId(strId: string): number {
    if (this.event && this.event.isBookable) {
      return 0;
    }
    // eslint-disable-next-line default-case
    switch (strId) {
      case 'summary':
        return 0;
      case 'checking':
        return 1;
      case 'list':
        return 2;
      case 'modify':
        return 3;
      case 'add-booking':
        return 4;
      case 'excel':
        return 5;
    }
  }

  goTo(strId: string) {
    this.router.navigate(['/events-settings', this.event.id, strId]);
    if (strId === 'summary') {
      this.summary.compute();
    } else if (strId === 'list') {
      this.list.updateList();
    }
  }

  refreshEvent(event: Event) {
    this.eventService.getBookings(event.id).subscribe((eventWithBookings: Event) => {
      this.event = event;
      this.event.bookings = eventWithBookings.bookings;
    });
  }

  delete(booking) {
    // eslint-disable-next-line no-restricted-globals, no-undef
    if (confirm(`Voulez-vous vraiment annuler la réservation de ${booking.userName} ?`)) {
      this.eventService.deleteBooking(booking.id).subscribe(
        () => {
          const bookings = this.event.bookings.filter((a: EventBooking) => a.id !== booking.id);
          this.eventService.get(this.event.id).subscribe((event: Event) => {
            this.event = event;
            this.event.bookings = bookings;
          });
          this.infoService.pushSuccess('Réservation annulée');
        },
        () => {
          this.event = { ...this.event };
        },
      );
    }
  }

  addBooking(booking) {
    this.event = {
      ...this.event,
      bookings: [...this.event.bookings, booking],
    };
    if (!booking.user) {
      this.users.unshift({
        username: booking.userName,
        bookingIndex: arrayFindById(this.event.bookings, booking.id),
      });
    }
  }

  selectUser(user) {
    this.selectedUser = user;
    this.goTo('checking');
  }

  selectUserToAddBooking(user) {
    this.selectedUserToAddBooking = user;
    this.goTo('add-booking');
  }
}
