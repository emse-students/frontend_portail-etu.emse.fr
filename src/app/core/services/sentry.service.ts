import * as Sentry from '@sentry/browser';
import { ErrorHandler, Injectable } from '@angular/core';

Sentry.init({
  dsn: 'https://423b494d1a89445bba1e14eea01e8997@sentry.io/1472817',
});

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
  constructor() {}
  handleError(error) {
    Sentry.captureException(error.originalError || error);
    throw error;
  }
}
