import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, PageEvent, Sort } from '@angular/material';
import { Operation } from '../../core/models/operation.model';
import { JsonLdCollection, JsonLdPage } from '../../core/models/json-ld.model';

@Component({
  selector: 'app-bde-operation-history',
  template: `
    <mat-paginator
      [length]="totalItems"
      pageSize="30"
      [pageIndex]="pages.current - 1"
      (page)="updatePage($event)"
      hidePageSize
    ></mat-paginator>
    <table
      mat-table
      [dataSource]="dataSource"
      matSort
      (matSortChange)="updateSort($event)"
      class="w-100"
    >
      <ng-container matColumnDef="createdAt">
        <th mat-header-cell *matHeaderCellDef mat-sort-header start="desc">Date</th>
        <td mat-cell *matCellDef="let element">
          {{ element.createdAt | date: " dd/MM/yyyy H'h'mm" }}
        </td>
      </ng-container>

      <ng-container matColumnDef="user">
        <th mat-header-cell *matHeaderCellDef>Utilisateur</th>
        <td mat-cell *matCellDef="let element">
          {{ element.user.firstname }} {{ element.user.lastname }}
        </td>
      </ng-container>

      <ng-container matColumnDef="reason">
        <th mat-header-cell *matHeaderCellDef>Raison</th>
        <td mat-cell *matCellDef="let element">{{ element.reason }}</td>
      </ng-container>

      <ng-container matColumnDef="paymentMeans">
        <th mat-header-cell *matHeaderCellDef>Moyen de paiement</th>
        <td mat-cell *matCellDef="let element">
          {{ element.paymentMeans.name }}
        </td>
      </ng-container>

      <ng-container matColumnDef="amount">
        <th mat-header-cell *matHeaderCellDef>Montant</th>
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
  `,
  styles: [
    `
      .greenRow {
        background: rgba(15, 176, 1, 0.36);
      }
    `,
  ],
})
export class BdeOperationHistoryComponent {
  pages: JsonLdPage;
  totalItems: number;
  _operations: JsonLdCollection<Operation>;
  @Input()
  set operations(operations: JsonLdCollection<Operation>) {
    this._operations = operations;
    this.dataSource.data = operations.collection;
    this.pages = operations.pages;
    this.totalItems = operations.totalItems;
    this.dataSource.sort = this.sort;
  }

  get operations(): JsonLdCollection<Operation> {
    return this._operations;
  }

  @Input()
  set filter(search: string) {
    this.dataSource.filter = search;
  }
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource();

  displayedColumns: string[] = ['createdAt', 'user', 'reason', 'paymentMeans', 'amount'];

  @Output() pageChange = new EventEmitter<number>();
  @Output() sortChange = new EventEmitter<Sort>();

  updateSort(event: Sort): void {
    this.sortChange.emit(event);
  }

  updatePage(event: PageEvent): void {
    this.pageChange.emit(event.pageIndex + 1);
  }
}
