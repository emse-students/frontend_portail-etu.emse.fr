import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {User, UserOperation} from '../../core/models/user.model';
import {UserService} from '../../core/services/user.service';

@Component({
  selector: 'app-bde-account',
  template: `
    <div class="container">
      <mat-card *ngIf="loaded">
        <mat-card-title>Historique de {{user.firstname}} {{user.lastname}} promo {{user.promo}}</mat-card-title>
        <app-search [query]="searchQuery"
                    (search)="search($event)"
                    placeholder="Rechercher une opération"></app-search>
        <app-bde-operation-list [operations]="user.operations" [filter]="searchQuery"></app-bde-operation-list>
      </mat-card>
    </div>
  `,
  styles: [`
    mat-card-title,
    mat-card-content,
    mat-card-footer {
      display: flex;
      justify-content: center;
    }
  `]
})
export class BdeAccountComponent implements OnInit {
  loaded = false;
  user: UserOperation;
  searchQuery = '';

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      if (!this.user || this.user.id !== Number(params.get('id'))) {
        this.loaded = false;
        this.userService.getUserOperations(Number(params.get('id'))).subscribe(
          (user) => {this.user = user; this.loaded = true; console.log(user); }
        );
      }
    });
  }

  search(event: string) {
    this.searchQuery = event;
  }

}
