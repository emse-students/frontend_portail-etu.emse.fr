import {Component, OnDestroy, OnInit} from '@angular/core';
import {Event, NewBooking} from '../../core/models/event.model';
import {PaymentMeans} from '../../core/models/payment-means.model';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {EventService} from '../../core/services/event.service';
import {AuthService} from '../../core/services/auth.service';
import {PaymentMeansService} from '../../core/services/payment-means.service';
import {AuthenticatedUser} from '../../core/models/auth.model';
import {UserService} from '../../core/services/user.service';
import {User} from '../../core/models/user.model';
import {InfoService} from '../../core/services/info.service';

@Component({
  selector: 'app-book',
  template: `
    <div class="container">
      <mat-card *ngIf="loaded &&
       paymentMeansLoaded &&
        !pending &&
         !allReadyBooked &&
          !(event.closingDate && event.closingDate < today) &&
           (event.status === 'validated' || !unauthorized) &&
            !(event.date < today)">
        <mat-card-title class="h4">Réservation</mat-card-title>
        <app-event-description [event]="event"></app-event-description>
        <app-booking-form [authenticatedUser]="authenticatedUser"
                          [relatedEvent]="event"
                          [BDEBalance]="BDEBalance"
                          (submitted)="book($event)" [isNew]="true"></app-booking-form>
      </mat-card>
      <mat-card *ngIf="allReadyBooked">
        <mat-card-title class="h4">Vous êtes déjà inscrit à l'événement {{event.name}}</mat-card-title>
        <p>Pour inscrire une personne n'ayant pas de compte EMSE, déconnectez vous et effectuez l'inscription sans être connecté</p>
      </mat-card>
      <mat-card *ngIf="loaded && (event.closingDate && event.closingDate < today)">
        <mat-card-title class="h4">Vous ne pouvez plus vous inscrire à l'événement {{event.name}}</mat-card-title>
        <p class="text-center">La deadline est passée</p>
      </mat-card>
      <mat-card *ngIf="loaded && (event.date < today)">
        <mat-card-title class="h4">Vous ne pouvez plus vous inscrire à l'événement {{event.name}}</mat-card-title>
        <p class="text-center">L'événement est passé</p>
      </mat-card>
      <mat-card *ngIf="loaded && event.status !== 'validated' && unauthorized">
        <mat-card-title class="h4">Vous ne pouvez pas vous inscrire à l'événement {{event.name}}</mat-card-title>
      </mat-card>
    </div>
    <div class="centrer" *ngIf="!loaded || pending">
      <mat-spinner  [diameter]="200" [strokeWidth]="5"></mat-spinner>
    </div>
  `,
  styles: [`
    mat-card-title,
    mat-card-content,
    mat-card-footer {
      display: flex;
      justify-content: center;
      text-align: center;
    }
  `]
})
export class BookComponent implements OnInit {
  today = new Date();
  loaded;
  paymentMeansLoaded = false;
  event: Event;
  paymentMeans: PaymentMeans[];
  authenticatedUser: AuthenticatedUser;
  BDEBalance: number;
  pending = false;
  allReadyBooked = false;
  unauthorized = false;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private authService: AuthService,
    private paymentMeansService: PaymentMeansService,
    private userService: UserService,
    private infoService: InfoService
  ) {  }

  ngOnInit() {
    this.authService.authenticatedUser.subscribe(authenticatedUser => {
      this.authenticatedUser = authenticatedUser;
      if (this.loaded) {
        this.allReadyBooked = this.userService.hasBooked(this.event.id);
        this.unauthorized = !this.authService.hasAssoRight(2, this.event.association.id) && !this.authService.isAdmin();
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
      if (!this.loaded) {
        this.eventService.get(Number(params.get('id'))).subscribe((event: Event) => {
          // console.log(event);
          this.event = event;
          this.loaded = true;
          this.allReadyBooked = this.userService.hasBooked(event.id);
          this.unauthorized = !this.authService.hasAssoRight(2, event.association.id) && !this.authService.isAdmin();
        });
      }
    });
    this.userService.user.subscribe((user: User) => {this.BDEBalance = user.balance; });
    this.userService.getBalance();
    this.authService.refresh();
  }

  book(newBooking: NewBooking) {
    this.pending = true;
    // console.log(newBooking);
    // setTimeout(() => {this.pending = false; }, 2000);
    if (newBooking.operation) {
      this.userService.updateBalance(newBooking.operation.amount);
    }
    this.eventService.book(newBooking).subscribe(
      () => {
        this.pending = false;
        this.infoService.pushSuccess('Réservation effectuée');
        this.router.navigate(['']);
        },
      (error) => {
        this.pending = false;
        if (newBooking.operation) {
          this.userService.updateBalance(-newBooking.operation.amount);
        }
      }
    );
  }
}
