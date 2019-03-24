import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Position} from '../../core/models/position.model';

@Component({
  selector: 'app-positions-list',
  template: `
    <mat-card-title>Membres</mat-card-title>
    <div class="d-flex flex-column">
      <div class="row justify-content-center">
        <div class="member-card" *ngFor="let position of filterPosition(positions, 5, 100000) |orderBy : ['-role.hierarchy','role.name']">
          <ng-container *ngIf="!position.loading">
            <div class="icon-row" *ngIf="modify">
              <mat-icon class="delete-icon"
                        color="warn"
                        fontSet="fas"
                        fontIcon="fa-user-minus"
                        (click)="delete.emit(position.id); position.loading=true;">
              </mat-icon>
            </div>
            <div class="member-title p-1">{{position.role.name}}</div>
            <div class="member-name pt-1 pr-1 pl-1">{{position.user.firstname+' '+position.user.lastname}}</div>
            <div class="member-name pb-1 pr-1 pl-1">{{position.user.type+' '+position.user.promo}}</div>
          </ng-container>
          <mat-spinner [diameter]="100" color="accent" *ngIf="position.loading"></mat-spinner>
        </div>
      </div>
      <div class="row justify-content-center">
        <div class="member-card" *ngFor="let position of filterPosition(positions, 3, 6) | orderBy : ['-role.hierarchy','role.name']">
          <ng-container *ngIf="!position.loading">
            <div class="icon-row" *ngIf="modify">
              <mat-icon class="delete-icon"
                        color="warn"
                        fontSet="fas"
                        fontIcon="fa-user-minus"
                        (click)="delete.emit(position.id); position.loading=true;">
              </mat-icon>
            </div>
            <div class="member-title p-1">{{position.role.name}}</div>
            <div class="member-name pt-1 pr-1 pl-1">{{position.user.firstname+' '+position.user.lastname}}</div>
            <div class="member-name pb-1 pr-1 pl-1">{{position.user.type+' '+position.user.promo}}</div>
          </ng-container>
          <mat-spinner [diameter]="100" color="accent" *ngIf="position.loading"></mat-spinner>
        </div>
      </div>
      <div class="row justify-content-center">
        <div class="member-card" *ngFor="let position of filterPosition(positions, -100000, 4) | orderBy : ['-role.hierarchy','role.name']">
          <ng-container *ngIf="!position.loading">
            <div class="icon-row" *ngIf="modify">
              <mat-icon class="delete-icon"
                        color="warn"
                        fontSet="fas"
                        fontIcon="fa-user-minus"
                        (click)="delete.emit(position.id); position.loading=true;">
              </mat-icon>
            </div>
            <div class="member-title p-1">{{position.role.name}}</div>
            <div class="member-name pt-1 pr-1 pl-1">{{position.user.firstname+' '+position.user.lastname}}</div>
            <div class="member-name pb-1 pr-1 pl-1">{{position.user.type+' '+position.user.promo}}</div>
          </ng-container>
          <mat-spinner [diameter]="100" color="accent" *ngIf="position.loading"></mat-spinner>
        </div>
      </div>
    </div>
  `,
  styles: [`
    mat-card-title,
    mat-card-content,
    mat-card-footer {
      display: flex;
      justify-content: center;
    }
    mat-chip {
      height: auto;
    }
    .member-card {
      position: relative;
      display: flex;
      flex-direction: column;
      margin: 10px;
      border-radius: 5px;
      justify-content: center;
      align-content: center;
      align-items: center;
    }
    .member-title {
      display: flex;
      justify-content: center;
      align-content: center;
      align-items: center;
      font-weight: bold;
      font-size: 1em;
      width: 100%;
      border-radius: 5px 5px 0 0;
    }
    .member-name {
      font-size: 0.8em;
    }
    .delete-icon {
      cursor: pointer;
      margin-right: -15px;
      margin-top: -5px;
      transform: scale(1.5);
    }
    .icon-row {
      position: absolute;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: flex-end;
    }
  `]
})
export class PositionsListComponent implements OnInit {
  @Input() positions: Position[];
  @Input() modify: boolean;
  @Output() delete = new EventEmitter<number>();
  constructor() { }

  ngOnInit() {
  }

  filterPosition(positions: Position[], min: number, max: number): Position[] {
    return positions.filter((p: Position) => p.role.hierarchy > min && p.role.hierarchy < max);
  }

}
