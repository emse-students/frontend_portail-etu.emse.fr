import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-search',
  template: `
  <mat-card-content>
    <mat-form-field>
      <input matInput placeholder="{{placeholder}}" [value]="query" (keyup)="search.emit($event.target.value)">
    </mat-form-field>
    <mat-spinner [class.show]="searching" [diameter]="30" [strokeWidth]="3"></mat-spinner>
  </mat-card-content>
  `,
  styles: [`
    mat-card-content {
      display: flex;
      justify-content: center;
    }
  .mat-form-field {
    min-width: 300px;
    margin-right: 10px; // Make room for the spinner
  }

  .mat-spinner {
    position: relative;
    top: 10px;
    left: 10px;
    visibility: hidden;
  }

  .mat-spinner.show {
    visibility: visible;
  }
`]
})
export class SearchComponent {
  @Input() query = '';
  @Input() searching = false;
  @Input() placeholder = 'Taper votre recherche';
  @Output() search = new EventEmitter<string>();
}
