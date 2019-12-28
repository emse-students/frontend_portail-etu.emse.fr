import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Info } from '../models/info.model';

@Injectable()
export class InfoService {
  $infos: Subject<Info>;

  constructor() {
    this.$infos = new Subject<Info>();
  }
  pushError(error: string, code?: number) {
    this.$infos.next({ type: 'error', message: error, code });
  }

  pushSuccess(success: string, code?: number) {
    this.$infos.next({ type: 'success', message: success, code });
  }

  pushInfo(info: string, code?: number) {
    this.$infos.next({ type: 'info', message: info, code });
  }
}
