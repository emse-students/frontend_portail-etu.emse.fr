import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { EventBand } from '../../core/models/event-band.model';
import { EventBandService } from '../../core/services/event-band.service';
import { InfoService } from '../../core/services/info.service';

@Component({
  selector: 'app-modify-event-band',
  template: `
    <div class="container">
      <mat-card *ngIf="!unauthorized">
        <mat-card-title>Modifier le bandeau d'Événement</mat-card-title>
        <app-event-band-form
          *ngIf="!pending"
          (submitted)="updateEventBand($event)"
          (deleted)="delete($event)"
          [eventBand]="eventBand"
          [isNew]="false"
        ></app-event-band-form>
      </mat-card>
      <mat-card *ngIf="unauthorized">
        <mat-card-title>Accès non autorisé</mat-card-title>
        <p class="text-center">
          Vous n'avez pas les droits necessaires pour créer un bandeau d'événement
        </p>
      </mat-card>
    </div>
    <div class="centrer" *ngIf="pending">
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
export class ModifyEventBandComponent implements OnInit {
  pending = false;
  unauthorized = false;
  eventBand: EventBand;

  constructor(
    private authService: AuthService,
    private eventBandService: EventBandService,
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
      } else {
        this.unauthorized = !this.authService.isAdmin();
      }
    });
    this.route.paramMap.subscribe(params => {
      if (!this.eventBand || this.eventBand.id !== Number(params.get('id'))) {
        this.pending = true;
        this.eventBandService.get(Number(params.get('id'))).subscribe(eventBand => {
          this.pending = false;
          this.eventBand = eventBand;
        });
      }
    });
  }

  updateEventBand(eventBand: EventBand) {
    this.pending = true;
    this.eventBandService.put(eventBand).subscribe(() => {
      this.pending = false;
      this.infoService.pushSuccess("Bandeau d'Événement mis à jour avec succès");
      this.router.navigate(['/home']);
    });
  }

  delete(event: EventBand) {
    this.pending = true;
    this.eventBandService.delete(event.id).subscribe(() => {
      this.pending = false;
      this.infoService.pushSuccess("Bandeau d'Événement avec succès");
      this.router.navigate(['/home']);
    });
  }
}
