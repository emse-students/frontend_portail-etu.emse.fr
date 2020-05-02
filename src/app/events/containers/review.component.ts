import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Event } from '../../core/models/event.model';
import { EventService } from '../../core/services/event.service';
import { UserService } from '../../core/services/user.service';
import { AuthenticatedUser } from '../../core/models/auth.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-review',
  template: `
    <div class="container">
      <mat-card *ngIf="loaded">
        <mat-card-title class="h4">Description de l'événement</mat-card-title>
        <mat-card-title>{{ event.name }}</mat-card-title>
        <app-event-description [event]="event"></app-event-description>

        <div
          class="row justify-content-center"
          *ngIf="
            !allReadyBooked &&
            (!event.closingDate || event.closingDate > today) &&
            event.date > today &&
            event.status != 'inactive' &&
            event.isBookable &&
            (event.open || (authenticatedUser && authenticatedUser.contributeBDE))
          "
        >
          <a [routerLink]="'/events/' + event.id + '/book'">
            <button mat-flat-button color="primary">S'inscrire</button>
          </a>
        </div>
        <p *ngIf="event.status === 'inactive'">
          Il n'est pas encore possible de s'inscrire à cet événement
        </p>
      </mat-card>
    </div>
    <div class="centrer" *ngIf="!loaded">
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
    `,
  ],
})
export class ReviewComponent implements OnInit {
  today = new Date();
  loaded;
  allReadyBooked: boolean;
  event: Event;
  authenticatedUser: AuthenticatedUser;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private userService: UserService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      if (!this.event || this.event.id !== Number(params.get('id'))) {
        this.loaded = false;
      }
      if (!this.loaded) {
        this.eventService.get(Number(params.get('id'))).subscribe((event: Event) => {
          this.event = event;
          this.allReadyBooked = this.userService.hasBooked(event.id);
          this.loaded = true;
        });
      }
    });
    this.authService.authenticatedUser.subscribe(authenticatedUser => {
      this.authenticatedUser = authenticatedUser;
    });
    this.authService.refresh();
  }
}
