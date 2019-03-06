import {Booking} from './event.model';
import {Operation} from './operation.model';

export interface User {
  id: number;
  balance: number;
  eventsBooked: number[];
}

export interface UserBookings {
  bookings: Booking[];
}

export interface UserOperation {
  id: number;
  balance: number;
  lastname:  string;
  firstname: string;
  promo: number;
  operations: Operation[];
}
