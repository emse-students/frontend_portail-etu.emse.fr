import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Event} from '../../core/models/event.model';
import {PaymentMeans} from '../../core/models/payment-means.model';
import {EventService} from '../../core/services/event.service';
import {InfoService} from '../../core/services/info.service';

@Component({
  selector: 'app-event-modify',
  template: `
    <app-event-form *ngIf="event.association && paymentMeans && !pending"
                    [asso]="event.association"
                    [allPaymentMeans]="paymentMeans"
                    (submitted)="updateEvent($event)"
                    [isAdmin]="isAdmin"
                    [event]="event"
                    [isNew]="false">
    </app-event-form>
    <div class="row justify-content-center" *ngIf="pending">
        <mat-spinner  [diameter]="200" [strokeWidth]="5"></mat-spinner>
    </div>
  `,
  styles: []
})
export class EventModifyComponent implements OnInit {
  @Input() event: Event;
  @Input() isAdmin: boolean;
  @Input() paymentMeans: PaymentMeans[];

  @Output() refreshEvent = new EventEmitter<Event>();
  pending = false;
  constructor(
    private eventService: EventService,
    private infoService: InfoService,
  ) { }

  ngOnInit() {}

  updateEvent(event: Event) {
    console.log(event);
    this.pending = true;
    this.eventService.put(event).subscribe(
      (newEvent) => {
        this.pending = false;
        this.infoService.pushSuccess('Événement mis à jour avec succès');
        this.refreshEvent.emit(newEvent);
      }
    );
  }
}