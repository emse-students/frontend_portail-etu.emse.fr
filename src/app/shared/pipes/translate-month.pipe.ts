import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'translateMonth' })
export class TranslateMonthPipe implements PipeTransform {
  transform(value: string): string {
    const parsed = value.split(' ');
    if (parsed.length === 2) {
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
    } else {
      switch (parsed[0]) {
        case '1':
          return ' Jan';
        case '2':
          return ' Fév';
        case '3':
          return ' Mar';
        case '4':
          return ' Avr';
        case '5':
          return ' Mai';
        case '6':
          return ' Juin';
        case '7':
          return ' Juil';
        case '8':
          return ' Août';
        case '9':
          return ' Sept';
        case '10':
          return ' Oct';
        case '11':
          return ' Nov';
        case '12':
          return ' Dèc';
        default:
          return value;
      }
    }
  }
}
