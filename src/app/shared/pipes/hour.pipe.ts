import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'hour' })
export class HourPipe implements PipeTransform {
  transform(value: string): string {
    const regex = /(.+h)0$/;
    return value.replace(regex, '$1');
  }
}
