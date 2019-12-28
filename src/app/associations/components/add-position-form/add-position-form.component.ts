import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { NewPosition } from '../../../core/models/position.model';
import { environment } from '../../../../environments/environment';
import { Right, Role } from '../../../core/models/role.model';
import { UserLight } from '../../../core/models/auth.model';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Association } from '../../../core/models/association.model';

interface BoolRight {
  selected: boolean;
  right: Right;
}

@Component({
  selector: 'app-add-position-form',
  templateUrl: './add-position-form.component.html',
  styleUrls: ['./add-position-form.component.scss'],
})
export class AddPositionFormComponent implements OnInit {
  @Input() asso: Association;
  @Input() roles: Role[];
  @Input() users: UserLight[];
  @Input() allRights: Right[];
  @Output() submitted = new EventEmitter<NewPosition>();
  apiUrl = environment.apiUri;
  filteredUsers: Observable<UserLight[]>;
  filteredRoles: Observable<Role[]>;
  boolRights: BoolRight[];

  form: FormGroup = this.fb.group({
    association: [''],
    userText: [''],
    roleText: [''],
    user: ['', Validators.required],
    role: ['', this.roleRequired()],
    name: ['', this.uniqRequired()],
    rights: [],
    hierarchy: [0],
    newRole: [false],
  });

  get association() {
    return this.form.get('association');
  }
  get user() {
    return this.form.get('user');
  }
  get userText() {
    return this.form.get('userText');
  }
  get role() {
    return this.form.get('role');
  }
  get roleText() {
    return this.form.get('roleText');
  }

  get name() {
    return this.form.get('name');
  }
  get hierarchy() {
    return this.form.get('hierarchy');
  }
  get rights() {
    return this.form.get('rights');
  }

  get newRole() {
    return this.form.get('newRole');
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.filteredUsers = this.userText.valueChanges.pipe(
      startWith(''),
      map(value => this._filterUsers(value)),
    );

    this.filteredRoles = this.roleText.valueChanges.pipe(
      startWith(''),
      map(value => this._filterRoles(value)),
    );

    this.boolRights = this.allRights.map(c => ({ selected: false, right: c }));
  }

  private _filterUsers(value: string): UserLight[] {
    const filterValue = value.toLowerCase();
    return this.users.filter((user: UserLight) =>
      (user.firstname + ' ' + user.lastname).toLowerCase().includes(filterValue),
    );
  }

  private _filterRoles(value: string): Role[] {
    const filterValue = value.toLowerCase();
    return this.roles.filter((role: Role) => role.name.toLowerCase().includes(filterValue));
  }

  submit() {
    if (this.form.valid) {
      this.association.setValue(environment.apiUri + '/associations/' + this.asso.id);
      this.user.setValue(this.apiUrl + '/users/' + this.user.value.id);
      if (this.newRole.value) {
        this.rights.patchValue(
          this.boolRights
            .map(v => (v.selected ? environment.apiUri + '/user_rights/' + v.right.id : null))
            .filter(v => v !== null),
        );
        this.role.setValue({
          name: this.name.value,
          hierarchy: this.hierarchy.value,
          rights: this.rights.value,
        });
      } else {
        this.role.setValue(this.apiUrl + '/roles/' + this.role.value.id);
      }
      this.form.removeControl('userText');
      this.form.removeControl('roleText');
      this.form.removeControl('name');
      this.form.removeControl('rights');
      this.form.removeControl('hierarchy');
      this.form.removeControl('newRole');
      this.submitted.emit(this.form.value);
    }
  }

  getErrorMessage(formControl: FormControl | AbstractControl) {
    return formControl.hasError('required')
      ? 'Ce champs ne doit pas être vide'
      : formControl.hasError('notUniq')
      ? 'Ce role éxiste déjà'
      : '';
  }
  // apiUrl + '/roles/' + selectRole.id
  uniqRequired(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (this.form && this.newRole && this.newRole.value) {
        if (control.value && !this.existInRoles(control.value)) {
          return null;
        } else if (control.value) {
          return { notUniq: { value: control.value } };
        } else {
          return { required: { value: control.value } };
        }
      } else {
        return null;
      }
    };
  }

  roleRequired(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (this.form && this.newRole && !this.newRole.value && !control.value) {
        return { required: { value: control.value } };
      } else {
        return null;
      }
    };
  }

  existInRoles(name: string): boolean {
    for (let i = 0; i < this.roles.length; i++) {
      if (this.roles[i].name === name) {
        return true;
      }
    }
    return false;
  }
}
