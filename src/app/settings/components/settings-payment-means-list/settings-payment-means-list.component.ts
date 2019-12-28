import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

interface NamedItem {
  id: number;
  name: string;
}

@Component({
  selector: 'app-settings-payment-means-list',
  templateUrl: './settings-payment-means-list.component.html',
  styleUrls: ['./settings-payment-means-list.component.scss'],
})
export class SettingsPaymentMeansListComponent implements OnInit {
  _items;
  @Input()
  set items(items: NamedItem[]) {
    this._items = items;
    this.dataSource.data = items;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  get items() {
    return this._items;
  }

  @Input()
  set filter(search: string) {
    this.dataSource.filter = search;
  }
  @Input() itemName = "l'item";
  @Output() deleted = new EventEmitter<number>();
  @Output() selected = new EventEmitter<number>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource();

  displayedColumns: string[] = ['name', 'put'];

  delete(item: NamedItem) {
    if (
      confirm(`Vous vous apprêtez à supprimer ${this.itemName} ${item.name}.\n` + `Continuer ?`)
    ) {
      this.deleted.emit(item.id);
    }
  }

  select(id: number) {
    this.selected.emit(id);
  }

  ngOnInit(): void {}
}
