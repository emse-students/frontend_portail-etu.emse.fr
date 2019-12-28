import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AssociationLight } from '../../../core/models/association.model';
import { PaymentMeans } from '../../../core/models/payment-means.model';
import { Event } from '../../../core/models/event.model';
import { environment } from '../../../../environments/environment';
import { setHourToDate } from '../../../core/services/utils';
import { FileDTO, FileToUpload } from '../../../core/models/file.model';
import { FileUploadService } from '../../../core/services/file-upload.service';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss'],
})
export class EventFormComponent implements OnInit {
  @Input() isAdmin: boolean;
  @Input() asso: AssociationLight;
  @Input() allPaymentMeans: PaymentMeans[];
  @Input() isNew;
  _event: Event | null;
  @Input()
  set event(event: Event | null) {
    this._event = event;
    this.initForm();
    this.patch();
  }
  sureDelete = false;
  addImg = false;
  imgLoading = false;
  imgFilename = null;
  imgPath = environment.imgUrl;

  @Output() submitted = new EventEmitter<Event>();
  @Output() deleted = new EventEmitter<Event>();

  form: FormGroup;

  get id(): AbstractControl {
    return this.form.get('id');
  }
  get association(): AbstractControl {
    return this.form.get('association');
  }
  get name(): AbstractControl {
    return this.form.get('name');
  }
  get description(): AbstractControl {
    return this.form.get('description');
  }
  get date(): AbstractControl {
    return this.form.get('date');
  }
  get hourDate(): AbstractControl {
    return this.form.get('hourDate');
  }
  get duration(): AbstractControl {
    return this.form.get('duration');
  }
  get payable(): AbstractControl {
    return this.form.get('payable');
  }
  get price(): AbstractControl {
    return this.form.get('price');
  }
  get place(): AbstractControl {
    return this.form.get('place');
  }
  get paymentMeans(): AbstractControl {
    return this.form.get('paymentMeans');
  }
  get shotgun(): AbstractControl {
    return this.form.get('shotgun');
  }
  get shotgunListLength(): AbstractControl {
    return this.form.get('shotgunListLength');
  }
  get shotgunWaitingList(): AbstractControl {
    return this.form.get('shotgunWaitingList');
  }
  get shotgunStartingDate(): AbstractControl {
    return this.form.get('shotgunStartingDate');
  }
  get hourShotgunStartingDate(): AbstractControl {
    return this.form.get('hourShotgunStartingDate');
  }
  get closingDate(): AbstractControl {
    return this.form.get('closingDate');
  }
  get hourClosingDate(): AbstractControl {
    return this.form.get('hourClosingDate');
  }
  get formInputs(): FormArray {
    return this.form.get('formInputs') as FormArray;
  }
  options(i): FormArray {
    return this.formInputs.controls[i].get('options') as FormArray;
  }
  get status(): AbstractControl {
    return this.form.get('status');
  }
  get img(): AbstractControl {
    return this.form.get('img');
  }
  get collectLink(): AbstractControl {
    return this.form.get('collectLink');
  }
  get boolPaymentMeans(): FormArray {
    return this.form.get('boolPaymentMeans') as FormArray;
  }
  boolPaymentMean(i): AbstractControl {
    return this.boolPaymentMeans.controls[i];
  }
  get isBookable(): AbstractControl {
    return this.form.get('isBookable');
  }
  asFormArray(value): FormArray {
    return value;
  }

  constructor(private fb: FormBuilder, private fileUploadService: FileUploadService) {}

  ngOnInit(): void {
    this.initForm();
    this.patch();
  }

