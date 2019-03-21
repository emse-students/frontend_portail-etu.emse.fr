import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Booking, BookingRanked, Event} from '../../core/models/event.model';
import {AuthService} from '../../core/services/auth.service';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {AuthenticatedUser} from '../../core/models/auth.model';

@Component({
  selector: 'app-registered-list',
  template: `
    <table mat-table [dataSource]="dataSource" matSort class="w-100">

      <ng-container matColumnDef="rank">
        <th mat-header-cell *matHeaderCellDef mat-sort-header> Place</th>
        <td mat-cell *matCellDef="let element"> {{element.rank}}.</td>
      </ng-container>

      <ng-container matColumnDef="createdAt">
        <th mat-header-cell *matHeaderCellDef mat-sort-header> Date d'inscription</th>
        <td mat-cell *matCellDef="let element">
          {{element.createdAt | date: 'EEEE d M' | translateDay}} {{element.createdAt | date: 'H\\'h\\'mm \\'min\\' ss \\'s\\''}}
        </td>
      </ng-container>

      <ng-container matColumnDef="userName">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Nom</th>
        <td mat-cell *matCellDef="let element">
          {{element.userName}}
        </td>
      </ng-container>

      <ng-container matColumnDef="paid">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Payé ?</th>
        <td mat-cell *matCellDef="let element">
          <mat-icon class="green-icon" *ngIf="element.paid">check_circle</mat-icon>
          <mat-icon color="warn" *ngIf="!element.paid">cancel</mat-icon>
        </td>
      </ng-container>

      <ng-container matColumnDef="checked">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Checké ?</th>
        <td mat-cell *matCellDef="let element">
          <mat-icon class="green-icon" *ngIf="element.checked">check_circle</mat-icon>
          <mat-icon color="warn" *ngIf="!element.checked">cancel</mat-icon>
        </td>
      </ng-container>

      <ng-container matColumnDef="select">
        <th mat-header-cell *matHeaderCellDef></th>
        <td mat-cell *matCellDef="let element"> <button mat-flat-button color="accent" (click)="select(element)">Voir</button> </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row
          *matRowDef="let row; columns: displayedColumns;"
          [ngClass]="{redRow: event.shotgunListLength && row.rank > event.shotgunListLength }">
      </tr>
    </table>

    <mat-paginator showFirstLastButtons pageSize="30" hidePageSize>
    </mat-paginator>
  `,
  styles: [`
    .green-icon{
      color: #0fb001;
    }
    mat-icon {
      transform: scale(2);
    }
    .redRow {
      background: rgba(255, 2, 0, 0.36);
    }
  `]
})
export class RegisteredListComponent implements OnInit {
  @Output() selectUser = new EventEmitter<any>();
  @Input() event: Event;
  @Input()
  set bookings (bookings: BookingRanked[]) {
    this._bookings = bookings;
    this.dataSource.data = bookings;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    // this.sort.sort({
    //   disableClear: false,
    //   id: 'rank',
    //   start: 'asc'
    // });
  }

  get bookings() {return this._bookings; }

  @Input()
  set filter(search: string) {
    this.dataSource.filter = search;
  }

  constructor( ) { }

  _bookings: BookingRanked[];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource();

  displayedColumns: string[];

  ngOnInit(): void {
    this.displayedColumns = this.event.price && this.event.shotgunListLength ?
      ['rank', 'createdAt', 'userName', 'paid', 'checked', 'select'] :
      this.event.price ? ['userName', 'paid', 'checked', 'select'] :
      this.event.shotgunListLength ? ['rank', 'createdAt', 'userName', 'checked', 'select'] :
      ['userName', 'checked', 'select'] ;
  }

  select(booking: BookingRanked) {
    if (booking.user) {
      this.selectUser.emit({
        id: booking.user.id,
        balance: booking.user.balance
      });
    } else {
      this.selectUser.emit({
        bookingId: booking.id
      });
    }
  }
}
