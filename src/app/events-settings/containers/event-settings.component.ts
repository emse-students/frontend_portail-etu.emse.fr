import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {EventService} from '../../core/services/event.service';
import {Booking, BookingRanked, Event, EventBooking} from '../../core/models/event.model';
import {PaymentMeans} from '../../core/models/payment-means.model';
import {AuthService} from '../../core/services/auth.service';
import {PaymentMeansService} from '../../core/services/payment-means.service';
import {EventSummaryComponent} from '../components/event-summary/event-summary.component';
import {InfoService} from '../../core/services/info.service';

@Component({
  selector: 'app-event-settings',
  template: `
    <div class="container">
      <mat-card *ngIf="loaded && paymentMeansLoaded && !unauthorized">
        <mat-card-title>{{event.name}}</mat-card-title>
        <mat-tab-group [dynamicHeight]="true" [selectedIndex]='selectedEventSetting'>
          <mat-tab>
            <ng-template mat-tab-label>
              <span class="mat-tab-label" (click)="goTo('summary')">Résumé</span>
            </ng-template>
            <mat-card>
              <mat-card-title>Résumé</mat-card-title>

              <app-event-summary #summary [event]="event">
              </app-event-summary>
            </mat-card>
          </mat-tab>

          <mat-tab>
            <ng-template mat-tab-label>
              <span class="mat-tab-label" (click)="goTo('checking')">Checking</span>
            </ng-template>

            <mat-card>
              <mat-card-title>Checking</mat-card-title>

              <app-event-checking [event]="event" [selectedUser]="selectedUser" (newBooking)="selectUserToAddBooking($event)">
              </app-event-checking>
            </mat-card>
          </mat-tab>

          <mat-tab>
            <ng-template mat-tab-label>
              <span class="mat-tab-label" (click)="goTo('list')">Liste</span>
            </ng-template>

            <mat-card>
              <mat-card-title>Liste</mat-card-title>

              <app-event-list [event]="event" (selectUser)="selectUser($event)" (deleteBooking)="delete($event)">
              </app-event-list>
            </mat-card>
          </mat-tab>

          <mat-tab>
            <ng-template mat-tab-label>
              <span class="mat-tab-label" (click)="goTo('modify')">Modifier</span>
            </ng-template>

            <mat-card>
              <mat-card-title>Modifier</mat-card-title>

              <app-event-modify [event]="event"
                           [isAdmin]="authService.isAdmin()"
                           [paymentMeans]="paymentMeans"
                           (refreshEvent)="refreshEvent($event)">
              </app-event-modify>
            </mat-card>
          </mat-tab>

          <mat-tab>
            <ng-template mat-tab-label>
              <span class="mat-tab-label" (click)="goTo('add-booking')">Nouvelle réservation</span>
            </ng-template>

            <mat-card>
              <mat-card-title>Nouvelle réservation</mat-card-title>

              <app-event-add-booking [event]="event"
                                (addBooking)="addBooking($event)" [selectedUser]="selectedUserToAddBooking">
              </app-event-add-booking>
            </mat-card>
          </mat-tab>

          <mat-tab>
            <ng-template mat-tab-label>
              <span class="mat-tab-label" (click)="goTo('excel')">Excel</span>
            </ng-template>

            <mat-card>
              <mat-card-title>Excel</mat-card-title>

              <app-event-excel [event]="event">
              </app-event-excel>
            </mat-card>
          </mat-tab>
        </mat-tab-group>
      </mat-card>
      <mat-card *ngIf="loaded && unauthorized">
        <mat-card-title>Accès non autorisé</mat-card-title>
        <p class="text-center">Vous n'avez pas les droits necessaires pour modifier l'Événement {{event.name}}</p>
      </mat-card>
    </div>
    <div class="centrer" *ngIf="!loaded">
      <mat-spinner  [diameter]="200" [strokeWidth]="5"></mat-spinner>
    </div>
  `,
  styles: [`
    mat-card-title,
    mat-card-content,
    mat-card-footer {
      display: flex;
      justify-content: center;
    }
  `]
})
export class EventSettingsComponent implements OnInit {
  selectedUser = null;
  selectedUserToAddBooking = null;
  unauthorized = false;
  loaded;
  paymentMeansLoaded = false;
  event: Event;
  selectedEventSetting: number;
  paymentMeans: PaymentMeans[];
  @ViewChild('summary') summary: EventSummaryComponent;
  get authService() { return this._authService; }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private _authService: AuthService,
    private paymentMeansService: PaymentMeansService,
    private infoService: InfoService
  ) { }

  ngOnInit() {
    this.authService.authenticatedUser.subscribe(authenticatedUser => {
      if (!authenticatedUser) {
        setTimeout(() => {this.router.navigate(['/home']); });
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
              console.log(this.event.bookings);
              this.unauthorized = !this.authService.hasAssoRight(3, event.association.id) && !this.authService.isAdmin();
              this.loaded = true;
            }
          );
        });
      }
    });
  }

  goTo(str_id: string) {
    this.router.navigate(['/events-settings', this.event.id, str_id]);
    if (str_id === 'summary') {
      this.summary.compute();
    }
  }

  refreshEvent(event: Event) {
    this.eventService.getBookings(event.id).subscribe((eventWithBookings: Event) => {
        this.event = event;
        this.event.bookings = eventWithBookings.bookings;
      }
    );
  }

  delete(booking) {
    if (confirm('Voulez-vous vraiment annuler la réservation de ' + booking.userName + ' ?')) {
      this.eventService.deleteBooking(booking.id).subscribe(
        () => {
          const bookings = this.event.bookings.filter((a: EventBooking) => a.id !== booking.id);
          this.eventService.get(this.event.id).subscribe((event: Event) => {
            this.event = event;
            this.event.bookings = bookings;
          });
          this.infoService.pushSuccess('Réservation annulée');
        },
        (error) => {
          this.event = Object.assign({}, this.event);
        }
      );
    }
  }

  addBooking(booking) {
    this.event.bookings.push(booking);
    const bookings = this.event.bookings;
    this.eventService.get(this.event.id).subscribe((event: Event) => {
      this.event = event;
      this.event.bookings = bookings;
    });
  }

  selectUser(user) {
    this.selectedUser = user;
    this.goTo('checking');
  }

  selectUserToAddBooking(user) {
    this.selectedUserToAddBooking = user;
    this.goTo('add-booking');
  }

  strIdToTabId(strId: string): number {
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
}
