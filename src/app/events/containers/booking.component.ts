import { Component, OnInit } from '@angular/core';
import { Booking, Event, PutBooking } from '../../core/models/event.model';
import { PaymentMeans } from '../../core/models/payment-means.model';
import { AuthenticatedUser } from '../../core/models/auth.model';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../core/services/event.service';
import { AuthService } from '../../core/services/auth.service';
import { PaymentMeansService } from '../../core/services/payment-means.service';
import { UserService } from '../../core/services/user.service';
import { InfoService } from '../../core/services/info.service';
import { User } from '../../core/models/user.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-booking',
  template: `
    <div class="container">
      <mat-card *ngIf="loaded && paymentMeansLoaded && !pending">
        <mat-card-title class="h4">{{ error ? 'Voir' : 'Modifier' }} sa réservation</mat-card-title>
        <app-event-description [event]="booking.event"></app-event-description>
        <app-booking-form
          [authenticatedUser]="authenticatedUser"
          [relatedEvent]="booking.event"
          [currentUser]="user"
          [booking]="booking"
          (submitted)="book($event)"
          [isNew]="false"
          *ngIf="!error"
        ></app-booking-form>
        <ng-container *ngIf="error">
          <h5 *ngIf="booking.formOutputs.length">Vos réponses au formulaire :</h5>
          <div class="row" *ngFor="let formOutput of booking.formOutputs">
            <div class="col">
              <div
                *ngIf="
                  (formOutput.formInput.type === 'text' && formOutput.answer) ||
                  ((formOutput.formInput.type === 'singleOption' ||
                    formOutput.formInput.type === 'multipleOptions') &&
                    formOutput.options.length)
                "
              >
                <u>{{ formOutput.formInput.title }}</u>
              </div>
              <div *ngIf="formOutput.formInput.type === 'text'">{{ formOutput.answer }}</div>
              <ul
                *ngIf="
                  formOutput.formInput.type === 'singleOption' ||
                  formOutput.formInput.type === 'multipleOptions'
                "
              >
                <li *ngFor="let option of formOutput.options">
                  {{ option.value }}
                  <span *ngIf="option.price">
                    {{ option.price | currency: 'EUR':'symbol':'1.0-2':'fr' }}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </ng-container>
        <mat-card-title *ngIf="error">Cette réservation n'est plus modifiable !</mat-card-title>
        <p class="loginButtons" *ngIf="!error">
          <button
            class="ml-2"
            mat-flat-button
            color="warn"
            (click)="delete()"
            [disabled]="!cancelable"
          >
            Annuler votre réservation
          </button>
          <br />
          <mat-error *ngIf="!cancelable">
            Vous avez payé avec un moyen de paiement qui ne vous permet pas d'annuler votre
            réservation
          </mat-error>
        </p>
      </mat-card>
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
export class BookingComponent implements OnInit {
  today = new Date();
  loaded;
  paymentMeansLoaded = false;
  booking: Booking;
  paymentMeans: PaymentMeans[];
  authenticatedUser: AuthenticatedUser;
  user: User;
  pending = false;
  error = false;
  cancelable = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private authService: AuthService,
    private paymentMeansService: PaymentMeansService,
    private userService: UserService,
    private infoService: InfoService,
  ) {}

  ngOnInit() {
    this.authService.authenticatedUser.subscribe(authenticatedUser => {
      if (authenticatedUser) {
        this.authenticatedUser = authenticatedUser;
      } else {
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
      if (!this.booking || this.booking.id !== Number(params.get('id'))) {
        this.loaded = false;
      }
      if (!this.loaded) {
        this.eventService.getBooking(Number(params.get('id'))).subscribe((booking: Booking) => {
          // console.log(booking);
          this.booking = booking;
          this.eventService.get(booking.event.id).subscribe((event: Event) => {
            // console.log(booking);
            this.booking.event = event;
            if (
              booking.event.date < this.today ||
              (booking.event.closingDate && booking.event.closingDate < this.today)
            ) {
              this.error = true;
            }
            if (!booking.paid || booking.paymentMeans.id === 1 || booking.paymentMeans.id === 2) {
              this.cancelable = true;
            }
            this.loaded = true;
          });
        });
      }
    });
    this.userService.user.subscribe((user: User) => {
      this.user = user;
    });
    this.userService.getBalance();
    this.authService.refresh();
  }

  book(booking: PutBooking) {
    this.pending = true;
    // console.log(booking);
    this.eventService.putBook(booking).subscribe(
      () => {
        if (
          booking.operation &&
          booking.operation.paymentMeans === environment.api_uri + '/payment_means/1'
        ) {
          if (this.booking.operation) {
            this.userService.updateBalance(
              booking.operation.amount - this.booking.operation.amount,
            );
          } else {
            this.userService.updateBalance(booking.operation.amount);
          }
        }
        if (booking.cercleOperationAmount) {
          if (this.booking.cercleOperationAmount) {
            this.userService.updateCercleBalance(
              this.booking.cercleOperationAmount - booking.cercleOperationAmount,
            );
          } else {
            this.userService.updateCercleBalance(-booking.cercleOperationAmount);
          }
        }
        this.pending = false;
        this.infoService.pushSuccess('Modification effectuée');
        this.router.navigate(['events', 'my-bookings']);
      },
      () => {
        this.pending = false;
      },
    );
  }

  delete() {
    if (confirm('Voulez-vous vraiment annuler votre réservation ?')) {
      this.pending = true;
      this.eventService.deleteBooking(this.booking.id).subscribe(
        () => {
          if (this.booking.operation && this.booking.operation.paymentMeans.id === 1) {
            this.userService.updateBalance(-this.booking.operation.amount);
          }
          if (this.booking.cercleOperationAmount) {
            this.userService.updateCercleBalance(this.booking.cercleOperationAmount);
          }
          this.pending = false;
          this.infoService.pushSuccess('Réservation annulée');
          this.userService.unbook(this.booking.event.id);
          this.router.navigate(['events', 'my-bookings']);
        },
        () => {
          this.pending = false;
        },
      );
    }
  }
}
