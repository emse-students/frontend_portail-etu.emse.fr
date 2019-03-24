import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'translateStatus'
})
export class TranslateStatusPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch (value) {
      case 'new':
        return 'Nouveau';
      case 'draft':
        return 'Brouillon';
      case 'submitted':
        return 'Soumis';
      case 'validated':
        return 'Validé';
      case 'inactive':
        return 'Inactif';
    }
  }

}
