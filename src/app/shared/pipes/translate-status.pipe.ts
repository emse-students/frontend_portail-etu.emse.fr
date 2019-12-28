import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'translateStatus',
})
export class TranslateStatusPipe implements PipeTransform {
  // eslint-disable-next-line consistent-return, no-unused-vars
  transform(value: any, args?: any): any {
    // eslint-disable-next-line default-case
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
