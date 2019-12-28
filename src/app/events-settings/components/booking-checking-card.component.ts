import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Booking, Event, EventBooking, PutBooking } from '../../core/models/event.model';
import { FormInput } from '../../core/models/form.model';
import { environment } from '../../../environments/environment';
import { EventService } from '../../core/services/event.service';
import { InfoService } from '../../core/services/info.service';

@Component({
  selector: 'app-booking-checking-card',
  template: `
    <div class="row">
      <div class="col text-center h4 m-2" *ngIf="booking.user">
        {{ booking.user.firstname }} {{ booking.user.lastname }} {{ booking.user.type }}
        {{ booking.user.promo }}
      </div>
      <div class="col text-center h4 m-2" *ngIf="!booking.user">
        {{ booking.userName }}
      </div>
    </div>
    <div class="row">
      <div class="col-md-6 order-md-2" *ngIf="event.price">
        <div class="d-flex justify-content-around align-items-center m-3" *ngIf="booking.paid">
          <mat-icon class="green-icon">check_circle</mat-icon>
          <div>Payé</div>
        </div>
        <div class="text-center" *ngIf="booking.paid">
          {{ price() | currency: 'EUR':'symbol':'1.0-2':'fr' }} par {{ booking.paymentMeans.name }}
        </div>
        <div class="row justify-content-center">
          <button class="m-1" mat-flat-button color="warn" *ngIf="booking.paid" (click)="unpay()">
            Annuler le paiement
          </button>
        </div>
        <div class="d-flex justify-content-around align-items-center m-3" *ngIf="!booking.paid">
          <mat-icon color="warn">cancel</mat-icon>
          <div>Non payé</div>
        </div>
        <div class="text-center" *ngIf="!booking.paid">
          {{ price() | currency: 'EUR':'symbol':'1.0-2':'fr' }} à payer
        </div>
        <div class="d-flex justify-content-around align-items-center m-3" *ngIf="booking.checked">
          <mat-icon class="green-icon">check_circle</mat-icon>
          <div>Checké</div>
        </div>
        <div class="d-flex justify-content-around align-items-center m-3" *ngIf="!booking.checked">
          <mat-icon color="warn">cancel</mat-icon>
          <div>Non checké</div>
        </div>
        <ng-container *ngIf="!booking.paid">
          <div
            class="d-flex flex-column justify-content-center m-2"
            *ngFor="let paymentMeans of event.paymentMeans"
          >
            <div
              class="text-center"
              *ngIf="paymentMeans.id === 1 && booking.user && booking.user.contributeBDE"
            >
              Solde BDE : {{ booking.user.balance | currency: 'EUR':'symbol':'1.0-2':'fr' }}
            </div>
            <div
              class="text-center"
              *ngIf="paymentMeans.id === 2 && booking.user && booking.user.cercleBalance"
            >
              Solde Cercle :
              {{ booking.user.cercleBalance | currency: 'EUR':'symbol':'1.0-2':'fr' }}
            </div>
            <div class="row justify-content-around">
              <button
                class="m-1"
                mat-flat-button
                color="primary"
                *ngIf="paymentMeans.id === 1 && booking.user && booking.user.contributeBDE"
                [disabled]="!booking.user || booking.user.balance < price()"
                (click)="book(paymentMeans.id)"
              >
                Payer par {{ paymentMeans.name }}
              </button>
              <button
                class="m-1"
                mat-flat-button
                color="accent"
                *ngIf="paymentMeans.id === 1 && booking.user && booking.user.contributeBDE"
                [disabled]="!booking.user || booking.user.balance < price()"
                (click)="book(paymentMeans.id, true)"
              >
                Payer par {{ paymentMeans.name }} et checker
              </button>
              <button
                class="m-1"
                mat-flat-button
                color="primary"
                *ngIf="paymentMeans.id === 2 && booking.user && booking.user.contributeCercle"
                [disabled]="!booking.user || booking.user.cercleBalance < price()"
                (click)="book(paymentMeans.id)"
              >
                Payer par {{ paymentMeans.name }}
              </button>
              <button
                class="m-1"
                mat-flat-button
                color="accent"
                *ngIf="paymentMeans.id === 2 && booking.user && booking.user.contributeCercle"
                [disabled]="!booking.user || booking.user.cercleBalance < price()"
                (click)="book(paymentMeans.id, true)"
              >
                Payer par {{ paymentMeans.name }} et checker
              </button>
              <button
                class="m-1"
                mat-flat-button
                color="primary"
                *ngIf="paymentMeans.id !== 1 && paymentMeans.id !== 2"
                (click)="book(paymentMeans.id)"
              >
                Payé par {{ paymentMeans.name }}
              </button>
              <button
                class="m-1"
                mat-flat-button
                color="accent"
                *ngIf="paymentMeans.id !== 1 && paymentMeans.id !== 2"
                (click)="book(paymentMeans.id, true)"
              >
                Payé par {{ paymentMeans.name }} et checker
              </button>
            </div>
          </div>
        </ng-container>
        <div class="row justify-content-center" *ngIf="booking.paid">
          <button class="m-1" mat-flat-button color="primary" (click)="book(0)">
            Retour
          </button>
          <button
            class="m-1"
            mat-flat-button
            color="accent"
            *ngIf="!booking.checked"
            (click)="book(0, true)"
          >
            Checker
          </button>
        </div>
      </div>
      <div class="col-md-6 order-md-2" *ngIf="!event.price">
        <div class="d-flex justify-content-around align-items-center m-3" *ngIf="booking.checked">
          <mat-icon class="green-icon">check_circle</mat-icon>
          <div>Checké</div>
        </div>
        <div class="d-flex justify-content-around align-items-center m-3" *ngIf="!booking.checked">
          <mat-icon color="warn">cancel</mat-icon>
          <div>Non checké</div>
        </div>
        <div class="row justify-content-center">
          <button class="m-1" mat-flat-button color="primary" (click)="book(0)">
            Retour
          </button>
          <button
            class="m-1"
            mat-flat-button
            color="accent"
            *ngIf="!booking.checked"
            (click)="book(0, true)"
          >
            Checker
          </button>
        </div>
      </div>
      <div class="col-md-6 order-md-1">
        <div class="row" *ngFor="let formOutput of booking.formOutputs">
          <div class="col" *ngIf="resolveFormInput(formOutput.formInput); let formInput">
            <div
              *ngIf="
                (formInput.type === 'text' && formOutput.answer) ||
                ((formInput.type === 'singleOption' || formInput.type === 'multipleOptions') &&
                  formOutput.options.length)
              "
            >
              <u>{{ formInput.title }}</u>
            </div>
            <div *ngIf="formInput.type === 'text'">{{ formOutput.answer }}</div>
            <ul *ngIf="formInput.type === 'singleOption' || formInput.type === 'multipleOptions'">
              <li *ngFor="let option of formOutput.options">
                {{ option.value }}
                <span *ngIf="option.price">
                  {{ option.price | currency: 'EUR':'symbol':'1.0-2':'fr' }}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .green-icon {
        color: #0fb001;
      }
      mat-icon {
        transform: scale(2);
      }
    `,
  ],
})
export class BookingCheckingCardComponent implements OnInit {
  @Input() booking: EventBooking;
  @Input() event: Event;
  @Output() paid = new EventEmitter<EventBooking>();
  pending = false;

