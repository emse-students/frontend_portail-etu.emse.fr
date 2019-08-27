import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Event, EventBooking } from '../../core/models/event.model';
import { PaymentMeans } from '../../core/models/payment-means.model';
import { EventUser, UserLight } from '../../core/models/auth.model';
import { map, startWith } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { arrayFindById } from '../../core/services/utils';

@Component({
  selector: 'app-event-checking',
  template: `
    <form [formGroup]="form">
      <div class="row">
        <mat-form-field class="col-10">
          <input
            type="text"
            placeholder="Prénom et Nom"
            matInput
            [matAutocomplete]="auto"
            formControlName="userText"
          />
          <mat-autocomplete #auto="matAutocomplete">
            <mat-option
              *ngFor="let option of filteredOptions | async"
              [value]="option.id ? option.firstname + ' ' + option.lastname : option.username"
              (click)="select(option)"
            >
              <span *ngIf="option.id">
                {{ option.firstname }} {{ option.lastname }} {{ option.type }} {{ option.promo }}
              </span>
              <span *ngIf="!option.id">{{ option.username }}</span>
            </mat-option>
          </mat-autocomplete>
        </mat-form-field>
        <div class="col-2 d-flex flex-column justify-content-center">
          <mat-icon color="warn" (click)="clear()">clear</mat-icon>
        </div>
      </div>
    </form>
    <app-booking-checking-card
      [booking]="booking"
      [event]="event"
      (paid)="majBookings($event)"
      *ngIf="booking && !pending"
    ></app-booking-checking-card>
    <div class="row" *ngIf="unbookedUser && !pending">
      <div class="col">
        <div>
          {{ unbookedUser.firstname }} {{ unbookedUser.lastname }} {{ unbookedUser.type }}
          {{ unbookedUser.promo }}
        </div>
        <div>Pas de réservation pour cet utilisateur</div>
        <button mat-flat-button color="primary" (click)="createBooking(unbookedUser)">
          Créer une réservation
        </button>
      </div>
    </div>
    <div class="centrer" *ngIf="pending">
      <mat-spinner [diameter]="150" [strokeWidth]="5"></mat-spinner>
    </div>
  `,
  styles: [
    `
      mat-icon {
        transform: scale(2);
        cursor: pointer;
      }
    `,
  ],
})
export class EventCheckingComponent implements OnInit {
  @Input() event: Event;
  @Input()
  set selectedUser(selectedUser) {
    if (selectedUser) {
      this.select(selectedUser);
    }
  }
  @Input() isAdmin: boolean;
  @Input() paymentMeans: PaymentMeans[];
  @Output() newBooking = new EventEmitter<UserLight>();
  filteredOptions: Observable<EventUser[]>;
  @Input() users: EventUser[];
  booking: EventBooking;
  unbookedUser: UserLight;
  pending = false;

  form: FormGroup = this.fb.group({
    userText: [''],
  });

  get userText() {
    return this.form.get('userText');
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.filteredOptions = this.userText.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
  }

  _filter(value: string) {
    const filterValue = value.toLowerCase();
    if (this.users) {
      return this.users.filter(user => {
        if (user.id) {
          return (user.firstname + ' ' + user.lastname).toLowerCase().includes(filterValue);
        } else {
          return user.username.toLowerCase().includes(filterValue);
        }
      });
    } else {
      return [];
    }
  }

  select(user) {
    if (user.bookingIndex) {
      this.unbookedUser = null;
      this.booking = this.event.bookings[user.bookingIndex];
    } else if (user.bookingId) {
      this.unbookedUser = null;
      this.booking = this.event.bookings[arrayFindById(this.event.bookings, user.bookingId)];
    } else {
      let found = false;
      for (let i = 0; i < this.event.bookings.length; i++) {
        if (this.event.bookings[i].user && this.event.bookings[i].user.id === user.id) {
          this.unbookedUser = null;
          this.booking = this.event.bookings[i];
          this.booking.user.balance = user.balance;
          this.booking.user.contributeBDE = user.contributeBDE;
          this.booking.user.cercleBalance = user.cercleBalance;
          this.booking.user.contributeCercle = user.contributeCercle;
          found = true;
        }
      }
      // console.log(this.booking);
      if (!found) {
        this.booking = null;
        this.unbookedUser = user;
      }
    }
  }

  createBooking(user) {
    this.clear();
    this.newBooking.emit(user);
  }

  clear() {
    this.userText.setValue('');
    this.booking = null;
    this.unbookedUser = null;
  }

  majBookings(booking: EventBooking) {
    if (booking) {
      for (let i = 0; i < this.event.bookings.length; i++) {
        if (this.event.bookings[i].id === booking.id) {
          if (booking.operation && booking.operation.paymentMeans.id === 1) {
            for (let j = 0; j < this.users.length; j++) {
              if (this.users[j].id === booking.user.id) {
                this.users[j].balance += booking.operation.amount;
              }
            }
          }
          this.event.bookings[i] = booking;
        }
      }
    }
    this.clear();
  }
}
