import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-bde-operation-list',
  template: `
    <table mat-table [dataSource]="dataSource" matSort class="w-100">
      <ng-container matColumnDef="createdAt">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Date</th>
        <td mat-cell *matCellDef="let element">
          {{ element.createdAt | date: " dd/MM/yyyy H'h'mm" }}
        </td>
      </ng-container>

      <ng-container matColumnDef="reason">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Raison</th>
        <td mat-cell *matCellDef="let element">{{ element.reason }}</td>
      </ng-container>

      <ng-container matColumnDef="paymentMeans">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Moyen de paiement</th>
        <td mat-cell *matCellDef="let element">
          {{ element.paymentMeans.name }}
        </td>
      </ng-container>

      <ng-container matColumnDef="amount">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Montant</th>
        <td mat-cell *matCellDef="let element">
          {{ element.amount | currency: 'EUR':'symbol':'1.2-2':'fr' }}
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr
        mat-row
        *matRowDef="let row; columns: displayedColumns"
        [ngClass]="{ greenRow: row.amount > 0 }"
      ></tr>
    </table>

    <mat-paginator showFirstLastButtons pageSize="30" hidePageSize></mat-paginator>
  `,
  styles: [
    `
      .greenRow {
        background: rgba(15, 176, 1, 0.36);
      }
    `,
  ],
})
export class BdeOperationListComponent implements OnInit {
  _operations;
  @Input()
  set operations(operations) {
    this._operations = operations;
    this.dataSource.data = operations;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.sort.sort({
      disableClear: false,
      id: 'createdAt',
      start: 'desc',
    });
  }

  get operations() {
    return this._operations;
  }

  @Input()
  set filter(search: string) {
    this.dataSource.filter = search;
  }
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource();

  displayedColumns: string[] = ['createdAt', 'reason', 'paymentMeans', 'amount'];

  // eslint-disable-next-line no-empty-function, @typescript-eslint/no-empty-function
  ngOnInit(): void {}
}
