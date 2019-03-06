import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Booking, Event, NewBooking} from '../../core/models/event.model';
import {FormInput} from '../../core/models/form.model';
import {environment} from '../../../environments/environment';
import {EventService} from '../../core/services/event.service';
import {InfoService} from '../../core/services/info.service';

@Component({
  selector: 'app-booking-checking-card',
  template: `
    <div class="row">
      <div class="col text-center h4 m-2" *ngIf="booking.user">
        {{booking.user.firstname}} {{booking.user.lastname}} {{booking.user.promo}}
      </div>
      <div class="col text-center h4 m-2" *ngIf="booking.userName">
        {{booking.userName}}
      </div>
    </div>
    <div class="row">
      <div class="col-md-5 order-md-2" *ngIf="event.price">
        <div class="d-flex justify-content-around align-items-center m-3" *ngIf="booking.paid">
          <mat-icon class="green-icon">check_circle</mat-icon>
          <div>Payé</div>
        </div>
        <div class="text-center" *ngIf="booking.paid">
          {{price() | currency:'EUR':'symbol':'1.0-2':'fr'}} par {{booking.paymentMeans.name}}
        </div>
        <div class="d-flex justify-content-around align-items-center m-3" *ngIf="!booking.paid">
          <mat-icon color="warn">cancel</mat-icon>
          <div>Non payé</div>
        </div>
        <div class="text-center" *ngIf="!booking.paid">{{price() | currency:'EUR':'symbol':'1.0-2':'fr'}} à payer</div>
        <ng-container *ngIf="!booking.paid">
          <div class="d-flex flex-column justify-content-center m-2" *ngFor="let paymentMeans of event.paymentMeans">
          <div class="text-center" *ngIf="paymentMeans.id === 1 && booking.user && booking.user.balance">
            Solde BDE : {{booking.user.balance | currency:'EUR':'symbol':'1.0-2':'fr'}}
          </div>
          <button mat-flat-button color="accent" *ngIf="paymentMeans.id === 1"
                  [disabled]="!booking.user || booking.user.balance < price()" (click)="book(paymentMeans.id)">
           Payer par {{paymentMeans.name}}
          </button>
          <button mat-flat-button color="accent" *ngIf="paymentMeans.id !== 1 && paymentMeans.id !== 2" (click)="book(paymentMeans.id)">
            Payé par {{paymentMeans.name}}
          </button>
        </div>
        </ng-container>
        <button mat-flat-button color="accent" *ngIf="booking.paid" (click)="book(0)">
          Ok
        </button>
      </div>
      <div class="col-md-5 order-md-2" *ngIf="!event.price">
        <button mat-flat-button color="accent" (click)="book(0)">
          Ok
        </button>
      </div>
      <div class="col-md-7 order-md-1">
        <div class="row" *ngFor="let formOutput of booking.formOutputs">
          <div class="col" *ngIf="resolveFormInput(formOutput.formInput); let formInput;">
            <div *ngIf="(formInput.type === 'text' && formOutput.answer) ||
         ((formInput.type === 'singleOption' || formInput.type === 'multipleOptions') && formOutput.options.length)">
              <u>{{formInput.title}}</u>
            </div>
            <div *ngIf="formInput.type === 'text'">{{formOutput.answer}}</div>
            <ul *ngIf="formInput.type === 'singleOption' || formInput.type === 'multipleOptions'">
              <li *ngFor="let option of formOutput.options">
                {{option.value}}
                <span *ngIf="option.price">{{option.price | currency:'EUR':'symbol':'1.0-2':'fr'}}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .green-icon{
      color: #0fb001;
    }
    mat-icon {
      transform: scale(2);
    }
  `]
})
export class BookingCheckingCardComponent implements OnInit {
  @Input() booking: Booking;
  @Input() event: Event;
  @Output() paid = new EventEmitter<Booking>();
  pending = false;

  constructor(
    private eventService: EventService,
    private infoService: InfoService
  ) { }

  ngOnInit() {
  }

  resolveFormInput(formInputId: string): FormInput {
    const re = new RegExp(environment.api_suffix + '/form_inputs/(.*)');
    const id = re.exec(formInputId)['1'];
    for (let i = 0; i < this.event.formInputs.length; i++) {
      if (this.event.formInputs[i].id === Number(id)) {
        return this.event.formInputs[i];
      }
    }
  }

  price(): number {
    if (this.event.price) {
      let price = this.event.price;
      for (let i = 0; i < this.booking.formOutputs.length; i++) {
        for (let j = 0; j < this.booking.formOutputs[i].options.length; j++) {
          if (this.booking.formOutputs[i].options[j].price) {
            price += this.booking.formOutputs[i].options[j].price;
          }
        }
      }
      return price;
    } else {
      return 0;
    }
  }

  book(paymentMeansId: number) {
    this.pending = true;
    if (paymentMeansId === 0) {
      this.paid.emit(null);
    } else {
      const booking = {
        id: this.booking.id,
        paid: true,
        paymentMeans: environment.api_url + '/payment_means/' + paymentMeansId
      };
      if (paymentMeansId === 1 ) {
        booking['operation'] = {
          user: environment.api_url + '/users/' + this.booking.user.id,
          amount: -this.price(),
          reason: this.event.name,
          type: 'event_debit'
        };
      }
      console.log(booking);
      this.eventService.putBook(booking).subscribe(
        (b: Booking) => {
          console.log(b);
          this.pending = false;
          this.booking.paid = true;
          this.booking.paymentMeans = b.paymentMeans;
          if (b.operation) {
            this.booking.operation = b.operation;
          }
          this.paid.emit(this.booking);
          this.infoService.pushSuccess('Paiement effectué');
        },
        (error) => {
          this.pending = false;
        }
      );
    }
  }
}
