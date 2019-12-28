import { Injectable } from '@angular/core';
import { error } from 'util';
import { JsonLdCollection, JsonLdPage } from '../models/json-ld.model';

@Injectable()
export class JsonLdService {
  private static idPageParser(urlPage: string): number | null {
    if (urlPage === undefined) {
      return null;
    }
    const argument: string[] = urlPage.split('?')[1].split('&');
    for (let _i = 0; _i < argument.length; _i++) {
      if (argument[_i].split('=')[0] === 'page') {
        return Number(argument[_i].split('=')[1]);
      }
    }
  }
  public static parseCollection<T>(jsonLd): JsonLdCollection<T> {
    if (jsonLd['@type'] !== 'hydra:Collection') {
      throw error('Argument is not a Json-Ld Collection');
    }
    let pages: JsonLdPage;
    if (jsonLd['hydra:view'] && jsonLd['hydra:view']['hydra:first']) {
      pages = {
        current: JsonLdService.idPageParser(jsonLd['hydra:view']['@id']),
        first: JsonLdService.idPageParser(jsonLd['hydra:view']['hydra:first']),
        last: JsonLdService.idPageParser(jsonLd['hydra:view']['hydra:last']),
        previous: JsonLdService.idPageParser(jsonLd['hydra:view']['hydra:previous']),
        next: JsonLdService.idPageParser(jsonLd['hydra:view']['hydra:next']),
      };
    } else {
      pages = null;
    }
    return {
      collection: jsonLd['hydra:member'],
      totalItems: jsonLd['hydra:totalItems'],
      pages,
    };
  }
}
