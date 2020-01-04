import { Component, OnInit } from '@angular/core';
import { AssociationLight } from '../../core/models/association.model';
import { AssociationService } from '../../core/services/association.service';
import { InfoService } from '../../core/services/info.service';

@Component({
  selector: 'app-settings-lists',
  template: `
    <app-settings-asso-form
      *ngIf="selectedAsso || newAsso"
      (submitted)="onSubmit($event)"
      [pending]="loading"
      [asso]="selectedAsso"
      [isNew]="newAsso"
    ></app-settings-asso-form>
    <button
      mat-flat-button
      color="primary"
      *ngIf="!newAsso && !selectedAsso"
      (click)="createAsso()"
    >
      Créer une Liste
    </button>
    <app-search
      [query]="searchQuery"
      [searching]="loading"
      (search)="search($event)"
      placeholder="Rechercher une liste"
    ></app-search>
    <app-settings-asso-list
      *ngIf="assos"
      [assos]="assos"
      (deleted)="delete($event)"
      (selected)="select($event)"
      [filter]="searchQuery"
      itemName="la liste"
    ></app-settings-asso-list>
  `,
  styles: [],
})
export class SettingsListsComponent implements OnInit {
  searchQuery = '';
  loading = false;
  selectedAsso: AssociationLight | null = null;
  assos: AssociationLight[] | null = null;
  newAsso = false;

  constructor(private associationService: AssociationService, private infoService: InfoService) {}

  ngOnInit(): void {
    this.associationService.allLists.subscribe((assos: AssociationLight[] | null) => {
      this.assos = assos;
      this.loading = false;
      this.newAsso = false;
      this.selectedAsso = null;
    });
    this.associationService.getLights();
  }

  search(event: string) {
    this.searchQuery = event;
  }

  createAsso() {
    this.newAsso = true;
  }

  select(idAsso: number) {
    this.newAsso = false;
    this.selectedAsso = this.assos.find(function(element) {
      return element.id === idAsso;
    });
  }

  delete(idAsso: number) {
    this.loading = true;
    this.associationService.delete(idAsso).subscribe(
      () => {
        this.loading = false;
        this.infoService.pushSuccess('Liste supprimée avec succès');
      },
      () => {
        this.loading = false;
      },
    );
  }

  onSubmit(asso) {
    this.loading = true;
    if (this.newAsso) {
      // eslint-disable-next-line no-param-reassign
      asso.isList = true;
      this.associationService.create(asso).subscribe(
        () => {
          this.loading = false;
        },
        () => {
          this.loading = false;
        },
      );
    } else {
      this.associationService.put(asso).subscribe(
        () => {
          this.loading = false;
        },
        () => {
          this.loading = false;
        },
      );
    }
  }
}
