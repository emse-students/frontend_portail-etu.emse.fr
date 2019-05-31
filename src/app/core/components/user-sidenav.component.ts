import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthenticatedUser } from '../models/auth.model';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-sidenav',
  template: `
    <ng-container *ngIf="show">
      <mat-toolbar color="primary" class="branding" *ngIf="authenticatedUser">
        <span class="w-100 text-center">
          {{ authenticatedUser.firstname }} {{ authenticatedUser.lastname }}
        </span>
      </mat-toolbar>

      <mat-nav-list>
        <a
          mat-list-item
          (click)="closeNav()"
          [routerLink]="'/bde-settings/account/' + user.id"
          *ngIf="authService.isBDEContributor() && user"
        >
          <mat-icon>assessment</mat-icon>
          Solde BDE :
          {{ user.balance | currency: 'EUR':'symbol':'1.2-2':'fr' }}
        </a>
        <a
          mat-list-item
          (click)="closeNav()"
          href="https://portail-etu.emse.fr/cercle/compte.php"
          target="_blank"
          *ngIf="authService.isCercleContributor() && user"
        >
          <mat-icon>assessment</mat-icon>
          Solde Cercle :
          {{ user.cercleBalance | currency: 'EUR':'symbol':'1.2-2':'fr' }}
        </a>
        <a mat-list-item (click)="closeNav()" [routerLink]="'/events/my-bookings'">
          <mat-icon>check_circle_outline</mat-icon>
          Mes réservations
        </a>
        <a
          mat-list-item
          (click)="closeNav()"
          [routerLink]="'/settings'"
          *ngIf="authService.isAdmin()"
        >
          <mat-icon fontSet="fas" fontIcon="fa-cog"></mat-icon>
          Paramètres
        </a>
        <a
          mat-list-item
          (click)="closeNav()"
          [routerLink]="'/bde-settings'"
          *ngIf="authService.isAdmin()"
        >
          <mat-icon fontSet="fas" fontIcon="fa-cog"></mat-icon>
          Gestion BDE
        </a>
        <a
          mat-list-item
          (click)="closeNav()"
          [routerLink]="'/events-settings/new'"
          *ngIf="authService.hasAsso()"
        >
          <mat-icon>add_circle_outline</mat-icon>
          Nouvel Événement
        </a>

        <mat-list-item (click)="logoutUser()">
          <mat-icon>power_settings_new</mat-icon>
          <span>Déconnexion</span>
        </mat-list-item>
      </mat-nav-list>
    </ng-container>
  `,
  styles: [],
})
export class UserSidenavComponent implements OnInit {
  @Input() show: boolean;
  @Input() authenticatedUser: AuthenticatedUser;
  @Output() close = new EventEmitter<boolean>();
  @Output() logout = new EventEmitter<boolean>();
  user: User;
  get authService() {
    return this._authService;
  }
  constructor(private _authService: AuthService, private userService: UserService) {}

  ngOnInit() {
    this._authService.authenticatedUser.subscribe(authenticatedUser => {
      // console.log(authenticatedUser);
      if (authenticatedUser && (!this.user || authenticatedUser.id !== this.user.id)) {
        this.userService.getInfo();
      }
    });
    this.userService.user.subscribe(user => {
      this.user = user;
    });
    this._authService.refresh();
  }

  closeNav() {
    this.close.emit(true);
  }

  logoutUser() {
    this.logout.emit(true);
  }
}
