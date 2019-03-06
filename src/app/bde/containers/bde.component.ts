import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Event} from '../../core/models/event.model';
import {UserLight} from '../../core/models/auth.model';
import {UserService} from '../../core/services/user.service';
import {NewOperation} from '../../core/models/operation.model';
import {OperationService} from '../../core/services/operation.service';
import {InfoService} from '../../core/services/info.service';
import {PaymentMeans} from '../../core/models/payment-means.model';
import {PaymentMeansService} from '../../core/services/payment-means.service';

@Component({
  selector: 'app-bde',
  template: `
    <div class="container">
      <mat-card *ngIf="users && paymentMeans && !unauthorized">
        <mat-card-title>Gestion Comptes BDE</mat-card-title>
        <mat-tab-group [dynamicHeight]="true" [selectedIndex]='selectedEventSetting'>
          <mat-tab>
            <ng-template mat-tab-label>
              <span class="mat-tab-label" (click)="goTo('list')">Liste</span>
            </ng-template>
            <mat-card>
              <mat-card-title>Liste des cotisants</mat-card-title>
              <app-search [query]="searchQuery"
                          (search)="search($event)"
                          placeholder="Rechercher un cotisant"></app-search>
              <app-bde-acounts-list [filter]="searchQuery" [users]="users"></app-bde-acounts-list>
            </mat-card>
          </mat-tab>

          <mat-tab>
            <ng-template mat-tab-label>
              <span class="mat-tab-label" (click)="goTo('debit')">Débit</span>
            </ng-template>

            <mat-card>
              <mat-card-title>Débiter un compte BDE</mat-card-title>
              <app-bde-debit-form [users]="users"
                                  (submitted)="createOperation($event)"
                                  *ngIf="!loading">
              </app-bde-debit-form>
              <mat-spinner  *ngIf="loading" [diameter]="150" [strokeWidth]="5"></mat-spinner>
            </mat-card>
          </mat-tab>

          <mat-tab>
            <ng-template mat-tab-label>
              <span class="mat-tab-label" (click)="goTo('recharge')">Rechargement</span>
            </ng-template>

            <mat-card>
              <mat-card-title>Recharger un compte BDE</mat-card-title>
              <app-bde-recharge-form [users]="users"
                                     (submitted)="createOperation($event)"
                                     [paymentMeans]="paymentMeans"
                                     *ngIf="!loading">
              </app-bde-recharge-form>
              <mat-spinner  *ngIf="loading" [diameter]="150" [strokeWidth]="5"></mat-spinner>
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
export class BdeComponent implements OnInit {
  selectedEventSetting;
  loading = false;
  unauthorized = false;
  users: UserLight[] = null;
  searchQuery = '';
  paymentMeans: PaymentMeans[] = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private operationService: OperationService,
    private infoService: InfoService,
    private paymentMeansService: PaymentMeansService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.selectedEventSetting = this.strIdToTabId(params.get('id'));
    });
    this.userService.getAllUsers().subscribe((users: UserLight[]) => {
      this.users = users;
    });
    this.paymentMeansService.gets().subscribe((paymentMeans: PaymentMeans[]) => {
      this.paymentMeans = paymentMeans;
    });
  }

  search(event: string) {
    this.searchQuery = event;
  }

  goTo(str_id: string) {
    this.router.navigate(['/bde-settings', str_id]);
  }

  strIdToTabId(strId: string): number {
    switch (strId) {
      case 'list':
        return 0;
      case 'debit':
        return 1;
      case 'recharge':
        return 2;
    }
  }

  createOperation(operation: NewOperation) {
    this.loading = true;
    this.operationService.create(operation).subscribe(
      () => {
        this.loading = false;
        this.infoService.pushSuccess('Operation effectuée');
        const user = operation.user.split('/');
        console.log(Number(user[user.length - 1]));
        for (let j = 0; j < this.users.length; j++) {
          if (this.users[j].id === Number(user[user.length - 1])) {
            this.users[j].balance += operation.amount;
          }
        }
      },
      () => { this.loading = false; }
    );
  }
}
