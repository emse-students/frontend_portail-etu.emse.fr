import {Component, Input, OnInit} from '@angular/core';
import {Event} from '../../core/models/event.model';
import {PaymentMeans} from '../../core/models/payment-means.model';

@Component({
  selector: 'app-event-summary',
  template: `
    <p>
      event-summary works!
    </p>
  `,
  styles: []
})
export class EventSummaryComponent implements OnInit {
  @Input() event: Event;
  @Input() isAdmin: boolean;
  @Input() paymentMeans: PaymentMeans[];
  constructor() { }

  ngOnInit() {
  }

}
