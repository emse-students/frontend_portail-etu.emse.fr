import { PaymentMeans } from './payment-means.model';
import { Association } from './association.model';
import {
  BookingFormOutput,
  FormInput,
  FormOutput,
  NewFormInput,
  NewFormOutput,
} from './form.model';
import { UserLight } from './auth.model';
import { NewOperation, OperationLight } from './operation.model';
import { FileDTO } from './file.model';

export interface Event {
  id: number;
  name: string;
  img: FileDTO;
  description: string;
  date: Date;
  duration: number;
  price: number;
  place: string;
  open: boolean;
  publicEvent: boolean;
  paymentMeans: PaymentMeans[];
  shotgunListLength: number;
  shotgunWaitingList: boolean;
  shotgunStartingDate: Date;
  closingDate: Date;
  association: Association;
  formInputs: FormInput[];
  status: string;
  bookings?: EventBooking[];
  countBookings: number;
  collectLink: string;
  isBookable: boolean;
}

export interface EventLight {
  id: number;
  name: string;
  description: string;
  date: string | Date;
  price: number;
  place: string;
  open: boolean;
  publicEvent: boolean;
  shotgunListLength: number;
  shotgunStartingDate: string | Date;
  closingDate: string | Date;
  status: string;
  countBookings: number;
  isBookable: boolean;
}

export interface NewEvent {
  name: string;
  description: string;
  date: string;
  duration: number;
  price: number;
  place: string;
  open: boolean;
  publicEvent: boolean;
  paymentMeans: string[];
  shotgunListLength: number;
  shotgunWaitingList: boolean;
  shotgunStartingDate: string;
  closingDate: string;
  association: string;
  formInputs: NewFormInput[];
  status: string;
  img: string;
  collectLink: string;
  isBookable: boolean;
}

export interface Booking {
  id: number;
  paid: boolean;
  paymentMeans: PaymentMeans;
  user: UserLight;
  userName: string;
  formOutputs: FormOutput[];
  operation?: OperationLight;
  event?: Event;
  createdAt?: Date;
  checked?: boolean;
  cercleOperationAmount: number;
}

export interface EventBooking {
  id: number;
  paid: boolean;
  paymentMeans: PaymentMeans;
  user: UserLight;
  userName: string;
  operation?: OperationLight;
  event?: Event;
  createdAt?: Date;
  checked?: boolean;
  formOutputs: BookingFormOutput[];
  cercleOperationAmount: number;
}

export interface BookingRanked extends EventBooking {
  rank?: number;
}

export interface NewBooking {
  event: string;
  paid: boolean;
  paymentMeans: string;
  user: string;
  userName: string;
  operation: NewOperation;
  formOutputs: NewFormOutput[];
  cercleOperationAmount: number;
}

export interface PutBooking {
  id: number;
  event: string;
  paid: boolean;
  paymentMeans: string;
  user: string;
  userName: string;
  operation: NewOperation;
  formOutputs: NewFormOutput[];
  cercleOperationAmount: number;
  checked?: boolean;
}

export interface PutBookingLight {
  id: number;
  paid?: boolean;
  paymentMeans?: string;
  operation?: NewOperation;
  checked?: boolean;
}
