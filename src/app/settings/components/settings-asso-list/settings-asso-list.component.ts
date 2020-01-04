import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { AssociationLight } from '../../../core/models/association.model';

@Component({
  selector: 'app-settings-asso-list',
  templateUrl: './settings-asso-list.component.html',
  styleUrls: ['./settings-asso-list.component.scss'],
})
export class SettingsAssoListComponent {
  _assos: AssociationLight[];
  @Input()
  set assos(assos: AssociationLight[]) {
    this._assos = assos;
    this.dataSource.data = assos;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  get assos(): AssociationLight[] {
    return this._assos;
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

  displayedColumns: string[] = ['name', 'isActive', 'put'];

  delete(asso: AssociationLight): void {
    // eslint-disable-next-line no-restricted-globals, no-undef
    if (confirm(`Vous vous apprêtez à supprimer ${this.itemName} ${asso.name}.\nContinuer ?`)) {
      this.deleted.emit(asso.id);
    }
  }

  select(id: number): void {
    this.selected.emit(id);
  }
}
