import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-bde-acounts-list',
  template: `
    <table mat-table [dataSource]="dataSource" matSort class="w-100">
      <ng-container matColumnDef="firstname">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Prénom</th>
        <td mat-cell *matCellDef="let element">{{ element.firstname }}</td>
      </ng-container>

      <ng-container matColumnDef="lastname">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Nom</th>
        <td mat-cell *matCellDef="let element">{{ element.lastname }}</td>
      </ng-container>

      <ng-container matColumnDef="type">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Type</th>
        <td mat-cell *matCellDef="let element">{{ element.type }}</td>
      </ng-container>

      <ng-container matColumnDef="promo">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Promo</th>
        <td mat-cell *matCellDef="let element">{{ element.promo }}</td>
      </ng-container>

      <ng-container matColumnDef="balance">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Solde</th>
        <td mat-cell *matCellDef="let element">
          {{ element.balance | currency: 'EUR':'symbol':'1.2-2':'fr' }}
        </td>
      </ng-container>

      <ng-container matColumnDef="history">
        <th mat-header-cell *matHeaderCellDef>Historique</th>
        <td mat-cell *matCellDef="let element">
          <a [routerLink]="'/bde-settings/account/' + element.id">
            <button mat-flat-button color="primary" routerLink="home">Historique</button>
          </a>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>

    <mat-paginator showFirstLastButtons pageSize="30" hidePageSize></mat-paginator>
  `,
  styles: [],
})
export class BdeAccountsListComponent implements OnInit {
  _users;
  @Input()
  set users(users) {
    const contributors = [];
    for (let i = 0; i < users.length; i++) {
      if (users[i].contributeBDE) {
        contributors.push(users[i]);
      }
    }
    this._users = contributors;
    this.dataSource.data = contributors;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  get users() {
    return this._users;
  }

  @Input()
  set filter(search: string) {
    this.dataSource.filter = search;
  }
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource();

  displayedColumns: string[] = ['firstname', 'lastname', 'type', 'promo', 'balance', 'history'];

  ngOnInit(): void {}
}
