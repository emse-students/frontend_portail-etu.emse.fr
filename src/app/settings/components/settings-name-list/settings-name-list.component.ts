import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

interface NamedItem {
  id: number;
  name: string;
}

@Component({
  selector: 'app-settings-name-list',
  templateUrl: './settings-name-list.component.html',
  styleUrls: ['./settings-name-list.component.scss'],
})
export class SettingsNameListComponent implements OnInit {
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
  @Input() supprEnable = false;
  @Output() deleted = new EventEmitter<number>();
  @Output() selected = new EventEmitter<number>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource();

  displayedColumns: string[] = this.supprEnable ? ['name', 'put', 'delete'] : ['name', 'put'];

  delete(item: NamedItem) {
    if (
      // eslint-disable-next-line no-restricted-globals, no-undef, no-useless-concat
      confirm(`Vous vous apprêtez à supprimer ${this.itemName} ${item.name}.\n` + `Continuer ?`)
    ) {
      this.deleted.emit(item.id);
    }
  }

  select(id: number) {
    this.selected.emit(id);
  }

  // eslint-disable-next-line no-empty-function, @typescript-eslint/no-empty-function
  ngOnInit(): void {}
}
