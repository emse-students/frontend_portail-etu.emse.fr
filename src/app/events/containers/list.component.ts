import { Component, OnInit } from '@angular/core';
import {Event} from '../../core/models/event.model';
import {PaymentMeans} from '../../core/models/payment-means.model';
import {ActivatedRoute, Router} from '@angular/router';
import {EventService} from '../../core/services/event.service';
import {AuthService} from '../../core/services/auth.service';
import {PaymentMeansService} from '../../core/services/payment-means.service';

@Component({
  selector: 'app-list',
  template: `
    <div class="container">
      <mat-card *ngIf="loaded">
        <mat-card-title class="h4">Liste des inscrits à l'événement {{event.name}}</mat-card-title>
        <p class="text-center" *ngIf="event.shotgunListLength">Événement au shotgun : {{event.shotgunListLength}} places</p>
        <p class="text-center">Nombre d'inscrits : {{event.countBookings}}</p>
        <app-search [query]="searchQuery"
                    [searching]="loading"
                    (search)="search($event)"
                    placeholder="Rechercher"></app-search>
        <app-event-bookings-list [event]="event" [filter]="searchQuery"></app-event-bookings-list>
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
export class ListComponent implements OnInit {
  searchQuery = '';
  loading = false;
  today = new Date();
  loaded;
  event: Event;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      if (!this.event || this.event.id !== Number(params.get('id'))) {
        this.loaded = false;
      }
      if (!this.loaded) {
        this.eventService.get(Number(params.get('id'))).subscribe((event: Event) => {
          this.event = event;
          this.eventService.getBookings(event.id).subscribe((eventWithBookings: Event) => {
              this.event.bookings = eventWithBookings.bookings;
              this.loaded = true;
            }
          );
        });
      }
    });
  }

  search(event: string) {
    this.searchQuery = event;
  }
}
