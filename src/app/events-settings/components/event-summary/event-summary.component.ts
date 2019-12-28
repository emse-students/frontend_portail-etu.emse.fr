import { Component, Input, OnInit } from '@angular/core';
import { Event } from '../../../core/models/event.model';
import { PaymentMeans } from '../../../core/models/payment-means.model';
import { FormOutput } from '../../../core/models/form.model';
import { environment } from '../../../../environments/environment';

interface Income {
  paymentMeans: PaymentMeans;
  total: number;
}

@Component({
  selector: 'app-event-summary',
  templateUrl: './event-summary.component.html',
  styleUrls: ['./event-summary.component.scss'],
})
export class EventSummaryComponent implements OnInit {
  _event: Event;
  @Input()
  set event(event: Event) {
    this._event = event;
    this.compute();
  }
  get event() {
    return this._event;
  }
  theoricalIncome: number;
  realIncomeTotal: number;
  realIncome: Income[];
  environmentHome = environment.home;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  ngOnInit() {
    this.compute();
  }

  compute() {
    this.theoricalIncome = 0;
    this.realIncome = [];
    this.realIncomeTotal = 0;
    for (let i = 0; i < this.event.paymentMeans.length; i++) {
      this.realIncome.push({
        paymentMeans: this.event.paymentMeans[i],
        total: 0,
      });
    }
    if (this.event.price) {
      for (let i = 0; i < this.event.bookings.length; i++) {
        this.theoricalIncome += this.event.price;
        let optionPrice = 0;
        for (let j = 0; j < this.event.bookings[i].formOutputs.length; j++) {
          if (this.event.bookings[i].formOutputs[j].options) {
            for (let k = 0; k < this.event.bookings[i].formOutputs[j].options.length; k++) {
              optionPrice += this.event.bookings[i].formOutputs[j].options[k].price;
              this.theoricalIncome += this.event.bookings[i].formOutputs[j].options[k].price;
            }
          }
        }
        if (this.event.bookings[i].paid) {
          for (let j = 0; j < this.realIncome.length; j++) {
            if (this.realIncome[j].paymentMeans.id === this.event.bookings[i].paymentMeans.id) {
              this.realIncome[j].total += this.event.price + optionPrice;
              this.realIncomeTotal += this.event.price + optionPrice;
            }
          }
        }
      }
    }
  }

  count(outputs: FormOutput[], optionId: number): number {
    let count = 0;
    for (let i = 0; i < outputs.length; i++) {
      for (let j = 0; j < outputs[i].options.length; j++) {
        if (outputs[i].options[j].id === optionId) {
          count += 1;
        }
      }
    }
    return count;
  }
}
