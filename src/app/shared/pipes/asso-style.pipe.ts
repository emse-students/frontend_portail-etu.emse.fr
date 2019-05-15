/*
 * From fuel-ui
 * See doc at http://fuelinteractive.github.io/fuel-ui/#/pipe/orderby
 */

import {Pipe, PipeTransform} from '@angular/core';
import { Association } from '../../core/models/association.model';

interface AssoStyle {
  [p: string]: string;
}
@Pipe({name: 'assoStyle', pure: false})
export class AssoStylePipe implements PipeTransform {

  transform(input: Association, color: 'primary' | 'accent' = 'primary' ): AssoStyle {
    if (!input) {
      return {};
    }
    let style: AssoStyle;

    if (color === 'accent') {
      style = {
        background: input.color2,
        color: input.contrastColor2 ? input.contrastColor2 : input.color
      };
    } else {
      style = {
        background: input.color,
        color: input.contrastColor ? input.contrastColor : input.color2
      };
    }
    return style;
  }
}
