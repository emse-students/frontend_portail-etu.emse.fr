import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PaymentMeans } from '../../core/models/payment-means.model';
import { arrayRemoveById } from '../../core/services/utils';

export interface OperationFilter {
  paymentMeans: PaymentMeans[];
  recharge: boolean;
}

@Component({
  selector: 'app-operation-filter',
  template: `
    <div class="row justify-content-center align-items-center">
      <mat-form-field>
        <mat-label>
          Moyens de paiement
        </mat-label>
        <mat-select multiple="true">
          <mat-option *ngFor="let paymentMean of paymentMeans" (click)="togglePayment(paymentMean)">
            {{ paymentMean.name }}
          </mat-option>
        </mat-select>
      </mat-form-field>
      <div class="m-2"></div>
      <mat-slide-toggle [(ngModel)]="filter.recharge" (change)="onChange()">
        Rechargements
      </mat-slide-toggle>
    </div>
  `,
  styles: [],
})
export class OperationFilterComponent implements OnInit {
  @Input() paymentMeans: PaymentMeans[];
  filter: OperationFilter;
  @Output() change = new EventEmitter<OperationFilter>();

  ngOnInit(): void {
    this.filter = {
      paymentMeans: [],
      recharge: false,
    };
  }

  onChange(): void {
    this.change.emit(this.filter);
  }

  togglePayment(paymentMean: PaymentMeans): void {
    if (this.filter.paymentMeans.includes(paymentMean)) {
      this.filter.paymentMeans = arrayRemoveById(this.filter.paymentMeans, paymentMean.id);
    } else {
      this.filter.paymentMeans.push(paymentMean);
    }
    this.onChange();
  }
}
