import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'translateDay'})
export class TranslateDayPipe implements PipeTransform {
  transform(value: string): string {
    const parsed = value.split(' ');
    if (parsed.length === 1) { parsed.push(''); }
    switch (parsed[0]) {
      case 'Monday':
        return 'Lundi ' + parsed[1];

      case 'Tuesday':
        return 'Mardi ' + parsed[1];

      case 'Wednesday':
        return 'Mercredi ' + parsed[1];

      case 'Thursday':
        return 'Jeudi ' + parsed[1];

      case 'Friday':
        return 'Vendredi ' + parsed[1];

      case 'Saturday':
        return 'Samedi ' + parsed[1];

      case 'Sunday':
        return 'Dimanche ' + parsed[1];

      default:
        return value;
    }
  }
}
