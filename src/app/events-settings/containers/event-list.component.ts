import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BookingRanked, Event, EventBooking } from '../../core/models/event.model';
import { FormInput } from '../../core/models/form.model';
import { environment } from '../../../environments/environment';
import { BookingFilter } from '../components/booking-filter.component';
import { PaymentMeans } from '../../core/models/payment-means.model';

export interface DisplayedColumns {
  inputs: FormInput[];
  checked: boolean;
  paid: boolean;
  paymentMeans: boolean;
  see: boolean;
  cancel: boolean;
  rank: boolean;
  createdAt: boolean;
}

@Component({
  selector: 'app-event-list',
  template: `
    <app-search
      [query]="searchQuery"
      (search)="search($event)"
      placeholder="Rechercher"
    ></app-search>
    <h6 class="text-center">Filtrer</h6>
    <app-booking-filter
      [event]="event"
      (change)="filter($event)"
      [paymentMeans]="paymentMeans"
    ></app-booking-filter>
    <app-registered-list
      [event]="event"
      [bookings]="filteredBookings"
      [filter]="searchQuery"
      (selectUser)="select($event)"
      (deleteBooking)="delete($event)"
      [displayedCol]="displayedColumns"
      *ngIf="filteredBookings"
    ></app-registered-list>
  `,
  styles: [],
})
export class EventListComponent implements OnInit {
  @Output() selectUser = new EventEmitter<any>();
  @Output() deleteBooking = new EventEmitter<BookingRanked>();
  @Input() paymentMeans: PaymentMeans[];
  _event: Event;
  @Input()
  set event(event: Event) {
    this._event = event;
    const bookings = this.event.bookings.sort((a: EventBooking, b: EventBooking) =>
      a.createdAt > b.createdAt ? 1 : -1,
    );
    this.rankedBookings = EventListComponent.rank(bookings);
    this.filteredBookings = this.rankedBookings;
  }
  get event() {
    return this._event;
  }
  filteredBookings: BookingRanked[];
  rankedBookings: BookingRanked[];
  searchQuery = '';
  displayedColumns: DisplayedColumns;

  constructor() {}

  static rank(bookings: EventBooking[]): BookingRanked[] {
    const bookingsRanked: BookingRanked[] = [];
    for (let i = 0; i < bookings.length; i++) {
      const booking = bookings[i];
      booking.userName = bookings[i].user
        ? `${bookings[i].user.firstname} ${bookings[i].user.lastname}`
        : bookings[i].userName;
      booking.rank = i + 1;
      bookingsRanked.push(booking);
    }
    return bookingsRanked;
  }

  static resolveFormInput(formInputId: string): number {
    const re = new RegExp(`${environment.apiSuffix}/form_inputs/(.*)`);
    const id = re.exec(formInputId)['1'];
    return Number(id);
  }

  private static optionFoundInBooking(a: BookingRanked, filter: BookingFilter, i: number) {
    for (let j = 0; j < a.formOutputs.length; j++) {
      if (
        EventListComponent.resolveFormInput(a.formOutputs[j].formInput) ===
        filter.inputs[i].formInput.id
      ) {
        for (let k = 0; k < a.formOutputs[j].options.length; k++) {
          if (a.formOutputs[j].options[k].id === filter.inputs[i].selectedOption.id) {
            return true;
          }
        }
      }
    }
    return false;
  }

  private static optionsAllFoundInBooking(a: BookingRanked, filter: BookingFilter, i: number) {
    for (let j = 0; j < a.formOutputs.length; j++) {
      if (
        EventListComponent.resolveFormInput(a.formOutputs[j].formInput) ===
        filter.inputs[i].formInput.id
      ) {
        for (let k = 0; k < filter.inputs[i].selectedOptions.length; k++) {
          let found = false;
          for (let l = 0; l < a.formOutputs[j].options.length; l++) {
            if (a.formOutputs[j].options[l].id === filter.inputs[i].selectedOptions[k].id) {
              found = true;
            }
          }
          if (!found) {
            return false;
          }
        }
        return true;
      }
    }
    return false;
  }

  ngOnInit() {
    this.displayedColumns = {
      inputs: [],
      paid: true,
      checked: true,
      paymentMeans: false,
      see: true,
      cancel: false,
      rank: true,
      createdAt: !!this.event.shotgunListLength,
    };
  }

  search(event: string) {
    this.searchQuery = event;
  }

  filter(filter: BookingFilter) {
    // console.log(filter);
    const displayedInputs = [];
    for (let i = 0; i < filter.inputs.length; i++) {
      if (filter.inputs[i].displayColumn) {
        displayedInputs.push(filter.inputs[i].formInput);
      }
    }
    this.displayedColumns = {
      inputs: displayedInputs,
      paid: filter.dPaid,
      checked: filter.dChecked,
      paymentMeans: filter.paymentMeans.displayColumn,
      see: filter.dSee,
      cancel: filter.dCancel,
      rank: filter.dRank,
      createdAt: filter.dCreatedAt,
    };
    this.filteredBookings = this.rankedBookings.filter((a: BookingRanked) => {
      let pass = true;
      if (filter.checked === 1 && !a.checked) {
        pass = false;
      }
      if (filter.checked === -1 && a.checked) {
        pass = false;
      }
      if (this.event.price && filter.paid === 1 && !a.paid) {
        pass = false;
      }
      if (this.event.price && filter.paid === -1 && a.paid) {
        pass = false;
      }
      for (let i = 0; i < filter.inputs.length; i++) {
        if (filter.inputs[i].formInput.type === 'singleOption' && filter.inputs[i].selectedOption) {
          pass = pass && EventListComponent.optionFoundInBooking(a, filter, i);
        } else if (
          filter.inputs[i].formInput.type === 'multipleOptions' &&
          filter.inputs[i].selectedOptions.length
        ) {
          pass = pass && EventListComponent.optionsAllFoundInBooking(a, filter, i);
        }
      }
      if (filter.paymentMeans.selectedOptions.length) {
        if (this.event.price && a.paid) {
          let found = false;
          for (let i = 0; i < filter.paymentMeans.selectedOptions.length; i++) {
            if (filter.paymentMeans.selectedOptions[i].id === a.paymentMeans.id) {
              found = true;
            }
          }
          pass = pass && found;
        } else {
          pass = false;
        }
      }
      return pass;
    });
  }

  select(event) {
    this.selectUser.emit(event);
  }

  delete(booking: BookingRanked) {
    this.deleteBooking.emit(booking);
  }
}
