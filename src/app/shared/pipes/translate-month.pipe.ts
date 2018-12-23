import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'translateMonth'})
export class TranslateMonthPipe implements PipeTransform {
  transform(value: string): string {
    const parsed = value.split(' ');
    switch (parsed[1]) {
      case '1':
        return parsed[0] + ' Jan';
      case '2':
        return parsed[0] + ' Fév';
      case '3':
        return parsed[0] + ' Mar';
      case '4':
        return parsed[0] + ' Avr';
      case '5':
        return parsed[0] + ' Mai';
      case '6':
        return parsed[0] + ' Juin';
      case '7':
        return parsed[0] + ' Juil';
      case '8':
        return parsed[0] + ' Août';
      case '9':
        return parsed[0] + ' Sept';
      case '10':
        return parsed[0] + ' Oct';
      case '11':
        return parsed[0] + ' Nov';
      case '12':
        return parsed[0] + ' Dèc';

      default:
        return value;
    }
  }
}
