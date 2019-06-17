import { Pipe, PipeTransform } from '@angular/core';
import { Association } from '../../core/models/association.model';

export interface AssoStyle {
  [p: string]: string;
}
@Pipe({ name: 'assoStyle', pure: false })
export class AssoStylePipe implements PipeTransform {
  transform(
    input: Association,
    color: 'primary' | 'accent' = 'primary',
    type: 'all' | 'background' | 'text' | 'text-shadow' = 'all',
  ): AssoStyle {
    if (!input) {
      return {};
    }
    let style: AssoStyle;

    if (color === 'accent') {
      style = {
        background: input.color2,
        color: input.contrastColor2 ? input.contrastColor2 : input.color,
      };
    } else {
      style = {
        background: input.color,
        color: input.contrastColor ? input.contrastColor : input.color2,
      };
    }
    if (type === 'text-shadow') {
      style.textShadow = `
        -1px -1px 0 ${style.background},
        1px -1px 0 ${style.background},
        -1px 1px 0 ${style.background},
        1px 1px 0 ${style.background}
      `;
      delete style.background;
    }
    if (type === 'text') {
      delete style.background;
    }
    if (type === 'background') {
      delete style.color;
    }
    return style;
  }
}
