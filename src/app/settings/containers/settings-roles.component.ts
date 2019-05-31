import { Component, OnInit } from '@angular/core';
import { Right, Role } from '../../core/models/role.model';
import { RoleService } from '../../core/services/role.service';
import { InfoService } from '../../core/services/info.service';
import { JsonLdService } from '../../core/services/json-ld.service';
import { arrayRemoveById } from '../../core/services/utils';

@Component({
  selector: 'app-roles',
  template: `
    <app-settings-role-form
      *ngIf="(selectedRole || newRole) && rights"
      (submitted)="onSubmit($event)"
      [pending]="loading"
      [role]="selectedRole"
      [allRights]="rights"
      [isNew]="newRole"
    ></app-settings-role-form>
    <button
      mat-flat-button
      color="primary"
      *ngIf="!newRole && !selectedRole"
      (click)="createRole()"
    >
      Créer un Role
    </button>
    <app-search
      [query]="searchQuery"
      [searching]="loading"
      (search)="search($event)"
      placeholder="Rechercher un role"
    ></app-search>
    <app-settings-name-list
      *ngIf="roles"
      [items]="roles"
      (deleted)="delete($event)"
      (selected)="select($event)"
      [filter]="searchQuery"
      itemName="le role"
    ></app-settings-name-list>
  `,
  styles: [],
})
export class SettingsRolesComponent implements OnInit {
  searchQuery = '';
  loading = false;
  selectedRole: Role | null = null;
  roles: Role[] | null = null;
  rights: Right[] | null = null;
  newRole = false;

  constructor(
    private roleService: RoleService,
    private infoService: InfoService,
    private jsonLdService: JsonLdService,
  ) {}

  ngOnInit(): void {
    this.roleService.getRights().subscribe((rights: Right[]) => {
      this.rights = JsonLdService.parseCollection<Right>(rights).collection;
      // console.log(this.rights);
    });
    this.roleService.gets().subscribe((roles: Role[]) => {
      this.roles = roles;
    });
  }

  search(event: string) {
    this.searchQuery = event;
  }

  createRole() {
    this.newRole = true;
  }

  select(idRole: number) {
    this.newRole = false;
    this.selectedRole = this.roles.find(function(element) {
      return element.id === idRole;
    });
  }

  delete(idRole: number) {
    this.loading = true;
    this.roleService.delete(idRole).subscribe(
      () => {
        this.roles = arrayRemoveById(this.roles, idRole);
        this.infoService.pushSuccess('Role supprimé avec succès');
        this.loading = false;
      },
      error => {
        console.log(error);
        this.infoService.pushError(error.toString());
        this.loading = false;
      },
    );
  }

  onSubmit(role) {
    this.loading = true;
    if (this.newRole) {
      this.roleService.create(role).subscribe(
        newRole => {
          const newRoles = this.roles.slice(0);
          newRoles.push(newRole);
          this.infoService.pushSuccess('Role créé avec succès');
          this.roles = newRoles;
          this.newRole = false;
          this.loading = false;
        },
        error => {
          console.log(error);
          this.infoService.pushError(error.toString());
          this.loading = false;
        },
      );
    } else {
      this.roleService.put(role).subscribe(
        updatedRole => {
          const newRoles = this.roles.slice(0);
          for (let i = 0; i < newRoles.length; i++) {
            if (newRoles[i].id === updatedRole.id) {
              newRoles[i] = updatedRole;
            }
          }
          this.infoService.pushSuccess('Role modifié avec succès');
          this.roles = newRoles;
          this.loading = false;
          this.selectedRole = null;
        },
        error => {
          console.log(error);
          this.infoService.pushError(error.toString());
          this.loading = false;
        },
      );
    }
  }
}
