import { Booking } from './event.model';
import { Operation } from './operation.model';

export interface User {
  id: number;
  login?: string;
  balance: number;
  cercleBalance: number;
  eventsBooked?: number[];
  contributeCercle?: boolean;
}

export interface UserDTO {
  balance: number;
  eventsBooked: number[];
}

export interface CercleUserDTO {
  balance: number;
  contribute: boolean;
}

export interface UserBookings {
  bookings: Booking[];
}

export interface UserOperation {
  id: number;
  balance: number;
  lastname: string;
  firstname: string;
  promo: number;
  type: string;
  operations: Operation[];
}
