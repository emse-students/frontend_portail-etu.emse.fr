import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserLight } from '../../core/models/auth.model';
import { UserService } from '../../core/services/user.service';
import { NewOperation } from '../../core/models/operation.model';
import { OperationService } from '../../core/services/operation.service';
import { InfoService } from '../../core/services/info.service';
import { PaymentMeans } from '../../core/models/payment-means.model';
import { PaymentMeansService } from '../../core/services/payment-means.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-bde',
  template: `
    <div class="container">
      <mat-card *ngIf="users && paymentMeans && !unauthorized">
        <mat-card-title>Gestion Comptes BDE</mat-card-title>
        <mat-tab-group [dynamicHeight]="true" [selectedIndex]="selectedEventSetting">
          <mat-tab>
            <ng-template mat-tab-label>
              <span class="mat-tab-label" (click)="goTo('list')">Liste</span>
            </ng-template>
            <mat-card>
              <mat-card-title>Liste des cotisants</mat-card-title>
              <app-search
                [query]="searchQuery"
                (search)="search($event)"
                placeholder="Rechercher un cotisant"
              ></app-search>
              <app-bde-acounts-list
                *ngIf="!loading"
                [filter]="searchQuery"
                [users]="users"
              ></app-bde-acounts-list>
            </mat-card>
          </mat-tab>

          <mat-tab>
            <ng-template mat-tab-label>
              <span class="mat-tab-label" (click)="goTo('debit')">Débit</span>
            </ng-template>

            <mat-card>
              <mat-card-title>Débiter un compte BDE</mat-card-title>
              <app-bde-debit-form
                [users]="users"
                (submitted)="createOperation($event)"
                *ngIf="!loading"
              ></app-bde-debit-form>
              <mat-card-content *ngIf="loading">
                <mat-spinner [diameter]="150" [strokeWidth]="5"></mat-spinner>
              </mat-card-content>
            </mat-card>
          </mat-tab>

          <mat-tab>
            <ng-template mat-tab-label>
              <span class="mat-tab-label" (click)="goTo('recharge')">Rechargement</span>
            </ng-template>

            <mat-card>
              <mat-card-title>Recharger un compte BDE</mat-card-title>
              <app-bde-recharge-form
                [users]="users"
                (submitted)="createOperation($event)"
                [paymentMeans]="paymentMeans"
                *ngIf="!loading"
              ></app-bde-recharge-form>
              <mat-card-content *ngIf="loading">
                <mat-spinner [diameter]="150" [strokeWidth]="5"></mat-spinner>
              </mat-card-content>
            </mat-card>
          </mat-tab>

          <mat-tab>
            <ng-template mat-tab-label>
              <span class="mat-tab-label" (click)="goTo('contribution')">Cotisations</span>
            </ng-template>

            <mat-card>
              <mat-card-title>Cotisations BDE</mat-card-title>
              <app-bde-contribution-form
                [users]="users"
                (contribute)="contribute($event)"
                (deleteContribution)="deleteContribution($event)"
                *ngIf="!loading"
              ></app-bde-contribution-form>
              <mat-card-content *ngIf="loading">
                <mat-spinner [diameter]="150" [strokeWidth]="5"></mat-spinner>
              </mat-card-content>
            </mat-card>
          </mat-tab>
        </mat-tab-group>
      </mat-card>
      <mat-card *ngIf="users && unauthorized">
        <mat-card-title>Accès non autorisé</mat-card-title>
        <p class="text-center">Vous n'avez pas les droits necessaires</p>
      </mat-card>
    </div>
    <div class="centrer" *ngIf="!users || !paymentMeans">
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
export class BdeComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private operationService: OperationService,
    private infoService: InfoService,
    private paymentMeansService: PaymentMeansService,
    private authService: AuthService,
  ) {}
  selectedEventSetting;
  loading = false;
  unauthorized = true;
  users: UserLight[] = null;
  searchQuery = '';
  paymentMeans: PaymentMeans[] = null;

  static strIdToTabId(strId: string): number {
    switch (strId) {
      case 'list':
        return 0;
      case 'debit':
        return 2;
      case 'recharge':
        return 3;
      case 'contribution':
        return 4;
      default:
        return 0;
    }
  }

  ngOnInit(): void {
    this.authService.authenticatedUser.subscribe(authenticatedUser => {
      if (!authenticatedUser) {
        setTimeout(() => {
          this.router.navigate(['/home']);
        });
      }
    });
    this.unauthorized = !this.authService.isAdmin();
    this.route.paramMap.subscribe(params => {
      this.selectedEventSetting = BdeComponent.strIdToTabId(params.get('id'));
    });
    this.userService.getAllUsers().subscribe((users: UserLight[]) => {
      this.users = users;
    });
    this.paymentMeansService.gets().subscribe((paymentMeans: PaymentMeans[]) => {
      this.paymentMeans = paymentMeans;
    });
  }

  search(event: string): void {
    this.searchQuery = event;
  }

  goTo(strId: string): void {
    this.router.navigate(['/bde-settings', strId]);
  }

  createOperation(operation: NewOperation): void {
    this.loading = true;
    this.operationService.create(operation).subscribe(
      () => {
        this.loading = false;
        this.infoService.pushSuccess('Operation effectuée');
        const user = operation.user.split('/');
        this.users.find(u => u.id === Number(user[user.length - 1])).balance += operation.amount;
      },
      () => {
        this.loading = false;
      },
    );
  }

  contribute(user: UserLight): void {
    this.loading = true;
    this.userService.put(user).subscribe(
      () => {
        this.infoService.pushSuccess('Cotisation effectuée');
        this.users.find(u => u.id === user.id).contributeBDE = user.contributeBDE;
        this.loading = false;
      },
      () => {
        this.loading = false;
      },
    );
  }

  deleteContribution(user: UserLight): void {
    this.loading = true;
    this.userService.put(user).subscribe(
      () => {
        this.infoService.pushSuccess('Cotisation annulée');
        this.users.find(u => u.id === user.id).contributeBDE = user.contributeBDE;
        this.loading = false;
      },
      () => {
        this.loading = false;
      },
    );
  }
}
