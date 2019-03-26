import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatSnackBarRef} from '@angular/material';

@Component({
  selector: 'app-custom-snackbar',
  template: `
    <div class="row justify-content-around">
      <div class="col-9"><span [innerHTML]="data | keepHtml"></span></div>
      <div class="col-3"><button mat-button (click)="close()">Ok</button></div>
    </div>
  `,
  styles: []
})
export class CustomSnackbarComponent {

  constructor(private snackBarRef: MatSnackBarRef<CustomSnackbarComponent>, @Inject(MAT_SNACK_BAR_DATA) public data: any) {}

  close() {
    this.snackBarRef.dismiss();
  }
}
