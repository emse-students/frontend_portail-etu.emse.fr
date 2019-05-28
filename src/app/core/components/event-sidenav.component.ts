import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Event } from '../models/event.model';
import { EventSidenavService } from '../services/event-sidenav.service';
import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-event-sidenav',
  template: `
    <ng-container *ngIf="event && show">
      <mat-toolbar [ngStyle]="event.association | assoStyle: 'accent'" class="branding">
        <span class="w-100 text-center">
          {{ event.name }}
        </span>
      </mat-toolbar>
      <div class="d-flex justify-content-center absolute-bottom">
        <button mat-button color="primary" (click)="closeNav()">Fermer</button>
      </div>
      <mat-card>
        <p>Organisé par {{ event.association.name }}</p>

        <h4 *ngIf="event.closingDate">
          Attention deadline le {{ event.closingDate | date: 'EEEE d M' | translateDay }} à
          {{event.closingDate | date: 'H\\'h\\'mm'}}
        </h4>

        <img
          [src]="imgPath + '/' + event.img.filename"
          [alt]="event.img.filename"
          style="max-width: 100%;"
          *ngIf="event.img"
        />

        <p [innerHTML]="event.description | keepHtml"></p>

        <p>
          Le {{ event.date | date: 'EEEE d M' | translateDay }} à
          {{event.date | date: 'H\\'h\\'mm'}}
        </p>

        <p *ngIf="event.duration">Durée : {{ event.duration }}</p>

        <p *ngIf="event.place">Lieu : {{ event.place }}</p>

        <p *ngIf="event.price">Prix : {{ event.price }} €</p>

        <ng-container *ngIf="event.price">
          <h5>Moyens de paiements possibles :</h5>
          <ul>
            <li *ngFor="let paymentMean of event.paymentMeans">{{ paymentMean.name }}</li>
          </ul>
        </ng-container>

        <h4 *ngIf="event.shotgunListLength">Attention ! Événement au shotgun</h4>

        <p *ngIf="event.shotgunListLength">
          Début du shotgun le {{ event.shotgunStartingDate | date: 'EEEE d M' | translateDay }} à
          {{event.shotgunStartingDate | date: 'H\\'h\\'mm'}}
        </p>

        <p *ngIf="event.shotgunListLength">Nombre de places : {{ event.shotgunListLength }}</p>

        <p *ngIf="event.shotgunListLength && event.shotgunWaitingList">
          Il y aura une file d'attente : les utilisateurs sont autorisés à continuer de s'incrire
          une fois le nombre maximal de places atteint
        </p>
        <p *ngIf="event.shotgunListLength && !event.shotgunWaitingList">
          Il y aura pas de file d'attente : Les utilisateurs NE sont PAS autorisés à continuer de
          s'incrire une fois le nombre maximal de places atteint
        </p>
        <p *ngIf="!event.closingDate">Pas de deadline</p>
        <div class="row justify-content-around">
          <a [routerLink]="'/events-settings/' + event.id" *ngIf="isRightful">
            <button
              mat-flat-button
              [ngStyle]="event.association | assoStyle: 'accent'"
              (click)="closeNav()"
            >
              Paramètres
            </button>
          </a>
          <a
            [routerLink]="'/events/' + event.id + '/book'"
            *ngIf="
              !allReadyBooked &&
              (!event.closingDate || event.closingDate > today) &&
              event.date > today &&
              (event.status != 'inactive' || isRightful)
            "
          >
            <button mat-flat-button [ngStyle]="event.association | assoStyle" (click)="closeNav()">
              S'inscrire
            </button>
          </a>
          <button mat-flat-button disabled *ngIf="allReadyBooked">Déjà inscrit</button>
          <button
            mat-flat-button
            disabled
            *ngIf="
              !allReadyBooked &&
              !(event.date < today) &&
              (event.closingDate && event.closingDate < today)
            "
          >
            Deadline passée
          </button>
          <button mat-flat-button disabled *ngIf="!allReadyBooked && event.date < today">
            Événement passé
          </button>
        </div>
      </mat-card>
    </ng-container>
  `,
  styles: [
    `
      :host {
        width: 300px;
      }
      .absolute-bottom {
        position: absolute;
        bottom: 5px;
        left: 0;
        right: 0;
      }
    `,
  ],
})
export class EventSidenavComponent implements OnInit {
  @Input() show: boolean;
  today = new Date();
  event: Event;
  imgPath = environment.img_url;
  allReadyBooked = false;
  isRightful = false;
  @Output() close = new EventEmitter<boolean>();

  constructor(
    private eventSidenavService: EventSidenavService,
    private userService: UserService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.eventSidenavService.event.subscribe((event: Event) => {
      this.event = event;
      this.allReadyBooked = this.userService.hasBooked(event.id);
      this.isRightful =
        this.authService.hasAssoRight(3, event.association.id) || this.authService.isAdmin();
    });
  }

  closeNav() {
    this.close.emit(true);
  }
}
