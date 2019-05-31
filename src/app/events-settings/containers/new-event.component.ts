import { Component, OnInit } from '@angular/core';
import { PaymentMeans } from '../../core/models/payment-means.model';
import { PaymentMeansService } from '../../core/services/payment-means.service';
import { AuthService } from '../../core/services/auth.service';
import { AssociationService } from '../../core/services/association.service';
import { AssociationLight } from '../../core/models/association.model';
import { arrayFindById } from '../../core/services/utils';
import { Event } from '../../core/models/event.model';
import { EventService } from '../../core/services/event.service';
import { InfoService } from '../../core/services/info.service';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-new-event',
  template: `
    <div class="container">
      <mat-card *ngIf="loaded && !unauthorized">
        <mat-card-title>Nouvel Événement</mat-card-title>
        <app-event-form
          *ngIf="selectedAsso && paymentMeans && !pending"
          [asso]="selectedAsso"
          [allPaymentMeans]="paymentMeans"
          (submitted)="createEvent($event)"
          [isAdmin]="authService.isAdmin()"
          [isNew]="true"
        ></app-event-form>
        <app-select-asso-form
          [assos]="assoAvailables"
          (submitted)="selectedAsso = $event"
          *ngIf="!selectedAsso && assoAvailables && !pending"
        ></app-select-asso-form>
      </mat-card>
      <mat-card *ngIf="loaded && unauthorized">
        <mat-card-title>Accès non autorisé</mat-card-title>
        <p class="text-center">Vous n'avez pas les droits necessaires pour créer un événement</p>
      </mat-card>
    </div>
    <div class="centrer" *ngIf="!loaded || pending">
      <mat-spinner [diameter]="200" [strokeWidth]="5"></mat-spinner>
    </div>
  `,
  styles: [
    `
      mat-card-title,
      mat-card-content,
      mat-card-footer {
        display: flex;
        justify-content: center;
      }

      .centrer {
        position: absolute;
        display: flex;
        align-content: center;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
      }
    `,
  ],
})
export class NewEventComponent implements OnInit {
  loaded = false;
  pending = false;
  paymentMeans: PaymentMeans[];
  assoAvailables: AssociationLight[];
  selectedAsso: AssociationLight;
  selectedId: number;
  unauthorized = false;
  get authService() {
    return this._authService;
  }

  constructor(
    private paymentMeansService: PaymentMeansService,
    private _authService: AuthService,
    private associationService: AssociationService,
    private eventService: EventService,
    private infoService: InfoService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.authService.authenticatedUser.subscribe(authenticatedUser => {
      if (!authenticatedUser) {
        setTimeout(() => {
          this.router.navigate(['/home']);
        });
      }
    });
    this.paymentMeansService.gets().subscribe((paymentMeans: PaymentMeans[]) => {
      this.paymentMeans = paymentMeans;
    });
    this.route.paramMap.subscribe(params => {
      if (params.get('id')) {
        this.selectedId = Number(params.get('id'));
      }
    });
    this.associationService.allAssosAndLists.subscribe((assos: AssociationLight[]) => {
      if (assos) {
        const assoIds = this._authService.getAssoIdRightfullyEventEditable();
        // console.log(assoIds);
        if (assoIds.length === 1 && assoIds[0] === 0) {
          this.assoAvailables = assos;
        } else if (assoIds.length > 0) {
          const assoAvailables = [];
          for (let i = 0; i < assoIds.length; i++) {
            const index = arrayFindById(assos, assoIds[i]);
            if (index !== -1) {
              assoAvailables.push(assos[arrayFindById(assos, assoIds[i])]);
            }
          }
          this.assoAvailables = assoAvailables;
        } else {
          this.assoAvailables = [];
          this.unauthorized = true;
        }
        if (this.selectedId) {
          this.selectedAsso = this.selectAsso(this.selectedId);
        }
        this.loaded = true;
      }
    });
    this.associationService.getLights();
  }

  createEvent(event: Event) {
    // console.log(event);
    this.selectedAsso = null;
    this.pending = true;
    this.eventService.create(event).subscribe(newEvent => {
      this.pending = false;
      this.infoService.pushSuccess('Événement créé avec succès');
      if (newEvent.isBookable) {
        this.infoService.pushInfo(
          "Url d'inscription : " + environment.home + 'events/' + newEvent.id + '/book',
        );
      }
    });
  }

  selectAsso(id: number): AssociationLight {
    for (let i = 0; i < this.assoAvailables.length; i++) {
      if (this.assoAvailables[i].id === id) {
        return this.assoAvailables[i];
      }
    }
    return null;
  }
}
