import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { FileToUpload } from '../../../core/models/file.model';
import { Association } from '../../../core/models/association.model';

@Component({
  selector: 'app-img-upload-form',
  templateUrl: './img-upload-form.component.html',
  styleUrls: ['./img-upload-form.component.scss'],
})
export class ImgUploadFormComponent implements OnInit {
  @Input() imgName: string;
  @Input() asso: Association;
  @Output() submitted = new EventEmitter<FileToUpload>();
  @Output() canceled = new EventEmitter<boolean>();
  filetouched = false;

  form: FormGroup = this.fb.group({
    file: [null, [this.fileValidator(), Validators.required]],
    filename: [''],
  });

  get file() {
    return this.form.get('file');
  }
  get filename() {
    return this.form.get('filename');
  }

  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef) {}

  ngOnInit() {}

  submit() {
    if (this.form.valid) {
      this.submitted.emit(this.form.value);
    }
  }

  getErrorMessage(formControl: FormControl | AbstractControl) {
    if (this.filetouched) {
      return formControl.hasError('required')
        ? 'Veuillez charger un fichier'
        : formControl.hasError('fileNotValid')
        ? "Le fichier n'est pas une image valide"
        : '';
    }
    return '';
  }

  onFileChange(event) {
    if (event.target.files && event.target.files.length) {
      const file = event.target.files.item(0);
      this.file.setValue(file);
      const now = new Date();
      this.filename.setValue(`${this.imgName}_${now.getTime()}`);
      this.filetouched = true;
      this.cd.markForCheck();
    }
  }

  fileValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const fileTypes = ['png', 'jpeg', 'jpg'];
      let forbidden;
      if (control.value !== null) {
        const extension = control.value.name
          .split('.')
          .pop()
          .toLowerCase();
        forbidden = fileTypes.indexOf(extension) === -1;
      } else {
        forbidden = true;
      }
      return forbidden ? { fileNotValid: { value: control.value } } : null;
    };
  }
}
