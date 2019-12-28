import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UrlSafeStringService } from '../../../core/services/url-safe-string.service';
import { AssociationLight } from '../../../core/models/association.model';

@Component({
  selector: 'app-settings-asso-form',
  templateUrl: './settings-asso-form.component.html',
  styleUrls: ['./settings-asso-form.component.scss'],
})
export class SettingsAssoFormComponent implements OnInit {
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
  @Input() errorMessage: string | null;
  @Input() successMessage: string | null;
  @Input() isNew = true;

  @Input()
  set asso(asso: AssociationLight | null) {
    if (asso !== null) {
      this.form.patchValue(asso);
    }
  }

  @Output() submitted = new EventEmitter<AssociationLight>();

  form: FormGroup = this.fb.group({
    id: [null],
    tag: [''],
    name: ['', Validators.required],
  });

  get name() {
    return this.form.get('name');
  }
  get tag() {
    return this.form.get('tag');
  }

  constructor(private fb: FormBuilder, private urlSafeStringService: UrlSafeStringService) {}

  // eslint-disable-next-line no-empty-function, @typescript-eslint/no-empty-function
  ngOnInit() {}

  submit() {
    if (this.form.valid) {
      if (this.isNew) {
        this.form.removeControl('id');
      }
      this.tag.setValue(this.urlSafeStringService.generate(this.name.value));
      this.submitted.emit(this.form.value);
    }
  }

  getErrorMessage(formControl: FormControl | AbstractControl) {
    return formControl.hasError('required') ? 'Ce champs ne doit pas être vide' : '';
  }
}
