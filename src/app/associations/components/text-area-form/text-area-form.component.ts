import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Association } from '../../../core/models/association.model';

@Component({
  selector: 'app-text-area-form',
  templateUrl: './text-area-form.component.html',
  styleUrls: ['./text-area-form.component.scss'],
})
export class TextAreaFormComponent implements OnInit {
  @Input() asso: Association;
  @Input()
  set text(text: string | null) {
    if (text !== null) {
      this.textInput.patchValue(text);
    }
  }

  @Output() submitted = new EventEmitter<string>();
  @Output() canceled = new EventEmitter<boolean>();

  form: FormGroup = this.fb.group({
    textInput: [''],
  });

  get textInput() {
    return this.form.get('textInput');
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit() {}

  submit() {
    if (this.form.valid) {
      this.submitted.emit(this.textInput.value);
    }
  }
}