  constructor(private eventService: EventService, private infoService: InfoService) {}

  // eslint-disable-next-line no-empty-function, @typescript-eslint/no-empty-function
  ngOnInit() {}

  // eslint-disable-next-line consistent-return
  resolveFormInput(formInputId: string): FormInput {
    const re = new RegExp(`${environment.apiSuffix}/form_inputs/(.*)`);
    const id = re.exec(formInputId)['1'];
    for (let i = 0; i < this.event.formInputs.length; i++) {
      if (this.event.formInputs[i].id === Number(id)) {
        return this.event.formInputs[i];
      }
    }
  }

  price(): number {
    if (this.event.price) {
      let { price } = this.event;
      for (let i = 0; i < this.booking.formOutputs.length; i++) {
        for (let j = 0; j < this.booking.formOutputs[i].options.length; j++) {
          if (this.booking.formOutputs[i].options[j].price) {
            price += this.booking.formOutputs[i].options[j].price;
          }
        }
      }
      return price;
    }
    return 0;
  }

  book(paymentMeansId: number, checked = false) {
    if (!this.pending) {
      this.pending = true;
      if (paymentMeansId === 0 && !checked) {
        this.paid.emit(null);
      } else {
        const booking = {
          id: this.booking.id,
        } as PutBooking;
        if (paymentMeansId !== 0) {
          booking.paid = true;
          booking.paymentMeans = `${environment.apiUri}/payment_means/${paymentMeansId}`;
          if (this.booking.user) {
            booking.operation = {
              user: `${environment.apiUri}/users/${this.booking.user.id}`,
              amount: -this.price(),
              reason: this.event.name,
              type: 'event_debit',
              paymentMeans: `${environment.apiUri}/payment_means/${paymentMeansId}`,
            };
          }
          if (paymentMeansId === 2) {
            booking.cercleOperationAmount = this.price();
          }
        }
        if (checked) {
          booking.checked = true;
        }
        // console.log(booking);
        this.eventService.putBook(booking).subscribe(
          (b: Booking) => {
            // console.log(b);
            this.pending = false;
            if (paymentMeansId !== 0) {
              this.booking.paid = true;
              this.booking.paymentMeans = b.paymentMeans;
            }
            if (checked) {
              this.booking.checked = true;
            }
            this.booking.operation = b.operation;
            if (paymentMeansId === 2) {
              this.booking.cercleOperationAmount = b.cercleOperationAmount;
            }
            this.paid.emit(this.booking);
            if (paymentMeansId !== 0) {
              this.infoService.pushSuccess('Paiement effectué');
            } else {
              this.infoService.pushSuccess('Checké');
            }
          },
          () => {
            this.pending = false;
          },
        );
      }
    }
  }

  unpay() {
    // eslint-disable-next-line no-restricted-globals, no-undef
    if (confirm('Voulez-vous annuler le paiement ?')) {
      this.pending = true;
      const booking = {
        id: this.booking.id,
        paid: false,
        paymentMeans: null,
        operation: null,
        checked: false,
        cercleOperationAmount: null,
      };
      // console.log(booking);
      this.eventService.putBook(booking).subscribe(
        () => {
          this.pending = false;
          this.booking.paid = false;
          this.booking.paymentMeans = null;
          this.booking.operation = null;
          this.booking.checked = false;
          this.booking.cercleOperationAmount = null;

          this.paid.emit(this.booking);
          this.infoService.pushSuccess('Paiement annulé');
        },
        () => {
          this.pending = false;
        },
      );
    }
  }
}
