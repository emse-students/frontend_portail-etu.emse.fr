import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'translateMonth' })
export class TranslateMonthPipe implements PipeTransform {
  transform(value: string): string {
    const parsed = value.split(' ');
    if (parsed.length === 2) {
      switch (parsed[1]) {
        case '1':
          return parsed[0] + ' Janvier';
        case '2':
          return parsed[0] + ' Février';
        case '3':
          return parsed[0] + ' Mars';
        case '4':
          return parsed[0] + ' Avril';
        case '5':
          return parsed[0] + ' Mai';
        case '6':
          return parsed[0] + ' Juin';
        case '7':
          return parsed[0] + ' Juillet';
        case '8':
          return parsed[0] + ' Août';
        case '9':
          return parsed[0] + ' Septembre';
        case '10':
          return parsed[0] + ' Octobre';
        case '11':
          return parsed[0] + ' Novembre';
        case '12':
          return parsed[0] + ' Décembre';

        default:
          return value;
      }
    } else {
      switch (parsed[0]) {
        case '1':
          return ' Janvier';
        case '2':
          return ' Février';
        case '3':
          return ' Mars';
        case '4':
          return ' Avril';
        case '5':
          return ' Mai';
        case '6':
          return ' Juin';
        case '7':
          return ' Juillet';
        case '8':
          return ' Août';
        case '9':
          return ' Septembre';
        case '10':
          return ' Octobre';
        case '11':
          return ' Novembre';
        case '12':
          return ' Décembre';
        default:
          return value;
      }
    }
  }
}
