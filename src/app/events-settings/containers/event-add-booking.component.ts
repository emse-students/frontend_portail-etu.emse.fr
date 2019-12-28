import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { Event, EventBooking, NewBooking } from '../../core/models/event.model';
import { PaymentMeans } from '../../core/models/payment-means.model';
import { EventUser, UserLight } from '../../core/models/auth.model';
import { UserService } from '../../core/services/user.service';
import { EventService } from '../../core/services/event.service';
import { InfoService } from '../../core/services/info.service';

@Component({
  selector: 'app-event-add-booking',
  template: `
    <p>Élève de l'école :</p>
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
            </mat-option>
          </mat-autocomplete>
        </mat-form-field>
        <div class="col-2 d-flex flex-column justify-content-center">
          <mat-icon color="warn" (click)="clear()">clear</mat-icon>
        </div>
      </div>
    </form>
    <p *ngIf="!newBookingUser">Sinon (pas de compte EMSE) :</p>
    <p *ngIf="newBookingUser && !alreadyBooked">
      Réserver au nom de {{ newBookingUser.firstname }} {{ newBookingUser.lastname }} promo
      {{ newBookingUser.promo }}
    </p>
    <app-booking-form
      [authenticatedUser]="newBookingUser"
      [relatedEvent]="event"
      [currentUser]="newBookingUser"
      [isFromSetting]="true"
      [isNew]="true"
      (submitted)="book($event)"
      *ngIf="!alreadyBooked && !pending"
    ></app-booking-form>
    <p *ngIf="alreadyBooked">
      {{ newBookingUser.firstname }} {{ newBookingUser.lastname }} promo
      {{ newBookingUser.promo }} a déjà réservé
    </p>
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
export class EventAddBookingComponent implements OnInit {
  @Input() event: Event;
  @Input()
  set selectedUser(selectedUser) {
    if (selectedUser) {
      this.select(selectedUser);
      this.userText.setValue(`${selectedUser.firstname} ${selectedUser.lastname}`);
    }
  }
  @Input() isAdmin: boolean;
  @Input() paymentMeans: PaymentMeans[];
  @Output() addBooking = new EventEmitter<EventBooking>();
  filteredOptions: Observable<EventUser[]>;
  _users: EventUser[];
  @Input()
  set users(users: EventUser[]) {
    this._users = users.filter(user => !!user.id);
  }
  get users(): EventUser[] {
    return this._users;
  }
  alreadyBooked = false;
  newBookingUser: UserLight = null;

  pending = false;

  form: FormGroup = this.fb.group({
    userText: [''],
  });

  get userText(): AbstractControl {
    return this.form.get('userText');
  }

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private eventService: EventService,
    private infoService: InfoService,
  ) {}

  ngOnInit(): void {
    this.filteredOptions = this.userText.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
  }

  _filter(value: string): EventUser[] {
    const filterValue = value.toLowerCase();
    if (this.users) {
      return this.users
        .filter(user => {
          if (user.id) {
            return `${user.firstname} ${user.lastname}`.toLowerCase().includes(filterValue);
          }
          return user.username.toLowerCase().includes(filterValue);
        })
        .slice(0, 20);
    }
    return [];
  }

  select(user): void {
    for (let i = 0; i < this.event.bookings.length; i++) {
      if (this.event.bookings[i].user && this.event.bookings[i].user.id === user.id) {
        this.alreadyBooked = true;
      }
    }
    this.newBookingUser = user;
  }

  clear(): void {
    this.userText.setValue('');
    this.newBookingUser = null;
    this.alreadyBooked = false;
  }

  book(newBooking: NewBooking): void {
    this.pending = true;
    // console.log(newBooking);
    // setTimeout(() => {this.pending = false; }, 2000);
    this.eventService.book(newBooking).subscribe(
      booking => {
        // console.log(booking);
        this.addBooking.emit(booking);
        this.pending = false;
        this.infoService.pushSuccess('Réservation effectuée');
        this.clear();
      },
      // eslint-disable-next-line no-unused-vars
      error => {
        this.pending = false;
      },
    );
  }
}
