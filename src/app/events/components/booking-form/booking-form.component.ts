import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AuthenticatedUser, UserLight} from '../../../core/models/auth.model';
import {FormInput, FormOutput, NewFormOutput, Option} from '../../../core/models/form.model';
import {PaymentMeans} from '../../../core/models/payment-means.model';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {environment} from '../../../../environments/environment';
import {NewBooking, Event, Booking} from '../../../core/models/event.model';
import {arrayFindById} from '../../../core/services/utils';
import {AuthService} from '../../../core/services/auth.service';

interface BoolOption {
  selected: boolean;
  option: Option;
}

@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.scss']
})
export class BookingFormComponent implements OnInit {
  now: Date;
  _authenticatedUser: AuthenticatedUser | UserLight;
  @Input()
  set authenticatedUser (authenticatedUser: AuthenticatedUser | UserLight) {
    this._authenticatedUser = authenticatedUser;
    if (authenticatedUser && this.form && this.userName) {
      this.form.removeControl('userName');
    } else if (!authenticatedUser && this.form && !this.userName) {
      this.form.addControl('userName', new FormControl('', Validators.required));
    }
  }
  get authenticatedUser() { return this._authenticatedUser; }
  @Input() relatedEvent: Event;
  @Input() BDEBalance = 0;
  @Input() isNew;
  @Input() isFromSetting = false;
  _booking: Booking;
  @Input()
  set booking(booking: Booking) {
    this._booking = booking;
    if (this.form) {
      this.patch();
    }
  }
  get booking() { return this._booking; }
  lastPrice: number = null;
  displayUserName = false;
  form: FormGroup;