  submit(): void {
    if (this.form.valid) {
      if (this.isNew) {
        this.form.removeControl('id');
      }
      if (!this.payable.value) {
        this.price.setValue(null);
        this.paymentMeans.setValue([]);
      } else {
        this.paymentMeans.patchValue(
          this.boolPaymentMeans.controls
            .map(v =>
              v.get('selected').value
                ? `${environment.apiUri}/payment_means/${v.get('paymentMeans').value.id}`
                : null,
            )
            .filter(v => v !== null),
        );
      }
      if (!this.shotgun.value) {
        this.shotgunListLength.setValue(null);
        this.shotgunStartingDate.setValue(null);
        this.shotgunWaitingList.setValue(null);
      } else if (this.shotgunStartingDate.value && this.hourShotgunStartingDate.value) {
        this.shotgunStartingDate.setValue(
          setHourToDate(this.shotgunStartingDate.value, this.hourShotgunStartingDate.value),
        );
      }
      this.date.setValue(setHourToDate(this.date.value, this.hourDate.value));
      if (this.closingDate.value && this.hourClosingDate.value) {
        this.closingDate.setValue(
          setHourToDate(this.closingDate.value, this.hourClosingDate.value),
        );
      }
      this.association.setValue(`${environment.apiUri}/associations/${this.asso.id}`);
      this.form.removeControl('payable');
      this.form.removeControl('shotgun');
      this.form.removeControl('hourDate');
      this.form.removeControl('hourShotgunStartingDate');
      this.form.removeControl('hourClosingDate');
      this.form.removeControl('boolPaymentMeans');
      this.submitted.emit(this.form.value);
    }
  }

  initForm(): void {
    this.form = this.fb.group(
      {
        id: [''],
        association: [''],
        name: ['', Validators.required],
        description: [''],
        date: ['', Validators.required],
        hourDate: [''],
        duration: [''],
        payable: [false],
        price: [null],
        place: [''],
        paymentMeans: [[]],
        shotgun: [false],
        shotgunListLength: [0],
        shotgunWaitingList: [false],
        shotgunStartingDate: [''],
        hourShotgunStartingDate: [''],
        closingDate: [null],
        hourClosingDate: [''],
        formInputs: this.fb.array([]),
        status: ['new'],
        open: [true],
        img: [null],
        collectLink: [''],
        boolPaymentMeans: this.fb.array([]),
        isBookable: [false],
      },
      { validators: [this.shotgunRequired(), this.collectLinkRequired()] },
    );
  }

  perm(): void {
    this.name.setValue('Perm ');
    this.date.setValue(new Date());
    this.hourDate.setValue('22:00');
    this.place.setValue('Le Cercle');
    this.duration.setValue("Jusqu'au bout de la nuit");
  }

  addFormInput(): void {
    this.formInputs.push(
      this.fb.group({
        title: ['', Validators.required],
        type: ['title'],
        required: [false],
        options: this.fb.array([]),
      }),
    );
  }

  delFormInput(index: number): void {
    this.formInputs.removeAt(index);
  }

  addOption(index: number): void {
    this.options(index).push(
      this.fb.group({
        value: ['', Validators.required],
        price: [null],
      }),
    );
  }

  delOption(inputIndex: number, optionIndex: number): void {
    this.options(inputIndex).removeAt(optionIndex);
  }

  getErrorMessage(formControl: FormControl | FormGroup | AbstractControl): string {
    if (formControl.hasError('required')) {
      return 'Ce champs ne doit pas être vide';
    }
    if (formControl.hasError('noShotgunDate')) {
      return 'Indiquez une date de début de shotgun';
    }
    if (formControl.hasError('noShotgunList')) {
      return 'Le nombre de place au shotgun doit être supérieur à 0';
    }
    if (formControl.hasError('noShotgunListInt')) {
      return 'Le nombre de place au shotgun doit être un entier';
    }
    if (formControl.hasError('noCollectLink')) {
      return 'Indiquez un lien de collect Lydia';
    }
    return '';
  }

  shotgunRequired(): ValidatorFn {
    return (): { [key: string]: { value: any } } | null => {
      if (this.form && this.shotgun && this.shotgun.value) {
        if (!this.shotgunStartingDate.value) {
          return { noShotgunDate: { value: this.shotgunStartingDate.value } };
        }
        if (!this.shotgunListLength.value || this.shotgunListLength.value <= 0) {
          return { noShotgunList: { value: this.shotgunListLength.value } };
        }
        if (this.shotgunListLength.value !== Math.floor(this.shotgunListLength.value)) {
          return { noShotgunListInt: { value: this.shotgunListLength.value } };
        }
        return null;
      }
      return null;
    };
  }

