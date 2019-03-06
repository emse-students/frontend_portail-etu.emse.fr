import {Component, Input, OnInit} from '@angular/core';
import {Booking, Event, PutBooking} from '../../core/models/event.model';
import {PaymentMeans} from '../../core/models/payment-means.model';
import {UserLight} from '../../core/models/auth.model';
import {map, startWith} from 'rxjs/operators';
import {UserService} from '../../core/services/user.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {EventService} from '../../core/services/event.service';
import {InfoService} from '../../core/services/info.service';

interface UnregistredUser {
  username: string;
  idBooking: number;
}
@Component({
  selector: 'app-event-checking',
  template: `
    <form [formGroup]="form">
      <div class="row">
        <mat-form-field class="col-10">
          <input type="text"
                 placeholder="Prénom et Nom"
                 matInput [matAutocomplete]="auto"
                 [formControl]="userText">
          <mat-autocomplete #auto="matAutocomplete">
            <mat-option *ngFor="let option of filteredOptions | async"
                        [value]="option.id ? option.firstname + ' ' + option.lastname : option.username"
                        (click)="select(option)">
              <span *ngIf="option.id">{{option.firstname}} {{option.lastname}} promo {{option.promo}}</span>
              <span *ngIf="!option.id">{{option.username}}</span>
            </mat-option>
          </mat-autocomplete>
        </mat-form-field>
        <div class="col-2 d-flex flex-column justify-content-center">
          <mat-icon color="warn" (click)="clear()">clear</mat-icon>
        </div>
      </div>
    </form>
    <app-booking-checking-card [booking]="booking"
                               [event]="event"
                               (paid)="majBookings($event)"
                               *ngIf="booking && !pending">
    </app-booking-checking-card>
    <div class="row" *ngIf="unbookedUser && !pending">
      <div class="col">
        <div>{{unbookedUser.firstname}} {{unbookedUser.lastname}} promo {{unbookedUser.promo}}</div>
        <div>Pas de réservation pour cet utilisateur</div>
      </div>
    </div>
    <div class="centrer" *ngIf="pending">
      <mat-spinner  [diameter]="150" [strokeWidth]="5"></mat-spinner>
    </div>
  `,
  styles: [`
    mat-icon {
      transform: scale(2);
      cursor: pointer;
    }
  `]
})
export class EventCheckingComponent implements OnInit {
  @Input() event: Event;
  @Input() isAdmin: boolean;
  @Input() paymentMeans: PaymentMeans[];
  filteredOptions: Observable<UserLight | UnregistredUser>;
  users;
  booking: Booking;
  unbookedUser: UserLight;
  pending = false;

  form: FormGroup = this.fb.group({
    userText: [''],
  });

  get userText() { return this.form.get('userText'); }

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.userService.getAllUsers().subscribe((users: UserLight[]) => {
      console.log(users);
      this.users = users;
      for (let i = 0; i < this.event.bookings.length; i++) {
        if (this.event.bookings[i].userName) {
          this.users.push(
            {
              username: this.event.bookings[i].userName,
              bookingId: i
            }
          );
        }
      }
    });
    this.filteredOptions = this.userText.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  _filter(value: string) {
    const filterValue = value.toLowerCase();
    if (this.users) {
      return this.users.filter(
        (user) => {
          if (user.id) {
            return (user.firstname + ' ' + user.lastname).toLowerCase().includes(filterValue);
          } else {
            return user.username.toLowerCase().includes(filterValue);
          }
        }
      );
    } else {
      return [];
    }
  }

  select(user) {
    if (user.bookingId) {
      this.unbookedUser = null;
      this.booking = this.event.bookings[user.bookingId];
    } else {
      let found = false;
      for (let i = 0; i < this.event.bookings.length; i++) {
        if (this.event.bookings[i].user && this.event.bookings[i].user.id === user.id) {
          this.unbookedUser = null;
          this.booking = this.event.bookings[i];
          this.booking.user.balance = user.balance;
          found = true;
        }
      }
      console.log(this.booking);
      if (!found) {
        this.booking = null;
        this.unbookedUser = user;
      }
    }
  }

  clear() {
    this.userText.setValue('');
    this.booking = null;
    this.unbookedUser = null;
  }

  majBookings(booking: Booking) {
    if (booking) {
      for (let i = 0; i < this.event.bookings.length; i++) {
        if (this.event.bookings[i].id === booking.id) {
          if (booking.operation) {
            for (let j = 0; j < this.users.length; j++) {
              if (this.users[j].id === booking.user.id) {
                this.users[j].balance += booking.operation.amount;
              }
            }
          }
          this.event.bookings[i] = booking;
          this.booking = null;
        }
      }
    } else {
      this.booking = null;
    }
  }
}
