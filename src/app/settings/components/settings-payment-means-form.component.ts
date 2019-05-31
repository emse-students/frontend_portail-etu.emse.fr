import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PaymentMeans } from '../../core/models/payment-means.model';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-settings-payment-means-form',
  template: `
    <mat-card-content>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <p>
          <mat-form-field>
            <input type="text" matInput placeholder="Nom" formControlName="name" />
            <mat-error *ngIf="name.invalid">{{ getErrorMessage(name) }}</mat-error>
          </mat-form-field>
        </p>

        <p class="loginButtons">
          <mat-spinner *ngIf="ispending" [diameter]="35"></mat-spinner>
          <button
            class="ml-2"
            type="submit"
            mat-flat-button
            color="accent"
            [disabled]="form.invalid"
            *ngIf="!ispending"
          >
            {{ isNew ? 'Créer' : 'Mettre à jour' }}
          </button>
        </p>
      </form>
    </mat-card-content>
  `,
  styles: [
    `
      mat-card-title,
      mat-card-content,
      mat-card-footer {
        display: flex;
        justify-content: center;
      }
    `,
  ],
})
export class SettingsPaymentMeansFormComponent implements OnInit {
  ispending;

  @Input()
  set pending(isPending: boolean) {
    if (isPending) {
      this.form.disable();
      this.ispending = true;
    } else {
      this.form.enable();
      this.ispending = false;
    }
  }
  @Input() isNew = true;
  _paymentMeans: PaymentMeans | null;
  @Input()
  set paymentMeans(paymentMeans: PaymentMeans | null) {
    this._paymentMeans = paymentMeans;
    if (paymentMeans !== null) {
      this.form.patchValue(paymentMeans);
    }
  }

  @Output() submitted = new EventEmitter<PaymentMeans>();

  form: FormGroup = this.fb.group({});

  get name() {
    return this.form.get('name');
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      id: [null],
      name: ['', Validators.required],
    });
    if (this._paymentMeans !== null) {
      this.form.patchValue(this._paymentMeans);
    }
  }

  submit() {
    if (this.form.valid) {
      if (this.isNew) {
        this.form.removeControl('id');
      }
      this.submitted.emit(this.form.value);
    }
  }

  getErrorMessage(formControl: FormControl | AbstractControl) {
    return formControl.hasError('required') ? 'Ce champs ne doit pas être vide' : '';
  }
}
