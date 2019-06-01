import * as Sentry from '@sentry/browser';
import { ErrorHandler, Injectable } from '@angular/core';

Sentry.init({
  dsn: '__PUBLIC_DSN__',
});

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
  constructor() {}
  handleError(error) {
    Sentry.captureException(error.originalError || error);
    throw error;
  }
}
