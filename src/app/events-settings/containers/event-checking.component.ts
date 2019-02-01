import {Component, Input, OnInit} from '@angular/core';
import {Event} from '../../core/models/event.model';
import {PaymentMeans} from '../../core/models/payment-means.model';

@Component({
  selector: 'app-event-checking',
  template: `
    <p>
      event-checking works!
    </p>
  `,
  styles: []
})
export class EventCheckingComponent implements OnInit {
  @Input() event: Event;
  @Input() isAdmin: boolean;
  @Input() paymentMeans: PaymentMeans[];

  constructor() { }

  ngOnInit() {
  }

}
