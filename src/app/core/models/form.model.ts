import {Booking} from './event.model';

export interface FormInput {
  id: number;
  title: string;
  type: string;
  required: boolean;
  options: Option[];
  formOutputs?: FormOutput[];
}

export interface NewFormInput {
  title: string;
  type: string;
  required: boolean;
  options: NewOption[];
}

export interface FormOutput {
  id: number;
  answer: string;
  options: Option[];
  formInput?: FormInput;
  booking?: Booking;
}

export interface NewFormOutput {
  answer: string;
  options: string[];
  formInput: string;
}

export interface Option {
  id: number;
  value: string;
  price: number;
}

export interface NewOption {
  value: string;
  price: number;
}
