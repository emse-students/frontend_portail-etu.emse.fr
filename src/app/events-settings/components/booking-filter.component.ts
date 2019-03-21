import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Booking, Event} from '../../core/models/event.model';
import {FormInput, Option} from '../../core/models/form.model';

export interface BookingFilterInput {
  formInput: FormInput;
  selectedOption?: Option;
  selectedOptions?: Option[];
  opened?: boolean;
}

export interface BookingFilter {
  checked: number;
  paid?: number;
  inputs?: BookingFilterInput[];
}

@Component({
  selector: 'app-booking-filter',
  template: `
    <div class="row justify-content-center">
      <mat-form-field>
        <mat-label>Checké ?</mat-label>
        <mat-select [(value)]="filter.checked" (valueChange)="onChange()">
          <mat-option [value]="0">-</mat-option>
          <mat-option [value]="1">Oui</mat-option>
          <mat-option [value]="-1">Non</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field *ngIf="event.price">
        <mat-label>Payé ?</mat-label>
        <mat-select [(value)]="filter.paid" (valueChange)="onChange()">
          <mat-option [value]="0">-</mat-option>
          <mat-option [value]="1">Oui</mat-option>
          <mat-option [value]="-1">Non</mat-option>
        </mat-select>
      </mat-form-field>

      <ng-container *ngFor="let input of filter.inputs; let i = index;">
        <mat-form-field *ngIf="input.formInput.type === 'singleOption'">
          <mat-label>{{input.formInput.title}}</mat-label>
          <mat-select [(value)]="input.selectedOption" (valueChange)="onChange()">
            <mat-option [value]="0">-</mat-option>
            <mat-option [value]="option" *ngFor="let option of input.formInput.options">{{option.value}}</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field *ngIf="input.formInput.type === 'multipleOptions'">
          <mat-label (click)="input.opened = !input.opened">{{input.formInput.title}}</mat-label>
          <mat-select multiple="true">
            <mat-option *ngFor="let option of input.formInput.options"
                        (click)="toggleOption(i, option)">
              {{option.value}}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </ng-container>
    </div>
  `,
  styles: []
})
export class BookingFilterComponent implements OnInit {
  @Input() event: Event;
  filter: BookingFilter;
  @Output() change = new EventEmitter<BookingFilter>();
  constructor() { }

  ngOnInit() {
    const inputs: BookingFilterInput[] = [];
    for (let i = 0; i < this.event.formInputs.length; i++) {
      if (this.event.formInputs[i].type === 'singleOption') {
        inputs.push({
          formInput: this.event.formInputs[i],
          selectedOption: null
        });
      } else if (this.event.formInputs[i].type === 'multipleOptions') {
        inputs.push({
          formInput: this.event.formInputs[i],
          selectedOptions: [],
          opened: false

        });
      }
    }
    this.filter = {
      paid: null,
      checked: null,
      inputs: inputs
    };
  }

  onChange() {
    this.change.emit(this.filter);
  }

  toggleOption(index: number, option: Option) {
    let findIndex = -1;
    for (let i = 0; i < this.filter.inputs[index].selectedOptions.length; i++) {
      if (this.filter.inputs[index].selectedOptions[i].id === option.id) {
        findIndex = i;
      }
    }
    if (findIndex === -1) {
      this.filter.inputs[index].selectedOptions.push(option);
    } else {
      this.filter.inputs[index].selectedOptions.splice(findIndex, 1);
    }
    this.onChange();
  }

  isOptionToggle(index: number, option: Option) {
    for (let i = 0; i < this.filter.inputs[index].selectedOptions.length; i++) {
      if (this.filter.inputs[index].selectedOptions[i].id === option.id) {
        return true;
      }
    }
    return false;
  }
}
