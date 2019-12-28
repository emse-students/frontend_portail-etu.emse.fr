import { Booking } from './event.model';
import { User } from './user.model';
import { PaymentMeans } from './payment-means.model';

export interface Operation {
  id: number;
  user: User;
  booking: Booking;
  amount: number;
  reason: string;
  type: string;
  paymentMeans: PaymentMeans;
  createdAt?: Date;
}

export interface NewOperation {
  user: string;
  booking?: string;
  amount: number;
  reason: string;
  type: string;
  paymentMeans: string;
}

export interface OperationLight {
  id: number;
  amount: number;
  paymentMeans: PaymentMeans;
}
