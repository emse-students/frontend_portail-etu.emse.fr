import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {AssociationLight} from '../../../core/models/association.model';
import {Booking} from '../../../core/models/event.model';

@Component({
  selector: 'app-bookings-list',
  templateUrl: './bookings-list.component.html',
  styleUrls: ['./bookings-list.component.scss']
})
export class BookingsListComponent implements OnInit, AfterViewInit {
  today = new Date();
  _bookings;
  @Input()
  set bookings (bookings) {
    this._bookings = bookings;

    this.dataSource.sort = this.sort;
    this.dataSource.data = bookings;
    this.sort.sort({
      disableClear: false,
      id: 'event.date',
      start: 'desc'
    });
  }

  get bookings() {return this._bookings; }

  @Input()
  set filter(search: string) {
    this.dataSource.filter = search;
  }
  @Output() selected = new EventEmitter<number>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource();

  displayedColumns: string[] = ['event.date', 'event.name', 'event.association.name', 'paid', 'modify'];

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.dataSource.sortingDataAccessor = (item: Booking, property) => {
      switch (property) {
        case 'event.date': return item.event.date;
        case 'event.name': return item.event.name;
        default: return item[property];
      }
    };

    this.dataSource.paginator = this.paginator;
  }
}
