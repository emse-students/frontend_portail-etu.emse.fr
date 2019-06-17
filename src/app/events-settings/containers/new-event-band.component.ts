import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { EventBand } from '../../core/models/event-band.model';
import { EventBandService } from '../../core/services/event-band.service';
import { InfoService } from '../../core/services/info.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-new-event-band',
  template: `
    <div class="container">
      <mat-card *ngIf="!unauthorized">
        <mat-card-title>Nouveau Bandeau d'Événement</mat-card-title>
        <app-event-band-form
          *ngIf="!pending"
          (submitted)="createEventBand($event)"
          [isNew]="true"
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
export class NewEventBandComponent implements OnInit {
  pending = false;
  unauthorized = false;

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
  }

  createEventBand(eventBand: EventBand) {
    // console.log(eventBand);
    this.pending = true;
    this.eventBandService.create(eventBand).subscribe(newEventBand => {
      this.pending = false;
      this.infoService.pushSuccess("Bandeau d'Événement créé avec succès");
      this.router.navigate(['/home']);
    });
  }
}
