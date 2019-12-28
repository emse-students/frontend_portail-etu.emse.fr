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

  get id() {
    return this.form.get('id');
  }
  get association() {
    return this.form.get('association');
  }
  get name() {
    return this.form.get('name');
  }
  get description() {
    return this.form.get('description');
  }
  get date() {
    return this.form.get('date');
  }
  get hourDate() {
    return this.form.get('hourDate');
  }
  get duration() {
    return this.form.get('duration');
  }
  get payable() {
    return this.form.get('payable');
  }
  get price() {
    return this.form.get('price');
  }
  get place() {
    return this.form.get('place');
  }
  get paymentMeans() {
    return this.form.get('paymentMeans');
  }
  get shotgun() {
    return this.form.get('shotgun');
  }
  get shotgunListLength() {
    return this.form.get('shotgunListLength');
  }
  get shotgunWaitingList() {
    return this.form.get('shotgunWaitingList');
  }
  get shotgunStartingDate() {
    return this.form.get('shotgunStartingDate');
  }
  get hourShotgunStartingDate() {
    return this.form.get('hourShotgunStartingDate');
  }
  get closingDate() {
    return this.form.get('closingDate');
  }
  get hourClosingDate() {
    return this.form.get('hourClosingDate');
  }
  get formInputs() {
    return this.form.get('formInputs') as FormArray;
  }
  options(i) {
    return this.formInputs.controls[i].get('options') as FormArray;
  }
  get status() {
    return this.form.get('status');
  }
  get open() {
    return this.form.get('open');
  }
  get img() {
    return this.form.get('img');
  }
  get collectLink() {
    return this.form.get('collectLink');
  }
  get boolPaymentMeans() {
    return this.form.get('boolPaymentMeans') as FormArray;
  }
  boolPaymentMean(i) {
    return this.boolPaymentMeans.controls[i];
  }
  get isBookable() {
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

  submit() {
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

  initForm() {
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

  perm() {
    this.name.setValue('Perm ');
    this.date.setValue(new Date());
    this.hourDate.setValue('22:00');
    this.place.setValue('Le Cercle');
    this.duration.setValue("Jusqu'au bout de la nuit");
  }

  addFormInput() {
    this.formInputs.push(
      this.fb.group({
        title: ['', Validators.required],
        type: ['title'],
        required: [false],
        options: this.fb.array([]),
      }),
    );
  }

  delFormInput(index: number) {
    this.formInputs.removeAt(index);
  }

  addOption(index: number) {
    this.options(index).push(
      this.fb.group({
        value: ['', Validators.required],
        price: [null],
      }),
    );
  }

  delOption(inputIndex: number, optionIndex: number) {
    this.options(inputIndex).removeAt(optionIndex);
  }

  getErrorMessage(formControl: FormControl | FormGroup | AbstractControl) {
    return formControl.hasError('required')
      ? 'Ce champs ne doit pas être vide'
      : formControl.hasError('noShotgunDate')
      ? 'Indiquez une date de début de shotgun'
      : formControl.hasError('noShotgunList')
      ? 'Le nombre de place au shotgun doit être supérieur à 0'
      : formControl.hasError('noShotgunListInt')
      ? 'Le nombre de place au shotgun doit être un entier'
      : formControl.hasError('noCollectLink')
      ? 'Indiquez un lien de collect Lydia'
      : '';
  }

  shotgunRequired(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
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
    return (control: AbstractControl): { [key: string]: any } | null => {
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

  patch() {
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
        ((<Date>this.date.value).getHours() > 9 ? '' : '0') +
          (<Date>this.date.value).getHours() +
          ((<Date>this.date.value).getMinutes() > 9 ? ':' : ':0') +
          (<Date>this.date.value).getMinutes(),
      );
      if (this.closingDate.value) {
        this.hourClosingDate.setValue(
          ((<Date>this.closingDate.value).getHours() > 9 ? '' : '0') +
            (<Date>this.closingDate.value).getHours() +
            ((<Date>this.closingDate.value).getMinutes() > 9 ? ':' : ':0') +
            (<Date>this.closingDate.value).getMinutes(),
        );
      }
      if (this.shotgunStartingDate.value) {
        this.hourShotgunStartingDate.setValue(
          ((<Date>this.shotgunStartingDate.value).getHours() > 9 ? '' : '0') +
            (<Date>this.shotgunStartingDate.value).getHours() +
            ((<Date>this.shotgunStartingDate.value).getMinutes() > 9 ? ':' : ':0') +
            (<Date>this.shotgunStartingDate.value).getMinutes(),
        );
      }
      if (this._event.paymentMeans) {
        this.allPaymentMeans.map(c => {
          this.boolPaymentMeans.push(
            this.fb.group({
              selected: [this._event.paymentMeans.map(r => r.id).includes(c.id)],
              paymentMeans: [c],
            }),
          );
        });
      } else {
        this.allPaymentMeans.map(c => {
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
      this.allPaymentMeans.map(c => {
        this.boolPaymentMeans.push(
          this.fb.group({
            selected: [false],
            paymentMeans: [c],
          }),
        );
      });
    }
  }

  delete() {
    this.deleted.emit(this._event);
  }

  uploadImg(img: FileToUpload) {
    this.addImg = false;
    this.imgLoading = true;
    this.fileUploadService.uploadImg(img).subscribe(
      (imgDTO: FileDTO) => {
        // console.log(imgDTO);
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
