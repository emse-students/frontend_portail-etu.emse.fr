/*
 * From fuel-ui
 * See doc at http://fuelinteractive.github.io/fuel-ui/#/pipe/orderby
 */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'orderBy', pure: false })
export class OrderByPipe implements PipeTransform {
  value: any[] = [];

  static _orderByComparator(a: any, b: any): number {
    if (a === null || typeof a === 'undefined') {
      // eslint-disable-next-line no-param-reassign
      a = 0;
    }
    if (b === null || typeof b === 'undefined') {
      // eslint-disable-next-line no-param-reassign
      b = 0;
    }

    if (a.constructor === Date && b.constructor === Date) {
      // Compare dates
      if (a < b) {
        return -1;
      }
      if (a > b) {
        return 1;
      }
      // eslint-disable-next-line no-restricted-globals, no-restricted-globals, no-restricted-globals, no-restricted-globals
    } else if (isNaN(parseFloat(a)) || !isFinite(a) || isNaN(parseFloat(b)) || !isFinite(b)) {
      // Isn't a number so lowercase the string to properly compare
      if (a.toLowerCase() < b.toLowerCase()) {
        return -1;
      }
      if (a.toLowerCase() > b.toLowerCase()) {
        return 1;
      }
    } else {
      // Parse strings as numbers to compare properly
      if (parseFloat(a) < parseFloat(b)) {
        return -1;
      }
      if (parseFloat(a) > parseFloat(b)) {
        return 1;
      }
    }

    return 0; // equal each other
  }

  transform<T>(input: T[], config: string[] | string = '+'): T[] {
    // invalid input given
    if (!input) {
      return input;
    }

    // make a copy of the input's reference
    this.value = [...input];
    const { value } = this;

    if (!Array.isArray(value)) {
      return value;
    }

    if (!Array.isArray(config) || (Array.isArray(config) && config.length === 1)) {
      const propertyToCheck: string = !Array.isArray(config) ? config : config[0];
      const desc = propertyToCheck.substr(0, 1) === '-';

      // Basic array
      if (!propertyToCheck || propertyToCheck === '-' || propertyToCheck === '+') {
        return !desc ? value.sort() : value.sort().reverse();
      }
      const property: string =
        propertyToCheck.substr(0, 1) === '+' || propertyToCheck.substr(0, 1) === '-'
          ? propertyToCheck.substr(1)
          : propertyToCheck;

      return value.sort(function(a: any, b: any) {
        let aValue = a[property];
        let bValue = b[property];

        const propertySplit = property.split('.');

        if (
          typeof aValue === 'undefined' &&
          typeof bValue === 'undefined' &&
          propertySplit.length > 1
        ) {
          aValue = a;
          bValue = b;
          for (let j = 0; j < propertySplit.length; j++) {
            aValue = aValue[propertySplit[j]];
            bValue = bValue[propertySplit[j]];
          }
        }

        return !desc
          ? OrderByPipe._orderByComparator(aValue, bValue)
          : -OrderByPipe._orderByComparator(aValue, bValue);
      });
    }
    // Loop over property of the array in order and sort
    return value.sort(function(a: any, b: any) {
      for (let i = 0; i < config.length; i++) {
        const desc = config[i].substr(0, 1) === '-';
        const property =
          config[i].substr(0, 1) === '+' || config[i].substr(0, 1) === '-'
            ? config[i].substr(1)
            : config[i];

        let aValue = a[property];
        let bValue = b[property];

        const propertySplit = property.split('.');

        if (
          typeof aValue === 'undefined' &&
          typeof bValue === 'undefined' &&
          propertySplit.length > 1
        ) {
          aValue = a;
          bValue = b;
          for (let j = 0; j < propertySplit.length; j++) {
            aValue = aValue[propertySplit[j]];
            bValue = bValue[propertySplit[j]];
          }
        }

        const comparison = !desc
          ? OrderByPipe._orderByComparator(aValue, bValue)
          : -OrderByPipe._orderByComparator(aValue, bValue);

        // Don't return 0 yet in case of needing to sort by next property
        if (comparison !== 0) {
          return comparison;
        }
      }

      return 0; // equal each other
    });
  }
}
