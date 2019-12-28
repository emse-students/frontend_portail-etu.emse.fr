import { Injectable } from '@angular/core';

@Injectable()
export class UrlSafeStringService {
  maxLen = 100;
  lowercaseOnly = true;
  regexRemovePattern = /((?!([a-z0-9])).)/gi;
  joinString = '-';
  trimWhitespace = true;

  public generate(text: string): string {
    const { joinString } = this;
    const reJoinString = new RegExp(`${joinString}+`, 'g');

    if (this.trimWhitespace) {
      // eslint-disable-next-line no-param-reassign
      text = text.trim();
    }
    // Join strings and convert whitespace between words to join string
    // eslint-disable-next-line no-param-reassign
    text = text.replace(/\s/g, joinString);
    if (this.lowercaseOnly) {
      // eslint-disable-next-line no-param-reassign
      text = text.toLowerCase();
    }
    // Regex away anything "unsafe", but ignore the join string!

    // eslint-disable-next-line no-param-reassign
    text = text.replace(this.regexRemovePattern, function(match) {
      if (match === joinString) {
        return match;
      }
      return '';
    });

    // Truncate in excess of maxLen
    if (text.length > this.maxLen) {
      // eslint-disable-next-line no-param-reassign
      text = text.substring(0, this.maxLen);
    }

    // Remove any duplicates of the join string using this pattern: /<join string>+/g
    // eslint-disable-next-line no-param-reassign
    text = text.replace(reJoinString, this.joinString);

    return text;
  }
}
