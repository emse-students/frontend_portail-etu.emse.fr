import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Association } from '../../core/models/association.model';

@Component({
  selector: 'app-title-form',
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <p>
        <mat-form-field class="w-100">
          <input type="text" matInput placeholder="Nom de l'association" formControlName="textInput">
          <mat-error *ngIf="textInput.invalid">{{getErrorMessage(textInput)}}</mat-error>
        </mat-form-field>
      </p>

      <p class="loginButtons">
        <button class="ml-2"  mat-flat-button color="warn" (click)="canceled.emit(true)">Annuler</button>
        <button class="ml-2" type="submit" mat-flat-button
                [ngStyle]=" form.valid ? (asso | assoStyle : 'accent') : {}"
                [disabled]="form.invalid">Sauvegarder</button>
      </p>

    </form>
  `,
  styles: []
})
export class TitleFormComponent implements OnInit {
  @Input() asso: Association;
  @Input()
  set text (text: string | null) {
    if (text !== null) {
      this.textInput.patchValue(text);
    }
  }

  @Output() submitted = new EventEmitter<string>();
  @Output() canceled = new EventEmitter<boolean>();

  form: FormGroup = this.fb.group({
    textInput: ['', Validators.required]
  });

  get textInput() { return this.form.get('textInput'); }

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
  }

  submit() {
    if (this.form.valid) {
      this.submitted.emit(this.textInput.value);
    }
  }

  getErrorMessage(formControl: FormControl | AbstractControl) {
    return formControl.hasError('required') ? 'Ce champs ne doit pas être vide' : '';
  }

}
