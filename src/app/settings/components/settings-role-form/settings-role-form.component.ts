import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Right, Role } from '../../../core/models/role.model';
import { environment } from '../../../../environments/environment';

interface BoolRight {
  selected: boolean;
  right: Right;
}
@Component({
  selector: 'app-settings-role-form',
  templateUrl: './settings-role-form.component.html',
  styleUrls: ['./settings-role-form.component.scss'],
})
export class SettingsRoleFormComponent implements OnInit {
  ispending;

  @Input()
  set pending(isPending: boolean) {
    if (isPending) {
      this.form.disable();
      this.ispending = true;
    } else {
      this.form.enable();
      this.ispending = false;
    }
  }
  @Input() allRights: Right[];
  @Input() isNew = true;
  _role: Role | null;
  @Input()
  set role(role: Role | null) {
    this._role = role;
    if (role !== null) {
      this.form.patchValue(role);
      this.boolRights = this.allRights.map(c => ({
        selected: this._role.rights.map(r => r.id).includes(c.id),
        right: c,
      }));
    }
  }

  @Output() submitted = new EventEmitter<Role>();

  form: FormGroup = this.fb.group({});

  get name() {
    return this.form.get('name');
  }
  get hierarchy() {
    return this.form.get('hierarchy');
  }
  get rights() {
    return this.form.get('rights');
  }

  boolRights: BoolRight[];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      rights: [],
      hierarchy: [0],
    });
    if (this._role === null) {
      this.boolRights = this.allRights.map(c => ({ selected: false, right: c }));
    } else {
      this.form.patchValue(this._role);
      this.boolRights = this.allRights.map(c => ({
        selected: this._role.rights.map(r => r.id).includes(c.id),
        right: c,
      }));
    }
  }

  submit() {
    if (this.form.valid) {
      if (this.isNew) {
        this.form.removeControl('id');
      }
      this.rights.patchValue(
        this.boolRights
          .map(v => (v.selected ? `${environment.apiUri}/user_rights/${v.right.id}` : null))
          .filter(v => v !== null),
      );
      this.submitted.emit(this.form.value);
    }
  }

  getErrorMessage(formControl: FormControl | AbstractControl) {
    return formControl.hasError('required') ? 'Ce champs ne doit pas être vide' : '';
  }
}
