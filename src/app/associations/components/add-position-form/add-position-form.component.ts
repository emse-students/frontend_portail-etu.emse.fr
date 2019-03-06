import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NewPosition} from '../../../core/models/position.model';
import {environment} from '../../../../environments/environment';
import {Role} from '../../../core/models/role.model';
import {UserLight} from '../../../core/models/auth.model';
import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-add-position-form',
  templateUrl: './add-position-form.component.html',
  styleUrls: ['./add-position-form.component.scss']
})
export class AddPositionFormComponent implements OnInit {
  @Input() assoId: number;
  @Input() roles: Role[];
  @Input() users: UserLight[];
  @Output() submitted = new EventEmitter<NewPosition>();
  api_url = environment.api_uri;
  filteredOptions: Observable<UserLight[]>;

  form: FormGroup = this.fb.group({
    association: [''],
    userText: [''],
    user: ['', Validators.required],
    role: ['', Validators.required]
  });

  get association() { return this.form.get('association'); }
  get user() { return this.form.get('user'); }
  get userText() { return this.form.get('userText'); }
  get role() { return this.form.get('role'); }


  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.filteredOptions = this.userText.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  private _filter(value: string): UserLight[] {
    const filterValue = value.toLowerCase();
    return this.users.filter((user: UserLight) => (user.firstname + ' ' + user.lastname).toLowerCase().includes(filterValue));
  }

  submit() {
    if (this.form.valid) {
      this.form.removeControl('userText');
      this.association.setValue(environment.api_uri + '/associations/' + this.assoId);
      this.user.setValue(this.api_url + '/users/' + this.user.value.id);
      this.submitted.emit(this.form.value);
    }
  }

  getErrorMessage(formControl: FormControl) {
    return formControl.hasError('required') ? 'Ce champs ne doit pas être vide' : '';
  }
}
