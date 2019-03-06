import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UserLight} from '../../core/models/auth.model';
import {NewOperation} from '../../core/models/operation.model';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {PaymentMeans} from '../../core/models/payment-means.model';

@Component({
  selector: 'app-bde-recharge-form',
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <p>
        <mat-form-field class="w-100" *ngIf="!user.value">
          <input type="text" placeholder="Cotisant" matInput [formControl]="userText" [matAutocomplete]="auto">
          <mat-autocomplete #auto="matAutocomplete">
            <mat-option *ngFor="let option of filteredOptions | async"
                        [value]="option.firstname +' '+ option.lastname"
                        (click)="user.patchValue(option)">
              {{option.firstname}} {{option.lastname}} promo {{option.promo}}
            </mat-option>
          </mat-autocomplete>
          <mat-error *ngIf="userText.touched && user.invalid">{{getErrorMessage(user)}}</mat-error>
        </mat-form-field>
      </p>
      <div *ngIf="user.value">
        {{user.value.firstname}} {{user.value.lastname}} promo {{user.value.promo}}
        , solde : {{user.value.balance |  currency:'EUR':'symbol':'1.2-2':'fr'}}
        <button class="ml-2" mat-flat-button color="warn" (click)="user.reset()">Changer</button>
      </div>
      <p>
        <mat-form-field class="w-100">
          <input type="number" matInput placeholder="Montant" formControlName="amount">
          <mat-error *ngIf="amount.touched && amount.invalid">{{getErrorMessage(amount)}}</mat-error>
        </mat-form-field>
      </p>
      <p>
        <mat-form-field class="w-100">
          <mat-select placeholder="Moyen de paiement" formControlName="paymentMeans">
            <mat-option *ngFor="let paymentMean of paymentMeans" [value]="api_url + '/payment_means/' + paymentMean.id">
              {{paymentMean.name}}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </p>
      <p>Nouveau solde : {{user.value.balance + amount.value | currency:'EUR':'symbol':'1.2-2':'fr' }}</p>
      <mat-error *ngIf="form.invalid">{{getErrorMessage(form)}}</mat-error>
      <p class="loginButtons">
        <button class="ml-2" type="submit" mat-flat-button color="accent" [disabled]="form.invalid">Recharger</button>
      </p>
    </form>
  `,
  styles: []
})
export class BdeRechargeFormComponent implements OnInit {

  _users: UserLight[];
  @Input()
  set users (users) {
    const contributors = [];
    for (let i = 0; i < users.length; i++) {
      if (users[i].contributeBDE) {
        contributors.push(users[i]);
      }
    }
    this._users = contributors;
  }

  get users() {return this._users; }
  _paymentMeans: PaymentMeans[];
  @Input()
  set paymentMeans (paymentMeans) {
    const paymentMeans2 = [];
    for (let i = 0; i < paymentMeans.length; i++) {
      if (paymentMeans[i].id > 2) {
        paymentMeans2.push(paymentMeans[i]);
      }
    }
    this._paymentMeans = paymentMeans2;
  }

  get paymentMeans() {return this._paymentMeans; }
  @Output() submitted = new EventEmitter<NewOperation>();
  api_url = environment.api_url;
  filteredOptions: Observable<UserLight[]>;

  form: FormGroup = this.fb.group({
    userText: [''],
    type: ['recharge'],
    user: ['', Validators.required],
    paymentMeans: ['', Validators.required],
    reason: ['Rechargement'],
    amount: [0]
  });

  get reason() { return this.form.get('reason'); }
  get user() { return this.form.get('user'); }
  get userText() { return this.form.get('userText'); }
  get amount() { return this.form.get('amount'); }


  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.filteredOptions = this.userText.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  private _filter(value: string): UserLight[] {
    const filterValue = value.toLowerCase();
    return this.users.filter((user: UserLight) => (user.firstname + ' ' + user.lastname).toLowerCase().includes(filterValue));
  }

  submit() {
    if (this.form.valid) {
      this.form.removeControl('userText');
      this.user.setValue(this.api_url + '/users/' + this.user.value.id);
      this.submitted.emit(this.form.value);
    }
  }

  getErrorMessage(formControl: FormControl) {
    return formControl.hasError('required') ? 'Ce champs ne doit pas être vide' :
      formControl.hasError('accountToLow') ? 'Le compte BDE ne contient pas assez d\'argent' : '';
  }
}
