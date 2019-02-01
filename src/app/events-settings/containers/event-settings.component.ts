import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {EventService} from '../../core/services/event.service';
import {Event} from '../../core/models/event.model';
import {PaymentMeans} from '../../core/models/payment-means.model';
import {AuthService} from '../../core/services/auth.service';
import {PaymentMeansService} from '../../core/services/payment-means.service';

@Component({
  selector: 'app-event-settings',
  template: `
    <div class="container">
      <mat-card *ngIf="loaded && paymentMeansLoaded">
        <mat-card-title>{{event.name}}</mat-card-title>
        <mat-tab-group [dynamicHeight]="true" [selectedIndex]='selectedEventSetting'>
          <mat-tab>
            <ng-template mat-tab-label>
              <span class="mat-tab-label" (click)="goTo('summary')">Résumé</span>
            </ng-template>
            <mat-card>
              <mat-card-title>résumé</mat-card-title>

              <app-event-summary [event]="event"
                                [isAdmin]="isAdmin"
                                [paymentMeans]="paymentMeans">
              </app-event-summary>
            </mat-card>
          </mat-tab>

          <mat-tab>
            <ng-template mat-tab-label>
              <span class="mat-tab-label" (click)="goTo('checking')">Checking</span>
            </ng-template>

            <mat-card>
              <mat-card-title>Checking</mat-card-title>

              <app-event-checking [event]="event"
                                [isAdmin]="isAdmin"
                                [paymentMeans]="paymentMeans">
              </app-event-checking>
            </mat-card>
          </mat-tab>

          <mat-tab>
          <ng-template mat-tab-label>
            <span class="mat-tab-label" (click)="goTo('modify')">Modifier</span>
          </ng-template>

          <mat-card>
            <mat-card-title>Modifier</mat-card-title>

            <app-event-modify [event]="event"
                         [isAdmin]="isAdmin"
                         [paymentMeans]="paymentMeans"
                         (refreshEvent)="refreshEvent($event)">
            </app-event-modify>
          </mat-card>
        </mat-tab>
        </mat-tab-group>
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
export class EventSettingsComponent implements OnInit {
  loaded;
  paymentMeansLoaded = false;
  event: Event;
  selectedEventSetting: number;
  isAdmin = false;
  paymentMeans: PaymentMeans[];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private authService: AuthService,
    private paymentMeansService: PaymentMeansService
  ) { }

  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();
    this.paymentMeansService.gets().subscribe((paymentMeans: PaymentMeans[]) => {
      this.paymentMeansLoaded = true;
      this.paymentMeans = paymentMeans;
    });
    this.route.paramMap.subscribe(params => {
      if (!this.event || this.event.id !== Number(params.get('id'))) {
        this.loaded = false;
      }
      this.selectedEventSetting = this.strIdToTabId(params.get('setting'));
      if (!this.loaded) {
        this.eventService.get(Number(params.get('id'))).subscribe((event: Event) => {
          console.log(event);
          this.event = event;
          this.loaded = true;
        });
      }
    });
  }

  goTo(str_id: string) {
    this.router.navigate(['/events-settings', this.event.id, str_id]);
  }

  refreshEvent(event: Event) {
    this.event = event;
  }

  strIdToTabId(strId: string): number {
    switch (strId) {
      case 'summary':
        return 0;
      case 'checking':
        return 1;
      case 'modify':
        return 2;
    }
  }
}
