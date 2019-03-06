import {Booking} from './event.model';
import {User} from './user.model';

export interface Operation {
  id: number;
  user: User;
  booking: Booking;
  amount: number;
  reason: string;
  type: string;
  createdAt?: Date;
}

export interface NewOperation {
  user: string;
  booking: string;
  amount: number;
  reason: string;
  type: string;
}

export interface OperationLight {
  id: number;
  amount: number;
}
