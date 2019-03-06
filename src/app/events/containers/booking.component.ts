import { Component, OnInit } from '@angular/core';
import {Booking, Event, NewBooking, PutBooking} from '../../core/models/event.model';
import {PaymentMeans} from '../../core/models/payment-means.model';
import {AuthenticatedUser} from '../../core/models/auth.model';
import {ActivatedRoute, Router} from '@angular/router';
import {EventService} from '../../core/services/event.service';
import {AuthService} from '../../core/services/auth.service';
import {PaymentMeansService} from '../../core/services/payment-means.service';
import {UserService} from '../../core/services/user.service';
import {InfoService} from '../../core/services/info.service';
import {User} from '../../core/models/user.model';

@Component({
  selector: 'app-booking',
  template: `
    <div class="container">
      <mat-card *ngIf="loaded && paymentMeansLoaded && !pending">
        <mat-card-title class="h4">Modifier sa réservation</mat-card-title>
        <app-event-description [event]="booking.event"></app-event-description>
        <app-booking-form [authenticatedUser]="authenticatedUser"
                          [relatedEvent]="booking.event"
                          [BDEBalance]="BDEBalance"
                          [booking]="booking"
                          (submitted)="book($event)" [isNew]="false" *ngIf="!error"></app-booking-form>
        <mat-card-title *ngIf="error">Cette réservation n'est plus modifiable !</mat-card-title>
        <p class="loginButtons">
          <button class="ml-2" mat-flat-button color="warn" (click)="delete()">Annuler votre réservation</button>
        </p>
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
    }
  `]
})
export class BookingComponent implements OnInit {
  today = new Date();
  loaded;
  paymentMeansLoaded = false;
  booking: Booking;
  paymentMeans: PaymentMeans[];
  authenticatedUser: AuthenticatedUser;
  BDEBalance: number;
  pending = false;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private authService: AuthService,
    private paymentMeansService: PaymentMeansService,
    private userService: UserService,
    private infoService: InfoService
  ) { }

  ngOnInit() {
    this.authService.authenticatedUser.subscribe(authenticatedUser => {
      if (authenticatedUser) {
        this.authenticatedUser = authenticatedUser;
      } else {
        setTimeout(() => {this.router.navigate(['/home']); });
      }
    });
    this.paymentMeansService.gets().subscribe((paymentMeans: PaymentMeans[]) => {
      this.paymentMeansLoaded = true;
      this.paymentMeans = paymentMeans;
    });
    this.route.paramMap.subscribe(params => {
      if (!this.booking || this.booking.id !== Number(params.get('id'))) {
        this.loaded = false;
      }
      if (!this.loaded) {
        this.eventService.getBooking(Number(params.get('id'))).subscribe((booking: Booking) => {
          console.log(booking);
          this.booking = booking;
          if (booking.event.date < this.today || (booking.event.closingDate && booking.event.closingDate < this.today)) {
            this.error = true;
          }
          this.loaded = true;
        });
      }
    });
    this.userService.user.subscribe((user: User) => {this.BDEBalance = user.balance; });
    this.userService.getBalance();
    this.authService.refresh();

  }

  book(booking: PutBooking) {
    this.pending = true;
    console.log(booking);
    if (booking.operation) {
      if (this.booking.operation) {
        this.userService.updateBalance(booking.operation.amount - this.booking.operation.amount);
      } else {
        this.userService.updateBalance(booking.operation.amount);
      }
    }
    this.eventService.putBook(booking).subscribe(
      () => {
        this.pending = false;
        this.infoService.pushSuccess('Modification effectuée');
        this.router.navigate(['events', 'my-bookings']);
        },
      (error) => {
        this.pending = false;
        if (booking.operation) {
          if (this.booking.operation) {
            this.userService.updateBalance(- booking.operation.amount + this.booking.operation.amount);
          } else {
            this.userService.updateBalance(-booking.operation.amount);
          }
        }
      }
    );
  }

  delete() {
    if (confirm('Voulez-vous vraiment annuler votre réservation ?')) {
      this.pending = true;
      this.eventService.deleteBooking(this.booking.id).subscribe(
        () => {
          if (this.booking.operation) {
            this.userService.updateBalance( - this.booking.operation.amount);
          }
          this.pending = false;
          this.infoService.pushSuccess('Réservation annulée');
          this.router.navigate(['events', 'my-bookings']);
        },
        (error) => {
          this.pending = false;
        }
      );
    }
  }

}
