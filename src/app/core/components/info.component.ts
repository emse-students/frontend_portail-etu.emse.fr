import { Component } from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {InfoService} from '../services/info.service';
import {Info} from '../models/info.model';
import {CustomSnackbarComponent} from './custom-snackbar.component';


@Component({
  selector: 'app-info',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<!--<button (click)="show({-->
                  <!--type: 'error',-->
                  <!--message:'Error : the description of the error could be very long, very very long',-->
                  <!--code: 500}-->
                <!--)">Click me (error)</button>-->
  <!--<button (click)="show({-->
                  <!--type: 'success',-->
                  <!--message:'Success : the description of the success could be very long, very very long'}-->
                <!--)">Click me (success)</button>-->
  <!--<button (click)="show({-->
                  <!--type: 'info',-->
                  <!--message:'Info : the description of the info could be very long, very very long'}-->
                <!--)">Click me</button>-->`
})
export class InfoComponent {
  infos: Info[] = [];
  constructor(private infoService: InfoService, public snackBar: MatSnackBar) {
    this.infoService.$infos.subscribe((info: Info) => this.show(info));
  }

  show(info: Info) {
    this.infos.push(info);
    if (this.infos.length === 1) {
      this.displaySnackBar();
    }
  }

  displaySnackBar() {
    const info = this.infos[0];
    const message = info.code ? info.code + ' : ' + info.message : info.message;
    const snackBar = this.snackBar.openFromComponent(CustomSnackbarComponent, {
      data: message,
      verticalPosition: 'top',
      duration: info.type === 'error' ? 20000 : 'info' ? 10000 : 2000,
      panelClass: [info.type + '-snackbar']
    });
    // const snackBar = this.snackBar.open(message, 'Ok', {
    //   verticalPosition: 'top',
    //   duration: info.type === 'error' ? 20000 : 5000,
    //   panelClass: [info.type + '-snackbar']
    // });
    snackBar.afterDismissed().subscribe(() => {
      this.infos.shift();
      if (this.infos.length > 0) {
        this.displaySnackBar();
      }
    });
  }
}
