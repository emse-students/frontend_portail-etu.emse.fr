import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UrlSafeStringService } from '../../../core/services/url-safe-string.service';
import { AssociationLight } from '../../../core/models/association.model';

@Component({
  selector: 'app-settings-asso-form',
  templateUrl: './settings-asso-form.component.html',
  styleUrls: ['./settings-asso-form.component.scss'],
})
export class SettingsAssoFormComponent {
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
    isActive: [true],
  });

  get name(): AbstractControl {
    return this.form.get('name');
  }
  get tag(): AbstractControl {
    return this.form.get('tag');
  }
  get isActive(): AbstractControl {
    return this.form.get('isActive');
  }

  constructor(private fb: FormBuilder, private urlSafeStringService: UrlSafeStringService) {}

  submit(): void {
    if (this.form.valid) {
      if (this.isNew) {
        this.form.removeControl('id');
      }
      this.tag.setValue(this.urlSafeStringService.generate(this.name.value));
      this.submitted.emit(this.form.value);
    }
  }

  getErrorMessage(formControl: FormControl | AbstractControl): string {
    return formControl.hasError('required') ? 'Ce champs ne doit pas être vide' : '';
  }
}
