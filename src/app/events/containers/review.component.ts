import { Component, OnInit } from '@angular/core';
import {Event} from '../../core/models/event.model';
import {PaymentMeans} from '../../core/models/payment-means.model';
import {ActivatedRoute, Router} from '@angular/router';
import {EventService} from '../../core/services/event.service';
import {AuthService} from '../../core/services/auth.service';
import {PaymentMeansService} from '../../core/services/payment-means.service';

@Component({
  selector: 'app-review',
  template: `
    <div class="container">
      <mat-card *ngIf="loaded && paymentMeansLoaded">
        <mat-card-title class="h4">Description de l'événement</mat-card-title>
        <app-event-description [event]="event"></app-event-description>

        <div class="row justify-content-center" *ngIf="!event.closingDate || event.closingDate > today">
          <a [routerLink]="'/events/'+event.id+'/book'">
            <button mat-flat-button color="primary">S'inscrire</button>
          </a>
        </div>
      </mat-card>
    </div>
    <div class="centrer" *ngIf="!loaded">
      <mat-spinner  [diameter]="200" [strokeWidth]="5"></mat-spinner>
    </div>
  `,
  styles: [`
    mat-card-title,
    mat-card-content,
    mat-card-footer {
      display: flex;
      justify-content: center;
    }
  `]
})
export class ReviewComponent implements OnInit {
  today = new Date();
  loaded;
  paymentMeansLoaded = false;
  event: Event;
  paymentMeans: PaymentMeans[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private authService: AuthService,
    private paymentMeansService: PaymentMeansService
  ) { }

  ngOnInit() {
    this.paymentMeansService.gets().subscribe((paymentMeans: PaymentMeans[]) => {
      this.paymentMeansLoaded = true;
      this.paymentMeans = paymentMeans;
    });
    this.route.paramMap.subscribe(params => {
      if (!this.event || this.event.id !== Number(params.get('id'))) {
        this.loaded = false;
      }
      if (!this.loaded) {
        this.eventService.get(Number(params.get('id'))).subscribe((event: Event) => {
          this.event = event;
          this.loaded = true;
        });
      }
    });
  }
}
