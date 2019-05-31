import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Event } from '../../core/models/event.model';
import { FormInput, Option } from '../../core/models/form.model';
import { PaymentMeans } from '../../core/models/payment-means.model';
import { arrayRemoveById } from '../../core/services/utils';

export interface BookingFilterInput {
  formInput: FormInput;
  selectedOption?: Option;
  selectedOptions?: Option[];
  displayColumn: boolean;
  opened?: boolean;
}

export interface PayementFilter {
  displayColumn: boolean;
  selectedOptions: PaymentMeans[];
  opened: boolean;
}

export interface BookingFilter {
  checked: number;
  dChecked: boolean;
  paid?: number;
  dPaid?: boolean;
  dSee: boolean;
  dRank: boolean;
  dCreatedAt;
  dCancel: boolean;
  inputs?: BookingFilterInput[];
  paymentMeans: PayementFilter;
}

@Component({
  selector: 'app-booking-filter',
  template: `
    <div class="row justify-content-center">
      <mat-form-field *ngIf="event.price">
        <mat-label>Payé ?</mat-label>
        <mat-select [(value)]="filter.paid" (valueChange)="onChange()">
          <mat-option [value]="0">-</mat-option>
          <mat-option [value]="1">Oui</mat-option>
          <mat-option [value]="-1">Non</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field *ngIf="event.price">
        <mat-label (click)="filter.paymentMeans.opened = !filter.paymentMeans.opened">
          Moyens de paiement
        </mat-label>
        <mat-select multiple="true">
          <mat-option *ngFor="let paymentMean of paymentMeans" (click)="togglePayment(paymentMean)">
            {{ paymentMean.name }}
          </mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field>
        <mat-label>Checké ?</mat-label>
        <mat-select [(value)]="filter.checked" (valueChange)="onChange()">
          <mat-option [value]="0">-</mat-option>
          <mat-option [value]="1">Oui</mat-option>
          <mat-option [value]="-1">Non</mat-option>
        </mat-select>
      </mat-form-field>

      <ng-container *ngFor="let input of filter.inputs; let i = index">
        <mat-form-field *ngIf="input.formInput.type === 'singleOption'">
          <mat-label>{{ input.formInput.title }}</mat-label>
          <mat-select [(value)]="input.selectedOption" (valueChange)="onChange()">
            <mat-option [value]="0">-</mat-option>
            <mat-option [value]="option" *ngFor="let option of input.formInput.options">
              {{ option.value }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field *ngIf="input.formInput.type === 'multipleOptions'">
          <mat-label (click)="input.opened = !input.opened">{{ input.formInput.title }}</mat-label>
          <mat-select multiple="true">
            <mat-option
              *ngFor="let option of input.formInput.options"
              (click)="toggleOption(i, option)"
            >
              {{ option.value }}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </ng-container>
    </div>
    <div class="row justify-content-center">
      <mat-slide-toggle
        [(ngModel)]="filter.dRank"
        (change)="onChange()"
        *ngIf="event.shotgunListLength"
      >
        Rang
      </mat-slide-toggle>
      <mat-slide-toggle [(ngModel)]="filter.dCreatedAt" (change)="onChange()">
        Date
      </mat-slide-toggle>
      <mat-slide-toggle [(ngModel)]="filter.dPaid" (change)="onChange()" *ngIf="event.price">
        Payé
      </mat-slide-toggle>
      <mat-slide-toggle
        [(ngModel)]="filter.paymentMeans.displayColumn"
        (change)="onChange()"
        *ngIf="event.price"
      >
        Moyens de paiement
      </mat-slide-toggle>
      <mat-slide-toggle [(ngModel)]="filter.dChecked" (change)="onChange()">
        Checké
      </mat-slide-toggle>
      <mat-slide-toggle [(ngModel)]="filter.dSee" (change)="onChange()">Voir</mat-slide-toggle>
      <mat-slide-toggle [(ngModel)]="filter.dCancel" (change)="onChange()">
        Annuler
      </mat-slide-toggle>
      <div *ngFor="let input of filter.inputs; let i = index">
        <mat-slide-toggle [(ngModel)]="input.displayColumn" (change)="onChange()">
          {{ input.formInput.title }}
        </mat-slide-toggle>
      </div>
    </div>
  `,
  styles: [],
})
export class BookingFilterComponent implements OnInit {
  @Input() event: Event;
  @Input() paymentMeans: PaymentMeans[];
  filter: BookingFilter;
  @Output() change = new EventEmitter<BookingFilter>();
  constructor() {}

  ngOnInit() {
    const inputs: BookingFilterInput[] = [];
    for (let i = 0; i < this.event.formInputs.length; i++) {
      if (this.event.formInputs[i].type === 'singleOption') {
        inputs.push({
          formInput: this.event.formInputs[i],
          selectedOption: null,
          displayColumn: false,
        });
      } else if (this.event.formInputs[i].type === 'multipleOptions') {
        inputs.push({
          formInput: this.event.formInputs[i],
          selectedOptions: [],
          opened: false,
          displayColumn: false,
        });
      }
    }
    this.filter = {
      paid: null,
      dPaid: true,
      dRank: true,
      dCreatedAt: !!this.event.shotgunListLength,
      checked: null,
      dChecked: true,
      dCancel: false,
      dSee: true,
      inputs: inputs,
      paymentMeans: {
        displayColumn: false,
        selectedOptions: [],
        opened: false,
      },
    };
  }

  onChange() {
    this.change.emit(this.filter);
  }

  toggleOption(index: number, option: Option) {
    let findIndex = -1;
    for (let i = 0; i < this.filter.inputs[index].selectedOptions.length; i++) {
      if (this.filter.inputs[index].selectedOptions[i].id === option.id) {
        findIndex = i;
      }
    }
    if (findIndex === -1) {
      this.filter.inputs[index].selectedOptions.push(option);
    } else {
      this.filter.inputs[index].selectedOptions.splice(findIndex, 1);
    }
    this.onChange();
  }

  togglePayment(paymentMean: PaymentMeans) {
    if (this.filter.paymentMeans.selectedOptions.includes(paymentMean)) {
      this.filter.paymentMeans.selectedOptions = arrayRemoveById(
        this.filter.paymentMeans.selectedOptions,
        paymentMean.id,
      );
    } else {
      this.filter.paymentMeans.selectedOptions.push(paymentMean);
    }
    this.onChange();
  }
}
