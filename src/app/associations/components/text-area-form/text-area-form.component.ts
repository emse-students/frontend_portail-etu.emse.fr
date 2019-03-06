import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UrlSafeStringService} from '../../../core/services/url-safe-string.service';

@Component({
  selector: 'app-text-area-form',
  templateUrl: './text-area-form.component.html',
  styleUrls: ['./text-area-form.component.scss']
})
export class TextAreaFormComponent implements OnInit {

  @Input()
  set text (text: string | null) {
    if (text !== null) {
      this.textInput.patchValue(text);
    }
  }

  @Output() submitted = new EventEmitter<string>();
  @Output() canceled = new EventEmitter<boolean>();

  form: FormGroup = this.fb.group({
    textInput: ['']
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
}
