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
      text = text.trim();
    }
    // Join strings and convert whitespace between words to join string
    text = text.replace(/\s/g, joinString);
    if (this.lowercaseOnly) {
      text = text.toLowerCase();
    }
    // Regex away anything "unsafe", but ignore the join string!

    text = text.replace(this.regexRemovePattern, function(match) {
      if (match === joinString) {
        return match;
      }
      return '';
    });

    // Truncate in excess of maxLen
    if (text.length > this.maxLen) {
      text = text.substring(0, this.maxLen);
    }

    // Remove any duplicates of the join string using this pattern: /<join string>+/g
    text = text.replace(reJoinString, this.joinString);

    return text;
  }
}
