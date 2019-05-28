import { Pipe, PipeTransform } from '@angular/core';
import { Association } from '../../core/models/association.model';

interface AssoStyle {
  [p: string]: string;
}
@Pipe({ name: 'calendarTextStyle', pure: false })
export class CalendarTextStylePipe implements PipeTransform {
  transform(input: Association, color: 'primary' | 'accent' = 'primary'): AssoStyle {
    if (!input) {
      return {};
    }
    let style: AssoStyle;

    if (color === 'accent') {
      style = {
        textShadow:
          `-1px -1px 0 ${input.color2},` +
          `1px -1px 0 ${input.color2},` +
          `-1px  1px 0 ${input.color2},` +
          `1px  1px 0 ${input.color2}`,
        color: input.contrastColor2 ? input.contrastColor2 : input.color,
      };
    } else {
      style = {
        textShadow:
          `-1px -1px 0 ${input.color},` +
          `1px -1px 0 ${input.color},` +
          `-1px  1px 0 ${input.color},` +
          `1px  1px 0 ${input.color}`,
        color: input.contrastColor ? input.contrastColor : input.color2,
      };
    }
    return style;
  }
}
