import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateDifference'
})
export class DateDifferencePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    const days = Math.floor(value / (1000 * 60 * 60 * 24));
    const dayPart = days === 1 ? days + ' jour, ' : days > 0 ? days + ' jours, ' : '';
    const hours = Math.floor((value - days * (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const hourPart = hours ? hours + ' h ' : '';
    const minutes = Math.floor((value - days * (1000 * 60 * 60 * 24) - hours * (1000 * 60 * 60)) / (1000 * 60));
    const minPart = minutes ?  minutes + ' min ' : '';
    const secondes = Math.floor((value - days * (1000 * 60 * 60 * 24) - hours * (1000 * 60 * 60) - minutes * (1000 * 60)) / (1000));
    const secPart = secondes ? secondes + ' s' : '';
    return dayPart + hourPart + minPart + secPart;
  }

}
