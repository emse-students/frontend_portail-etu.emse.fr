import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AssociationLight} from '../../core/models/association.model';

@Component({
  selector: 'app-select-asso-form',
  template: `
    <h6>Sélectionnez l'association pour laquelle vous créez cet événement</h6>
    <form [formGroup]="form" (ngSubmit)="submit()">
      <p>
        <mat-form-field class="w-100">
          <mat-select placeholder="Association" formControlName="association">
            <mat-option [value]="asso" *ngFor="let asso of assos">{{asso.name}}</mat-option>
          </mat-select>
          <mat-error *ngIf="association.touched && association.invalid">{{getErrorMessage(association)}}</mat-error>
        </mat-form-field>
      </p>

      <p class="loginButtons">
        <button class="ml-2" type="submit" mat-flat-button color="accent" [disabled]="form.invalid">Ok</button>
      </p>

    </form>
  `,
  styles: []
})
export class SelectAssoFormComponent implements OnInit {
  @Input() assos: AssociationLight[];
  @Output() submitted = new EventEmitter<AssociationLight>();

  form: FormGroup = this.fb.group({
    association: ['', Validators.required],
  });

  get association() { return this.form.get('association'); }

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

  submit() {
    if (this.form.valid) {
      this.submitted.emit(this.association.value);
    }
  }

  getErrorMessage(formControl: FormControl) {
    return formControl.hasError('required') ? 'Ce champs ne doit pas être vide' : '';
  }
}