  collectLinkRequired(): ValidatorFn {
    return (): { [key: string]: any } | null => {
      if (this.form && this.boolPaymentMeans && this.collectLink) {
        for (let i = 0; i < this.boolPaymentMeans.controls.length; i++) {
          if (
            this.boolPaymentMean(i).get('paymentMeans').value.id === 7 &&
            this.boolPaymentMean(i).get('selected').value &&
            !this.collectLink.value
          ) {
            return { noCollectLink: { value: this.collectLink.value } };
          }
        }
        return null;
      }
      return null;
    };
  }

  patch(): void {
    if (this._event) {
      this.form.patchValue(this._event);
      if (this._event.img) {
        this.img.setValue(`${environment.apiUri}/img_objects/${this._event.img.id}`);
        this.imgFilename = this._event.img.filename;
      }
      if (this.price.value) {
        this.payable.setValue(true);
      }
      if (this.shotgunListLength.value) {
        this.shotgun.setValue(true);
      }
      this.hourDate.setValue(
        ((this.date.value as Date).getHours() > 9 ? '' : '0') +
          (this.date.value as Date).getHours() +
          ((this.date.value as Date).getMinutes() > 9 ? ':' : ':0') +
          (this.date.value as Date).getMinutes(),
      );
      if (this.closingDate.value) {
        this.hourClosingDate.setValue(
          ((this.closingDate.value as Date).getHours() > 9 ? '' : '0') +
            (this.closingDate.value as Date).getHours() +
            ((this.closingDate.value as Date).getMinutes() > 9 ? ':' : ':0') +
            (this.closingDate.value as Date).getMinutes(),
        );
      }
      if (this.shotgunStartingDate.value) {
        this.hourShotgunStartingDate.setValue(
          ((this.shotgunStartingDate.value as Date).getHours() > 9 ? '' : '0') +
            (this.shotgunStartingDate.value as Date).getHours() +
            ((this.shotgunStartingDate.value as Date).getMinutes() > 9 ? ':' : ':0') +
            (this.shotgunStartingDate.value as Date).getMinutes(),
        );
      }
      if (this._event.paymentMeans) {
        this.allPaymentMeans.forEach(c => {
          this.boolPaymentMeans.push(
            this.fb.group({
              selected: [this._event.paymentMeans.map(r => r.id).includes(c.id)],
              paymentMeans: [c],
            }),
          );
        });
      } else {
        this.allPaymentMeans.forEach(c => {
          this.boolPaymentMeans.push(
            this.fb.group({
              selected: [false],
              paymentMeans: [c],
            }),
          );
        });
      }
      for (let i = 0; i < this._event.formInputs.length; i++) {
        this.formInputs.push(
          this.fb.group({
            '@id': [`${environment.apiUri}/form_inputs/${this._event.formInputs[i].id}`],
            title: [this._event.formInputs[i].title, Validators.required],
            required: [this._event.formInputs[i].required],
            type: [this._event.formInputs[i].type],
            options: this.fb.array([]),
          }),
        );
        for (let j = 0; j < this._event.formInputs[i].options.length; j++) {
          this.options(i).push(
            this.fb.group({
              '@id': [`${environment.apiUri}/options/${this._event.formInputs[i].options[j].id}`],
              value: [this._event.formInputs[i].options[j].value, Validators.required],
              price: [this._event.formInputs[i].options[j].price],
            }),
          );
        }
      }
    } else {
      this.allPaymentMeans.forEach(c => {
        this.boolPaymentMeans.push(
          this.fb.group({
            selected: [false],
            paymentMeans: [c],
          }),
        );
      });
    }
  }

  delete(): void {
    this.deleted.emit(this._event);
  }

  uploadImg(img: FileToUpload): void {
    this.addImg = false;
    this.imgLoading = true;
    this.fileUploadService.uploadImg(img).subscribe(
      (imgDTO: FileDTO) => {
        this.img.setValue(`${environment.apiUri}/img_objects/${imgDTO.id}`);
        this.imgFilename = imgDTO.filename;
        this.imgLoading = false;
      },
      () => {
        this.imgLoading = false;
      },
    );
  }
}
