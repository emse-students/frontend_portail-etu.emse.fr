import {PaymentMeans} from './payment-means.model';
import {AssociationLight} from './association.model';
import {FormInput, NewFormInput} from './form.model';

export interface Event {
  id: number;
  name: string;
  description:	string;
  date:	string;
  duration:	number;
  price:	number;
  place:	string;
  paymentMeans:	PaymentMeans[];
  shotgunListLength:	number;
  shotgunWaitingList:	boolean;
  shotgunStartingDate:	string;
  closingDate:	string;
  association:	AssociationLight;
  formInputs: FormInput[];
  status: string;
}

export interface EventLight {
  id: number;
  name: string;
  description:	string;
  date:	string | Date;
  price:	number;
  place:	string;
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
  paymentMeans:	string[];
  shotgunListLength:	number;
  shotgunWaitingList:	boolean;
  shotgunStartingDate:	string;
  closingDate:	string;
  association:	string;
  formInputs: NewFormInput[];
  status: string;
}
