import {AfterContentInit, AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Booking, Event} from '../../core/models/event.model';
import {AuthService} from '../../core/services/auth.service';
import {AuthenticatedUser} from '../../core/models/auth.model';

interface BookingRanked {
  userName: string;
  createdAt: Date;
  rank: number;
}

@Component({
  selector: 'app-event-bookings-list',
  template: `
    <p class="text-center" *ngIf="event.shotgunListLength && userRank">Votre place : {{userRank}}</p>
    <table mat-table [dataSource]="dataSource" matSort class="w-100">

      <ng-container matColumnDef="rank">
        <th mat-header-cell *matHeaderCellDef mat-sort-header> Place</th>
        <td mat-cell *matCellDef="let element"> {{EventListComponent.rank}}.</td>
      </ng-container>

      <ng-container matColumnDef="createdAt">
        <th mat-header-cell *matHeaderCellDef mat-sort-header> Date d'inscription</th>
        <td mat-cell *matCellDef="let element">
          {{element.createdAt | date: 'EEEE d M' | translateDay}} {{element.createdAt | date: 'H\\'h\\'mm \\'min\\' ss \\'s\\''}}
        </td>
      </ng-container>

      <ng-container matColumnDef="userName">
        <th mat-header-cell *matHeaderCellDef mat-sort-header> Nom</th>
        <td mat-cell *matCellDef="let element">
          {{element.userName}}
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row
          *matRowDef="let row; columns: displayedColumns;"
          [ngClass]="{redRow: event.shotgunListLength && EventListComponent.rank > event.shotgunListLength }">
      </tr>
    </table>

    <mat-paginator showFirstLastButtons pageSize="30" hidePageSize>
    </mat-paginator>
  `,
  styles: [`
    .redRow {
      background: rgba(255, 2, 0, 0.36);
    }
  `]
})
export class EventBookingsListComponent implements OnInit {
  @Input()
  set event (event: Event) {
    this._event = event;
    this.dataSource.data = EventBookingsListComponent.parseBookings(event.bookings);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.sort.sort({
      disableClear: false,
      id: 'rank',
      start: 'asc'
    });
  }

  get event() {return this._event; }

  @Input()
  set filter(search: string) {
    this.dataSource.filter = search;
  }

  constructor(
    private authService: AuthService
  ) { }

  _event: Event;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource();

  displayedColumns: string[];
  authenticatedUser: AuthenticatedUser;
  userRank: number;

  static parseBookings(bookings: Booking[]): BookingRanked[] {
    bookings = bookings.sort((a: Booking, b: Booking) => a.createdAt > b.createdAt ? 1 : -1);
    const bookingsRanked: BookingRanked[] = [];
    for (let i = 0; i < bookings.length; i++) {
      bookingsRanked.push({
        userName: bookings[i].user ? bookings[i].user.firstname + ' ' + bookings[i].user.lastname : bookings[i].userName,
        createdAt: bookings[i].createdAt,
        rank: i + 1
      });
    }
    return bookingsRanked;
  }

  ngOnInit(): void {
    this.displayedColumns = this._event.shotgunListLength ? ['rank', 'createdAt', 'userName'] : ['userName'];
    this.authService.authenticatedUser.subscribe(authenticatedUser => {
      this.authenticatedUser = authenticatedUser;
      if (this.event.shotgunListLength) {
        this.userRank = this.computeUserRank();
      }
    });
    this.authService.refresh();
  }

  computeUserRank(): number {
    const bookings = this.event.bookings.sort((a: Booking, b: Booking) => a.createdAt > b.createdAt ? 1 : -1);
    for (let i = 0; i < bookings.length; i++) {
      if (bookings[i].user && this.authenticatedUser && bookings[i].user.id === this.authenticatedUser.id) {
        return i + 1;
      }
    }
    return 0;
  }
}