  @Output() submitted = new EventEmitter<NewBooking>();
  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.initForm();
    this.now = new Date();
    if (this.relatedEvent.shotgunListLength) {
      setInterval(() => {this.now = new Date(); }, 1000);
    }
  }

  get id() {return this.form.get('id'); }
  get paid() {return this.form.get('paid'); }
  get paymentMeans() {return this.form.get('paymentMeans'); }
  get user() {return this.form.get('user'); }
  get event() {return this.form.get('event'); }
  get userName() {return this.form.get('userName'); }
  get operation() {return this.form.get('operation'); }
  get bdePayment() {return this.form.get('bdePayment'); }
  get cerclePayment() {return this.form.get('cerclePayment'); }
  get formOutputs() {return this.form.get('formOutputs') as FormArray; }
  options(i) { return this.formOutputs.controls[i].get('options'); }
  boolOptions(i) { return this.formOutputs.controls[i].get('boolOptions') as FormArray; }
  formInput(i) { return this.formOutputs.controls[i].get('formInput'); }


  initForm() {
    this.form = this.fb.group({
      id: [''],
      paid: [false],
      paymentMeans: [null],
      user: [null],
      userName: ['', Validators.required],
      event: [''],
      operation: [null],
      bdePayment: [false],
      cerclePayment: [false],
      formOutputs: this.fb.array([])
    }, {validators: this.positiveAccount()});
    if (this.authenticatedUser) {
      this.form.removeControl('userName');
    }
    this.patch();
  }

  patch() {
    if (this._booking) {
      this.form.patchValue(this._booking);
      for (let i = 0; i < this._booking.formOutputs.length; i++) {
        this.patchFormOutput(this._booking.formOutputs[i]);
      }
      if (this.booking.operation) {
        this.lastPrice = -this.booking.operation.amount;
      }
      if (this.paymentMeans.value && this.paymentMeans.value.id === 1 ) {
        this.bdePayment.setValue(true);
      }
    } else if (this.relatedEvent && this.relatedEvent.formInputs) {
      for (let i = 0; i < this.relatedEvent.formInputs.length; i++) {
        this.addFormOutput(this.relatedEvent.formInputs[i]);
      }
    }
  }

  addFormOutput(formInput: FormInput) {
    if (formInput.required && formInput.type === 'text') {
      this.formOutputs.push(
        this.fb.group({
          answer: ['', Validators.required],
          boolOptions: this.fb.array([]),
          options: [[]],
          formInput: [formInput]
        })
      );
    } else if (formInput.required && ( formInput.type === 'singleOption' || formInput.type === 'multipleOptions' ) ) {
      this.formOutputs.push(
        this.fb.group({
          answer: [''],
          boolOptions: this.fb.array([],  this.optionRequired()),
          options: [[]],
          formInput: [formInput]
        })
      );
    } else {
      this.formOutputs.push(
        this.fb.group({
          answer: [''],
          boolOptions: this.fb.array([]),
          options: [[]],
          formInput: [formInput]
        })
      );
    }
    if (formInput.options) {
      for (let i = 0; i < formInput.options.length; i++) {
        this.boolOptions(this.formOutputs.length - 1).push(
          this.fb.group({
            selected: [false],
            option: [formInput.options[i]]
          })
        );
      }
    }
  }

  patchFormOutput(formOutput: FormOutput) {
    const formInput = formOutput.formInput;
    if (formInput.required && formInput.type === 'text') {
      this.formOutputs.push(
        this.fb.group({
          '@id': [environment.api_uri + '/form_outputs/' + formOutput.id],
          answer: [formOutput.answer, Validators.required],
          boolOptions: this.fb.array([]),
          options: [[]],
          formInput: [formInput]
        })
      );
    } else if (formInput.required && ( formInput.type === 'singleOption' || formInput.type === 'multipleOptions' ) ) {
      this.formOutputs.push(
        this.fb.group({
          '@id': [environment.api_uri + '/form_outputs/' + formOutput.id],
          answer: [''],
          boolOptions: this.fb.array([],  this.optionRequired()),
          options: [[]],
          formInput: [formInput]
        })
      );
    } else {
      this.formOutputs.push(
        this.fb.group({
          '@id': [environment.api_uri + '/form_outputs/' + formOutput.id],
          answer: [formOutput.answer],
          boolOptions: this.fb.array([]),
          options: [[]],
          formInput: [formInput]
        })
      );
    }
    if (formInput.options) {
      for (let i = 0; i < formInput.options.length; i++) {
        if (formOutput.options.map(r => r.id).includes(formInput.options[i].id)) {
          this.boolOptions(this.formOutputs.length - 1).push(
            this.fb.group({
              selected: [true],
              option: [formInput.options[i]]
            })
          );
        } else {
          this.boolOptions(this.formOutputs.length - 1).push(
            this.fb.group({
              selected: [false],
              option: [formInput.options[i]]
            })
          );
        }
      }
    }
  }

  selectOption(formOutputIndex: number, optionIndex: number) {
    for (let i = 0; i < this.boolOptions(formOutputIndex).controls.length; i++) {
      if (i === optionIndex) {
        this.boolOptions(formOutputIndex).controls[i].get('selected').setValue(true);
      } else {
        this.boolOptions(formOutputIndex).controls[i].get('selected').setValue(false);
      }
    }
  }

  submit() {
    if (this.form.valid) {
      let totalPrice = this.relatedEvent.price ? this.relatedEvent.price : 0;
      if (this.isNew) {this.form.removeControl('id'); }
      this.event.setValue(environment.api_uri + '/events/' + this.relatedEvent.id);
      if (this.authenticatedUser) {
        this.user.setValue(environment.api_uri + '/users/' + this.authenticatedUser.id);
      } else {
        this.form.removeControl('user');
      }
      const outputsToRemove = [];
      for (let i = 0; i < this.formOutputs.controls.length; i++) {
        const type = this.formInput(i).value.type;
        this.formInput(i).setValue(environment.api_uri + '/form_inputs/' + this.formInput(i).value.id);
        this.options(i).patchValue(
          this.boolOptions(i).value
            .map((v) => {
              totalPrice += v.selected ? v.option.price : 0;
              return v.selected ? environment.api_uri + '/options/' + v.option.id : null;
            })
            .filter(v => v !== null)
        );
        if (!this.formOutputs.controls[i].get('answer').value) {
          (<FormGroup>this.formOutputs.controls[i]).removeControl('answer');
        }
        (<FormGroup>this.formOutputs.controls[i]).removeControl('boolOptions');
        if (
          type === 'title' ||
          (type === 'text' && !this.formOutputs.controls[i].value.answer) ||
          ((type === 'multipleOptions' || type === 'singleOption' ) && !this.formOutputs.controls[i].value.options.length)
        ) {
          outputsToRemove.push(i);
        }
      }
      outputsToRemove.sort((a: number, b: number) => a > b ? -1 : a < b ? 1 : 0);
      for (let i = 0; i < outputsToRemove.length; i++) {
        this.formOutputs.removeAt(outputsToRemove[i]);
      }
      if (this.bdePayment.value) {
        this.paymentMeans.setValue(environment.api_uri + '/payment_means/1');
        if (!this.lastPrice) {
          this.operation.setValue({
            user: environment.api_uri + '/users/' + this.authenticatedUser.id,
            amount: -totalPrice,
            reason: this.relatedEvent.name,
            type: 'event_debit'
          });
        } else if (this.lastPrice !== totalPrice) {
          this.operation.setValue({
            user: environment.api_uri + '/users/' + this.authenticatedUser.id,
            amount: -totalPrice,
            reason: this.relatedEvent.name,
            type: 'event_debit'
          });
        }
        this.paid.setValue(true);
      } else if (this.cerclePayment.value) {
        this.paymentMeans.setValue(environment.api_uri + '/payment_means/2');
        this.paid.setValue(true);
      } else {
        this.form.removeControl('paymentMeans');
      }
      if (!this.operation.value) {
        this.form.removeControl('operation');
      }
      this.form.removeControl('bdePayment');
      this.form.removeControl('cerclePayment');
      this.submitted.emit(this.form.value);
    }
  }

  getErrorMessage(formControl: FormControl | AbstractControl) {
    return formControl.hasError('required') ? 'Ce champs ne doit pas être vide' :
      formControl.hasError('accountToLow') ? 'Votre compte BDE ne contient pas assez d\'argent' : '';
  }

  arrayFindById(arr, id) {
    return arrayFindById(arr, id);
  }

  optionRequired(): ValidatorFn {
    return (control: FormArray): {[key: string]: any} | null => {
      if (control.controls) {
        for (let i = 0; i < control.controls.length; i++) {
          if (control.controls[i].get('selected').value) {
            return null;
          }
        }
      }
      return {'required': {value: control.value}};
    };
  }

  positiveAccount(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      if (
        this.form && this.relatedEvent.price && this.bdePayment && this.bdePayment.value &&
        (this.totalPrice() > this.BDEBalance && (!this.lastPrice || (this.totalPrice() - this.lastPrice) > this.BDEBalance))
      ) {
          return {'accountToLow': {value: this.totalPrice()}};
      } else {
        return null;
      }
    };
  }

  totalPrice() {
    if (!this.relatedEvent.price) {
      return 0;
    } else if (!this.formOutputs.controls.length || !this.boolOptions(0)) {
      return this.relatedEvent.price;
    } else {
      let totalPrice = this.relatedEvent.price ? this.relatedEvent.price : 0;
      for (let i = 0; i < this.formOutputs.controls.length; i++) {
        for (let j = 0; j < this.boolOptions(i).length; j++) {
          if (this.boolOptions(i).controls[j].get('selected').value && this.boolOptions(i).controls[j].get('option').value.price) {
            totalPrice += this.boolOptions(i).controls[j].get('option').value.price;
          }
        }
      }
      return totalPrice;
    }
  }

  onLoginClick() {
    this.authService.login();
  }
}
