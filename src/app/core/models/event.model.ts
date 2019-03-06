import {PaymentMeans} from './payment-means.model';
import {AssociationLight} from './association.model';
import {FormInput, FormOutput, NewFormInput, NewFormOutput} from './form.model';
import {UserLight} from './auth.model';
import {NewOperation, OperationLight} from './operation.model';

export interface Event {
  id: number;
  name: string;
  description:	string;
  date:	Date;
  duration:	number;
  price:	number;
  place:	string;
  open: boolean;
  paymentMeans:	PaymentMeans[];
  shotgunListLength:	number;
  shotgunWaitingList:	boolean;
  shotgunStartingDate:	Date;
  closingDate:	Date;
  association:	AssociationLight;
  formInputs: FormInput[];
  status: string;
  bookings?: Booking[];
}

export interface EventLight {
  id: number;
  name: string;
  description:	string;
  date:	string | Date;
  price:	number;
  place:	string;
  open: boolean;
  shotgunListLength:	number;
  shotgunStartingDate:	string | Date;
  closingDate:	string | Date;
  status: string;
}

export interface NewEvent {
  name: string;
  description:	string;
  date:	string;
  duration:	number;
  price:	number;
  place:	string;
  open: boolean;
  paymentMeans:	string[];
  shotgunListLength:	number;
  shotgunWaitingList:	boolean;
  shotgunStartingDate:	string;
  closingDate:	string;
  association:	string;
  formInputs: NewFormInput[];
  status: string;
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
}

export interface NewBooking {
  event: string;
  paid: boolean;
  paymentMeans: string;
  user: string;
  userName: string;
  operation: NewOperation;
  formOutputs: NewFormOutput[];
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
}

export interface PutBookingLight {
  id: number;
  paid: boolean;
  paymentMeans: string;
  operation?: NewOperation;
}