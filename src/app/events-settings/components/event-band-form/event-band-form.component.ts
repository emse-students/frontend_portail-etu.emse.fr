import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EventBand } from '../../../core/models/event-band.model';

@Component({
  selector: 'app-event-band-form',
  templateUrl: './event-band-form.component.html',
  styleUrls: ['./event-band-form.component.scss'],
})
export class EventBandFormComponent implements OnInit {
  @Input() isNew;
  _eventBand: EventBand | null;
  @Input()
  set eventBand(eventBand: EventBand | null) {
    this._eventBand = eventBand;
    this.initForm();
    this.form.patchValue(eventBand);
  }

  @Output() submitted = new EventEmitter<EventBand>();
  @Output() deleted = new EventEmitter<EventBand>();

  form: FormGroup;

  get id() {
    return this.form.get('id');
  }
  get text() {
    return this.form.get('text');
  }
  get startingDate() {
    return this.form.get('startingDate');
  }
  get endingDate() {
    return this.form.get('endingDate');
  }
  get color() {
    return this.form.get('color');
  }
  get contrastColor() {
    return this.form.get('contrastColor');
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    if (this._eventBand) {
      this.form.patchValue(this._eventBand);
    }
  }

  submit() {
    if (this.form.valid) {
      if (this.isNew) {
        this.form.removeControl('id');
      }
      this.submitted.emit(this.form.value);
    }
  }

  initForm() {
    this.form = this.fb.group({
      id: [''],
      text: ['', Validators.required],
      startingDate: ['', Validators.required],
      endingDate: ['', Validators.required],
      color: [''],
      contrastColor: [''],
    });
  }

  getErrorMessage(formControl: FormControl | FormGroup | AbstractControl) {
    return formControl.hasError('required') ? 'Ce champs ne doit pas être vide' : '';
  }

  delete() {
    this.deleted.emit(this._eventBand);
  }

  switchColor() {
    const tempColor = this.color.value;
    this.color.setValue(this.contrastColor.value);
    this.contrastColor.setValue(tempColor);
  }
}
