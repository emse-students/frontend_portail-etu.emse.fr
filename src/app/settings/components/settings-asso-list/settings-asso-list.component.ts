import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { AssociationLight } from '../../../core/models/association.model';

@Component({
  selector: 'app-settings-asso-list',
  templateUrl: './settings-asso-list.component.html',
  styleUrls: ['./settings-asso-list.component.scss'],
})
export class SettingsAssoListComponent implements OnInit {
  _assos;
  @Input()
  set assos(assos) {
    this._assos = assos;
    this.dataSource.data = assos;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  get assos() {
    return this._assos;
  }

  @Input()
  set filter(search: string) {
    this.dataSource.filter = search;
  }
  @Output() deleted = new EventEmitter<number>();
  @Output() selected = new EventEmitter<number>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource();

  displayedColumns: string[] = ['name', 'put'];

  delete(asso: AssociationLight) {
    if (confirm(`Vous vous apprêtez à supprimer l'asso ${asso.name}.\n` + `Continuer ?`)) {
      this.deleted.emit(asso.id);
    }
  }

  select(id: number) {
    this.selected.emit(id);
  }

  ngOnInit(): void {}
}
