import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Booking, BookingRanked, Event, EventBooking} from '../../core/models/event.model';
import {FormInput} from '../../core/models/form.model';
import {environment} from '../../../environments/environment';
import {BookingFilter} from '../components/booking-filter.component';
import {EventService} from '../../core/services/event.service';
import {InfoService} from '../../core/services/info.service';

@Component({
  selector: 'app-event-list',
  template: `
    <app-search [query]="searchQuery"
                (search)="search($event)"
                placeholder="Rechercher"></app-search>
    <h6 class="text-center">Filtrer</h6>
    <app-booking-filter [event]="event" (change)="filter($event)"></app-booking-filter>
    <app-registered-list [event]="event"
                         [bookings]="filteredBookings"
                         [filter]="searchQuery"
                         (selectUser)="select($event)"
                         (deleteBooking)="delete($event)"
                         *ngIf="filteredBookings">
    </app-registered-list>
  `,
  styles: []
})
export class EventListComponent implements OnInit {
  @Output() selectUser = new EventEmitter<any>();
  @Output() deleteBooking = new EventEmitter<BookingRanked>();

  _event: Event;
  @Input()
  set event(event: Event) {
    this._event = event;
    const bookings = this.event.bookings.sort((a: EventBooking, b: EventBooking) => a.createdAt > b.createdAt ? 1 : -1);
    this.rankedBookings = EventListComponent.rank(bookings);
    this.filteredBookings = this.rankedBookings;
  }
  get event() {return this._event; }
  filteredBookings: BookingRanked[];
  rankedBookings: BookingRanked[];
  searchQuery = '';


  constructor() { }

  static rank(bookings: EventBooking[]): BookingRanked[] {
    const bookingsRanked: BookingRanked[] = [];
    for (let i = 0; i < bookings.length; i++) {
      const booking = bookings[i];
      booking.userName = bookings[i].user ? bookings[i].user.firstname + ' ' + bookings[i].user.lastname : bookings[i].userName;
      booking['rank'] = i + 1;
      bookingsRanked.push(booking);
    }
    return bookingsRanked;
  }

  static resolveFormInput(formInputId: string): number {
    const re = new RegExp(environment.api_suffix + '/form_inputs/(.*)');
    const id = re.exec(formInputId)['1'];
    return Number(id);
  }

  private static optionFoundInBooking(a: BookingRanked, filter: BookingFilter, i: number) {
    for (let j = 0; j < a.formOutputs.length; j++) {
      if (EventListComponent.resolveFormInput(a.formOutputs[j].formInput) === filter.inputs[i].formInput.id) {
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
      if (EventListComponent.resolveFormInput(a.formOutputs[j].formInput) === filter.inputs[i].formInput.id) {
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

  ngOnInit() {}

  search(event: string) {
    this.searchQuery = event;
  }

  filter(filter: BookingFilter) {
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
          } else if (filter.inputs[i].formInput.type === 'multipleOptions' && filter.inputs[i].selectedOptions.length) {
            pass = pass && EventListComponent.optionsAllFoundInBooking(a, filter, i);
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
