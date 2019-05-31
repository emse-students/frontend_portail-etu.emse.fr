import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'translateDay' })
export class TranslateDayPipe implements PipeTransform {
  transform(value: string): string {
    const parsed = value.split(' ');
    let month = '';
    if (parsed.length === 1) {
      parsed.push('');
    } else if (parsed.length === 3) {
      switch (parsed[2]) {
        case '1':
          month = ' Janvier';
          break;
        case '2':
          month = ' Février';
          break;
        case '3':
          month = ' Mars';
          break;
        case '4':
          month = ' Avril';
          break;
        case '5':
          month = ' Mai';
          break;
        case '6':
          month = ' Juin';
          break;
        case '7':
          month = ' Juillet';
          break;
        case '8':
          month = ' Août';
          break;
        case '9':
          month = ' Septembre';
          break;
        case '10':
          month = ' Octobre';
          break;
        case '11':
          month = ' Novembre';
          break;
        case '12':
          month = ' Dècembre';
          break;

        default:
          month = '';
      }
    }
    switch (parsed[0]) {
      case 'Monday':
        return 'Lundi ' + parsed[1] + month;

      case 'Tuesday':
        return 'Mardi ' + parsed[1] + month;

      case 'Wednesday':
        return 'Mercredi ' + parsed[1] + month;

      case 'Thursday':
        return 'Jeudi ' + parsed[1] + month;

      case 'Friday':
        return 'Vendredi ' + parsed[1] + month;

      case 'Saturday':
        return 'Samedi ' + parsed[1] + month;

      case 'Sunday':
        return 'Dimanche ' + parsed[1] + month;

      default:
        return value;
    }
  }
}
