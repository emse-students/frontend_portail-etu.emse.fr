import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserLight } from '../../core/models/auth.model';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-bde-contribution-form',
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <p>
        <mat-form-field class="w-100" *ngIf="!selectedUser">
          <input
            type="text"
            placeholder="Prénom et Nom"
            matInput
            formControlName="userText"
            [matAutocomplete]="auto"
          />
          <mat-autocomplete #auto="matAutocomplete">
            <mat-option
              *ngFor="let option of filteredOptions | async"
              [value]="option.firstname + ' ' + option.lastname"
              (click)="select(option)"
            >
              {{ option.firstname }} {{ option.lastname }} {{ option.type }} {{ option.promo }}
            </mat-option>
          </mat-autocomplete>
          <mat-error *ngIf="userText.touched && id.invalid">
            {{ getErrorMessage(id) }}
          </mat-error>
        </mat-form-field>
      </p>
      <div *ngIf="selectedUser && selectedUser.contributeBDE">
        {{ selectedUser.firstname }} {{ selectedUser.lastname }} {{ selectedUser.type }}
        {{ selectedUser.promo }}
        <button
          class="ml-2"
          mat-flat-button
          color="warn"
          (click)="selectedUser = null; userText.reset()"
        >
          Changer
        </button>
      </div>
      <h3 *ngIf="selectedUser && selectedUser.contributeBDE">Déjà cotisant BDE</h3>
      <div *ngIf="selectedUser && !selectedUser.contributeBDE">
        {{ selectedUser.firstname }} {{ selectedUser.lastname }} {{ selectedUser.type }}
        {{ selectedUser.promo }}
        <button
          class="ml-2"
          mat-flat-button
          color="warn"
          (click)="selectedUser = null; userText.reset()"
        >
          Changer
        </button>
      </div>
      <mat-error *ngIf="form.invalid">{{ getErrorMessage(form) }}</mat-error>
      <p class="loginButtons">
        <button
          class="ml-2"
          type="submit"
          mat-flat-button
          color="accent"
          [disabled]="form.invalid || (selectedUser && selectedUser.contributeBDE)"
          (click)="contributeBDE.setValue(true)"
        >
          Faire cotiser BDE
        </button>
        <button
          *ngIf="selectedUser && selectedUser.contributeBDE"
          class="ml-2"
          type="submit"
          mat-flat-button
          color="warn"
          [disabled]="form.invalid"
          (click)="contributeBDE.setValue(false)"
        >
          Annuler la cotisation BDE
        </button>
      </p>
    </form>
  `,
  styles: [],
})
export class BdeContributionFormComponent implements OnInit {
  _users: UserLight[];
  @Input()
  set users(users) {
    this._users = users.sort((a, b) => (a.contributeBDE ? 1 : b.contributeBDE ? -1 : 0));
  }
  get users() {
    return this._users;
  }
  selectedUser: UserLight;

  @Output() contribute = new EventEmitter<UserLight>();
  @Output() deleteContribution = new EventEmitter<UserLight>();

  api_url = environment.api_uri;
  filteredOptions: Observable<UserLight[]>;

  form: FormGroup = this.fb.group({
    userText: [''],
    id: [null, Validators.required],
    contributeBDE: [false],
  });

  get id() {
    return this.form.get('id');
  }
  get contributeBDE() {
    return this.form.get('contributeBDE');
  }
  get userText() {
    return this.form.get('userText');
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.filteredOptions = this.userText.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
  }

  private _filter(value: string): UserLight[] {
    const filterValue = value.toLowerCase();
    return this.users.filter((user: UserLight) =>
      (user.firstname + ' ' + user.lastname).toLowerCase().includes(filterValue),
    );
  }

  select(user: UserLight) {
    this.selectedUser = user;
    this.id.setValue(user.id);
    this.contributeBDE.setValue(user.contributeBDE);
  }

  submit() {
    if (this.form.valid) {
      this.form.removeControl('userText');
      if (this.contributeBDE.value) {
        this.contribute.emit(this.form.value);
      }
      this.deleteContribution.emit(this.form.value);
    }
  }

  getErrorMessage(formControl: FormControl | AbstractControl) {
    return formControl.hasError('required') ? 'Ce champs ne doit pas être vide' : '';
  }
}
